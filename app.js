document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const characterPrompt = document.getElementById('character-prompt');
    const generateFromPromptBtn = document.getElementById('generate-from-prompt');
    const promptStatus = document.getElementById('prompt-status');
    const processingStatus = document.getElementById('processing-status');
    const dropZone = document.getElementById('drop-zone');
    const fileList = document.getElementById('file-list');
    const downloadBtn = document.getElementById('download-json');
    const knowledgeContent = document.getElementById('knowledge-content');
    const addExampleBtn = document.getElementById('add-example');
    const messageExamplesContainer = document.getElementById('message-examples-container');
    const modelSelect = document.getElementById('model-select');
    const apiKeyInput = document.getElementById('api-key');
    const saveKeyBtn = document.getElementById('save-key');
    const apiKeyStatus = document.getElementById('api-key-status');
    const rawPromptOutput = document.getElementById('raw-prompt');
    const rawResponseOutput = document.getElementById('raw-response');
    const characterDropZone = document.getElementById('character-drop-zone');
    const characterFileStatus = document.getElementById('character-file-status');
    const characterFileInput = document.getElementById('character-file-input');
    const characterFileButton = document.getElementById('character-file-button');
    const fileInput = document.getElementById('file-input');
    const fileButton = document.getElementById('file-button');
    const generateJsonBtn = document.getElementById('generate-json');

    // Character form elements
    const characterName = document.getElementById('character-name');
    const modelProvider = document.getElementById('model-provider');
    const voiceModel = document.getElementById('voice-model');
    const bioInput = document.getElementById('bio');
    const loreInput = document.getElementById('lore');
    const topicsInput = document.getElementById('topics');
    const styleAllInput = document.getElementById('style-all');
    const styleChatInput = document.getElementById('style-chat');
    const stylePostInput = document.getElementById('style-post');
    const adjectivesInput = document.getElementById('adjectives');
    const postExamplesInput = document.getElementById('post-examples');

    // Constants
    const API_KEY_STORAGE_KEY = 'openrouter_api_key';
    const API_BASE_URL = window.location.origin;

    // Store files and current character data
    let collectedFiles = [];
    let currentCharacterData = null;

    // Helper Functions
    const splitIntoSentences = (text) => {
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return [];
        }
        return text
            .split(/[.!?]+/)
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0)
            .map(sentence => sentence + '.');
    };

    const splitAdjectives = (text) => {
        if (!text || typeof text !== 'string' || text.trim() === '') {
            return [];
        }
        return text
            .split(/\s+/)
            .map(word => word.trim().toLowerCase())
            .filter(word => word.length > 0);
    };

    const createMessageExample = () => {
        const example = document.createElement('div');
        example.className = 'message-example';
        example.innerHTML = `
            <div class="message-pair">
                <textarea placeholder="Write an example user message that shows how someone might interact with this character (e.g., asking a question, making a statement, or starting a conversation)" class="user-message"></textarea>
            </div>
            <div class="message-pair">
                <textarea placeholder="Write how the character would respond, using their unique personality, knowledge, and speaking style to craft an authentic reply" class="character-message"></textarea>
            </div>
            <button class="remove-example">Remove Example</button>
        `;
        example.querySelector('.remove-example').addEventListener('click', () => {
            example.remove();
        });
        return example;
    };

    const collectMessageExamples = () => {
        return Array.from(messageExamplesContainer.querySelectorAll('.message-example'))
            .map(example => {
                const userMessage = example.querySelector('.user-message').value.trim();
                const charMessage = example.querySelector('.character-message').value.trim();
                if (!userMessage && !charMessage) return null;
                return [
                    {
                        user: '{{user1}}',
                        content: { text: userMessage || '' }
                    },
                    {
                        user: characterName.value || 'character',
                        content: { text: charMessage || '' }
                    }
                ];
            })
            .filter(example => example !== null);
    };

    const collectCharacterData = (knowledge = []) => {
        return {
            name: characterName.value || '',
            clients: [],
            modelProvider: modelProvider.value || '',
            settings: {
                secrets: {},
                voice: {
                    model: voiceModel.value || ''
                }
            },
            plugins: [],
            bio: splitIntoSentences(bioInput.value),
            lore: splitIntoSentences(loreInput.value),
            knowledge: knowledge || [],
            messageExamples: collectMessageExamples(),
            postExamples: splitIntoSentences(postExamplesInput.value),
            topics: splitIntoSentences(topicsInput.value),
            style: {
                all: splitIntoSentences(styleAllInput.value),
                chat: splitIntoSentences(styleChatInput.value),
                post: splitIntoSentences(stylePostInput.value)
            },
            adjectives: splitAdjectives(adjectivesInput.value)
        };
    };

    const displayResults = (knowledge) => {
        currentCharacterData = collectCharacterData(knowledge);
        knowledgeContent.innerHTML = `<pre>${JSON.stringify(currentCharacterData, null, 2)}</pre>`;
        downloadBtn.disabled = false;
    };

    const populateFormFields = (data) => {
        const examples = messageExamplesContainer.querySelectorAll('.message-example');
        examples.forEach(example => example.remove());

        characterName.value = data.name || '';
        modelProvider.value = data.modelProvider || '';
        voiceModel.value = data.settings?.voice?.model || '';
        bioInput.value = data.bio?.join('\n') || '';
        loreInput.value = data.lore?.join('\n') || '';
        topicsInput.value = data.topics?.join('\n') || '';
        styleAllInput.value = data.style?.all?.join('\n') || '';
        styleChatInput.value = data.style?.chat?.join('\n') || '';
        stylePostInput.value = data.style?.post?.join('\n') || '';
        adjectivesInput.value = data.adjectives?.join(' ') || '';
        postExamplesInput.value = data.postExamples?.join('\n') || '';

        data.messageExamples?.forEach(example => {
            const exampleElement = createMessageExample();
            const userMessage = exampleElement.querySelector('.user-message');
            const charMessage = exampleElement.querySelector('.character-message');
            
            userMessage.value = example[0]?.content?.text || '';
            charMessage.value = example[1]?.content?.text || '';
            
            messageExamplesContainer.appendChild(exampleElement);
        });

        if (!data.messageExamples?.length) {
            const example = createMessageExample();
            messageExamplesContainer.appendChild(example);
        }

        displayResults([]);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const apiCall = async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                }
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                throw new Error('Cannot connect to server. Please ensure the server is running.');
            }
            throw error;
        }
    };

    // Event Handlers
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            section.classList.toggle('collapsed');
        });
    });

    const checkSavedApiKey = () => {
        const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (savedKey) {
            apiKeyStatus.textContent = 'API key is set';
            apiKeyStatus.className = 'success';
        }
    };

    saveKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            apiKeyStatus.textContent = 'Please enter an API key';
            apiKeyStatus.className = 'error';
            return;
        }

        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
        apiKeyStatus.textContent = 'API key saved successfully';
        apiKeyStatus.className = 'success';
        apiKeyInput.value = '';
    });

    modelSelect.addEventListener('change', () => {
        const selectedModel = modelSelect.value;
        if (selectedModel) {
            const provider = selectedModel.split('/')[0];
            modelProvider.value = provider;
        }
    });

    addExampleBtn.addEventListener('click', () => {
        const example = createMessageExample();
        messageExamplesContainer.appendChild(example);
    });

    // Character file button handler
    characterFileButton.addEventListener('click', () => {
        characterFileInput.click();
    });

    characterFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            characterFileStatus.textContent = 'Please select a JSON file';
            characterFileStatus.className = 'error';
            return;
        }

        characterFileStatus.textContent = 'Loading character...';
        characterFileStatus.className = '';

        try {
            const content = await file.text();
            let characterData;

            try {
                characterData = JSON.parse(content);
            } catch (parseError) {
                const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
                if (!apiKey) {
                    throw new Error('Please set your OpenRouter API key to fix JSON formatting');
                }

                characterFileStatus.textContent = 'Fixing JSON formatting...';
                const response = await apiCall('/api/fix-json', {
                    method: 'POST',
                    headers: {
                        'X-API-Key': apiKey
                    },
                    body: JSON.stringify({ content })
                });
                characterData = response.character;
            }

            populateFormFields(characterData);
            characterFileStatus.textContent = 'Character loaded successfully';
            characterFileStatus.className = 'success';
        } catch (error) {
            console.error('Character loading error:', error);
            characterFileStatus.textContent = `Error: ${error.message}`;
            characterFileStatus.className = 'error';
        }
    });

    // Generate JSON button handler
    generateJsonBtn.addEventListener('click', async () => {
        let knowledge = [];
        
        if (collectedFiles.length > 0) {
            processingStatus.textContent = 'Processing knowledge files...';
            processingStatus.className = '';

            try {
                const formData = new FormData();
                collectedFiles.forEach(file => {
                    console.log('Appending file:', file.name);
                    formData.append('files', file);
                });

                const response = await fetch(`${API_BASE_URL}/api/process-files`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Processed data:', data);
                knowledge = data.knowledge || [];
                processingStatus.textContent = 'Knowledge files processed successfully';
                processingStatus.className = 'success';
            } catch (error) {
                console.error('Processing error:', error);
                processingStatus.textContent = `Error processing knowledge: ${error.message}`;
                processingStatus.className = 'error';
                // Continue with character generation even if knowledge processing fails
            }
        }

        // Generate character with processed knowledge
        displayResults(knowledge);
        knowledgeContent.scrollIntoView({ behavior: 'smooth' });
    });

    // File input and drop handlers
    fileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        addFiles(files);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    });

    const addFiles = (files) => {
        collectedFiles = [...collectedFiles, ...files];
        updateFileList();
    };

    const updateFileList = () => {
        fileList.innerHTML = collectedFiles.map((file, index) => `
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <button class="remove-file" onclick="window.removeFile(${index})">×</button>
            </div>
        `).join('');
    };

    window.removeFile = (index) => {
        collectedFiles.splice(index, 1);
        updateFileList();
    };

    generateFromPromptBtn.addEventListener('click', async () => {
        const prompt = characterPrompt.value.trim();
        const selectedModel = modelSelect.value;
        const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);

        if (!prompt) {
            promptStatus.textContent = 'Please enter a prompt';
            promptStatus.className = 'error';
            return;
        }

        if (!selectedModel) {
            promptStatus.textContent = 'Please select a model';
            promptStatus.className = 'error';
            return;
        }

        if (!apiKey) {
            promptStatus.textContent = 'Please set your OpenRouter API key';
            promptStatus.className = 'error';
            return;
        }

        promptStatus.textContent = 'Generating character...';
        promptStatus.className = '';
        generateFromPromptBtn.disabled = true;
        rawPromptOutput.textContent = 'Loading...';
        rawResponseOutput.textContent = 'Loading...';

        try {
            const data = await apiCall('/api/generate-character', {
                method: 'POST',
                headers: {
                    'X-API-Key': apiKey
                },
                body: JSON.stringify({ 
                    prompt,
                    model: selectedModel
                })
            });

            rawPromptOutput.textContent = data.rawPrompt || 'No raw prompt available';
            rawResponseOutput.textContent = data.rawResponse || 'No raw response available';

            populateFormFields(data.character);
            promptStatus.textContent = 'Character generated successfully';
            promptStatus.className = 'success';
        } catch (error) {
            console.error('Generation error:', error);
            promptStatus.textContent = `Error: ${error.message}`;
            promptStatus.className = 'error';
            rawPromptOutput.textContent = 'Error occurred';
            rawResponseOutput.textContent = 'Error occurred';
        } finally {
            generateFromPromptBtn.disabled = false;
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!currentCharacterData) return;

        const blob = new Blob([JSON.stringify(currentCharacterData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentCharacterData.name || 'character'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    checkSavedApiKey();
    addExampleBtn.click();
});
