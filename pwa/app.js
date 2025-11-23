const BACKEND_URL = "http://localhost:3000/api/chat";
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

const emojiCategories = {
  activities: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','🏋️','🏃','🏊','🚴','🚵','🤸','🤺','🧗','🏂','⛷️','🎽','⛳','🏹','🎣','🧘','💪','🛹','🛼','🤾','⛹️','🏇','🥏','🛶','🚣','🚤','🏄','🏕️','🎯'],
  education: ['📚','📖','📝','✏️','✒️','🖊️','🖋️','📒','📓','📔','📕','📗','📘','📙','📄','📃','📊','📈','📉','📋','📆','🗓️','📎','🖇️','📏','📐','✂️','📌','📍','🏫','🎓','🧮','🧠','🔬','🔭','🧪','🧫','🧬','💡','📚'],
  spiritual: ['✝️','⛪','🙏','🕊️','📖','🕯️','⛓️','🫶','💒','🌟','💖','🪔','🧎‍♂️','🧎‍♀️','🤲','🤍','💒','📿','🕊️','✨'],
  work: ['💼','🏢','🏭','⚙️','🔧','🔨','🪚','🪛','🪜','🔩','💻','🖥️','⌨️','🖱️','🖨️','📱','📞','☎️','🗂️','📂','🗃️','📦','📠','📺','📡','⏰','🕰️','💾','🪙','💰','🧾','🪪','📈','📊','📑','💬','📨','📧','📤','📥'],
  hobbies: ['🎨','🎭','🎬','🎤','🎧','🎹','🎷','🎺','🎸','🎻','🥁','🎮','🎯','🎳','🎲','♟️','🧩','🎯','🖌️','🧵','🧶','✍️','🪡','🪢','📷','🎥','📹','📸','📼','📻','🪕','🎼','🎶','🎵','🧩','🃏','🎴','🧩','🎰','🧁'],
  tech: ['💻','🖥️','🖨️','🕹️','🧠','🤖','📡','🔋','🪫','💽','💾','🪄','🛰️','🔭','🔬','🧬','📱','⌚','🪙','⚙️','🪩','💡','🎛️','🧩','🧮','🪫','🔌','📶','💾','🪄'],
  travel: ['✈️','🚗','🚙','🚌','🚎','🚐','🚓','🚑','🚒','🏍️','🚲','🚂','🚆','🚊','🚇','🚉','🚁','🛩️','🛫','🛬','🛳️','⛴️','⚓','🗺️','🧭','🏕️','🏖️','🏝️','🏜️','🏞️','🌄','🌅','🏔️','🗻','🌋','🏰','🕍','🏯','🗽','🗼'],
  food: ['🍕','🍔','🍟','🌭','🍿','🥓','🥚','🍳','🧇','🥞','🍞','🥐','🥨','🥯','🥖','🥗','🥙','🌮','🌯','🥪','🍖','🍗','🥩','🥘','🍲','🍱','🍙','🍚','🍛','🍜','🍝','🍠','🍣','🍤','🍥','🧁','🍰','🎂','🍩','🍪'],
  nature: ['🌱','🌿','🍀','🌵','🌴','🌳','🌲','🌺','🌸','🌼','🌷','🌹','💐','🍁','🍂','🍄','🪵','🪨','🌾','🌻','🐚','⛰️','🏔️','🌋','🏕️','🏖️','🏜️','🏝️','🌅','🌄','🐦','🐕','🐈','🐇','🐢','🦋','🐞','🪶','🕊️','🐠'],
  time: ['⏰','⏱️','⏲️','⏳','⌛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕧','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕰️'],
  emotions: ['😀','😃','😄','😁','😆','🥹','😂','🤣','😊','😇','🙂','😉','😍','🥰','😘','😋','😜','😎','🤩','🤔','😴','😌','😢','😭','😤','😡','😱','🤯','😅','😬','🤗','😇','🙏','🤍','💖','💗','💓','💞','💯','🔥'],
  symbols: ['✅','❌','⭐','💯','🔥','💡','🎯','📌','🔔','🎉','🎊','🎈','💫','✨','⚡','💥','💬','💭','🗯️','💤','💨','🌀','🎇','🎆','🏆','🥇','🥈','🥉','🎖️','🏅']
};


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
    VOICE_PER_SECOND: 0.0075 / 60,  
    VOICE_BASE: 0.00099  
};

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let events = {};
let tasks = [];
let settings = {
    maxSpend: 0.90,
    currentSpend: 0,
    model: 'gpt-4o-mini',
    language: 'it',
    stats: { messages: 0, events: 0, tasks: 0 },
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

    return msgEl;
}

async function syncToServer() {
    if (isSyncing) return;
    const user = getUserEmail();
    if (!user) return;

    isSyncing = true;

    const payload = { 
        user, 
        events, 
        tasks, 
        settings,  
        messages: messagesArray 
    };

    try {
        const response = await fetch("http://localhost:3000/api/save-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log("✅ Sync completato");
        } else {
            console.error("❌ Sync fallito:", await response.text());
        }
    } catch (err) {
        console.error("Sync error:", err);
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
        const res = await fetch(`http://localhost:3000/api/load-data?user=${encodeURIComponent(user)}`);
        if (!res.ok) throw new Error('Load data error');
        
        const data = await res.json();

        console.log('📥 Data loaded from server:', data);

        // Initialize events
        if (data.events !== undefined) {
            events = data.events;
        }

        // Initialize tasks
        if (data.tasks !== undefined) {
            tasks = data.tasks;
        }

        // Initialize settings with proper defaults
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
                }
            };
        }

        console.log('🕒 Schedule loaded:', {
            slots: settings.schedule.slots.length,
            categories: settings.schedule.categories.length,
            sports: settings.schedule.sports.length,
            hobbies: settings.schedule.hobbies.length
        });

        // Initialize messages
        if (data.messages !== undefined) {
            messagesArray = data.messages;
        }

        // Render messages
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            messagesArray.forEach(msg => {
                addMessage(msg.text, msg.sender, false);
            });
        }

        // Render based on active tab
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

document.addEventListener('DOMContentLoaded', async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
        window.location.href = '../login.html';
        return;
    }
    
    await loadDataFromServer();
    
    initTabs();
    initChat();
    initCalendar();
    initTasks();
    initSettings();
    initServiceWorker();
    initDeleteAccount();
    initLogout();
    initClearChat();
});

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

function initChat() {
    const messagesContainer = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const email = getUserEmail();
    const userName = localStorage.getItem('user_name') || 'User';
    
    if (!email) {
        window.location.href = '../login.html';
        return;
    }

    if (settings.currentSpend >= settings.maxSpend) {
        chatInput.disabled = true;
        chatInput.placeholder = '⚠️ Budget esaurito';
        micBtn.disabled = true;
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
    let mediaRecorder;
    let audioChunks = [];
    let startTime;

    micBtn.addEventListener("click", async () => {
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
                    chatInput.placeholder = 'Write a message...';
                    chatInput.disabled = false;
                    
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const durationMs = Date.now() - startTime;
                    const durationSeconds = Math.round(durationMs / 1000);

                    const voiceCost = calculateMessageCost(true, durationSeconds);

                    if (settings.currentSpend + voiceCost > settings.maxSpend) {
                        addMessage('⚠️ Budget limit reached! Increase your maximum budget to continue.', 'bot');
                        stream.getTracks().forEach(track => track.stop());
                        return;
                    }

                    const transcribingMsg = addMessage(`🎤 Audio ${durationSeconds}s - Transcribing...`, 'user', false);
                                        
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const base64Audio = reader.result.split(',')[1];
                        
                        try {
                            const response = await fetch(BACKEND_URL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    audio_data: base64Audio,
                                    email: getUserEmail(),
                                    user_id: getUserIdentifier()
                                })
                            });
                            
                            if (!response.ok) throw new Error(await response.text());
                            const data = await response.json();
                            
                            const transcribedText = data.transcription || '';
                            const aiReply = data.value || data.reply || '';
                            
                            transcribingMsg.remove();
                            
                            if (transcribedText) {
                                addMessage(transcribedText, 'user', true, audioBlob, true);
                            }
                            
                            if (aiReply) {
                                addMessage(aiReply, 'bot', true, null, true);
                            }

                            settings.stats.messages++;
                            settings.stats.voiceMessages = (settings.stats.voiceMessages || 0) + 1;
                            settings.stats.voiceSeconds = (settings.stats.voiceSeconds || 0) + durationSeconds;
                            settings.currentSpend += voiceCost;
                            settings.currentSpend = Math.round(settings.currentSpend * 100000) / 100000;

                            console.log(`💰 Voice cost: €${voiceCost.toFixed(5)} (${durationSeconds}s)`);

                            if (data.events) events = data.events;
                            if (data.tasks) tasks = data.tasks;
                            if (data.stats) {
                                settings.stats.events = data.stats.events || settings.stats.events;
                                settings.stats.tasks = data.stats.tasks || settings.stats.tasks;
                            }

                            await syncToServer();
                            updateStats();
                            updateBudgetDisplay();
                            
                        } catch (error) {
                            transcribingMsg.remove();
                            addMessage('❌ Transcription error. Try again.', 'bot');
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
        
        const msg = chatInput.value.trim();
        if (!msg) return;

        const textCost = calculateMessageCost(false);

        if (settings.currentSpend + textCost > settings.maxSpend) {
            addMessage('⚠️ Budget limit reached! Increase your maximum budget to continue.', 'bot');
            return;
        }

        addMessage(msg, 'user', true, null, true);
        chatInput.value = '';

        const loadingMsg = addMessage('⏳ Processing...', 'bot', false);

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    email: getUserEmail(),
                    user_id: getUserIdentifier()
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
            settings.currentSpend += textCost;
            settings.currentSpend = Math.round(settings.currentSpend * 100000) / 100000;

            console.log(`💰 Costo testuale: €${textCost.toFixed(5)}`);

            if (data.events) events = data.events;
            if (data.tasks) tasks = data.tasks;
            if (data.stats) {
                settings.stats.events = data.stats.events || settings.stats.events;
                settings.stats.tasks = data.stats.tasks || settings.stats.tasks;
            }

            await syncToServer();
            updateStats();
            updateBudgetDisplay();

        } catch (error) {
            loadingMsg.remove();
            
            if (error.status === 401 || (error.message && error.message.includes('401'))) {
                addReauthButton();
            } else {
                addMessage('❌ Server error. Try again.', 'bot');
                showNotification('❌ Server error. Please try again later.', 'error');
            }
            
            console.error("Chat error:", error);
        }
    });
}

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
            const response = await fetch('http://localhost:3000/api/import-google-calendar', {
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
                    start: sport.startTime || '18:00',
                    end: sport.endTime || '19:30',
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
    
    const selectedEmoji = emojiSelect.value || '🕒';
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

    if (!events[selectedDate]) events[selectedDate] = [];

    const event = { 
        title: fullTitle,
        description, 
        start,
        end
    };

    if (eventId !== '') {
        events[selectedDate][parseInt(eventId)] = event;
    } else { 
        events[selectedDate].push(event); 
        settings.stats.events++; 
    }

    await syncToServer();
    updateStats(); 
    loadDayEvents(); 
    clearEventForm(); 
    generateCalendar();
    
    showNotification('✅ Event saved successfully', 'success');
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
    await syncToServer();
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
    await syncToServer(); 
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
        await syncToServer(); 
        renderTasks(); 
    }
}

async function deleteTask(id){ 
    tasks=tasks.filter(t=>t.id!==id); 
    await syncToServer(); 
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
            await fetch("http://localhost:3000/api/set-language", {
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

async function initServiceWorker(){
    if('serviceWorker' in navigator){
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
            console.log('🗑️ Service Worker vecchio rimosso');
        }
        
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (let cacheName of cacheNames) {
                await caches.delete(cacheName);
                console.log('🗑️ Cache rimossa:', cacheName);
            }
        }
        
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('✅ Service Worker registrato:', registration.scope);
            } catch (error) {
                console.error('❌ Errore registrazione SW:', error);
            }
        });
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
                await fetch("http://localhost:3000/api/delete-account", {
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
            await fetch("http://localhost:3000/api/save-data", {
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
                'https://www.googleapis.com/auth/documents',
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/gmail.send'
            ].join(" "),

            ux_mode: 'popup',
            callback: async (response) => {
                if (response.code) {
                    const result = await fetch('http://localhost:3000/api/refresh-oauth', {
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