document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const currentMode = document.querySelector('.current-mode');
    const contextPanel = document.querySelector('.context-panel');
    const toggleContext = document.querySelector('.toggle-context');
    const historyList = document.querySelector('.history-list');

    // Mock conversation history
    const mockHistory = [
        { title: 'Community Garden Project', time: '2 hours ago' },
        { title: 'Education Access Initiative', time: '5 hours ago' },
        { title: 'Health Awareness Campaign', time: '1 day ago' },
        { title: 'Environmental Clean-up', time: '2 days ago' }
    ];

    // AI Modes with responses
    const aiModes = {
        community: {
            icon: 'fas fa-users',
            name: 'Community Builder',
            responses: [
                "Let's work on strengthening community bonds. What specific area would you like to focus on?",
                "Community engagement is key to social development. How can we help facilitate better connections?",
                "Building inclusive communities is our priority. What challenges are you facing?",
            ]
        },
        education: {
            icon: 'fas fa-graduation-cap',
            name: 'Education Guide',
            responses: [
                "Education empowers communities. What learning initiatives are you interested in?",
                "Let's explore ways to make education more accessible. What's your target audience?",
                "Knowledge sharing is crucial for development. How can we help spread awareness?",
            ]
        },
        environment: {
            icon: 'fas fa-leaf',
            name: 'Environmental Advisor',
            responses: [
                "Environmental sustainability is crucial. What green initiatives would you like to explore?",
                "Let's work on reducing our ecological footprint. What areas concern you most?",
                "Protecting our environment is a shared responsibility. How can we contribute?",
            ]
        },
        health: {
            icon: 'fas fa-heartbeat',
            name: 'Health & Wellness',
            responses: [
                "Health is wealth. What wellness aspects would you like to focus on?",
                "Community health is our priority. How can we promote better healthcare access?",
                "Mental and physical well-being go hand in hand. What support do you need?",
            ]
        },
        innovation: {
            icon: 'fas fa-lightbulb',
            name: 'Innovation Lab',
            responses: [
                "Innovation drives progress. What ideas would you like to develop?",
                "Let's think outside the box. What challenges need creative solutions?",
                "Social innovation can transform communities. What's your vision?",
            ]
        }
    };

    // Initialize history
    function initializeHistory() {
        mockHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-title">${item.title}</div>
                <div class="history-time">${item.time}</div>
            `;
            historyList.appendChild(historyItem);
        });
    }

    // Add message to chat
    function addMessage(content, isUser = false) {
        const message = document.createElement('div');
        message.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        message.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-text">${content}</div>
            </div>
        `;
        
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get random response based on current mode
    function getAIResponse(mode) {
        const responses = aiModes[mode].responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Handle message sending
    function handleSendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, true);
        chatInput.value = '';
        
        // Simulate AI thinking
        setTimeout(() => {
            const currentModeType = document.querySelector('.mode-btn.active').dataset.mode;
            const response = getAIResponse(currentModeType);
            addMessage(response);
        }, 1000);
    }

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current mode display
            const mode = btn.dataset.mode;
            const { icon, name } = aiModes[mode];
            currentMode.innerHTML = `
                <i class="${icon}"></i>
                <span>${name}</span>
            `;

            // Add mode change message
            addMessage(`Switched to ${name} mode. How can I assist you?`);
        });
    });

    toggleContext.addEventListener('click', () => {
        contextPanel.classList.toggle('active');
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });

    // Initialize history
    initializeHistory();

    // Add feature card functionality
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.querySelector('h4').textContent;
            addMessage(`Let's explore ${feature}. What specific aspects would you like to discuss?`);
        });
    });

    // Add resource list functionality
    const resourceItems = document.querySelectorAll('.resource-list li');
    resourceItems.forEach(item => {
        item.addEventListener('click', () => {
            const resource = item.textContent.trim();
            addMessage(`I've opened the ${resource} for you. Would you like me to explain any specific part?`);
        });
    });
});
