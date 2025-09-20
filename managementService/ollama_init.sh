#!/bin/bash
set -e

# Start Ollama server in the background
echo "Starting Ollama server..."
/bin/ollama serve &

# Store the PID of the Ollama server process
OLLAMA_SERVER_PID=$!

# Wait for Ollama to become responsive on the host (internal to container)
echo "Waiting for Ollama API to be ready..."
until curl -s http://localhost:11434 > /dev/null; do
  echo "Ollama not yet ready, waiting..."
  sleep 2
done
echo "Ollama API is ready."

# Check if OLLAMA_INITIAL_MODEL environment variable is set
if [ -n "$OLLAMA_INITIAL_MODEL" ]; then
  echo "Checking if model '$OLLAMA_INITIAL_MODEL' exists..."
  # Use `ollama list` to check if the model is already present
  if ! ollama list | grep -q "$OLLAMA_INITIAL_MODEL"; then
    echo "Model '$OLLAMA_INITIAL_MODEL' not found. Pulling it now..."
    ollama pull "$OLLAMA_INITIAL_MODEL"
    echo "Model '$OLLAMA_INITIAL_MODEL' pull complete."
  else
    echo "Model '$OLLAMA_INITIAL_MODEL' already exists. Skipping pull."
  fi
else
  echo "No OLLAMA_INITIAL_MODEL specified. Skipping initial model pull."
fi

# Bring the Ollama server process to the foreground
# This ensures the container continues to run and doesn't exit
wait $OLLAMA_SERVER_PID