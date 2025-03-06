#!/bin/bash

# Define the target directory
TARGET_DIR="ze_frontend_files"

# Remove the directory if it exists without prompting
if [ -d "$TARGET_DIR" ]; then
    echo "Removing existing $TARGET_DIR directory..."
    rm -rf "$TARGET_DIR"
fi

# Create directory
echo "Creating $TARGET_DIR directory..."
mkdir -p "$TARGET_DIR"

# Define the folders to copy
FOLDERS=("composables" "middleware" "plugins" "stores")

# Copy files from each specified folder with appropriate prefix
for dir in "${FOLDERS[@]}"; do
    if [ -d "$dir" ]; then
        echo "Copying files from $dir..."
        
        # Get first letter of directory for prefix
        prefix="${dir:0:1}_"
        
        # Find all files in the directory
        find "$dir" -type f -name "*.ts" -o -name "*.js" -o -name "*.vue" | while read file; do
            # Extract just the filename without path
            filename=$(basename "$file")
            # Copy to target with prefix
            cp "$file" "$TARGET_DIR/${prefix}${filename}"
            echo "  Copied ${file} to ${TARGET_DIR}/${prefix}${filename}"
        done
    else
        echo "Warning: Directory $dir not found"
    fi
done

# Copy package.json and nuxt.config files if they exist
echo "Copying configuration files..."
[ -f package.json ] && cp package.json "$TARGET_DIR/" && echo "  Copied package.json"
[ -f nuxt.config.ts ] && cp nuxt.config.ts "$TARGET_DIR/" && echo "  Copied nuxt.config.ts"
[ -f nuxt.config.js ] && cp nuxt.config.js "$TARGET_DIR/" && echo "  Copied nuxt.config.js"

# Copy type definitions if they exist
if [ -d "types" ]; then
    echo "Copying type definitions..."
    mkdir -p "$TARGET_DIR/types"
    cp types/*.ts "$TARGET_DIR/types/" 2>/dev/null
    echo "  Copied type definitions to $TARGET_DIR/types/"
fi

echo "Files copied to $TARGET_DIR successfully!"