# Use the official Ollama image as the base
FROM ollama/ollama:latest

# Install curl
# This command updates the package list and then installs curl
RUN apt-get update && apt-get install -y curl --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
