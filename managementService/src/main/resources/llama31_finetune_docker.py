import torch
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer, 
    TrainingArguments, 
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import Dataset
import json
import os
import random

def create_grocery_training_data(products):
    """
    Convert grocery product data into various training prompts and responses for Llama 3.1
    """
    training_examples = []
    
    for product in products:
        name = product.get('name', '')
        category = product.get('category', '')
        price = product.get('price', 0)
        
        # Generate various types of training examples with Llama 3.1 chat format
        
        # 1. Direct price queries
        training_examples.append({
            "prompt": f"What is the price of {name}?",
            "response": f"The price of {name} is {price} lei."
        })
        
        # 2. Category queries
        training_examples.append({
            "prompt": f"What category does {name} belong to?",
            "response": f"{name} belongs to the {category} category."
        })
        
        # 3. Product recommendations by category
        training_examples.append({
            "prompt": f"Can you recommend a product from the {category} section?",
            "response": f"I recommend {name} from our {category} section. It costs {price} lei."
        })
        
        # 4. Price range searches
        if price < 30:
            price_range = "affordable"
        elif price < 100:
            price_range = "moderately priced"
        else:
            price_range = "premium"
            
        training_examples.append({
            "prompt": f"Show me an {price_range} item from {category}",
            "response": f"{name} is an {price_range} item from {category}, priced at {price} lei."
        })
        
        # 5. General product information
        training_examples.append({
            "prompt": f"Tell me about {name}",
            "response": f"{name} is available in our {category} section for {price} lei."
        })
        
        # 6. Availability queries
        training_examples.append({
            "prompt": f"Do you have {name} in stock?",
            "response": f"Yes, we have {name} available in the {category} section for {price} lei."
        })
    
    # Add category-based queries
    categories = list(set(product['category'] for product in products))
    for category in categories:
        category_products = [p for p in products if p['category'] == category]
        if len(category_products) > 1:
            products_list = ", ".join([p['name'] for p in category_products[:3]])
            training_examples.append({
                "prompt": f"What products do you have in {category}?",
                "response": f"In {category}, we have {products_list} and more."
            })
    
    return training_examples

def prepare_llama31_dataset(training_data, tokenizer, max_length=2048):
    """
    Prepare dataset for Llama 3.1 training with proper chat formatting
    """
    def format_chat_prompt(prompt, response):
        # Llama 3.1 Instruct format
        chat_template = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful grocery store assistant. You have knowledge about products, their categories, and prices. Always provide accurate information about available products.<|eot_id|><|start_header_id|>user<|end_header_id|>

{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>

{response}<|eot_id|>"""
        return chat_template
    
    def tokenize_function(examples):
        texts = []
        for prompt, response in zip(examples['prompt'], examples['response']):
            formatted_text = format_chat_prompt(prompt, response)
            texts.append(formatted_text)
        
        # Tokenize
        tokenized = tokenizer(
            texts,
            truncation=True,
            padding=False,
            max_length=max_length,
            return_tensors=None
        )
        
        tokenized["labels"] = tokenized["input_ids"].copy()
        return tokenized
    
    dataset = Dataset.from_dict({
        'prompt': [item['prompt'] for item in training_data],
        'response': [item['response'] for item in training_data]
    })
    
    tokenized_dataset = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names
    )
    
    return tokenized_dataset

def load_grocery_data(file_path):
    """
    Load grocery product data from JSON file
    """
    if not os.path.exists(file_path):
        print(f"Creating example grocery dataset at {file_path}")
        example_products = [
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
        
        with open(file_path, 'w') as f:
            json.dump(example_products, f, indent=2)
        
        return example_products
    
    with open(file_path, 'r') as f:
        return json.load(f)

def main():
    # Configuration
    model_name = "meta-llama/Meta-Llama-3.1-8B-Instruct"  # or "meta-llama/Meta-Llama-3.1-7B-Instruct"
    product_file = "grocery_products.json"
    output_dir = "./grocery-llama31-lora"
    max_length = 2048
    
    print(f"Using device: {torch.cuda.get_device_name() if torch.cuda.is_available() else 'CPU'}")
    
    # Load grocery data
    print("Loading grocery data...")
    products = load_grocery_data(product_file)
    print(f"Loaded {len(products)} products")
    
    # Create training data
    print("Creating training examples...")
    training_data = create_grocery_training_data(products)
    print(f"Created {len(training_data)} training examples")
    random.shuffle(training_data)
    
    # Load tokenizer
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    # Load model with LoRA for efficient fine-tuning
    print("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.bfloat16,
        device_map="auto",
        trust_remote_code=True,
        attn_implementation="flash_attention_2" if torch.cuda.is_available() else None
    )
    
    # Configure LoRA
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # Prepare dataset
    print("Preparing dataset...")
    train_dataset = prepare_llama31_dataset(training_data, tokenizer, max_length)
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
    
    # Training arguments optimized for LoRA
    training_args = TrainingArguments(
        output_dir=output_dir,
        overwrite_output_dir=True,
        per_device_train_batch_size=1,
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=8,
        num_train_epochs=3,
        learning_rate=2e-4,  # Higher LR for LoRA
        warmup_steps=50,
        logging_steps=5,
        save_steps=100,
        save_total_limit=3,
        prediction_loss_only=True,
        remove_unused_columns=False,
        dataloader_pin_memory=False,
        bf16=True,
        gradient_checkpointing=True,
        report_to=None,
        optim="adamw_torch",
        lr_scheduler_type="cosine",
    )
    
    # Create trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator,
    )
    
    # Start training
    print("Starting LoRA fine-tuning...")
    trainer.train()
    
    # Save the LoRA adapter
    print("Saving LoRA adapter...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    # Save base model info for later merging
    with open(f"{output_dir}/base_model_info.json", "w") as f:
        json.dump({"base_model": model_name}, f)
    
    print(f"LoRA fine-tuning completed! Adapter saved to {output_dir}")
    print("\nNext steps:")
    print("1. Merge the LoRA adapter with base model")
    print("2. Convert to GGUF format")
    print("3. Import to Ollama")

if __name__ == "__main__":
    main()