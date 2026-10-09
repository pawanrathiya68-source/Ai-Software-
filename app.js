document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const currentViewTitle = document.getElementById('current-view-title');

    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // --- Mobile Sidebar Toggle ---
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        mobileOverlay.classList.remove('hidden');
    }

    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        mobileOverlay.classList.add('hidden');
    }

    mobileMenuBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    mobileOverlay.addEventListener('click', closeSidebar);

    // --- View Navigation ---
    function switchView(targetId) {
        // Update Nav Items active state
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
                item.classList.remove('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900');
                item.classList.add('text-primary', 'bg-indigo-50', 'hover:bg-indigo-50', 'hover:text-primary');

                // Update header title
                currentViewTitle.textContent = item.textContent.trim();
            } else {
                item.classList.remove('active');
                item.classList.remove('text-primary', 'bg-indigo-50', 'hover:bg-indigo-50', 'hover:text-primary');
                item.classList.add('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900');
            }
        });

        // Toggle View Sections
        viewSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
                section.classList.add('active');
            } else {
                section.classList.add('hidden');
                section.classList.remove('active');
            }
        });

        // Close sidebar on mobile after navigating
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    }

    // Attach click listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                switchView(targetId);
            }
        });
    });

    // Make switchView globally available for the dashboard cards
    window.switchView = switchView;

    // --- Auto-resize Chat Textarea ---
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if(this.value.trim() === '') {
            this.style.height = 'auto';
        }
    });

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // --- Mock Chat Functionality ---
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Add User Message
        appendMessage('user', message);

        // Clear input and reset height
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Disable input while "thinking"
        const submitBtn = chatForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        chatInput.disabled = true;

        // Scroll to bottom
        scrollToBottom();

        // 2. Simulate AI Delay then respond
        setTimeout(() => {
            const aiResponse = "I am a simulated frontend interface. Real AI capabilities are not yet configured for this platform. Please connect a backend AI service to process your message: \"" + message + "\"";
            appendMessage('ai', aiResponse);

            // Re-enable input
            submitBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();

            // Scroll to bottom
            scrollToBottom();
        }, 800); // 800ms delay to feel slightly real
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'flex gap-4 max-w-3xl ml-auto flex-row-reverse' : 'flex gap-4 max-w-3xl';

        let avatarHtml = '';
        let bubbleHtml = '';

        if (sender === 'user') {
            avatarHtml = `
                <div class="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden mt-1">
                    <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="User Avatar" class="w-full h-full object-cover">
                </div>
            `;
            bubbleHtml = `
                <div class="flex flex-col gap-1 items-end">
                    <span class="text-xs font-semibold text-gray-500">You</span>
                    <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm md:text-base shadow-sm">
                        <p>${escapeHTML(text)}</p>
                    </div>
                </div>
            `;
        } else {
            avatarHtml = `
                <div class="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <i class="fa-solid fa-robot text-sm"></i>
                </div>
            `;
            bubbleHtml = `
                <div class="flex flex-col gap-1">
                    <span class="text-xs font-semibold text-gray-500">Nexus Assistant</span>
                    <div class="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-tl-none text-sm md:text-base border border-gray-200 shadow-sm">
                        <p>${escapeHTML(text)}</p>
                    </div>
                </div>
            `;
        }

        msgDiv.innerHTML = avatarHtml + bubbleHtml;
        chatMessages.appendChild(msgDiv);
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simple HTML escaper to prevent XSS in chat
    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});