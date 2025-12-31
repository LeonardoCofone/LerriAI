const BACKEND_URL = "https://api.lerriai.com/api/chat";
const API_BASE_URL = 'https://api.lerriai.com'; //http://localhost:3000
const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID_HERE";
const CLIENT_ID = "692895314861-lmsub53tc5mdso1g7rkb6gop098safoe.apps.googleusercontent.com";
const LANGUAGES = {
    "it": "Italiano",
    "en": "English",
    "es": "Español",
    "fr": "Français",
    "de": "Deutsch",
    "pt": "Português",
    "ru": "Русский",
    "ja": "日本語",
    "zh": "中文",
    "ar": "العربية"
};

const baseUrl = '/LerriAI_dev/pwa/';

const VAPID_PUBLIC_KEY = 'BGR8PSUhEMD5Jij2vMHJamrLlnPZAi26RDhWCRLYKr0J_Cl2L7pZjgbqTHxKqzqU4bMYLNibnl4ltPQzIFkr0-c';
let isProcessing = false;

if ('serviceWorker' in navigator) {
    console.log('📡 Registering service worker...');
    console.log('🌐 Service worker URL:', `${baseUrl}sw.js`);
    
    navigator.serviceWorker.register(`${baseUrl}sw.js`, { scope: baseUrl })
        .then(reg => console.log('✅ SW registered with scope:', reg.scope))
        .catch(err => console.error('❌ SW registration failed:', err));
}




function loadPayPalSDK() {
    if (window.paypalLoaded || document.querySelector('script[src*="paypal.com/sdk"]')) {
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
        script.async = true;
        script.onload = () => {
            window.paypalLoaded = true;
            console.log('✅ PayPal SDK loaded');
            resolve();
        };
        script.onerror = () => {
            console.error('❌ PayPal SDK load failed');
            reject(new Error('PayPal SDK failed to load'));
        };
        document.body.appendChild(script);
    });
}


function setProcessingState(processing) {
    isProcessing = processing;
    
    const chatInput = document.getElementById('chat-input');
    const micBtn = document.getElementById('mic-btn');
    const attachBtn = document.getElementById('attach-btn');
    const briefingBtn = document.getElementById('daily-briefing-btn');
    const submitBtn = document.querySelector('#chat-form button[type="submit"]');
    
    if (processing) {
        if (chatInput) {
            chatInput.disabled = true;
            chatInput.style.opacity = '0.5';
            chatInput.style.cursor = 'not-allowed';
        }
        if (micBtn) {
            micBtn.disabled = true;
            micBtn.style.opacity = '0.5';
            micBtn.style.cursor = 'not-allowed';
            micBtn.style.filter = 'grayscale(1)';
        }
        if (attachBtn) {
            attachBtn.disabled = true;
            attachBtn.style.opacity = '0.5';
            attachBtn.style.cursor = 'not-allowed';
            attachBtn.style.filter = 'grayscale(1)';
        }
        if (briefingBtn) {
            briefingBtn.disabled = true;
            briefingBtn.style.opacity = '0.5';
            briefingBtn.style.cursor = 'not-allowed';
            briefingBtn.style.filter = 'grayscale(1)';
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.background = '#94a3b8';
        }
    } else {
        if (chatInput) {
            chatInput.disabled = false;
            chatInput.style.opacity = '';
            chatInput.style.cursor = '';
        }
        if (micBtn) {
            micBtn.disabled = false;
            micBtn.style.opacity = '';
            micBtn.style.cursor = '';
            micBtn.style.filter = '';
        }
        if (attachBtn) {
            attachBtn.disabled = false;
            attachBtn.style.opacity = '';
            attachBtn.style.cursor = '';
            attachBtn.style.filter = '';
        }
        if (briefingBtn) {
            briefingBtn.disabled = false;
            briefingBtn.style.opacity = '';
            briefingBtn.style.cursor = '';
            briefingBtn.style.filter = '';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
            submitBtn.style.background = '';
        }
    }
}


async function sendNotificationReale(title, body, data = {}) {
    if (!('serviceWorker' in navigator)) return;
    if (Notification.permission !== 'granted') return;

    try {
        const regs = await navigator.serviceWorker.getRegistrations();
        if (!regs.length) throw new Error('Service worker not registered');
        const registration = regs[0];
        await registration.showNotification(title, {
            body: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
            icon: `${baseUrl}icon/icon-192.png`,
            badge: `${baseUrl}icon/icon-192.png`,
            vibrate: [200, 100, 200],
            tag: 'lerri-notification',
            requireInteraction: false,
            data: data
        });
    } catch (error) {
        console.error('Notification error:', error);
    }
}

async function initNotifications() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Notifications enabled');
            const sub = await ensurePushSubscription();
            if (sub) {
                await sendSubscriptionToBackend(getUserEmail(), sub);
            }
        }
    }
}

// Usage:
//sendNotificationReale('Daily Briefing', 'Your schedule is ready!', { url: '/pwa/index.html' });


function initDailyBriefingButton() {
    if (initDailyBriefingButton.initialized) return;
    initDailyBriefingButton.initialized = true;

    const chatHeaderBar = document.querySelector('.chat-header-bar');
    if (!chatHeaderBar) return;

    const briefingWrapper = document.createElement('div');
    briefingWrapper.style.display = 'inline-flex';
    briefingWrapper.style.alignItems = 'center';
    briefingWrapper.style.gap = '8px';

    const briefingBtn = document.createElement('button');
    briefingBtn.id = 'daily-briefing-btn';
    briefingBtn.className = 'btn-icon';
    briefingBtn.setAttribute('aria-label', 'Daily Briefing');
    briefingBtn.innerHTML = '📊';
    briefingBtn.title = 'Get Daily Briefing';

    const infoWrapper = document.createElement('div');
    infoWrapper.style.position = 'relative';
    infoWrapper.style.display = 'inline-flex';
    infoWrapper.style.alignItems = 'center';

    const infoIcon = document.createElement('span');
    infoIcon.innerHTML = 'ℹ️';
    infoIcon.style.cursor = 'pointer';
    infoIcon.style.fontSize = '1.2rem';

    const tooltip = document.createElement('div');
    tooltip.className = 'info-tooltip';
    tooltip.textContent = 'Click this button to generate your daily briefing, including today\'s events, tomorrow\'s events, week events, and pending tasks.';
    tooltip.style.cssText = `
        position: absolute;
        top: 120%;
        left: 50%;
        transform: translateX(-50%);
        background: #2d3748;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.85rem;
        width: 220px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        z-index: 1000;
        text-align: center;
        line-height: 1.4;
    `;


    const tooltipArrow = document.createElement('div');
    tooltipArrow.style.cssText = `
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #2d3748;
    `;

    tooltip.appendChild(tooltipArrow);

    infoIcon.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
    });

    infoIcon.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });

    infoWrapper.appendChild(infoIcon);
    infoWrapper.appendChild(tooltip);

    briefingWrapper.appendChild(infoWrapper);
    briefingWrapper.appendChild(briefingBtn);

    const clearBtn = document.getElementById('clear-chat-btn');
    if (clearBtn) {
        chatHeaderBar.insertBefore(briefingWrapper, clearBtn);
    } else {
        chatHeaderBar.appendChild(briefingWrapper);
    }

    briefingBtn.addEventListener('click', async () => {
        if (isProcessing) return;

        const email = getUserEmail();
        if (!email) {
            showNotification('❌ Please login first', 'error');
            return;
        }

        const briefingCost = COSTS.TEXT_MESSAGE;

        if (settings.currentSpend + briefingCost > settings.maxSpend) {
            showNotification('⚠️ Budget limit reached! Increase your maximum budget to continue.', 'error');
            addMessage('⚠️ You have reached your monthly spending limit. Increase your budget in your settings to continue.', 'bot', false);
            return;
        }

        setProcessingState(true);

        briefingBtn.disabled = true;
        briefingBtn.innerHTML = '⏳';

        try {
            const loadingMsg = addMessage('📊 Generating your daily briefing...', 'bot', false);

            const response = await fetch('https://api.lerriai.com/api/trigger-briefing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Briefing generation failed');
            }

            const data = await response.json();

            loadingMsg.remove();
            addMessage('Tell me my day', 'user', false);
            addMessage(data.briefing, 'bot', false);

            messagesArray.push({ text: 'Tell me my day', sender: 'user' });
            messagesArray.push({ text: data.briefing, sender: 'bot' });
            if (messagesArray.length > 25) {
                messagesArray = messagesArray.slice(-25);
            }

            settings.stats.messages++;
            settings.currentSpend += briefingCost;
            settings.currentSpend = Math.round(settings.currentSpend * 100000) / 100000;

            if (data.subscription) {
                settings.subscription = data.subscription;
                console.log('✅ Updated subscription from briefing:', settings.subscription);
            }

            console.log(`💰 Briefing cost: €${briefingCost.toFixed(5)}`);

            await syncToServer();
            await updateTrialBanner();
            updateStats();
            updateBudgetDisplay();

            showNotification('✅ Daily briefing generated!', 'success');

        } catch (error) {
            console.error('Briefing error:', error);
            showNotification('❌ Failed to generate briefing. Try again.', 'error');
        } finally { 
            setProcessingState(false);
        }
    });
}

async function checkTrialStatus() {
    const email = getUserEmail();
    if (!email) return { canSendMessage: true, messagesRemaining: 50 };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/check-trial-status?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Trial status check error:', error);
        return { canSendMessage: true, messagesRemaining: 50 };
    }
}

async function updateTrialBanner() {
    const status = await checkTrialStatus();
    const existingBanner = document.getElementById('trial-banner');
    
    if (existingBanner) {
        existingBanner.remove();
    }
    
    if (!status.subscriptionActive && status.messagesRemaining >= 0) {
        const messagesContainer = document.getElementById('messages');
        const trialBanner = document.createElement('div');
        trialBanner.id = 'trial-banner';
        trialBanner.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
            border-radius: 8px;
            margin-bottom: 15px;
        `;
        trialBanner.textContent = `🎁 Free Trial: ${status.messagesRemaining} messages remaining`;
        messagesContainer.parentNode.insertBefore(trialBanner, messagesContainer);
    }
}

async function showSubscriptionModal() {
    const existingModal = document.getElementById('subscription-modal');
    if (existingModal) return;

    const modal = document.createElement('div');
    modal.id = 'subscription-modal';
    modal.innerHTML = `
        <div class="subscription-modal-overlay">
            <div class="subscription-modal-content">
                <h2 class="premium-title">🚀 Upgrade to Premium</h2>
                <p class="premium-subtitle">Unlock unlimited AI power</p>
                
                <div class="subscription-benefits">
                    <p>✨ Unlimited messages</p>
                    <p>🤖 Full AI assistant access</p>
                    <p>📅 Advanced calendar features</p>
                    <p>📧 Gmail integration</p>
                    <p>☁️ Google Drive access</p>
                </div>
                
                <div class="premium-divider"></div>
                
                <p class="subscription-price">
                    €2.99 <span>/ month + usage</span>
                </p>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 8px;">
                    Base subscription + pay only for what you use<br>
                    (typically under €1/month for usage)
                </p>
                
                <div id="payment-element"></div>
                <button id="submit-payment" class="btn-primary" style="width: 100%; margin-top: 20px;">
                    Subscribe Now
                </button>
                
                <button id="close-subscription-modal" class="btn-secondary" style="width: 100%; margin-top: 10px;">
                    Maybe Later
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/create-subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: getUserEmail() })
        });
        
        const { clientSecret, subscriptionId } = await response.json();
        
        const elements = stripe.elements({ clientSecret });
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
        
        document.getElementById('submit-payment').addEventListener('click', async () => {
            const submitBtn = document.getElementById('submit-payment');
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Processing...';
            
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/pwa/index.html?subscription=success`
                }
            });
            
            if (error) {
                showNotification('❌ Payment failed: ' + error.message, 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Subscribe Now';
            }
        });
        
        document.getElementById('close-subscription-modal').addEventListener('click', () => {
            modal.remove();
        });
        
    } catch (error) {
        console.error('Subscription modal error:', error);
        showNotification('❌ Failed to load payment form', 'error');
        modal.remove();
    }
}

async function handleSubscriptionSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('subscription') === 'success') {
        showNotification('✅ Subscription activated successfully!', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
        await loadDataFromServer();
        await updateTrialBanner();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    handleSubscriptionSuccess();
});

function initEmojiSelect() {
    const emojiSelect = document.getElementById('event-emoji-select');
    if (!emojiSelect) return;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'emoji-dropdown';
    
    Object.entries(emojiCategories).forEach(([category, emojis]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'emoji-category';
        
        const title = document.createElement('div');
        title.className = 'emoji-category-title';
        title.textContent = category;
        categoryDiv.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'emoji-grid';
        
        emojis.forEach(emoji => {
            const option = document.createElement('span');
            option.className = 'emoji-option';
            option.textContent = emoji;
            option.addEventListener('click', () => {
                emojiSelect.textContent = emoji;
                emojiSelect.value = emoji;
                dropdown.classList.remove('active');
            });
            grid.appendChild(option);
        });
        
        categoryDiv.appendChild(grid);
        dropdown.appendChild(categoryDiv);
    });
    
    emojiSelect.parentElement.style.position = 'relative';
    emojiSelect.parentElement.appendChild(dropdown);
    
    emojiSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        dropdown.classList.remove('active');
    });
}

const COSTS = {
    TEXT_MESSAGE: 0.00099,
    VOICE_PER_SECOND: 0.005 / 60,
    VOICE_BASE: 0.00099,
    FILE_BASE: 0.002,
    FILE_PER_MB: 0.003
};

let attachedFiles = [];
let fileMessageCounter = 0;
const MAX_FILES = 5;

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let events = {};
let tasks = [];
let currentPushSubscription = null;
let settings = {
    maxSpend: 0.90,
    currentSpend: 0,
    model: 'gpt-4o-mini',
    language: 'it',
    stats: { messages: 0, events: 0, tasks: 0 },
    subscription: {
        active: false,
        trialMessagesUsed: 0,
        trialLimit: 50,
        subscriptionId: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null
        },
    schedule: {
        work: null,
        subjects: [],
        sports: [],
        hobbies: []
    }
};

let isLoading = false;
let isSyncing = false;
let messagesArray = [];

const md = window.markdownit();

function calculateMessageCost(isVoice = false, durationSeconds = 0) {
    if (!isVoice) return COSTS.TEXT_MESSAGE;
    return COSTS.VOICE_BASE + (durationSeconds * COSTS.VOICE_PER_SECOND);
}

function calculateFileCost(files) {
    return files.reduce((total, fileItem) => {
        const file = fileItem.file || fileItem;
        const sizeMB = file.size / (1024 * 1024);
        
        return total + COSTS.FILE_BASE + (sizeMB * COSTS.FILE_PER_MB);
    }, 0);
}

function makeLinksClickable(text) {
    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
    return text.replace(urlRegex, (url) => {
        const cleanUrl = url.replace(/[.,;:!?)]$/, '');
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
    });
}

function normalizeMarkdown(text) {
    if (!text) return '';
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    text = text.replace(/_{2,}/g, '');
    text = text.replace(/\*{2,}/g, '');
    
    text = text.replace(/^```(\w+)?\n/gm, '\n```$1\n');
    text = text.replace(/\n```$/gm, '\n```\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    
    return text;
}

function addMessage(text, sender, save = true, audioBlob = null, skipSync = false) {
    const messagesContainer = document.getElementById('messages');
    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;
    
    if (audioBlob && sender === 'user') {
        const audioPlayer = document.createElement('audio');
        audioPlayer.controls = true;
        audioPlayer.src = URL.createObjectURL(audioBlob);
        audioPlayer.style.maxWidth = '100%';
        audioPlayer.style.marginBottom = '8px';
        msgEl.appendChild(audioPlayer);
    }   
    
    const textDiv = document.createElement('div');
    
    const cleanText = text
        .replace(/_{2,}/g, '')
        .replace(/\*{3,}/g, '**')
        .replace(/__(\S)/g, '$1')
        .replace(/(\S)__/g, '$1');
    
    const normalizedText = normalizeMarkdown(cleanText);
    const renderedHtml = md.render(normalizedText);
    
    const sanitizedHtml = DOMPurify.sanitize(renderedHtml, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
    
    const finalHtml = sanitizedHtml.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
    
    textDiv.innerHTML = finalHtml;
    msgEl.appendChild(textDiv);
    messagesContainer.appendChild(msgEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (save && !skipSync) { 
        messagesArray.push({ text, sender });
        if (messagesArray.length > 25) messagesArray = messagesArray.slice(-25);
        syncToServer();
    } else if (save) { 
        messagesArray.push({ text, sender });
        if (messagesArray.length > 25) messagesArray = messagesArray.slice(-25);
    }

    if (sender === 'bot' && 
        text !== "⏳ Processing..." && 
        !text.startsWith('📊 Generating') &&
        !text.startsWith('⏳')) {
        
        const preview = text
            .replace(/[*_~`#\[\]]/g, '')
            .replace(/<[^>]*>/g, '')
            .substring(0, 100);
        
        sendNotificationReale(
            'New message from Lerri', 
            preview, 
            { url: `${baseUrl}index.html` }
        ).catch(err => {
            console.error('Notification send error:', err);
        });
    }
    
    return msgEl;
}

async function syncToServer() {
    if (isSyncing) {
        console.log('⏳ Sync already in progress, skipping...');
        return;
    }
    
    const user = getUserEmail();
    if (!user) {
        console.log('❌ No user email, cannot sync');
        return;
    }

    isSyncing = true;

    const payload = { 
        user, 
        pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
        settings: {
            ...settings,
            subscription: settings.subscription || {
                active: false,
                trialMessagesUsed: 0,
                trialLimit: 50,
                subscriptionId: null,
                subscriptionStartDate: null,
                subscriptionEndDate: null
            }
        },  
        messages: messagesArray 
    };

    try {
        const response = await fetch("https://api.lerriai.com/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("✅ Sync completed successfully");
        } else {
            console.error("❌ Sync failed:", response.status);
        }
    } catch (err) {
        console.error("❌ Sync error:", err);
    } finally {
        isSyncing = false;
    }
}

// Replace the loadDataFromServer function in app.js with this improved version

async function loadDataFromServer() {
    if (isLoading) return;
    isLoading = true;
    
    const user = getUserEmail();
    if (!user) {
        isLoading = false;
        return;
    }

    try {
        const res = await fetch(`https://api.lerriai.com/api/load-data?user=${encodeURIComponent(user)}`);
        if (!res.ok) throw new Error('Load data error');
        
        const data = await res.json();

        console.log('📥 Data loaded from server:', data);

        if (data.pushSubscription) {
            currentPushSubscription = data.pushSubscription;
            console.log('✅ pushSubscription restored from server');
        }

        if (data.events !== undefined) {
            events = data.events;
        }

        if (data.tasks !== undefined) {
            tasks = data.tasks;
        }

        if (data.settings !== undefined) {
            settings = {
                maxSpend: data.settings.maxSpend !== undefined ? data.settings.maxSpend : 0.90,
                currentSpend: data.settings.currentSpend !== undefined ? data.settings.currentSpend : 0,
                model: data.settings.model || 'gpt-4o-mini',
                language: data.settings.language || 'it',
                stats: {
                    messages: data.settings.stats?.messages || 0,
                    events: data.settings.stats?.events || 0,
                    tasks: data.settings.stats?.tasks || 0,
                    voiceMessages: data.settings.stats?.voiceMessages || 0,
                    voiceSeconds: data.settings.stats?.voiceSeconds || 0
                },
                schedule: {
                    userDescription: data.settings.schedule?.userDescription || '',
                    dailyBibleVerse: data.settings.schedule?.dailyBibleVerse || false,
                    slots: Array.isArray(data.settings.schedule?.slots) ? data.settings.schedule.slots : [],
                    categories: Array.isArray(data.settings.schedule?.categories) ? data.settings.schedule.categories : [],
                    sports: Array.isArray(data.settings.schedule?.sports) ? data.settings.schedule.sports : [],
                    hobbies: Array.isArray(data.settings.schedule?.hobbies) ? data.settings.schedule.hobbies : []
                },
                subscription: data.settings.subscription || {
                    active: false,
                    trialMessagesUsed: 0,
                    trialLimit: 50,
                    subscriptionId: null,
                    subscriptionStartDate: null,
                    subscriptionEndDate: null
                }
            };
        }

        if (!settings.subscription.active && settings.subscription.trialMessagesUsed >= settings.subscription.trialLimit) {
            await showSubscriptionModal();
            isLoading = false;
            return;
        }

        if (!window.paypalLoaded) {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
            script.async = true;
            document.body.appendChild(script);
            window.paypalLoaded = true;
        }

        console.log('🕒 Schedule loaded:', {
            slots: settings.schedule.slots.length,
            categories: settings.schedule.categories.length,
            sports: settings.schedule.sports.length,
            hobbies: settings.schedule.hobbies.length
        });

        if (data.messages !== undefined) {
            messagesArray = data.messages;
        }

        const messagesContainer = document.getElementById('messages');
        if (messagesContainer && localStorage.getItem('lexor-current-tab') === 'chat') {
            messagesContainer.innerHTML = '';
            messagesArray.forEach(msg => {
                addMessage(msg.text, msg.sender, false, null, false);
            });
        }

        const activeTab = localStorage.getItem('lexor-current-tab') || 'chat';
        if (activeTab === 'calendar') {
            generateCalendar();
        }
        if (activeTab === 'tasks') {
            renderTasks();
        }
        if (activeTab === 'settings') {
            updateStats();
            updateLanguageSelect();
            updateBudgetDisplay();
        }

        console.log("✅ Data loaded successfully from server");

    } catch (err) {
        console.error("❌ Load error:", err);
    } finally {
        isLoading = false;
    }
}

function getUserEmail() { return localStorage.getItem('user_email'); }
function getPwaId() { return localStorage.getItem('pwa_id'); }
function getUserIdentifier() { 
    return getUserEmail() || getPwaId() || null;
}

let isInitialized = false;

document.addEventListener('DOMContentLoaded', async () => {
    if (isInitialized) return;
    isInitialized = true;

    const userEmail = getUserEmail();
    if (!userEmail) {
        return;
    }
    
    if (!checkPWAStatus()) {
        const checkInterval = setInterval(() => {
            if (deferredPrompt) {
                clearInterval(checkInterval);
                showPWAInstallBanner();
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
    
    await loadDataFromServer();
    await loadPayPalSDK();
    
    initTabs();
    initChat();
    initCalendar();
    initTasks();
    initSettings();
    initServiceWorker();
    initDeleteAccount();
    initLogout();
    initClearChat();
    
    console.log('✅ App initialized, checking PWA status...');
    
    if (checkPWAStatus()) {
        console.log('✅ PWA is installed, scheduling notification check...');
        setTimeout(() => {
            checkAndPromptNotifications().catch(err => console.error('Notification prompt error:', err));
        }, 3000);
    } else {
        console.log('ℹ️ PWA not installed yet, waiting for installation...');
    }
});

//setTimeout(() => checkAndPromptPWA(), 2000);

function initTabs() {
    const tabs = document.querySelectorAll('#nav-tabs li');
    const contents = document.querySelectorAll('.tab-content');

    let savedTab = localStorage.getItem('lexor-current-tab') || 'chat';

    function activateTab(target) {
        localStorage.setItem('lexor-current-tab', target);
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tabs.forEach(t => {
            if (t.dataset.tab === target) t.classList.add('active');
        });

        document.getElementById(target).classList.add('active');
        
        if (target === 'calendar') generateCalendar();
        if (target === 'tasks') renderTasks();
        if (target === 'settings') {
            updateStats();
            updateLanguageSelect();
            updateBudgetDisplay();
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            activateTab(tab.dataset.tab);
        });
    });

    activateTab(savedTab);
}


let deferredPrompt = null;
let isStandalone = false;

function checkPWAStatus() {
    const displayMode = window.matchMedia('(display-mode: standalone)').matches;
    const navigatorStandalone = window.navigator.standalone === true;
    const isIOSChrome = /CriOS/.test(navigator.userAgent);
    const localStorageFlag = localStorage.getItem('pwa-installed') === 'true';
    
    isStandalone = displayMode || navigatorStandalone;
    
    if (isStandalone) {
        localStorage.setItem('pwa-installed', 'true');
        return true;
    }
    
    if (localStorageFlag && !isIOSChrome) {
        return true;
    }
    
    return false;
}


window.testPWA = window.testPWA || {};
window.testPWA.reset = () => {
    localStorage.removeItem('pwa-installed');
    localStorage.removeItem('pwa-prompt-dismiss-time');
    localStorage.removeItem('notification-prompt-dismiss-time');
    console.log('✅ Reset flags - ora ricarica la pagina (F5)');
};

window.testPWA.showBanner = () => {
    if (deferredPrompt) {
        showPWAInstallBanner();
        console.log('✅ PWA banner shown');
    } else {
        console.log('⚠️ No deferredPrompt');
    }
};

window.testPWA.forceNotifications = () => {
    localStorage.removeItem('notification-prompt-dismiss-time');
    showNotificationModal();
    console.log('✅ Notification modal forced');
};

window.testPWA.status = () => {
    console.log('PWA installed:', localStorage.getItem('pwa-installed'));
    console.log('PWA dismiss time:', localStorage.getItem('pwa-prompt-dismiss-time'));
    console.log('Notif deny time:', localStorage.getItem('notification-prompt-dismiss-time'));
    console.log('Notification permission:', Notification.permission);
    console.log('Location protocol:', location.protocol);
    console.log('isSecureContext:', window.isSecureContext);
    try {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'notifications' }).then(p => {
                console.log('navigator.permissions (notifications):', p.state, p);
            }).catch(err => console.warn('permissions.query error:', err));
        }
    } catch (err) {
        console.warn('permissions API unavailable', err);
    }
};

function initPWAInstallPrompt() {
    if (checkPWAStatus()) {
        setTimeout(() => {
            checkAndPromptNotifications().catch(err => console.error('Notification prompt error:', err));
        }, 2000);
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        console.log('📢 Showing mandatory PWA banner immediately...');
        showPWAInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
        localStorage.setItem('pwa-installed', 'true');
        localStorage.removeItem('pwa-prompt-dismiss-time');
        const overlay = document.getElementById('pwa-install-overlay');
        if (overlay) {
            document.body.style.overflow = '';
            overlay.remove();
        }
        deferredPrompt = null;
        
        setTimeout(() => {
            checkAndPromptNotifications().catch(err => console.error('Notification prompt error:', err));
        }, 2000);
    });
}

initPWAInstallPrompt();

function checkNotificationStatus() {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    
    return Notification.permission;
}

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('❌ Notifications not supported');
        return 'unsupported';
    }
    return Notification.permission;
}

function promptNotificationPermission() {
    const permission = checkNotificationPermission();
    
    if (permission === 'unsupported' || permission === 'denied') return;
    if (permission === 'granted') {
        ensurePushSubscription();
        return;
    }

    console.log('🔔 Showing notification modal');
    showNotificationModal();
}



function showNotificationModal() {
    if (document.getElementById('lerri-notification-modal')) {
        console.log('⚠️ Modal already exists, skipping');
        return;
    }

    const container = document.createElement('div');
    container.id = 'lerri-notification-modal';
    container.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    `;

    container.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:30px;max-width:420px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3)">
            <div style="font-size:48px;margin-bottom:16px">🔔</div>
            <h3 style="margin:0 0 12px;font-size:1.5rem;color:#1a202c">Enable Notifications</h3>
            <p style="color:#718096;margin:0 0 20px;line-height:1.6">Stay updated with daily briefings, task reminders, and important alerts.</p>
            <div style="display:flex;gap:12px;justify-content:center">
                <button id="lerri-notif-enable" style="background:#667eea;color:#fff;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:600;font-size:1rem;transition:all 0.2s">Enable</button>
                <button id="lerri-notif-dismiss" style="background:#e2e8f0;color:#4a5568;border:none;padding:12px 24px;border-radius:10px;cursor:pointer;font-weight:500;font-size:1rem;transition:all 0.2s">Not Now</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const cleanup = () => {
        container.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            const el = document.getElementById('lerri-notification-modal');
            if (el) el.remove();
        }, 300);
    };

    document.getElementById('lerri-notif-dismiss').addEventListener('click', () => {
        localStorage.setItem('notification-prompt-dismiss-time', Date.now().toString());
        cleanup();
    });

    document.getElementById('lerri-notif-enable').addEventListener('click', async () => {
        console.log('-----🔔 Enable clicked');

        const enableBtn = document.getElementById('lerri-notif-enable');
        enableBtn.disabled = true;
        enableBtn.textContent = '⏳ Loading...';

        try {
            console.log('-----⏳ Requesting notification permission');
            const permission = await Notification.requestPermission();
            console.log('-----📊 Permission result:', permission);

            if (permission === 'granted') {
                console.log('-----✅ Permission granted');

                console.log('-----⏳ Waiting for service worker ready');
                await navigator.serviceWorker.ready;
                console.log('-----✅ Service worker ready');
                
                console.log('-----⏳ Getting registration with baseUrl:', baseUrl);
                const registration = await navigator.serviceWorker.getRegistration(baseUrl);
                console.log('-----📋 Registration result:', registration);
                
                if (!registration) {
                    console.error('-----❌ No registration found');
                    throw new Error('Service worker not registered');
                }
                
                console.log('-----✅ Service Worker found:', registration.scope);

                console.log('-----⏳ Subscribing to push notifications');
                console.log('-----🔑 VAPID key:', VAPID_PUBLIC_KEY.substring(0, 20) + '...');
                
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });

                currentPushSubscription = subscription;
                console.log('-----📩 Push subscription created successfully');
                console.log('-----📩 Subscription endpoint:', subscription.endpoint.substring(0, 50) + '...');

                const email = getUserEmail();
                console.log('-----📧 User email:', email);

                if (email) {
                    console.log('-----⏳ Sending subscription to backend');
                    const saved = await sendSubscriptionToBackend(email, subscription);
                    console.log('-----✅ Backend save result:', saved);

                    console.log('-----⏳ Syncing with server');
                    await syncToServer();
                    console.log('-----✅ Sync completed');
                }

                cleanup();
                showNotification('✅ Notifications enabled!', 'success');
                console.log('-----🎉 Flow completed successfully');

            } else if (permission === 'denied') {
                console.warn('-----🚫 Permission denied');
                localStorage.setItem('notification-prompt-dismiss-time', Date.now().toString());
                cleanup();
                showNotificationDeniedInstructions();
            } else {
                console.log('-----ℹ️ Permission dismissed/default');
                cleanup();
            }
        } catch (err) {
            console.error('-----❌ Full error object:', err);
            console.error('-----❌ Error message:', err.message);
            console.error('-----❌ Error stack:', err.stack);
            cleanup();
            showNotification('⚠️ Notification setup error: ' + err.message, 'error');
        }
    });
}

function hideNotificationModal() {
    const modal = document.getElementById('notification-permission-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

function showNotificationDeniedInstructions() {
    if (document.getElementById('lerri-notif-denied-modal')) return;

    const instructions = `Notifications are blocked for this site.

To enable them:
- Chrome / Edge: Click the lock icon (🔒) next to the address bar → Site settings → Notifications → Allow.
- Alternatively open: chrome://settings/content/notifications and remove this site from the blocked list.
- Firefox: Click the info icon (i) → Permissions → Notifications → Allow.
- You can also test in an Incognito/Private window or another browser profile.
- Or just ask Lerri how to do it! ;)

After changing the setting, reload this page and click Enable.`;

    const container = document.createElement('div');
    container.id = 'lerri-notif-denied-modal';
    container.style.cssText = `position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:10001;background:rgba(0,0,0,0.6);`;
    container.innerHTML = `
            <div style="
                background:#ffffff;
                border-radius:14px;
                padding:28px;
                max-width:600px;
                width:92%;
                box-shadow:0 25px 70px rgba(0,0,0,0.35);
                text-align:left;
                font-family:Inter, Arial, sans-serif;
                color:#111;
                animation:fadeIn 0.25s ease-out;
            ">
                <h3 style="
                    margin-top:0;
                    margin-bottom:10px;
                    font-size:22px;
                    font-weight:700;
                    color:#000;
                ">Notifications blocked</h3>

                <p style="
                    color:#2d3748;
                    white-space:pre-wrap;
                    margin-bottom:18px;
                    line-height:1.55;
                    font-size:15px;
                ">${instructions}</p>

                <div style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                    margin-top:20px;
                ">

                    <button id="lerri-copy-notif-instr" style="
                        padding:9px 14px;
                        border-radius:8px;
                        border:1px solid #d1d5db;
                        background:#f8f9fa;
                        font-size:14px;
                        cursor:pointer;
                        transition:0.2s;
                    " onmouseover="this.style.background='#eceff1'"
                    onmouseout="this.style.background='#f8f9fa'">Copy instructions</button>

                    <a id="lerri-open-notif-settings"
                    href="chrome://settings/content/notifications"
                    target="_blank"
                    style="
                        padding:9px 14px;
                        border-radius:8px;
                        border:1px solid #c3d3ff;
                        background:#e8f0ff;
                        color:#1a56db;
                        text-decoration:none;
                        font-size:14px;
                        display:inline-flex;
                        align-items:center;
                        transition:0.2s;
                    "
                    onmouseover="this.style.background='#d9e6ff'"
                    onmouseout="this.style.background='#e8f0ff'">Open settings</a>

                    <button id="lerri-close-notif-instr" style="
                        padding:9px 14px;
                        border-radius:8px;
                        background:#e5e7eb;
                        border:none;
                        font-size:14px;
                        cursor:pointer;
                        transition:0.2s;
                    " onmouseover="this.style.background='#d5d7db'"
                    onmouseout="this.style.background='#e5e7eb'">Close</button>

                </div>
            </div>
        `;


    document.body.appendChild(container);

    document.getElementById('lerri-copy-notif-instr').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(instructions);
            showNotification('📋 Instructions copied to clipboard', 'success');
        } catch (err) {
            showNotification('⚠️ Unable to copy — please select and copy manually', 'error');
        }
    });

    document.getElementById('lerri-close-notif-instr').addEventListener('click', () => {
        const el = document.getElementById('lerri-notif-denied-modal');
        if (el) el.remove();
    });
}

async function checkAndPromptPWA() {
    if (checkPWAStatus()) {
        await checkAndPromptNotifications();
        return;
    }

    if (deferredPrompt) {
        console.log('✅ Showing mandatory PWA banner...');
        showPWAInstallBanner();
    } else {
        console.log('⚠️ deferredPrompt not available yet, will show when ready');
    }
}

async function checkAndPromptNotifications() {
    console.log('🔔 Checking notification status...');
    
    const status = checkNotificationStatus();
    console.log('📊 Notification permission:', status);
    
    if (status === 'unsupported') {
        console.log('❌ Notifications not supported in this browser');
        return;
    }
    
    if (status === 'granted') {
        console.log('✅ Notifications already granted, ensuring subscription...');
        await ensurePushSubscription();
        return;
    }
    
    if (status === 'denied') {
        console.log('❌ Notifications denied by user');
        return;
    }

    const dismissTime = localStorage.getItem('notification-prompt-dismiss-time');
    const daysSinceDismiss = dismissTime ? (Date.now() - parseInt(dismissTime, 10)) / (1000 * 60 * 60 * 24) : 999;
    
    console.log('📅 Days since last dismiss:', daysSinceDismiss.toFixed(2));
    
    if (daysSinceDismiss < 7) {
        console.log('⏳ User dismissed recently, waiting 7 days before asking again');
        return;
    }

    console.log('✅ Showing notification prompt...');
    setTimeout(() => {
        promptNotificationPermission();
    }, 1000);
}

async function ensurePushSubscription() {
    try {
        if (!('serviceWorker' in navigator)) {
            console.error('❌ Service Worker not supported');
            return null;
        }

        await navigator.serviceWorker.ready;
        console.log('✅ Service Worker ready');

        const registration = await navigator.serviceWorker.getRegistration(baseUrl);
        
        if (!registration) {
            console.error('❌ No Service Worker registration found');
            return null;
        }

        console.log('✅ Service Worker registration found:', registration.scope);

        let existing = await registration.pushManager.getSubscription();
        if (!existing) {
            existing = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });
            console.log('✅ New push subscription created');
        } else {
            console.log('✅ Using existing push subscription');
        }

        currentPushSubscription = existing;
        const email = getUserEmail();
        if (email) {
            await sendSubscriptionToBackend(email, existing);
        }

        return existing;

    } catch (err) {
        console.error('❌ ensurePushSubscription error:', err);
        return null;
    }
}


async function sendSubscriptionToBackend(email, subscription) {
    try {
        const response = await fetch('https://api.lerriai.com/api/subscribe-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                subscription: subscription.toJSON()
            })
        });
        
        if (!response.ok) {
            console.error('❌ Backend subscription save failed:', response.status);
            return false;
        }
        
        const data = await response.json();
        console.log('✅ Subscription saved to backend');
        return true;
        
    } catch (error) {
        console.error('❌ sendSubscriptionToBackend error:', error);
        return false;
    }
}

function initChat() {
    if (initChat.initialized) return;
    initChat.initialized = true;
    const messagesContainer = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const email = getUserEmail();
    const userName = localStorage.getItem('user_name') || 'User';

    updateTrialBanner();
    
    if (!email) {
        //window.location.href = '../login.html';
        return;
    }

    if (settings.currentSpend >= settings.maxSpend) {
        chatInput.disabled = true;
        chatInput.placeholder = '⚠️ Budget esaurito';
        micBtn.disabled = true;
        const attachBtn = document.getElementById('attach-btn');
        if (attachBtn) attachBtn.disabled = true;
        addMessage('⚠️ You have reached your monthly spending limit. Increase your budget in your settings to continue.', 'bot', false);
        return;
    }

    const welcomeMsg = messagesContainer.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.innerHTML = `
            <h3>👋 Hello ${userName}!</h3>
            <p>I'm Lerri, your digital strategic AI assistant. How can I help you today?</p>
        `;
    }
    
    const micBtn = document.getElementById("mic-btn");
    const attachBtn = document.getElementById("attach-btn");
    const fileInput = document.getElementById("file-input");
    
    if (attachBtn && fileInput) {
        attachBtn.addEventListener("click", () => {
            fileInput.click();
        });
        
        fileInput.addEventListener("change", handleFileSelect);
    }
    
    let mediaRecorder;
    let audioChunks = [];
    let startTime;

    micBtn.addEventListener("click", async () => {
        if (isProcessing) return;

        if (!mediaRecorder || mediaRecorder.state === "inactive") {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                startTime = Date.now();

                chatInput.placeholder = '🔴 Recording...';
                chatInput.disabled = true;
                micBtn.classList.add("recording");

                mediaRecorder.ondataavailable = (e) => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = async () => {
                    chatInput.placeholder = 'Ask Lerri...';
                    chatInput.disabled = false;

                    try {
                        const trialStatus = await checkTrialStatus();
                        if (!trialStatus.canSendMessage) {
                            await showSubscriptionModal(); // Mostra il popup di abbonamento
                            
                            // Spegni il microfono e ferma tutto
                            if (typeof stream !== 'undefined') {
                                stream.getTracks().forEach(track => track.stop());
                            }
                            return; // ESCE DALLA FUNZIONE QUI (non invia nulla)
                        }
                    } catch (err) {
                        console.error("Errore verifica trial vocale:", err);
                    }

                    setProcessingState(true);
                                    
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const durationMs = Date.now() - startTime;
                    const durationSeconds = Math.round(durationMs / 1000);

                    const voiceCost = calculateMessageCost(true, durationSeconds);
                    const filesCost = calculateFileCost(attachedFiles);
                    const totalCost = voiceCost + filesCost;

                    if (settings.currentSpend + totalCost > settings.maxSpend) {
                        addMessage('⚠️ Budget limit reached! Increase your maximum budget to continue.', 'bot');
                        stream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    const hasFiles = attachedFiles.length > 0;
                    const filesList = attachedFiles.map(item => item.file.name).join(', ');

                    const transcribingMsg = addMessage(`🎤 Audio ${durationSeconds}s${hasFiles ? ` + ${attachedFiles.length} file(s)` : ''} - Transcribing...`, 'user', false);
                                        
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const base64Audio = reader.result.split(',')[1];
                        
                        try {
                            const filesData = await Promise.all(
                                attachedFiles.map(item => fileToBase64(item.file))
                            );

                            const response = await fetch(BACKEND_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    audio_data: base64Audio,
                                    email: getUserEmail(),
                                    user_id: getUserIdentifier(),
                                    files: filesData
                                })
                            });
                            
                            const data = await response.json();

                            if (!response.ok) {
                                if (data && data.error) {
                                    throw new Error(data.error);
                                } else {
                                    throw new Error(`Server error: ${response.statusText}`);
                                }
                            }

                            const transcribedText = data.transcription || '';
                            const aiReply = data.value || data.reply || '';
                            
                            transcribingMsg.remove();
                            
                            if (transcribedText) {
                                const userMsgElement = addMessage(transcribedText, 'user', true, audioBlob, true);
                                
                                if (hasFiles) {
                                    const filesListDiv = document.createElement('div');
                                    filesListDiv.className = 'message-files-list';
                                    filesListDiv.innerHTML = attachedFiles.map(item => `
                                        <span class="message-file-badge">
                                            <span class="file-chip-icon">${getFileIcon(item.file.type)}</span>
                                            ${item.file.name}
                                        </span>
                                    `).join('');
                                    userMsgElement.appendChild(filesListDiv);
                                }
                            }
                            
                            if (aiReply) {
                                addMessage(aiReply, 'bot', true, null, true);
                            }

                            settings.stats.messages++;
                            settings.stats.voiceMessages = (settings.stats.voiceMessages || 0) + 1;
                            settings.stats.voiceSeconds = (settings.stats.voiceSeconds || 0) + durationSeconds;
                            settings.currentSpend += totalCost;
                            settings.currentSpend = Math.round(settings.currentSpend * 100000) / 100000;

                            console.log(`💰 Voice cost: €${voiceCost.toFixed(5)} (${durationSeconds}s) + Files: €${filesCost.toFixed(2)}`);

                            if (data.events) events = data.events;
                            if (data.tasks) tasks = data.tasks;
                            if (data.stats) {
                                settings.stats.events = data.stats.events || settings.stats.events;
                                settings.stats.tasks = data.stats.tasks || settings.stats.tasks;
                            }

                            if (data.subscription) {
                                settings.subscription = data.subscription;
                                console.log('✅ Updated subscription from voice:', settings.subscription);
                            }

                            await syncToServer();
                            await updateTrialBanner();
                            setProcessingState(false);
                            updateStats();
                            updateBudgetDisplay();
                            
                        } catch (error) {
                            transcribingMsg.remove();
                            // Mostra un messaggio di errore più specifico.
                            addMessage(`❌ Si è verificato un errore: ${error.message}. Riprova.`, 'bot');
                            console.error("Audio error:", error);
                        }
                    };
                    
                    reader.readAsDataURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                
            } catch (error) {
                console.error("Microphone error:", error);
                addMessage("❌ Cannot access microphone.", 'bot');
                chatInput.disabled = false;
                chatInput.placeholder = 'Scrivi un messaggio...';
            }
        } else {
            mediaRecorder.stop();
            micBtn.classList.remove("recording");
        }
    });
    
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isProcessing) return;
        
        const msg = chatInput.value.trim();
        if (!msg && attachedFiles.length === 0) return;

        const trialStatus = await checkTrialStatus();
        
        if (!trialStatus.canSendMessage) {
            await showSubscriptionModal();
            return;
        }
        
        if (trialStatus.messagesRemaining >= 0 && trialStatus.messagesRemaining <= 5) {
            showNotification(`⚠️ ${trialStatus.messagesRemaining} free messages remaining`, 'warning');
        }

        const textCost = calculateMessageCost(false);
        const filesCost = calculateFileCost(attachedFiles);
        const totalCost = textCost + filesCost;

        if (settings.currentSpend + totalCost > settings.maxSpend) {
            addMessage('⚠️ Budget limit reached!', 'bot');
            return;
        }

        setProcessingState(true);
        const attachBtn = document.getElementById('attach-btn');
        if (attachBtn) attachBtn.disabled = true;
        const briefingBtn = document.getElementById('daily-briefing-btn');
        if (briefingBtn) briefingBtn.disabled = true;

        const hasFiles = attachedFiles.length > 0;
        const filesList = attachedFiles.map(item => item.file.name).join(', ');
        
        let displayMsg = msg || '🔎 Analyzing attached files';
        if (hasFiles && msg) {
            displayMsg = msg;
        }
        
        const userMsgElement = addMessage(displayMsg, 'user', true, null, true);
        
        if (hasFiles) {
            const filesListDiv = document.createElement('div');
            filesListDiv.className = 'message-files-list';
            filesListDiv.innerHTML = attachedFiles.map(item => `
                <span class="message-file-badge">
                    <span class="file-chip-icon">${getFileIcon(item.file.type)}</span>
                    ${item.file.name}
                </span>
            `).join('');
            userMsgElement.appendChild(filesListDiv);
        }
        
        chatInput.value = '';

        const loadingMsg = addMessage('⏳ Processing...', 'bot', false);

        try {
            const filesData = await Promise.all(
                attachedFiles.map(item => fileToBase64(item.file))
            );

            let optimizedPrompt = msg;
            
            if (hasFiles) {
                const fileContext = `\n\n[SYSTEM: The user has attached ${attachedFiles.length} document${attachedFiles.length > 1 ? 's' : ''}: ${filesList}. Analyze the content and respond accordingly.]`;
                optimizedPrompt = (msg || 'Please analyze the attached documents and provide a summary.') + fileContext;
            }

            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: optimizedPrompt,
                    email: getUserEmail(),
                    user_id: getUserIdentifier(),
                    files: filesData.length > 0 ? filesData : undefined
                })
            });

            if (response.status === 401) {
                const errorData = await response.json();
                if (errorData.needsReauth) {
                    loadingMsg.remove();
                    addReauthButton();
                    return;
                }
            }

            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const replyText = data.value || data;

            loadingMsg.remove();
            addMessage(replyText, 'bot', true, null, true);

            settings.stats.messages++;
            settings.currentSpend += totalCost;
            settings.currentSpend = Math.round(settings.currentSpend * 100000) / 100000;

            console.log(`💰 Text cost: €${textCost.toFixed(5)} + Files: €${filesCost.toFixed(2)}`);

            if (data.events) events = data.events;
            if (data.tasks) tasks = data.tasks;
            if (data.stats) {
                settings.stats.events = data.stats.events || settings.stats.events;
                settings.stats.tasks = data.stats.tasks || settings.stats.tasks;
            }

            if (data.subscription) {
                settings.subscription = data.subscription;
            }

            await syncToServer();
            updateStats();
            updateBudgetDisplay();
            await updateTrialBanner();

        } catch (error) {
            loadingMsg.remove();
            
            if (error.status === 401 || (error.message && error.message.includes('401'))) {
                addReauthButton();
            } else {
                addMessage('❌ Server error. Try again.', 'bot');
                showNotification('❌ Server error. Please try again later.', 'error');
            }
            
            console.error("Chat error:", error);
        } finally {
            setProcessingState(false);
            if (attachBtn) attachBtn.disabled = false;
            if (briefingBtn) briefingBtn.disabled = false;
        }
    });
    initDailyBriefingButton();
    updateTrialBanner();
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    if (attachedFiles.length + files.length > MAX_FILES) {
        showNotification(`❌ Maximum ${MAX_FILES} files allowed`, 'error');
        return;
    }

    const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    for (const file of files) {
        if (!validTypes.includes(file.type)) {
            showNotification(`❌ File type not supported: ${file.name}`, 'error');
            continue;
        }

        if (file.size > 2 * 1024 * 1024) {
            showNotification(`❌ File too large (max 10MB): ${file.name}`, 'error');
            continue;
        }

        attachedFiles.push({
            file: file,
            addedAt: Date.now(),
            messageCount: 0
        });
    }

    updateAttachedFilesDisplay();
    event.target.value = '';
}

function updateAttachedFilesDisplay() {
    let display = document.getElementById('attached-files-display');
    
    if (!display) {
        const messagesContainer = document.getElementById('messages');
        display = document.createElement('div');
        display.id = 'attached-files-display';
        display.className = 'attached-files-display hidden';
        messagesContainer.parentNode.insertBefore(display, messagesContainer);
    }

    if (attachedFiles.length === 0) {
        display.classList.add('hidden');
        return;
    }

    display.classList.remove('hidden');
    
    const totalSize = attachedFiles.reduce((sum, item) => sum + item.file.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    display.innerHTML = `
        <div class="files-count-badge">
            📎 ${attachedFiles.length} file${attachedFiles.length > 1 ? 's' : ''} (${totalSizeMB} MB)
        </div>
        ${attachedFiles.map((item, index) => `
            <div class="attached-file-chip">
                <span class="file-chip-icon">${getFileIcon(item.file.type)}</span>
                <div class="file-chip-info">
                    <span class="file-chip-name">${item.file.name}</span>
                    <span class="file-chip-size">${(item.file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button type="button" class="remove-file-chip-btn" onclick="removeAttachedFile(${index})">×</button>
            </div>
        `).join('')}
    `;
}


function updateAttachedFilesUI() {
    let container = document.getElementById('attached-files-container');
    
    if (!container) {
        const chatForm = document.getElementById('chat-form');
        container = document.createElement('div');
        container.id = 'attached-files-container';
        container.className = 'attached-files-container';
        chatForm.insertBefore(container, chatForm.firstChild);
    }

    if (attachedFiles.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = attachedFiles.map((file, index) => `
        <div class="attached-file-tag">
            <span class="file-icon">${getFileIcon(file.type)}</span>
            <span class="file-name">${file.name}</span>
            <button type="button" class="remove-file-btn" onclick="removeAttachedFile(${index})">×</button>
        </div>
    `).join('');

    const filesCost = attachedFiles.length * COSTS.FILE_ATTACHMENT;
    const costTag = document.createElement('div');
    costTag.className = 'files-cost-tag';
    costTag.textContent = `+€${filesCost.toFixed(2)}`;
    container.appendChild(costTag);
}

function removeAttachedFile(index) {
    attachedFiles.splice(index, 1);
    updateAttachedFilesDisplay();
    showNotification('📎 File removed', 'info');
}

function clearAttachedFiles() {
    attachedFiles = [];
    updateAttachedFilesDisplay();
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('text')) return '📃';
    return '📎';
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result.split(',')[1]
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

window.removeAttachedFile = removeAttachedFile;

function initCalendar() {
    generateCalendar();
    initEmojiSelect();
    
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--; 
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        generateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++; 
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        generateCalendar();
    });
    
    document.getElementById('back-to-month').addEventListener('click', () => {
        document.getElementById('day-view').classList.add('hidden');
        document.getElementById('monthly-view').classList.remove('hidden');
    });
    
    document.getElementById('day-event-form').addEventListener('submit', (e) => {
        e.preventDefault(); 
        saveEvent();
    });
    
    document.getElementById('delete-day-event').addEventListener('click', deleteEvent);

    document.getElementById('import-google-calendar').addEventListener('click', importFromGoogleCalendar);

    async function importFromGoogleCalendar() {
        const email = getUserEmail();
        if (!email) {
            showNotification('Please login first', 'error');
            return;
        }

        const btn = document.getElementById('import-google-calendar');
        const originalText = btn.textContent;
        btn.textContent = '⏳';
        btn.disabled = true;

        try {
            const response = await fetch('https://api.lerriai.com/api/import-google-calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.status === 401) {
                const data = await response.json();
                if (data.needsReauth) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    showNotification('Authorization expired. Please reconnect your Google account.', 'error');
                    addReauthButton();
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Import failed');
            }

            const data = await response.json();
            
            events = data.events;
            settings.stats = data.stats;
            
            generateCalendar();
            updateStats();
            
            showNotification(`✅ Imported ${data.importedCount} events from Google Calendar`, 'success');

        } catch (error) {
            console.error('Import error:', error);
            showNotification('❌ Failed to import events. Try again.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}

function generateCalendar() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calendar-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const tbody = document.getElementById('calendar-body'); 
    tbody.innerHTML = '';
    
    let date = 1, nextMonthDate = 1;
    
    for (let i=0; i<6; i++) {
        const row = document.createElement('tr');
        
        for (let j=0; j<7; j++) {
            const cell = document.createElement('td');
            
            if (i===0 && j<startDay) { 
                const dayNum = document.createElement('span');
                dayNum.className = 'day-number';
                dayNum.textContent = daysInPrevMonth - startDay + j + 1;
                cell.appendChild(dayNum);
                cell.classList.add('other-month'); 
            }
            else if (date > daysInMonth) { 
                const dayNum = document.createElement('span');
                dayNum.className = 'day-number';
                dayNum.textContent = nextMonthDate;
                cell.appendChild(dayNum);
                cell.classList.add('other-month'); 
                nextMonthDate++; 
            }
            else {
                const cellDate = date;
                const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(cellDate).padStart(2,'0')}`;
                
                const dayNum = document.createElement('span');
                dayNum.className = 'day-number';
                dayNum.textContent = cellDate;
                cell.appendChild(dayNum);
                
                const recurringEvents = getRecurringEventsForDate(dateKey);
                const customEvents = events[dateKey] || [];
                const allEvents = [...recurringEvents, ...customEvents];
                
                if (allEvents.length > 0) {
                    const eventsPreview = document.createElement('div');
                    eventsPreview.className = 'events-preview';
                    
                    const displayEvents = allEvents.slice(0, 3);
                    displayEvents.forEach(event => {
                        const dot = document.createElement('span');
                        dot.className = 'event-dot';
                        
                        const match = event.title.match(/^(\p{Emoji})/u);
                        dot.textContent = match ? match[1] : '🕒';
                        
                        eventsPreview.appendChild(dot);
                    });
                    
                    cell.appendChild(eventsPreview);
                }
                
                const today = new Date();
                if (cellDate === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    cell.classList.add('today');
                }
                
                cell.addEventListener('click', () => openDayView(cellDate));
                date++;
            }
            
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
        if (date > daysInMonth) break;
    }
}

// Update only the getRecurringEventsForDate function in app.js

function getRecurringEventsForDate(dateKey) {
    const schedule = settings.schedule;
    if (!schedule) return [];

    const date = new Date(dateKey);
    const currentDay = date.getDay();
    const dayMap = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
    const dayName = Object.keys(dayMap).find(d => dayMap[d] === currentDay);

    if (!dayName) return [];

    const recurringEvents = [];

    // Process categories
    if (Array.isArray(schedule.categories)) {
        const dayCategories = schedule.categories.filter(cat => cat.day === dayName);
        dayCategories.forEach(cat => {
            if (cat.slots && cat.slots.length > 0) {
                const firstSlot = cat.slots[0];
                const lastSlot = cat.slots[cat.slots.length - 1];
                const description = cat.slots.map(s => `${s.start}-${s.end}: ${s.emoji || ''} ${s.name || ''}`).join(' | ');

                recurringEvents.push({
                    title: `📁 ${cat.name}`,
                    start: firstSlot.start,
                    end: lastSlot.end,
                    description: description,
                    isRecurring: true
                });
            }
        });
    }

    // Process individual slots (excluding categorized ones)
    if (Array.isArray(schedule.slots)) {
        const daySlots = schedule.slots.filter(slot => slot.day === dayName);
        const categorizedSlotIds = new Set();
        
        if (Array.isArray(schedule.categories)) {
            schedule.categories.forEach(cat => {
                if (cat.day === dayName && Array.isArray(cat.slotIds)) {
                    cat.slotIds.forEach(id => categorizedSlotIds.add(id));
                }
            });
        }

        daySlots.forEach(slot => {
            if (!categorizedSlotIds.has(slot.id)) {
                recurringEvents.push({
                    title: `${slot.emoji || ''} ${slot.name || ''}`.trim() || 'Activity',
                    start: slot.start,
                    end: slot.end,
                    description: slot.description || '',
                    isRecurring: true
                });
            }
        });
    }

    // Process sports
    if (Array.isArray(schedule.sports)) {
        schedule.sports.forEach(sport => {
            if (Array.isArray(sport.days) && sport.days.includes(dayName)) {
                recurringEvents.push({
                    title: `${sport.emoji || '⚽'} ${sport.name}`,
                    start: sport.startTime || '00:00',
                    end: sport.endTime || '23:59',
                    description: `Sport: ${sport.name}`,
                    isRecurring: true
                });
            }
        });
    }

    // Process hobbies
    if (Array.isArray(schedule.hobbies)) {
        schedule.hobbies.forEach(hobby => {
            if (Array.isArray(hobby.days) && hobby.days.includes(dayName)) {
                recurringEvents.push({
                    title: `${hobby.emoji || '🎨'} ${hobby.name}`,
                    start: hobby.startTime || '10:00',
                    end: hobby.endTime || '11:00',
                    description: `Hobby: ${hobby.name}`,
                    isRecurring: true
                });
            }
        });
    }

    return recurringEvents;
}

function openDayView(day){
    selectedDate = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('selected-date-title').textContent = `${day} ${monthNames[currentMonth]} ${currentYear}`;
    document.getElementById('monthly-view').classList.add('hidden');
    document.getElementById('day-view').classList.remove('hidden');
    loadDayEvents(); 
    clearEventForm();
}

function loadDayEvents() {
    const eventList = document.getElementById('day-event-list');
    const recurringEvents = getRecurringEventsForDate(selectedDate);
    const customEvents = events[selectedDate] || [];
    const allEvents = [...recurringEvents, ...customEvents];
    
    if (allEvents.length === 0) {
        eventList.innerHTML = '<li class="empty-state">No events for this day</li>';
        return;
    }
    
    eventList.innerHTML = '';
    
    recurringEvents.forEach((event) => {
        const li = document.createElement('li');
        const description = event.description ? `<br><small style="color: #64748b;">${event.description}</small>` : '';
        li.innerHTML = `<div><strong>${event.title}</strong> <span style="background: rgba(102, 126, 234, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px;">Recurring</span><br><small>${event.start} - ${event.end}</small>${description}</div>`;
        li.style.opacity = '0.85';
        eventList.appendChild(li);
    });
    
    customEvents.forEach((event, index) => {
        const li = document.createElement('li');
        const description = event.description ? `<br><small style="color: #64748b;">${event.description}</small>` : '';
        li.innerHTML = `<div><strong>${event.title}</strong><br><small>${event.start} - ${event.end}</small>${description}</div>
                        <button onclick="editEvent(${index})" class="btn-secondary">Edit</button>`;
        eventList.appendChild(li);
    });
}

async function saveEvent() {
    const emojiSelect = document.getElementById('event-emoji-select');
    const titleInput = document.getElementById('day-event-title');
    const descriptionInput = document.getElementById('day-event-description');
    const startInput = document.getElementById('day-event-start');
    const endInput = document.getElementById('day-event-end');
    const eventIdInput = document.getElementById('day-event-id');
    const recurringCheckbox = document.getElementById('event-recurring');
    
    const selectedEmoji = emojiSelect.value || '🕐';
    const titleText = titleInput.value.trim();
    
    if (!titleText) {
        alert('Please enter an event title');
        return;
    }
    
    const fullTitle = `${selectedEmoji} ${titleText}`;
    const description = descriptionInput.value.trim();
    const start = startInput.value || "00:00";
    const end = endInput.value || "23:59";
    const eventId = eventIdInput.value;
    const isRecurring = recurringCheckbox.checked;

    const event = { 
        title: fullTitle,
        description, 
        start,
        end
    };

    if (eventId !== '') {
        events[selectedDate][parseInt(eventId)] = event;
    } else {
        if (isRecurring) {
            const baseDate = new Date(selectedDate);
            const month = baseDate.getMonth();
            const day = baseDate.getDate();
            
            for (let yearOffset = 0; yearOffset < 5; yearOffset++) {
                const targetYear = baseDate.getFullYear() + yearOffset;
                const targetDateKey = `${targetYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                if (!events[targetDateKey]) events[targetDateKey] = [];
                events[targetDateKey].push({ ...event });
            }
        } else {
            if (!events[selectedDate]) events[selectedDate] = [];
            events[selectedDate].push(event);
        }
        
        settings.stats.events++;
    }

    try {
        const response = await fetch("https://api.lerriai.com/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: getUserEmail(),
                events: events,
                pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
                settings: settings,
                messages: messagesArray
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save event');
        }
    } catch (error) {
        console.error('Save event error:', error);
        showNotification('❌ Failed to save event', 'error');
        return;
    }

    updateStats();
    loadDayEvents();
    clearEventForm();
    generateCalendar();
    
    const message = isRecurring 
        ? '✅ Event saved and repeated for 5 years' 
        : '✅ Event saved successfully';
    showNotification(message, 'success');
}



function editEvent(index) {
    const event = events[selectedDate][index];
    
    const emojiMatch = event.title.match(/^(\p{Emoji}+)\s/u);
    const emoji = emojiMatch ? emojiMatch[1] : '🕒';
    const titleText = emojiMatch ? event.title.substring(emoji.length).trim() : event.title;
    
    document.getElementById('event-emoji-select').value = emoji;
    document.getElementById('day-event-title').value = titleText;
    document.getElementById('day-event-description').value = event.description || '';
    document.getElementById('day-event-start').value = event.start;
    document.getElementById('day-event-end').value = event.end;
    document.getElementById('day-event-id').value = index;
}

async function deleteEvent(){
    const eventId = document.getElementById('day-event-id').value;
    if(!eventId) return;
    events[selectedDate].splice(parseInt(eventId), 1);
    if(events[selectedDate].length === 0) delete events[selectedDate];
    
    try {
        const response = await fetch("https://api.lerriai.com/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: getUserEmail(),
                events: events,
                pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
                settings: settings,
                messages: messagesArray
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete event');
        }
    } catch (error) {
        console.error('Delete event error:', error);
        showNotification('❌ Failed to delete event', 'error');
        return;
    }
    
    loadDayEvents();
    clearEventForm();
    generateCalendar();
}

function clearEventForm() {
    document.getElementById('event-emoji-select').value = '🕒';
    document.getElementById('day-event-title').value = '';
    document.getElementById('day-event-description').value = '';
    document.getElementById('day-event-start').value = '';
    document.getElementById('day-event-end').value = '';
    document.getElementById('day-event-id').value = '';
    document.getElementById('event-recurring').checked = false;
}

function initTasks(){
    const taskForm=document.getElementById('task-form');
    taskForm.addEventListener('submit',e=>{e.preventDefault(); addTask();});
    document.getElementById('clear-completed').addEventListener('click', async ()=>{
        tasks=tasks.filter(t=>!t.completed); 
        await syncToServer(); 
        renderTasks();
    });
    document.querySelectorAll('.filter-btn').forEach(btn=>{
        btn.addEventListener('click',e=>{
            document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
            e.target.classList.add('active');
            renderTasks(e.target.dataset.filter);
        });
    });
    renderTasks();
}

async function addTask(){
    const title=document.getElementById('task-title').value.trim();
    const time=document.getElementById('task-time').value;
    if(!title) return;
    
    tasks.push({
        id:Date.now(),
        title,
        time,
        completed:false,
        createdAt:new Date().toISOString()
    });
    
    settings.stats.tasks++;
    
    try {
        const response = await fetch("https://api.lerriai.com/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: getUserEmail(),
                tasks: tasks,
                pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
                settings: settings,
                messages: messagesArray
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save task');
        }
    } catch (error) {
        console.error('Add task error:', error);
        showNotification('❌ Failed to save task', 'error');
        return;
    }
    
    updateStats(); 
    renderTasks(); 
    document.getElementById('task-form').reset();
}

function renderTasks(filter='all'){
    const taskList=document.getElementById('task-list');
    let filteredTasks=tasks;
    if(filter==='active') filteredTasks=tasks.filter(t=>!t.completed);
    else if(filter==='completed') filteredTasks=tasks.filter(t=>t.completed);
    
    if(filteredTasks.length===0){ 
        taskList.innerHTML='<li class="empty-state">No tasks to show</li>'; 
        return; 
    }
    
    taskList.innerHTML='';
    filteredTasks.forEach(task=>{
        const li=document.createElement('li');
        li.className=task.completed?'completed':'';
        li.innerHTML=`<input type="checkbox" class="task-checkbox" ${task.completed?'checked':''} onchange="toggleTask(${task.id})">
            <div class="task-content">${task.time?`<span class="task-time">${task.time}</span>`:''}<span class="task-text">${task.title}</span></div>
            <div class="task-actions"><button onclick="deleteTask(${task.id})" class="btn-danger">Delete</button></div>`;
        taskList.appendChild(li);
    });
}

async function toggleTask(id){
    const task=tasks.find(t=>t.id===id);
    if(task){ 
        task.completed=!task.completed;
        
        try {
            const response = await fetch("https://api.lerriai.com/api/save-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: getUserEmail(),
                    tasks: tasks,
                    pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
                    settings: settings,
                    messages: messagesArray
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            console.error('Toggle task error:', error);
            showNotification('❌ Failed to update task', 'error');
            return;
        }
        
        renderTasks(); 
    }
}

async function deleteTask(id){ 
    tasks=tasks.filter(t=>t.id!==id);
    
    try {
        const response = await fetch("https://api.lerriai.com/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: getUserEmail(),
                tasks: tasks,
                pushSubscription: currentPushSubscription ? currentPushSubscription.toJSON() : null,
                settings: settings,
                messages: messagesArray
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Delete task error:', error);
        showNotification('❌ Failed to delete task', 'error');
        return;
    }
    
    renderTasks(); 
}

function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        opacity: 0;
        transition: opacity 0.5s, bottom 0.5s;
        z-index: 9999;
        font-weight: 500;
    `;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b', 
        info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type] || colors.success;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.bottom = '50px';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.bottom = '30px';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 500);
    }, 3000);
}

function initSettings(){
    const settingsForm=document.getElementById('settings-form');
    const maxSpendInput=document.getElementById('max-spend');
    const languageSelect=document.getElementById('language-select');
    const userDescriptionInput=document.getElementById('user-description');
    const bibleVerseCheckbox=document.getElementById('daily-bible-verse');

    const manageScheduleBtn = document.getElementById('manage-schedule-btn');
    if (manageScheduleBtn) {
        manageScheduleBtn.addEventListener('click', () => {
            if (typeof openScheduleManager === 'function') {
                openScheduleManager();
            } else {
                showNotification('❌ Errore caricamento. Ricarica la pagina.', 'error');
            }
        });
    }
    
    maxSpendInput.value=settings.maxSpend;
    
    const currentDescription = settings.schedule?.userDescription || '';
    userDescriptionInput.value = currentDescription;
    userDescriptionInput.placeholder = currentDescription || 'Tell me about yourself, your interests, goals...';
    
    bibleVerseCheckbox.checked = settings.schedule?.dailyBibleVerse || false;
    
    updateBudgetDisplay(); 
    updateModelCost();
    updateLanguageSelect();
    
    settingsForm.addEventListener('submit', async e=>{
        e.preventDefault(); 
        settings.maxSpend=parseFloat(maxSpendInput.value)||0.90;
        settings.language = languageSelect.value;
        
        if (!settings.schedule) {
            settings.schedule = { slots: [], categories: [], sports: [], hobbies: [] };
        }
        settings.schedule.userDescription = userDescriptionInput.value.trim();
        settings.schedule.dailyBibleVerse = bibleVerseCheckbox.checked;
        
        try {
            await fetch("https://api.lerriai.com/api/set-language", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: getUserEmail(), language: settings.language })
            });
        } catch (err) {
            console.error("Language update failed:", err);
        }
        
        await syncToServer();
        updateBudgetDisplay(); 
        showNotification('Settings saved!', 'success');
    });
}

function updateLanguageSelect() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    languageSelect.innerHTML = '';
    for (const [code, name] of Object.entries(LANGUAGES)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        if (settings.language === code) {
            option.selected = true;
        }
        languageSelect.appendChild(option);
    }
}

function updateBudgetDisplay(){
    document.getElementById('current-spend').textContent=settings.currentSpend.toFixed(5);
    document.getElementById('max-spend-display').textContent=settings.maxSpend.toFixed(2);
    const percentage=(settings.currentSpend/settings.maxSpend)*100;
    const progressBar = document.getElementById('spend-progress');
    progressBar.style.width=`${Math.min(percentage,100)}%`;
    
    if (percentage >= 90) {
        progressBar.style.background = '#ef4444';
    } else if (percentage >= 70) {
        progressBar.style.background = '#f59e0b';
    } else {
        progressBar.style.background = '#667eea';
    }
}

function updateModelCost(){
    const costs={'gpt-4o-mini':0.99,'gpt-4o':0.015,'gemini-1.5-flash':0.001,'claude-sonnet':0.003};
    document.getElementById('model-cost').textContent=(costs[settings.model]||0.002).toFixed(3);
}

function updateStats(){
    document.getElementById('total-messages').textContent=settings.stats.messages;
    document.getElementById('total-events').textContent=settings.stats.events;
    document.getElementById('total-tasks').textContent=settings.stats.tasks;
}

async function initServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.log('❌ Service Workers not supported');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register(`${baseUrl}sw.js`, { 
            scope: baseUrl 
        });
        console.log('✅ Service Worker registered:', registration.scope);

        await navigator.serviceWorker.ready;
        console.log('✅ Service Worker ready and active');

        registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
        });

        if (checkPWAStatus()) {
            console.log('✅ PWA detected, checking notifications after delay...');
            setTimeout(async () => {
                try {
                    await checkAndPromptNotifications();
                } catch (err) {
                    console.error('Notification prompt error:', err);
                }
            }, 3000);
        }

    } catch (error) {
        console.error('❌ Service Worker registration error:', error);
    }
}




function initDeleteAccount() {
    const deleteBtn = document.getElementById('delete-account');
    const modal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    if (!deleteBtn || !modal) return;

    deleteBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    confirmBtn.addEventListener('click', async () => {
        const email = localStorage.getItem("user_email");
        if (email) {
            try {
                await fetch("https://api.lerriai.com/api/delete-account", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
            } catch (err) {
                console.error("Account deletion error:", err);
            }
        }
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../login.html';
    });
}

function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    const modal = document.getElementById('logout-modal');
    const cancelBtn = document.getElementById('cancel-logout');
    const confirmBtn = document.getElementById('confirm-logout');
    
    if (!logoutBtn || !modal) return;

    logoutBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    confirmBtn.addEventListener('click', () => {
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('lexor-current-tab');
        sessionStorage.clear();
        window.location.href = '../login.html';
    });
}

function initClearChat() {
    const clearBtn = document.getElementById('clear-chat-btn');
    const modal = document.getElementById('clear-chat-modal');
    const cancelBtn = document.getElementById('cancel-clear-chat');
    const confirmBtn = document.getElementById('confirm-clear-chat');
    
    if (!clearBtn || !modal) return;

    clearBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

    confirmBtn.addEventListener('click', async () => {
        const email = getUserEmail();
        if (!email) return;

        messagesArray = [];
        
        try {
            await fetch("https://api.lerriai.com/api/save-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user: email, 
                    events, 
                    tasks, 
                    settings,  
                    messages: []
                })
            });
        } catch (err) {
            console.error("Clear chat error:", err);
        }

        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h3>👋 Hello ${localStorage.getItem('user_name') || 'User'}!</h3>
                <p>I'm Lerri, your digital strategic AI assistant. How can I help you today?</p>
            </div>
        `;

        modal.classList.add('hidden');
        showNotification('Chat cleared successfully', 'success');
    });
}

function addReauthButton() {
    const messagesContainer = document.getElementById('messages');
    
    const existingReauth = messagesContainer.querySelector('.reauth-container');
    if (existingReauth) return;
    
    const reauthDiv = document.createElement('div');
    reauthDiv.className = 'reauth-container';
    reauthDiv.innerHTML = `
        <div class="reauth-message">
            <p>🔐 Your authorization has expired. Please reconnect your Google account to continue.</p>
            <button id="reauth-btn" class="btn-primary">Reconnect Google Account</button>
        </div>
    `;
    
    messagesContainer.appendChild(reauthDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    document.getElementById('reauth-btn').addEventListener('click', handleReauth);
}

async function handleReauth() {
    const email = getUserEmail();
    if (!email) return;
    
    try {
        google.accounts.oauth2.initCodeClient({
            client_id: CLIENT_ID,
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/gmail.send'
            ].join(" "),

            ux_mode: 'popup',
            callback: async (response) => {
                if (response.code) {
                    const result = await fetch('https://api.lerriai.com/api/refresh-oauth', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            oauth_code: response.code
                        })
                    });
                    
                    const data = await result.json();
                    
                    if (data.success) {
                        const reauthContainer = document.querySelector('.reauth-container');
                        if (reauthContainer) reauthContainer.remove();
                        
                        addMessage('✅ Authorization renewed successfully! You can continue using the assistant.', 'bot');
                        showNotification('✅ Authorization renewed successfully!', 'success');
                    } else {
                        showNotification('❌ Authorization renewal failed. Try again.', 'error');
                    }
                }
            }
        }).requestCode();
        
    } catch (error) {
        console.error('Reauth error:', error);
        showNotification('❌ Error during authorization renewal', 'error');
    }
}

function checkPWAInstallation() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        return true;
    }
    return localStorage.getItem('pwa-installed') === 'true';
}

function showPWAInstallBanner() {
    console.log('🎨 Creating PWA banner...');
    
    const existingBanner = document.getElementById('pwa-install-banner');
    if (existingBanner) {
        console.log('Banner already exists');
        return;
    }
    
    if (!deferredPrompt) {
        console.log('⚠️ No deferredPrompt available, cannot show banner');
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
        <div class="pwa-banner-content">
            <div class="pwa-banner-icon">📱</div>
            <div class="pwa-banner-text">
                <h3>Install LerriAI App</h3>
                <p>Get instant access and work offline!</p>
            </div>
            <div class="pwa-banner-actions">
                <button id="pwa-install-btn" class="btn-primary">Install Now</button>
                <button id="pwa-dismiss-btn" class="btn-secondary">×</button>
            </div>
        </div>
    `;

    banner.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        padding: 20px;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { 
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
            to { 
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from { 
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to { 
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
        }
        .pwa-banner-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .pwa-banner-icon {
            font-size: 3rem;
            flex-shrink: 0;
        }
        .pwa-banner-text {
            flex: 1;
        }
        .pwa-banner-text h3 {
            margin: 0 0 5px 0;
            font-size: 1.2rem;
            color: #667eea;
        }
        .pwa-banner-text p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        .pwa-banner-actions {
            display: flex;
            gap: 10px;
            flex-shrink: 0;
            align-items: center;
        }
        #pwa-dismiss-btn {
            width: 36px;
            height: 36px;
            padding: 0;
            font-size: 1.5rem;
            line-height: 1;
            min-width: unset;
        }
        @media (max-width: 600px) {
            .pwa-banner-content {
                flex-wrap: wrap;
            }
            .pwa-banner-actions {
                width: 100%;
                justify-content: space-between;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(banner);
    console.log('✅ PWA banner displayed');

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        console.log('🔘 Install button clicked');
        if (!deferredPrompt) {
            console.log('⚠️ No deferredPrompt available');
            return;
        }

        const installBtn = document.getElementById('pwa-install-btn');
        installBtn.disabled = true;
        installBtn.textContent = '⏳ Installing...';

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('📊 Install outcome:', outcome);

            if (outcome === 'accepted') {
                localStorage.setItem('pwa-installed', 'true');
                localStorage.removeItem('pwa-prompt-dismiss-time');
                showNotification('✅ App installed successfully!', 'success');
            } else {
                localStorage.setItem('pwa-prompt-dismiss-time', Date.now().toString());
            }
        } catch (error) {
            console.error('❌ Install error:', error);
        } finally {
            hidePWAInstallBanner();
            deferredPrompt = null;
        }
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
        console.log('❌ Banner dismissed by user');
        localStorage.setItem('pwa-prompt-dismiss-time', Date.now().toString());
        hidePWAInstallBanner();
    });
}



function hidePWAInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.style.animation = 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => banner.remove(), 400);
    }
}



function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function hideNotificationPrompt() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
}

function diagnoseNotificationPermission() {
    console.log('📡 Diagnosing notification permission...');
    try {
        console.log(' - Location:', location.href);
        console.log(' - Protocol:', location.protocol);
        console.log(' - isSecureContext:', window.isSecureContext);
        console.log(' - In iframe:', window.top !== window.self);

        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'notifications' }).then(p => {
                console.log(' - permissions.query notifications state:', p.state);
                console.log(' - permissions object:', p);
            }).catch(err => console.warn(' - permissions.query error:', err));
        } else {
            console.log(' - navigator.permissions API not available');
        }
    } catch (err) {
        console.error('Diagnosis error:', err);
    }
}