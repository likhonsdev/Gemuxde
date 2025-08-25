#!/bin/bash
set -e

# The directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MODEL_DIR="$DIR/models"
MODEL_PATH="$MODEL_DIR/SmolLM3-3B-Q5_K_M.gguf"
MODEL_URL="https://huggingface.co/second-state/SmolLM3-3B-GGUF/resolve/main/SmolLM3-3B-Q5_K_M.gguf"

# Create the models directory if it doesn't exist
mkdir -p "$MODEL_DIR"

# Download the model if it doesn't exist
if [ ! -f "$MODEL_PATH" ]; then
    echo "Downloading SmolLM3 model..."
    curl -L -o "$MODEL_PATH" "$MODEL_URL"
    echo "Model downloaded successfully."
else
    echo "Model already exists."
fi
