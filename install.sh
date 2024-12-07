#!/bin/bash

echo "Starting Eliza Character Generator installation..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required but not installed. Please install npm first."
    exit 1
fi

echo "Creating necessary directories..."
# Create necessary directories
mkdir -p uploads

echo "Installing dependencies..."
# Install dependencies with legacy peer deps to avoid warnings
npm install --legacy-peer-deps

echo "Setting up configuration..."
# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
fi

echo "Installation complete!"
echo "To start the server, run: npm start"
echo "The application will be available at: http://localhost:4000"
