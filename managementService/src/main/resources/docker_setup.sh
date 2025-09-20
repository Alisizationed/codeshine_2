#!/bin/bash

# Docker Compose file for complete workflow
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  # Fine-tuning service
  finetune:
    build:
      context: .
      dockerfile: Dockerfile.finetune
    volumes:
      - ./data:/app/data
      - ./output:/app/output
      - ./models:/app/models
    environment:
      - CUDA_VISIBLE_DEVICES=0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    profiles: ["finetune"]

  # Existing Ollama service
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama:/root/.ollama
      - ./output:/app/models
    environment:
      - OLLAMA_KEEP_ALIVE=24h
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

volumes:
  ollama:
EOF

# Dockerfile for fine-tuning
cat > Dockerfile.finetune << 'EOF'
FROM nvidia/cuda:12.1-devel-ubuntu22.04

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip3 install --no-cache-dir \
    torch \
    transformers>=4.36.0 \
    peft \
    datasets \
    accelerate \
    bitsandbytes \
    scipy \
    sentencepiece \
    protobuf

# Install llama.cpp for GGUF conversion
RUN git clone https://github.com/ggerganov/llama.cpp.git /app/llama.cpp && \
    cd /app/llama.cpp && \
    make

WORKDIR /app
COPY finetune_llama31.py .
COPY merge_and_convert.py .
COPY grocery_products.json ./data/

ENV PYTHONPATH=/app
CMD ["python3", "finetune_llama31.py"]
EOF

# Model merging and conversion script
cat > merge_and_convert.py << 'EOF'
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import json
import os
import subprocess

def merge_lora_adapter(base_model_name, adapter_path, output_path):
    """
    Merge LoRA adapter with base model
    """
    print(f"Loading base model: {base_model_name}")
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.bfloat16,
        device_map="auto"
    )
    
    print(f"Loading LoRA adapter: {adapter_path}")
    model = PeftModel.from_pretrained(base_model, adapter_path)
    
    print("Merging LoRA adapter...")
    merged_model = model.merge_and_unload()
    
    print(f"Saving merged model to: {output_path}")
    merged_model.save_pretrained(output_path, safe_serialization=True)
    
    # Save tokenizer
    tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    tokenizer.save_pretrained(output_path)
    
    print("Model merged successfully!")
    return output_path

def convert_to_gguf(model_path, gguf_path):
    """
    Convert merged model to GGUF format for Ollama
    """
    print(f"Converting {model_path} to GGUF format...")
    
    # Use llama.cpp convert script
    convert_script = "/app/llama.cpp/convert.py"
    
    cmd = [
        "python3", convert_script,
        model_path,
        "--outdir", os.path.dirname(gguf_path),
        "--outtype", "f16"
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"GGUF conversion completed: {gguf_path}")
        return gguf_path
    except subprocess.CalledProcessError as e:
        print(f"GGUF conversion failed: {e}")
        return None

def create_ollama_modelfile(gguf_path, modelfile_path):
    """
    Create Ollama Modelfile for the fine-tuned model
    """
    modelfile_content = f"""FROM {gguf_path}

# Set temperature for more consistent responses
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40

# System prompt
SYSTEM \"\"\"You are a helpful grocery store assistant with knowledge about products, categories, and prices. 
You can help customers find products, check prices, and make recommendations based on their needs.
Always provide accurate information about available products and their prices in lei.\"\"\"

# Template for chat format
TEMPLATE \"\"\"<|begin_of_text|><|start_header_id|>system<|end_header_id|>

{{ .System }}<|eot_id|><|start_header_id|>user<|end_header_id|>

{{ .Prompt }}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

\"\"\"
"""
    
    with open(modelfile_path, 'w') as f:
        f.write(modelfile_content)
    
    print(f"Ollama Modelfile created: {modelfile_path}")

def main():
    # Paths
    adapter_path = "/app/output/grocery-llama31-lora"
    merged_path = "/app/output/grocery-llama31-merged"
    gguf_path = "/app/output/grocery-llama31.gguf"
    modelfile_path = "/app/output/Modelfile"
    
    # Load base model info
    with open(f"{adapter_path}/base_model_info.json", "r") as f:
        base_info = json.load(f)
    base_model_name = base_info["base_model"]
    
    # Step 1: Merge LoRA adapter
    merge_lora_adapter(base_model_name, adapter_path, merged_path)
    
    # Step 2: Convert to GGUF
    convert_to_gguf(merged_path, gguf_path)
    
    # Step 3: Create Ollama Modelfile
    create_ollama_modelfile(gguf_path, modelfile_path)
    
    print("\nConversion completed! Next steps:")
    print("1. Copy the GGUF file to your Ollama container")
    print("2. Import the model using: ollama create grocery-assistant -f Modelfile")

if __name__ == "__main__":
    main()
EOF

# Create your grocery products file
cat > grocery_products.json << 'EOF'
[
  {"name": "Junior Sausages Rogob", "category": "Meat, cold cuts", "price": 105.00},
  {"name": "Sinaia Salami 350 g", "category": "Meat, cold cuts", "price": 74.95},
  {"name": "Mici 1000 g", "category": "Meat, cold cuts", "price": 85.90},
  {"name": "Praga Ham Fox", "category": "Meat, cold cuts", "price": 175.00},
  {"name": "Nurnberger Sausages K-Classic 300 g", "category": "Meat, cold cuts", "price": 74.90},
  {"name": "Sliced Processed Cheese Hochland 18% fat", "category": "Dairy, eggs", "price": 119.90},
  {"name": "Cream Cheese K-Classic 200 g", "category": "Dairy, eggs", "price": 21.90},
  {"name": "Cherry Yogurt Muller 500 g", "category": "Dairy, eggs", "price": 34.90},
  {"name": "Olive Oil Il Grezzo 500 ml", "category": "Staple food", "price": 129.00},
  {"name": "White Wheat Flour K-Classic 1 kg", "category": "Staple food", "price": 6.95},
  {"name": "Flint Breadcrumbs 100 g", "category": "Bakery", "price": 9.90},
  {"name": "Chocolate Biscuits Milka 128 g", "category": "Sweets, snacks", "price": 25.50},
  {"name": "Roasted Peanuts Nutline 300 g", "category": "Sweets, snacks", "price": 47.50},
  {"name": "Zurli Biscuits Eugenia 360 g", "category": "Sweets, snacks", "price": 54.95},
  {"name": "Original Biscuits Eugenia 360 g", "category": "Sweets, snacks", "price": 54.95},
  {"name": "Pils Beer Stephansbrau 0.5 l", "category": "Drinks", "price": 10.95},
  {"name": "Strongbow Cider 0.33 l", "category": "Drinks", "price": 27.95}
]
EOF

# Usage script
cat > run_finetune.sh << 'EOF'
#!/bin/bash

echo "Starting Llama 3.1 fine-tuning process..."

# Create necessary directories
mkdir -p data output models

# Step 1: Fine-tune with LoRA
echo "Step 1: Fine-tuning with LoRA..."
docker-compose --profile finetune up --build finetune

# Step 2: Merge and convert
echo "Step 2: Merging LoRA adapter and converting to GGUF..."
docker-compose --profile finetune run --rm finetune python3 merge_and_convert.py

# Step 3: Import to Ollama
echo "Step 3: Importing to Ollama..."
docker-compose up -d ollama

# Wait for Ollama to start
sleep 10

# Create the model in Ollama
docker-compose exec ollama ollama create grocery-assistant -f /app/models/Modelfile

echo "Fine-tuning complete! Your grocery assistant is ready."
echo "Test it with: docker-compose exec ollama ollama run grocery-assistant"
EOF

chmod +x run_finetune.sh

echo "Setup complete! Here's what to do next:"
echo ""
echo "1. Make sure you have your grocery_products.json file ready"
echo "2. Run: ./run_finetune.sh"
echo "3. Wait for the process to complete (may take 1-2 hours)"
echo "4. Test your model: docker-compose exec ollama ollama run grocery-assistant"
echo ""
echo "The script will:"
echo "- Fine-tune Llama 3.1 with LoRA on your grocery data"
echo "- Merge the adapter and convert to GGUF format"
echo "- Import the model into your existing Ollama setup"