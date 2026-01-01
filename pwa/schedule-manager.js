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

const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayNamesDisplay = {
    'monday': 'Monday', 'tuesday': 'Tuesday', 'wednesday': 'Wednesday',
    'thursday': 'Thursday', 'friday': 'Friday', 'saturday': 'Saturday', 'sunday': 'Sunday'
};

let scheduleSlots = {};
let scheduleCategories = {};
let scheduleSports = [];
let scheduleHobbies = [];
let slotIdCounter = 0;
let categoryIdCounter = 0;
let selectedSportEmoji = '⚽';
let selectedHobbyEmoji = '📚';
let selectedSportDays = new Set();
let selectedHobbyDays = new Set();

const SLOT_HEIGHT_PX = 60;
const MINUTES_PER_SLOT = 60;
const SNAP_MINUTES = 10;
const VISIBLE_START_HOUR = 5;
const VISIBLE_END_HOUR = 22;
const VISIBLE_HOURS = VISIBLE_END_HOUR - VISIBLE_START_HOUR;

let draggedSlot = null;
let dragStartY = 0;
let isResizing = false;
let selectedSlots = new Set();
let currentEditingSlot = null;
let selectedSlotEmoji = '🕒';

let isDuplicating = false;
let ghostElement = null;
let duplicateStartX = 0;
let originalDayIndex = -1;

function timeToPixels(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const minutesFromStart = (hours * 60 + minutes) - (VISIBLE_START_HOUR * 60);
    return (minutesFromStart / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;
}

function pixelsToTime(px) {
    const totalMinutesFromStart = Math.round((px / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT);
    const snappedMinutesFromStart = Math.round(totalMinutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;
    let absMinutes = snappedMinutesFromStart + (VISIBLE_START_HOUR * 60);
    const minAbs = VISIBLE_START_HOUR * 60;
    const maxAbs = VISIBLE_END_HOUR * 60;
    if (absMinutes < minAbs) absMinutes = minAbs;
    if (absMinutes > maxAbs) absMinutes = maxAbs;
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function createSlot(day, start, end, name = '', emoji = '', description = '') {
    return {
        id: slotIdCounter++,
        day,
        start,
        end,
        name,
        emoji,
        description
    };
}

function openScheduleManager() {
    loadExistingSchedule();
    
    const overlay = document.createElement('div');
    overlay.id = 'scheduleManagerOverlay';
    overlay.className = 'schedule-manager-overlay';
    overlay.innerHTML = `
        <div class="schedule-manager-container">
            <div class="schedule-manager-header">
                <h1>📅 Manage Your Schedule</h1>
                <button class="close-schedule-manager" id="closeScheduleManager">×</button>
            </div>

            <div class="schedule-tabs">
                <button class="schedule-tab-btn active" data-tab="slots">🕒 Fixed Schedule</button>
                <button class="schedule-tab-btn" data-tab="sports">⚽ Sports</button>
                <button class="schedule-tab-btn" data-tab="hobbies">🎨 Hobbies</button>
            </div>

            <div class="schedule-tab-content active" id="slotsTab">
                <div class="calendar-controls">
                    <button class="btn-secondary" id="schedResetCalendar">🔄 Reset Calendar</button>
                </div>

                <div class="selection-toolbar" id="schedSelectionToolbar">
                    <span class="selection-info" id="schedSelectionInfo">0 slots selected</span>
                    <div class="selection-actions">
                        <button class="toolbar-btn" id="schedCreateCategory">🔗 Create Category</button>
                        <button class="toolbar-btn" id="schedClearSelection">✖ Clear Selection</button>
                    </div>
                </div>

                <div class="weekly-calendar-wrapper">
                    <div class="time-labels" id="schedTimeLabels"></div>
                    <div class="weekly-calendar" id="schedWeeklyCalendar"></div>
                </div>
            </div>

            <div class="schedule-tab-content" id="sportsTab">
                <div class="custom-activity-creator">
                    <h3>➕ Add Sport</h3>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="schedSportName">Sport Name *</label>
                            <input type="text" id="schedSportName" placeholder="e.g., Soccer, Gym, Yoga">
                        </div>
                        <div class="input-group">
                            <label for="schedSportEmojiBtn">Emoji</label>
                            <div class="emoji-picker-wrapper">
                                <button type="button" class="emoji-btn" id="schedSportEmojiBtn">⚽</button>
                                <div class="emoji-dropdown" id="schedSportEmojiDropdown"></div>
                            </div>
                        </div>
                    </div>
                    <div class="input-group full-width">
                        <label>Days of the week *</label>
                        <div class="days-selector" id="schedSportDaysSelector">
                            <button type="button" class="day-btn" data-day="monday">Mon</button>
                            <button type="button" class="day-btn" data-day="tuesday">Tue</button>
                            <button type="button" class="day-btn" data-day="wednesday">Wed</button>
                            <button type="button" class="day-btn" data-day="thursday">Thu</button>
                            <button type="button" class="day-btn" data-day="friday">Fri</button>
                            <button type="button" class="day-btn" data-day="saturday">Sat</button>
                            <button type="button" class="day-btn" data-day="sunday">Sun</button>
                        </div>
                    </div>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="schedSportStartTime">Start Time (optional)</label>
                            <input type="time" id="schedSportStartTime">
                        </div>
                        <div class="input-group">
                            <label for="schedSportEndTime">End Time (optional)</label>
                            <input type="time" id="schedSportEndTime">
                        </div>
                        <div class="input-group">
                            <button type="button" class="btn-primary" id="schedAddSport">Add Sport</button>
                        </div>
                    </div>
                </div>

                <div class="saved-items">
                    <h3>✅ Saved Sports</h3>
                    <div id="schedSportsList" class="items-grid">
                        <p class="empty-state">No sports added yet</p>
                    </div>
                </div>
            </div>

            <div class="schedule-tab-content" id="hobbiesTab">
                <div class="custom-activity-creator">
                    <h3>➕ Add Hobby</h3>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="schedHobbyName">Hobby Name *</label>
                            <input type="text" id="schedHobbyName" placeholder="e.g., Reading, Prayer, Drawing">
                        </div>
                        <div class="input-group">
                            <label for="schedHobbyEmojiBtn">Emoji</label>
                            <div class="emoji-picker-wrapper">
                                <button type="button" class="emoji-btn" id="schedHobbyEmojiBtn">📚</button>
                                <div class="emoji-dropdown" id="schedHobbyEmojiDropdown"></div>
                            </div>
                        </div>
                    </div>
                    <div class="input-group full-width">
                        <label>Days of the week *</label>
                        <div class="days-selector" id="schedHobbyDaysSelector">
                            <button type="button" class="day-btn" data-day="monday">Mon</button>
                            <button type="button" class="day-btn" data-day="tuesday">Tue</button>
                            <button type="button" class="day-btn" data-day="wednesday">Wed</button>
                            <button type="button" class="day-btn" data-day="thursday">Thu</button>
                            <button type="button" class="day-btn" data-day="friday">Fri</button>
                            <button type="button" class="day-btn" data-day="saturday">Sat</button>
                            <button type="button" class="day-btn" data-day="sunday">Sun</button>
                        </div>
                    </div>
                    <div class="input-row">
                        <div class="input-group">
                            <label for="schedHobbyStartTime">Start Time (optional)</label>
                            <input type="time" id="schedHobbyStartTime">
                        </div>
                        <div class="input-group">
                            <label for="schedHobbyEndTime">End Time (optional)</label>
                            <input type="time" id="schedHobbyEndTime">
                        </div>
                        <div class="input-group">
                            <button type="button" class="btn-primary" id="schedAddHobby">Add Hobby</button>
                        </div>
                    </div>
                </div>

                <div class="saved-items">
                    <h3>✅ Saved Hobbies</h3>
                    <div id="schedHobbiesList" class="items-grid">
                        <p class="empty-state">No hobbies added yet</p>
                    </div>
                </div>
            </div>

            <div class="schedule-manager-footer">
                <button class="btn-secondary btn-large" id="schedCancelBtn">Cancel</button>
                <button class="btn-primary btn-large" id="schedSaveBtn">💾 Save Schedule</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    
    initializeScheduleCalendar();
    initializeScheduleEmojiPickers();
    setupScheduleDaySelectors();
    
    document.getElementById('closeScheduleManager').addEventListener('click', closeScheduleManager);
    document.getElementById('schedCancelBtn').addEventListener('click', closeScheduleManager);
    document.getElementById('schedSaveBtn').addEventListener('click', saveScheduleChanges);
    document.getElementById('schedResetCalendar').addEventListener('click', resetScheduleCalendar);
    document.getElementById('schedCreateCategory').addEventListener('click', openScheduleCategoryModal);
    document.getElementById('schedClearSelection').addEventListener('click', clearScheduleSelection);
    document.getElementById('schedAddSport').addEventListener('click', addScheduleSport);
    document.getElementById('schedAddHobby').addEventListener('click', addScheduleHobby);

    document.querySelectorAll('.schedule-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            document.querySelectorAll('.schedule-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.schedule-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(targetTab + 'Tab').classList.add('active');
        });
    });
}

function closeScheduleManager() {
    const overlay = document.getElementById('scheduleManagerOverlay');
    if (overlay) {
        document.body.classList.remove('modal-open');
        overlay.remove();
    }
}
function loadExistingSchedule() {
    scheduleSlots = {};
    scheduleCategories = {};
    scheduleSports = [];
    scheduleHobbies = [];
    selectedSlots.clear();
    slotIdCounter = 0;
    categoryIdCounter = 0;

    if (!settings.schedule) return;

    if (Array.isArray(settings.schedule.slots)) {
        settings.schedule.slots.forEach(slot => {
            const day = slot.day;
            if (!scheduleSlots[day]) scheduleSlots[day] = [];
            scheduleSlots[day].push({
                id: slotIdCounter++,
                day: slot.day,
                start: slot.start,
                end: slot.end,
                name: slot.name || '',
                emoji: slot.emoji || '',
                description: slot.description || ''
            });
        });
    }

    if (Array.isArray(settings.schedule.categories)) {
        settings.schedule.categories.forEach(cat => {
            const day = cat.day;
            if (!scheduleCategories[day]) scheduleCategories[day] = [];
            scheduleCategories[day].push({
                id: categoryIdCounter++,
                name: cat.name,
                slotIds: cat.slotIds || []
            });
        });
    }

    if (Array.isArray(settings.schedule.sports)) {
        scheduleSports = settings.schedule.sports.map(s => ({
            id: Date.now() + Math.random(),
            name: s.name,
            emoji: s.emoji || '⚽',
            days: s.days || [],
            startTime: s.startTime || null,
            endTime: s.endTime || null
        }));
    }

    if (Array.isArray(settings.schedule.hobbies)) {
        scheduleHobbies = settings.schedule.hobbies.map(h => ({
            id: Date.now() + Math.random(),
            name: h.name,
            emoji: h.emoji || '🎨',
            days: h.days || [],
            startTime: h.startTime || null,
            endTime: h.endTime || null
        }));
    }
}

function initializeScheduleCalendar() {
    const timeLabels = document.getElementById('schedTimeLabels');
    timeLabels.innerHTML = '';
    const totalHeight = VISIBLE_HOURS * SLOT_HEIGHT_PX;
    timeLabels.style.height = `${totalHeight}px`;

    for (let h = VISIBLE_START_HOUR; h < VISIBLE_END_HOUR; h++) {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = `${h.toString().padStart(2, '0')}:00`;
        label.style.height = `${SLOT_HEIGHT_PX}px`;
        timeLabels.appendChild(label);
    }

    const calendarContainer = document.getElementById('schedWeeklyCalendar');
    calendarContainer.innerHTML = '';
    calendarContainer.style.height = `${totalHeight}px`;

    dayNames.forEach(day => {
        if (!scheduleSlots[day]) scheduleSlots[day] = [];
        if (!scheduleCategories[day]) scheduleCategories[day] = [];

        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        dayColumn.innerHTML = `
            <div class="day-header">
                ${dayNamesDisplay[day]}
                <button class="add-slot-btn" data-day="${day}">➕</button>
            </div>
            <div class="day-grid" data-day="${day}"></div>
        `;

        dayColumn.style.minHeight = '0';
        const dayGrid = dayColumn.querySelector('.day-grid');
        if (dayGrid) dayGrid.style.height = `${totalHeight}px`;

        calendarContainer.appendChild(dayColumn);

        dayColumn.querySelector('.add-slot-btn').addEventListener('click', (e) => {
            const day = e.currentTarget.dataset.day;
            const newSlot = createSlot(day, `${VISIBLE_START_HOUR.toString().padStart(2,'0')}:00`, `${(VISIBLE_START_HOUR+1).toString().padStart(2,'0')}:00`);
            scheduleSlots[day].push(newSlot);
            renderScheduleDaySlots(day);
            openScheduleSlotEditor(newSlot);
            showScheduleToast('✅ New slot added! Click to edit.');
        });
    });

    dayNames.forEach(day => renderScheduleDaySlots(day));
    renderScheduleSports();
    renderScheduleHobbies();
}

function renderScheduleDaySlots(day) {
    const container = document.querySelector(`#schedWeeklyCalendar .day-grid[data-day="${day}"]`);
    if (!container) return;
    container.innerHTML = '';

    const slots = scheduleSlots[day];
    const dayCategories = scheduleCategories[day] || [];
    const categorizedSlotIds = new Set(dayCategories.flatMap(c => c.slotIds));

    dayCategories.forEach(category => {
        const categorySlots = slots.filter(s => category.slotIds.includes(s.id));
        if (categorySlots.length === 0) return;

        const firstSlot = categorySlots[0];
        const lastSlot = categorySlots[categorySlots.length - 1];
        
        const startPx = timeToPixels(firstSlot.start);
        const endPx = timeToPixels(lastSlot.end);
        const height = endPx - startPx;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'calendar-slot category-slot';
        categoryEl.style.top = startPx + 'px';
        categoryEl.style.height = height + 'px';

        categoryEl.innerHTML = `
            <div class="slot-content">
                <div class="slot-time">${firstSlot.start} - ${lastSlot.end}</div>
                <div class="slot-info">📁 ${category.name}</div>
            </div>
        `;

        categoryEl.addEventListener('click', () => viewScheduleCategory(category, day));
        container.appendChild(categoryEl);
    });

    slots.forEach(slot => {
        if (categorizedSlotIds.has(slot.id)) return;

        const startPx = timeToPixels(slot.start);
        const endPx = timeToPixels(slot.end);
        const height = endPx - startPx;

        const slotEl = document.createElement('div');
        slotEl.className = 'calendar-slot';
        if (selectedSlots.has(slot.id)) slotEl.classList.add('selected');
        slotEl.dataset.slotId = slot.id;
        slotEl.dataset.day = day;
        slotEl.style.top = startPx + 'px';
        slotEl.style.height = height + 'px';
        const durationMinutes = timeToMinutes(slot.end) - timeToMinutes(slot.start);
        const showHints = durationMinutes >= 180;

        slotEl.innerHTML = `
            <input type="checkbox" class="slot-checkbox" data-slot-id="${slot.id}" ${selectedSlots.has(slot.id) ? 'checked' : ''}>
            <div class="slot-content">
                <div class="slot-time">${slot.start} - ${slot.end}</div>
                ${slot.emoji || slot.name ? `<div class="slot-info">${slot.emoji} ${slot.name}</div>` : ''}
            </div>
            ${showHints ? `
                <div class="slot-hints">
                    <div class="slot-hint-top">▲ Move</div>
                    <div class="slot-hint-sides">
                        <span>◀</span>
                        <span>Copy</span>
                        <span>▶</span>
                    </div>
                    <div class="slot-hint-bottom">▼ Resize</div>
                </div>
            ` : ''}
            <div class="slot-resize-handle"></div>
        `;

        const checkbox = slotEl.querySelector('.slot-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleScheduleSlotSelection(slot.id);
        });

        slotEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('slot-resize-handle')) {
                startScheduleResize(e, slot, slotEl);
            } else if (!e.target.classList.contains('slot-checkbox')) {
                startScheduleDrag(e, slot, slotEl);
            }
        });

        slotEl.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('slot-resize-handle')) {
                const touch = e.touches[0];
                startScheduleResize({ clientY: touch.clientY, preventDefault: () => e.preventDefault() }, slot, slotEl);
            } else if (!e.target.classList.contains('slot-checkbox')) {
                const touch = e.touches[0];
                startScheduleDrag({ clientY: touch.clientY, clientX: touch.clientX, preventDefault: () => e.preventDefault() }, slot, slotEl);
            }
        }, { passive: false });

        slotEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('.slot-checkbox') || e.target.closest('.slot-resize-handle')) return;
            if (draggedSlot && draggedSlot.moved) return;
            openScheduleSlotEditor(slot);
        });

        container.appendChild(slotEl);
    });

    updateScheduleSelectionToolbar();
}

const DRAG_THRESHOLD = 10;
let resizedSlot = null;
let recentlyDragged = false;

function startScheduleDrag(e, slot, slotEl) {
    const dayColumn = slotEl.closest('.day-column');
    const dayGrid = dayColumn.querySelector('.day-grid');
    originalDayIndex = dayNames.indexOf(dayGrid.dataset.day);
    
    draggedSlot = { slot, slotEl, startY: e.clientY, startX: e.clientX, moved: false };
    dragStartY = e.clientY;
    duplicateStartX = e.clientX;
    slotEl.classList.add('dragging');
    document.addEventListener('mousemove', onScheduleDragMove);
    document.addEventListener('mouseup', onScheduleDragEnd);
    document.addEventListener('touchmove', onScheduleDragMove, { passive: false });
    document.addEventListener('touchend', onScheduleDragEnd);
    e.preventDefault();
}


function onScheduleDragMove(e) {
    if (!draggedSlot) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    const dx = Math.abs(clientX - draggedSlot.startX);
    const dy = Math.abs(clientY - draggedSlot.startY);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (!draggedSlot.moved && distance < DRAG_THRESHOLD) return;

    draggedSlot.moved = true;
    
    const horizontalDelta = Math.abs(clientX - duplicateStartX);
    
    if (horizontalDelta > 80 && !isDuplicating) {
        isDuplicating = true;
        
        if (!ghostElement) {
            ghostElement = document.createElement('div');
            ghostElement.className = 'slot-ghost';
            ghostElement.textContent = draggedSlot.slot.emoji || '📋';
            document.body.appendChild(ghostElement);
        }
    }
    
    if (isDuplicating && ghostElement) {
        ghostElement.style.left = (clientX - ghostElement.offsetWidth / 2) + 'px';
        ghostElement.style.top = (clientY - ghostElement.offsetHeight / 2) + 'px';
    } else if (!isDuplicating) {
        const deltaY = clientY - dragStartY;
        const currentTop = parseInt(draggedSlot.slotEl.style.top) || 0;
        const newTop = Math.max(0, currentTop + deltaY);
        draggedSlot.slotEl.style.top = newTop + 'px';
        dragStartY = clientY;
    }
}

function onScheduleDragEnd(e) {
    if (!draggedSlot) return;
    const wasMoved = !!draggedSlot.moved;
    
    if (ghostElement) {
        ghostElement.remove();
        ghostElement = null;
    }
    
    if (isDuplicating && wasMoved) {
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const dayColumns = document.querySelectorAll('#schedWeeklyCalendar .day-column');
        let targetDayIndex = -1;
        
        dayColumns.forEach((col, idx) => {
            const rect = col.getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right) {
                targetDayIndex = idx;
            }
        });
        
        if (targetDayIndex !== -1 && targetDayIndex !== originalDayIndex) {
            const targetDay = dayNames[targetDayIndex];
            const originalSlot = draggedSlot.slot;
            const newSlot = createSlot(
                targetDay,
                originalSlot.start,
                originalSlot.end,
                originalSlot.name,
                originalSlot.emoji,
                originalSlot.description
            );
            scheduleSlots[targetDay].push(newSlot);
            renderScheduleDaySlots(targetDay);
            showScheduleToast(`✅ Slot duplicated to ${dayNamesDisplay[targetDay]}!`);
        }
        
        renderScheduleDaySlots(draggedSlot.slot.day);
        
    } else if (wasMoved && !isDuplicating) {
        const newTop = parseInt(draggedSlot.slotEl.style.top) || 0;
        const newStart = pixelsToTime(newTop);
        const duration = timeToMinutes(draggedSlot.slot.end) - timeToMinutes(draggedSlot.slot.start);
        const newEnd = minutesToTime(timeToMinutes(newStart) + duration);
        draggedSlot.slot.start = newStart;
        draggedSlot.slot.end = newEnd;
        draggedSlot.slotEl.classList.remove('dragging');
        renderScheduleDaySlots(draggedSlot.slot.day);

        recentlyDragged = true;
        setTimeout(() => recentlyDragged = false, 200);
    } else {
        draggedSlot.slotEl.classList.remove('dragging');
    }

    isDuplicating = false;
    draggedSlot = null;
    originalDayIndex = -1;
    document.removeEventListener('mousemove', onScheduleDragMove);
    document.removeEventListener('mouseup', onScheduleDragEnd);
    document.removeEventListener('touchmove', onScheduleDragMove);
    document.removeEventListener('touchend', onScheduleDragEnd);
}

function startScheduleResize(e, slot, slotEl) {
    isResizing = true;
    resizedSlot = { slot, slotEl, startY: e.clientY };
    dragStartY = e.clientY;
    document.addEventListener('mousemove', onScheduleResizeMove);
    document.addEventListener('mouseup', onScheduleResizeEnd);
    document.addEventListener('touchmove', onScheduleResizeMove, { passive: false });
    document.addEventListener('touchend', onScheduleResizeEnd);
    e.preventDefault();
    e.stopPropagation();
}

function onScheduleResizeMove(e) {
    if (!isResizing || !resizedSlot) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaY = clientY - dragStartY;
    const currentHeight = parseInt(resizedSlot.slotEl.style.height) || SLOT_HEIGHT_PX;
    const newHeight = Math.max(SLOT_HEIGHT_PX / 6, currentHeight + deltaY);
    resizedSlot.slotEl.style.height = newHeight + 'px';
    dragStartY = clientY;
}

function onScheduleResizeEnd() {
    if (!isResizing || !resizedSlot) return;
    const newHeight = parseInt(resizedSlot.slotEl.style.height) || 0;
    const startPx = parseInt(resizedSlot.slotEl.style.top) || 0;
    const endPx = startPx + newHeight;
    let newEnd = pixelsToTime(endPx);
    const startMinutes = timeToMinutes(resizedSlot.slot.start);
    if (timeToMinutes(newEnd) <= startMinutes) {
        newEnd = minutesToTime(startMinutes + 10);
    }
    resizedSlot.slot.end = newEnd;
    renderScheduleDaySlots(resizedSlot.slot.day);

    recentlyDragged = true;
    setTimeout(() => recentlyDragged = false, 200);

    isResizing = false;
    resizedSlot = null;
    document.removeEventListener('mousemove', onScheduleResizeMove);
    document.removeEventListener('mouseup', onScheduleResizeEnd);
    document.removeEventListener('touchmove', onScheduleResizeMove);
    document.removeEventListener('touchend', onScheduleResizeEnd);
}

function toggleScheduleSlotSelection(slotId) {
    if (selectedSlots.has(slotId)) {
        selectedSlots.delete(slotId);
    } else {
        selectedSlots.add(slotId);
    }
    dayNames.forEach(day => renderScheduleDaySlots(day));
}

function clearScheduleSelection() {
    selectedSlots.clear();
    dayNames.forEach(day => renderScheduleDaySlots(day));
}

function updateScheduleSelectionToolbar() {
    const toolbar = document.getElementById('schedSelectionToolbar');
    const info = document.getElementById('schedSelectionInfo');
    if (!toolbar || !info) return;
    const count = selectedSlots.size;
    if (count > 0) {
        toolbar.classList.add('show');
        info.textContent = `${count} slot${count === 1 ? '' : 's'} selected`;
    } else {
        toolbar.classList.remove('show');
    }
}

function openScheduleSlotEditor(slot) {
    currentEditingSlot = slot;

    let modal = document.getElementById('schedSlotEditorModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'schedSlotEditorModal';
    modal.className = 'modal-overlay';

    const categoriesHtml = Object.keys(emojiCategories).map(cat => {
        return `<button type="button" class="emoji-cat-tab" data-cat="${cat}">${cat}</button>`;
    }).join('');

    const emojisHtml = Object.entries(emojiCategories).map(([cat, list]) => {
        const btns = list.map(e => {
            const selClass = (e === (slot.emoji || selectedSlotEmoji)) ? ' selected' : '';
            return `<button type="button" class="emoji-btn-modal${selClass}" data-emoji="${e}" title="${cat}">${e}</button>`;
        }).join('');
        return `<div class="emoji-cat-panel" data-cat="${cat}" style="display:none">${btns}</div>`;
    }).join('');

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Slot — ${dayNamesDisplay[slot.day]} ${slot.start}</h3>
                <button class="modal-close" id="schedSlotEditorCloseBtn">×</button>
            </div>

            <div class="modal-body">
                <div class="form-row">
                    <label>Activity Name</label>
                    <input type="text" id="schedSlotName" value="${slot.name || ''}" placeholder="e.g. Work, Gym">
                </div>

                <div class="form-row emoji-picker-modal-wrapper">
                    <label>Emoji / Icon</label>
                    <div class="emoji-selected-preview">Selected: <span id="schedSelectedEmojiPreview">${slot.emoji || selectedSlotEmoji || '🕒'}</span></div>

                    <div class="emoji-picker-controls">
                        <div class="emoji-cat-tabs">${categoriesHtml}</div>
                    </div>

                    <div class="emoji-grid-modal-wrapper">
                        ${emojisHtml}
                    </div>
                </div>

                <div class="form-row">
                    <label>Description (optional)</label>
                    <textarea id="schedSlotDescription" rows="3" placeholder="Notes...">${slot.description || ''}</textarea>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-danger" id="schedSlotEditorDeleteBtn">🗑️ Delete</button>
                <button class="btn-primary" id="schedSlotEditorSaveBtn">💾 Save</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    selectedSlotEmoji = slot.emoji || selectedSlotEmoji || '🕒';
    const preview = modal.querySelector('#schedSelectedEmojiPreview');
    if (preview) preview.textContent = selectedSlotEmoji;

    const closeBtn = modal.querySelector('#schedSlotEditorCloseBtn');
    const cancelBtn = modal.querySelector('#schedSlotEditorCancelBtn');
    const saveBtn = modal.querySelector('#schedSlotEditorSaveBtn');
    const deleteBtn = modal.querySelector('#schedSlotEditorDeleteBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeScheduleSlotEditor);
    if (cancelBtn) cancelBtn.addEventListener('click', closeScheduleSlotEditor);
    if (saveBtn) saveBtn.addEventListener('click', () => {
        if (!currentEditingSlot) return;
        currentEditingSlot.name = (modal.querySelector('#schedSlotName') || { value: '' }).value.trim();
        currentEditingSlot.emoji = selectedSlotEmoji;
        currentEditingSlot.description = (modal.querySelector('#schedSlotDescription') || { value: '' }).value.trim();
        renderScheduleDaySlots(currentEditingSlot.day);
        closeScheduleSlotEditor();
        showScheduleToast('✅ Slot saved!');
    });
    if (deleteBtn) deleteBtn.addEventListener('click', () => {
        currentEditingSlot = slot;
        deleteScheduleSlot();
    });

    const gridWrapper = modal.querySelector('.emoji-grid-modal-wrapper');
    gridWrapper.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.emoji-btn-modal');
        if (!btn) return;
        const emoji = btn.dataset.emoji;
        selectedSlotEmoji = emoji;
        const p = modal.querySelector('#schedSelectedEmojiPreview');
        if (p) p.textContent = emoji;
        modal.querySelectorAll('.emoji-btn-modal.selected').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });

    modal.querySelectorAll('.emoji-cat-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.cat;
            modal.querySelectorAll('.emoji-cat-panel').forEach(panel => {
                panel.style.display = (panel.dataset.cat === cat) ? 'flex' : 'none';
            });
            modal.querySelectorAll('.emoji-cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    const firstTab = modal.querySelector('.emoji-cat-tab');
    if (firstTab) firstTab.click();
    modal.querySelectorAll(`.emoji-btn-modal[data-emoji="${selectedSlotEmoji}"]`).forEach(b => b.classList.add('selected'));

    const keyHandler = (ke) => { if (ke.key === 'Escape') closeScheduleSlotEditor(); };
    modal._keyHandler = keyHandler;
    document.addEventListener('keydown', keyHandler);

    setTimeout(() => {
        const input = modal.querySelector('#schedSlotName');
        if (input) input.focus();
    }, 50);
}

function closeScheduleSlotEditor() {
    const modal = document.getElementById('schedSlotEditorModal');
    if (!modal) return;

    if (modal._keyHandler) {
        document.removeEventListener('keydown', modal._keyHandler);
        delete modal._keyHandler;
    }

    document.body.classList.remove('modal-open');
    modal.remove();
    currentEditingSlot = null;
}

function deleteScheduleSlot() {
    if (!currentEditingSlot) return;
    if (confirm('Are you sure you want to delete this slot?')) {
        const day = currentEditingSlot.day;
        const slotId = currentEditingSlot.id;
        scheduleSlots[day] = scheduleSlots[day].filter(s => s.id !== slotId);
        scheduleCategories[day].forEach(cat => {
            cat.slotIds = cat.slotIds.filter(id => id !== slotId);
        });
        scheduleCategories[day] = scheduleCategories[day].filter(cat => cat.slotIds.length > 0);
        renderScheduleDaySlots(day);
        closeScheduleSlotEditor();
        showScheduleToast('🗑️ Slot deleted');
    }
}

function resetScheduleCalendar() {
    if (confirm('Are you sure you want to reset the entire calendar?')) {
        slotIdCounter = 0;
        categoryIdCounter = 0;
        selectedSlots.clear();
        dayNames.forEach(day => {
            scheduleSlots[day] = [];
            scheduleCategories[day] = [];
            renderScheduleDaySlots(day);
        });
        showScheduleToast('🔄 Calendar reset');
    }
}

function openScheduleCategoryModal() {
    if (selectedSlots.size < 2) {
        showScheduleToast('⚠️ Select at least 2 slots to create a category!');
        return;
    }
    const slots = Array.from(selectedSlots).map(id => {
        for (const day of dayNames) {
            const slot = scheduleSlots[day].find(s => s.id === id);
            if (slot) return { ...slot, day };
        }
        return null;
    }).filter(Boolean);

    const slotsByDay = {};
    slots.forEach(slot => {
        if (!slotsByDay[slot.day]) slotsByDay[slot.day] = [];
        slotsByDay[slot.day].push(slot);
    });

    let slotsList = '';
    Object.keys(slotsByDay).sort((a, b) => dayNames.indexOf(a) - dayNames.indexOf(b)).forEach(day => {
        slotsList += `\n${dayNamesDisplay[day]}: `;
        slotsByDay[day].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)).forEach(s => {
            slotsList += `${s.start}-${s.end} ${s.emoji} ${s.name}, `;
        });
    });

    let modal = document.getElementById('schedCategoryModal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'schedCategoryModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🔗 Create Category</h3>
                <button class="modal-close" id="schedCloseCategoryModal">×</button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="schedCategoryName">Category Name</label>
                    <input type="text" id="schedCategoryName" placeholder="e.g., SCHOOL, WORK, TRAINING">
                </div>
                <div class="slot-time-info">
                    <strong>Selected slots:</strong> <span>${slotsList}</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" id="schedCancelCategoryBtn">Cancel</button>
                <button class="btn-primary" id="schedSaveCategoryBtn">💾 Create Category</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    document.getElementById('schedCloseCategoryModal').addEventListener('click', closeScheduleCategoryModal);
    document.getElementById('schedCancelCategoryBtn').addEventListener('click', closeScheduleCategoryModal);
    document.getElementById('schedSaveCategoryBtn').addEventListener('click', createScheduleCategory);
}

function closeScheduleCategoryModal() {
    const modal = document.getElementById('schedCategoryModal');
    if (modal) modal.remove();
}

function createScheduleCategory() {
    const modal = document.getElementById('schedCategoryModal');
    const name = modal.querySelector('#schedCategoryName').value.trim().toUpperCase();
    if (!name) {
        showScheduleToast('⚠️ Enter a category name!');
        return;
    }
    const slotsByDay = {};
    for (const slotId of selectedSlots) {
        for (const day of dayNames) {
            const slot = scheduleSlots[day].find(s => s.id === slotId);
            if (slot) {
                if (!slotsByDay[day]) slotsByDay[day] = [];
                slotsByDay[day].push(slotId);
                break;
            }
        }
    }
    Object.keys(slotsByDay).forEach(day => {
        scheduleCategories[day].push({
            id: categoryIdCounter++,
            name,
            slotIds: slotsByDay[day]
        });
    });
    selectedSlots.clear();
    Object.keys(slotsByDay).forEach(day => renderScheduleDaySlots(day));
    closeScheduleCategoryModal();
    showScheduleToast(`✅ Category "${name}" created!`);
}

function viewScheduleCategory(category, day) {
    const allCategorySlots = [];
    dayNames.forEach(d => {
        const dayCat = scheduleCategories[d].find(c => c.name === category.name);
        if (dayCat) {
            const slots = scheduleSlots[d].filter(s => dayCat.slotIds.includes(s.id));
            slots.forEach(s => allCategorySlots.push({ ...s, day: d }));
        }
    });

    const slotsByDay = {};
    allCategorySlots.forEach(slot => {
        if (!slotsByDay[slot.day]) slotsByDay[slot.day] = [];
        slotsByDay[slot.day].push(slot);
    });

    let details = '';
    Object.keys(slotsByDay).sort((a, b) => dayNames.indexOf(a) - dayNames.indexOf(b)).forEach(d => {
        details += `\n${dayNamesDisplay[d]}:\n`;
        slotsByDay[d].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)).forEach(s => {
            details += `  • ${s.start}-${s.end}: ${s.emoji} ${s.name || 'Unnamed'}\n`;
        });
    });

    if (confirm(`📁 CATEGORY: ${category.name}${details}\n\n🗑️ Delete this category?`)) {
        dayNames.forEach(d => {
            scheduleCategories[d] = scheduleCategories[d].filter(c => c.name !== category.name);
            renderScheduleDaySlots(d);
        });
        showScheduleToast('🗑️ Category deleted');
    }
}

function setupScheduleDaySelectors() {
    document.querySelectorAll('#schedSportDaysSelector .day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.dataset.day;
            if (selectedSportDays.has(day)) {
                selectedSportDays.delete(day);
                this.classList.remove('selected');
            } else {
                selectedSportDays.add(day);
                this.classList.add('selected');
            }
        });
    });

    document.querySelectorAll('#schedHobbyDaysSelector .day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.dataset.day;
            if (selectedHobbyDays.has(day)) {
                selectedHobbyDays.delete(day);
                this.classList.remove('selected');
            } else {
                selectedHobbyDays.add(day);
                this.classList.add('selected');
            }
        });
    });
}

function initializeScheduleEmojiPickers() {
    createScheduleEmojiPicker('schedSportEmojiBtn', 'schedSportEmojiDropdown', (emoji) => {
        selectedSportEmoji = emoji;
        document.getElementById('schedSportEmojiBtn').textContent = emoji;
    });
    createScheduleEmojiPicker('schedHobbyEmojiBtn', 'schedHobbyEmojiDropdown', (emoji) => {
        selectedHobbyEmoji = emoji;
        document.getElementById('schedHobbyEmojiBtn').textContent = emoji;
    });
}

function createScheduleEmojiPicker(btnId, dropdownId, onSelect) {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    if (!btn || !dropdown) return;

    let html = '';
    for (const [category, emojis] of Object.entries(emojiCategories)) {
        html += `<div class="emoji-category"><div class="emoji-category-title">${category}</div><div class="emoji-grid">`;
        emojis.forEach(emoji => {
            html += `<button type="button" class="emoji-item" data-emoji="${emoji}">${emoji}</button>`;
        });
        html += '</div></div>';
    }
    dropdown.innerHTML = html;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    dropdown.querySelectorAll('.emoji-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelect(item.dataset.emoji);
            dropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
}

function addScheduleSport() {
    const name = document.getElementById('schedSportName').value.trim();
    const startTime = document.getElementById('schedSportStartTime').value || null;
    const endTime = document.getElementById('schedSportEndTime').value || null;
    if (!name) {
        showScheduleToast('⚠️ Enter the sport name!');
        return;
    }
    if (selectedSportDays.size === 0) {
        showScheduleToast('⚠️ Select at least one day!');
        return;
    }
    scheduleSports.push({ 
        id: Date.now() + Math.random(), 
        name, 
        emoji: selectedSportEmoji || '⚽',
        days: Array.from(selectedSportDays),
        startTime,
        endTime
    });
    renderScheduleSports();
    document.getElementById('schedSportName').value = '';
    document.getElementById('schedSportStartTime').value = '';
    document.getElementById('schedSportEndTime').value = '';
    document.getElementById('schedSportEmojiBtn').textContent = '⚽';
    selectedSportEmoji = '⚽';
    selectedSportDays.clear();
    document.querySelectorAll('#schedSportDaysSelector .day-btn').forEach(d => d.classList.remove('selected'));
    showScheduleToast(`✅ ${selectedSportEmoji} ${name} added!`);
}

function renderScheduleSports() {
    const container = document.getElementById('schedSportsList');
    if (!container) return;
    if (scheduleSports.length === 0) {
        container.innerHTML = '<p class="empty-state">No sports added yet</p>';
        return;
    }
    container.innerHTML = scheduleSports.map(sport => {
        const daysStr = sport.days.map(d => dayNamesDisplay[d]).join(', ');
        const timeStr = sport.startTime && sport.endTime ? ` (${sport.startTime}-${sport.endTime})` : '';
        return `
            <div class="item-tag">
                <span>${sport.emoji} ${sport.name} - ${daysStr}${timeStr}</span>
                <button type="button" onclick="removeScheduleSport(${sport.id})">×</button>
            </div>
        `;
    }).join('');
}

function removeScheduleSport(sportId) {
    scheduleSports = scheduleSports.filter(s => s.id !== sportId);
    renderScheduleSports();
    showScheduleToast('🗑️ Sport removed');
}

function addScheduleHobby() {
    const name = document.getElementById('schedHobbyName').value.trim();
    const startTime = document.getElementById('schedHobbyStartTime').value || null;
    const endTime = document.getElementById('schedHobbyEndTime').value || null;
    if (!name) {
        showScheduleToast('⚠️ Enter the hobby name!');
        return;
    }
    if (selectedHobbyDays.size === 0) {
        showScheduleToast('⚠️ Select at least one day!');
        return;
    }
    scheduleHobbies.push({ 
        id: Date.now() + Math.random(), 
        name, 
        emoji: selectedHobbyEmoji || '🎨',
        days: Array.from(selectedHobbyDays),
        startTime,
        endTime
    });
    renderScheduleHobbies();
    document.getElementById('schedHobbyName').value = '';
    document.getElementById('schedHobbyStartTime').value = '';
    document.getElementById('schedHobbyEndTime').value = '';
    document.getElementById('schedHobbyEmojiBtn').textContent = '📚';
    selectedHobbyEmoji = '📚';
    selectedHobbyDays.clear();
    document.querySelectorAll('#schedHobbyDaysSelector .day-btn').forEach(d => d.classList.remove('selected'));
    showScheduleToast(`✅ ${selectedHobbyEmoji} ${name} added!`);
}

function renderScheduleHobbies() {
    const container = document.getElementById('schedHobbiesList');
    if (!container) return;
    if (scheduleHobbies.length === 0) {
        container.innerHTML = '<p class="empty-state">No hobbies added yet</p>';
        return;
    }
    container.innerHTML = scheduleHobbies.map(hobby => {
        const daysStr = hobby.days.map(d => dayNamesDisplay[d]).join(', ');
        const timeStr = hobby.startTime && hobby.endTime ? ` (${hobby.startTime}-${hobby.endTime})` : '';
        return `
            <div class="item-tag">
                <span>${hobby.emoji} ${hobby.name} - ${daysStr}${timeStr}</span>
                <button type="button" onclick="removeScheduleHobby(${hobby.id})">×</button>
            </div>
        `;
    }).join('');
}

function removeScheduleHobby(hobbyId) {
    scheduleHobbies = scheduleHobbies.filter(h => h.id !== hobbyId);
    renderScheduleHobbies();
    showScheduleToast('🗑️ Hobby removed');
}

async function saveScheduleChanges() {
    const userEmail = getUserEmail();
    if (!userEmail) {
        showScheduleToast('❌ User not found');
        return;
    }

    const allSlots = [];
    const allCategories = [];
    
    dayNames.forEach(day => {
        scheduleSlots[day].forEach(slot => {
            allSlots.push({
                id: slot.id,
                day: day,
                start: slot.start,
                end: slot.end,
                name: slot.name || '',
                emoji: slot.emoji || '',
                description: slot.description || ''
            });
        });
        
        scheduleCategories[day].forEach(category => {
            const categorySlots = scheduleSlots[day].filter(s => category.slotIds.includes(s.id));
            allCategories.push({
                id: category.id,
                name: category.name,
                day: day,
                slotIds: category.slotIds,
                slots: categorySlots.map(s => ({
                    start: s.start,
                    end: s.end,
                    name: s.name || '',
                    emoji: s.emoji || ''
                }))
            });
        });
    });

    const scheduleData = {
        slots: allSlots,
        categories: allCategories,
        sports: scheduleSports.map(s => ({
            name: s.name,
            emoji: s.emoji,
            days: s.days,
            startTime: s.startTime,
            endTime: s.endTime
        })),
        hobbies: scheduleHobbies.map(h => ({
            name: h.name,
            emoji: h.emoji,
            days: h.days,
            startTime: h.startTime,
            endTime: h.endTime
        }))
    };

    settings.schedule = scheduleData;

    try {
        await syncToServer();
        await loadDataFromServer();
        generateCalendar();
        
        closeScheduleManager();
        showNotification('✅ Schedule updated successfully!', 'success');

    } catch (error) {
        console.error('Update error:', error);
        showNotification('❌ Error updating schedule. Try again.', 'error');
    }
}

function showScheduleToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.openScheduleManager = openScheduleManager;
window.removeScheduleSport = removeScheduleSport;
window.removeScheduleHobby = removeScheduleHobby;