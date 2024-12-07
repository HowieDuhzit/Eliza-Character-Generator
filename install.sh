#!/bin/bash

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is required but not installed. Please install npm first."
    exit 1
fi

# Create necessary directories
mkdir -p uploads

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "PORT=4000" > .env
    echo "HOST=0.0.0.0" >> .env
    echo "APP_URL=http://localhost:4000" >> .env
fi

echo "Installation complete! Run 'npm start' to start the server."
