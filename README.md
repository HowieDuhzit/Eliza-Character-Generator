# Eliza Character Generator

A web-based tool for creating and managing AI character definitions with knowledge integration capabilities.

## Features

- Character generation from prompts using AI models
- Load and edit existing character definitions
- Knowledge integration from PDF and text files
- Message example management
- Character style and personality definition
- JSON output for character definitions

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- An OpenRouter API key (get one from [openrouter.ai](https://openrouter.ai))

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/HowieDuhzit/Eliza-Character-Generator/blob/main/README.md
cd eliza-generator
```

2. Make the install script executable and run it:
```bash
chmod +x install.sh
./install.sh
```

3. Edit the .env file and add your OpenRouter API key:
```bash
nano .env
# Add your API key to the OPENROUTER_API_KEY line
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:4000`

## Usage

### 1. API Key Setup
- Get an API key from [openrouter.ai](https://openrouter.ai)
- Enter your API key in the Character Generation section
- Click "Save Key" to store it

### 2. Creating a Character

#### Method 1: Generate from Prompt
1. Enter a detailed character description in the prompt field
2. Select an AI model
3. Click "Generate from Prompt"
4. Review and edit the generated character details

#### Method 2: Manual Creation
1. Fill in the Basic Information section
2. Add character details in each section
3. Add message examples to demonstrate character interactions
4. Click "Generate Character" to create the JSON definition

### 3. Adding Knowledge
1. Drag and drop PDF or text files into the Knowledge Processing section
   OR click "Select Knowledge Files" to choose files
2. Files will appear in the list
3. Click "Generate Character" to process files and integrate knowledge

### 4. Loading Existing Characters
1. Drag and drop a character JSON file into the Load Character section
   OR click "Select Character File" to choose a file
2. The character details will be loaded into the form for editing

### 5. Downloading Characters
1. After generating or editing a character, click "Download Character JSON"
2. The character definition will be saved as a JSON file

## File Format Support

### Knowledge Files
- PDF documents
- Text files (.txt)
- Markdown files (.md)
- Other text-based formats

### Character Files
- JSON format
- Must contain required character definition fields

## Troubleshooting

### Common Issues

1. Installation Warnings
   - If you see module compatibility warnings during installation, they can be safely ignored
   - The warnings are related to experimental features but don't affect functionality

2. Server Connection Error
   - Ensure the server is running
   - Check if port 4000 is available
   - Verify your internet connection

3. API Key Issues
   - Ensure your OpenRouter API key is valid
   - Check if the key is properly saved
   - Verify the key format (should start with 'sk-')

4. File Processing Issues
   - Check file format compatibility
   - Ensure files are not corrupted
   - Verify file size is reasonable

### Error Messages

- "Server returned non-JSON response": API communication issue
- "Failed to parse JSON": Invalid character file format
- "No files to process": No knowledge files selected

## Development

To run in development mode with auto-reload:
```bash
npm run dev
```

To run tests:
```bash
npm test
```

## Support

For issues and feature requests, please create an issue in the repository.

## License

[MIT License](LICENSE)
