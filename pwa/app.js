const BACKEND_URL = "http://localhost:3000/api/chat";
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

function makeLinksClickable(text) {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
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
    const html = DOMPurify.sanitize(md.render(normalizeMarkdown(text)));
    textDiv.innerHTML = makeLinksClickable(html);
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

async function loadDataFromServer() {
    if (isLoading) return;
    isLoading = true;
    
    const user = getUserEmail();
    if (!user) return;

    try {
        const res = await fetch(`http://localhost:3000/api/load-data?user=${encodeURIComponent(user)}`);
        if (!res.ok) throw new Error('Load data error');
        
        const data = await res.json();

        if (data.events !== undefined) events = data.events;
        if (data.tasks !== undefined) tasks = data.tasks;
        if (data.settings !== undefined) {
            settings = {
                maxSpend: data.settings.maxSpend !== undefined ? data.settings.maxSpend : 0.90,
                currentSpend: data.settings.currentSpend !== undefined ? data.settings.currentSpend : 0,
                model: data.settings.model || 'gpt-4o-mini',
                language: data.settings.language || 'it',
                stats: {
                    messages: data.settings.stats?.messages || 0,
                    events: data.settings.stats?.events || 0,
                    tasks: data.settings.stats?.tasks || 0
                },
                schedule: data.settings.schedule || {
                    work: null,
                    subjects: [],
                    sports: [],
                    hobbies: []
                }
            };
        }
        if (data.messages !== undefined) messagesArray = data.messages;

        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        messagesArray.forEach(msg => {
            addMessage(msg.text, msg.sender, false);
        });

        const activeTab = localStorage.getItem('lexor-current-tab') || 'chat';
        if (activeTab === 'calendar') generateCalendar();
        if (activeTab === 'tasks') renderTasks();
        if (activeTab === 'settings') {
            updateStats();
            updateLanguageSelect();
            updateBudgetDisplay();
        }

        console.log("✅ Dati caricati dal server");

    } catch (err) {
        console.error("Load error:", err);
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
        //window.location.href = '../login.html';
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

function normalizeMarkdown(text) {
    if (!text) return '';
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    text = text.replace(/```/g, '\n```\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text;
}

function initChat() {
    const messagesContainer = document.getElementById('messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const email = getUserEmail();
    const userName = localStorage.getItem('user_name') || 'User';
    
    if (!email) {
        //window.location.href = '../login.html';
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
                    chatInput.placeholder = 'Scrivi un messaggio...';
                    chatInput.disabled = false;
                    
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const duration = Math.round((Date.now() - startTime) / 1000);
                    
                    const transcribingMsg = addMessage(`🎤 Audio ${duration}s - Transcribing...`, 'user', false);
                    
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
                            const replyText = data.value || data;
                            
                            transcribingMsg.remove();
                            addMessage(replyText, 'user', true, audioBlob, true);

                            if (data.events) events = data.events;
                            if (data.tasks) tasks = data.tasks;
                            if (data.stats) settings.stats = data.stats;
                            
                            await syncToServer();
                            updateStats();
                            
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

            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            const replyText = data.value || data;

            loadingMsg.remove();
            addMessage(replyText, 'bot', true, null, true); 

            if (data.events) events = data.events;
            if (data.tasks) tasks = data.tasks;
            if (data.stats) settings.stats = data.stats;
            
            await syncToServer();
            updateStats();

        } catch (error) {
            loadingMsg.remove();
            addMessage('❌ Server error. Try again.', 'bot');
            console.error("Chat error:", error);
        }
    });
}

function initCalendar() {
    generateCalendar();
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
    for (let i=0;i<6;i++){
        const row = document.createElement('tr');
        for (let j=0;j<7;j++){
            const cell = document.createElement('td');
            if(i===0&&j<startDay){ 
                cell.textContent = daysInPrevMonth - startDay + j + 1; 
                cell.classList.add('other-month'); 
            }
            else if(date>daysInMonth){ 
                cell.textContent = nextMonthDate; 
                cell.classList.add('other-month'); 
                nextMonthDate++; 
            }
            else{
                cell.textContent = date;
                const today = new Date();
                if(date===today.getDate() && currentMonth===today.getMonth() && currentYear===today.getFullYear()) 
                    cell.classList.add('today');
                const dateKey = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
                if(events[dateKey] && events[dateKey].length>0) 
                    cell.classList.add('has-events');
                const currentDate = date;
                cell.addEventListener('click',()=>openDayView(currentDate));
                date++;
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
        if(date>daysInMonth) break;
    }
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
    const dayEvents = events[selectedDate] || [];
    if (dayEvents.length === 0) {
        eventList.innerHTML = '<li class="empty-state">No events for this day</li>';
        return;
    }
    eventList.innerHTML = '';
    dayEvents.forEach((event, index) => {
        const li = document.createElement('li');
        const description = event.description ? `<br><small style="color: rgba(255,255,255,0.8);">${event.description}</small>` : '';
        li.innerHTML = `<div><strong>${event.title}</strong><br><small>${event.start} - ${event.end}</small>${description}</div>
                        <button onclick="editEvent(${index})" class="btn-secondary">Edit</button>`;
        eventList.appendChild(li);
    });
}

async function saveEvent(){
    const title = document.getElementById('day-event-title').value.trim();
    const start = document.getElementById('day-event-start').value;
    const end = document.getElementById('day-event-end').value;
    const eventId = document.getElementById('day-event-id').value;

    if(!title) return;
    if(!events[selectedDate]) events[selectedDate] = [];

    const event = { title, start: start || "00:00", end: end || "23:59" };

    if(eventId) events[selectedDate][parseInt(eventId)] = event;
    else { events[selectedDate].push(event); settings.stats.events++; }

    await syncToServer();
    updateStats(); 
    loadDayEvents(); 
    clearEventForm(); 
    generateCalendar();
}

function editEvent(index){
    const event=events[selectedDate][index];
    document.getElementById('day-event-id').value=index;
    document.getElementById('day-event-title').value=event.title;
    document.getElementById('day-event-start').value=event.start;
    document.getElementById('day-event-end').value=event.end;
}

async function deleteEvent(){
    const eventId=document.getElementById('day-event-id').value;
    if(!eventId) return;
    events[selectedDate].splice(parseInt(eventId),1);
    if(events[selectedDate].length===0) delete events[selectedDate];
    
    await syncToServer();
    loadDayEvents(); 
    clearEventForm(); 
    generateCalendar();
}

function clearEventForm(){ 
    document.getElementById('day-event-form').reset(); 
    document.getElementById('day-event-id').value=''; 
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

function initSettings(){
    const settingsForm=document.getElementById('settings-form');
    const maxSpendInput=document.getElementById('max-spend');
    const languageSelect=document.getElementById('language-select');
    
    maxSpendInput.value=settings.maxSpend;
    updateBudgetDisplay(); 
    updateModelCost();
    updateLanguageSelect();
    
    // Nota: initScheduleManager() è chiamato da index.html
    
    settingsForm.addEventListener('submit', async e=>{
        e.preventDefault(); 
        settings.maxSpend=parseFloat(maxSpendInput.value)||0.90;
        const newLanguage = languageSelect.value;
        settings.language = newLanguage;
        
        try {
            await fetch("http://localhost:3000/api/set-language", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: getUserEmail(), language: newLanguage })
            });
        } catch (err) {
            console.error("Language update failed:", err);
        }
        
        await syncToServer();
        updateBudgetDisplay(); 
        alert('Settings saved!');
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
    document.getElementById('current-spend').textContent=settings.currentSpend.toFixed(2);
    document.getElementById('max-spend-display').textContent=settings.maxSpend.toFixed(2);
    const percentage=(settings.currentSpend/settings.maxSpend)*100;
    document.getElementById('spend-progress').style.width=`${Math.min(percentage,100)}%`;
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
        //window.location.href = '../login.html';
    });
}