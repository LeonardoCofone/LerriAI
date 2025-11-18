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

let currentStep = 1;
let weeklySlots = {};
let categories = {};
let sports = [];
let hobbies = [];
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
let selectedSlotEmoji = '📅';

function timeToPixels(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const minutesFromStart = (hours * 60 + minutes) - (VISIBLE_START_HOUR * 60);
    return (minutesFromStart / MINUTES_PER_SLOT) * SLOT_HEIGHT_PX;
}

function pixelsToTime(px) {
    const totalMinutesFromStart = Math.round((px / SLOT_HEIGHT_PX) * MINUTES_PER_SLOT);
    const snappedMinutesFromStart = Math.round(totalMinutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;
    // absolute minutes since midnight
    let absMinutes = snappedMinutesFromStart + (VISIBLE_START_HOUR * 60);
    // clamp to visible range
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

function initializeWeeklyCalendar() {
    const timeLabels = document.getElementById('timeLabels');
    timeLabels.innerHTML = '';

    // totale altezza visibile (es. 17 ore * 60px)
    const totalHeight = VISIBLE_HOURS * SLOT_HEIGHT_PX;
    timeLabels.style.height = `${totalHeight}px`;

    // crea etichette orarie solo per l'intervallo visibile (05:00 .. 21:00)
    // ogni label ha altezza SLOT_HEIGHT_PX, la griglia avrà l'altezza totale corretta
    for (let h = VISIBLE_START_HOUR; h < VISIBLE_END_HOUR; h++) {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = `${h.toString().padStart(2, '0')}:00`;
        label.style.height = `${SLOT_HEIGHT_PX}px`;
        timeLabels.appendChild(label);
    }

    const calendarContainer = document.getElementById('weeklyCalendar');
    calendarContainer.innerHTML = '';
    calendarContainer.style.height = `${totalHeight}px`; // forziamo altezza container

    dayNames.forEach(day => {
        weeklySlots[day] = [];
        categories[day] = [];

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

        // set visible grid height to match displayed hours
        const dayGrid = dayColumn.querySelector('.day-grid');
        if (dayGrid) {
            dayGrid.style.height = `${totalHeight}px`;
            // assicurati che background-grid (CSS) utilizzi questa altezza/linea
        }

        calendarContainer.appendChild(dayColumn);

        dayColumn.querySelector('.add-slot-btn').addEventListener('click', (e) => {
            const day = e.currentTarget.dataset.day;
            const newSlot = createSlot(day, `${VISIBLE_START_HOUR.toString().padStart(2,'0')}:00`, `${(VISIBLE_START_HOUR+1).toString().padStart(2,'0')}:00`);
            weeklySlots[day].push(newSlot);
            renderDaySlots(day);
            openSlotEditor(newSlot);
            showToast('✅ New slot added! Click to edit.');
        });
    });
}


const DRAG_THRESHOLD = 10; 
let resizedSlot = null; 
let recentlyDragged = false;


function renderDaySlots(day) {
    const container = document.querySelector(`.day-grid[data-day="${day}"]`);
    container.innerHTML = '';

    const slots = weeklySlots[day];
    const dayCategories = categories[day] || [];
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

        categoryEl.addEventListener('click', () => viewCategory(category, day));
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

        slotEl.innerHTML = `
            <input type="checkbox" class="slot-checkbox" data-slot-id="${slot.id}" ${selectedSlots.has(slot.id) ? 'checked' : ''}>
            <div class="slot-content">
                <div class="slot-time">${slot.start} - ${slot.end}</div>
                ${slot.emoji || slot.name ? `<div class="slot-info">${slot.emoji} ${slot.name}</div>` : ''}
            </div>
            <div class="slot-resize-handle"></div>
        `;

        const checkbox = slotEl.querySelector('.slot-checkbox');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleSlotSelection(slot.id);
        });

        slotEl.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('slot-resize-handle')) {
                startResize(e, slot, slotEl);
            } else if (!e.target.classList.contains('slot-checkbox')) {
                startDrag(e, slot, slotEl);
            }
        });

        slotEl.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('slot-resize-handle')) {
                const touch = e.touches[0];
                startResize({ clientY: touch.clientY, preventDefault: () => e.preventDefault() }, slot, slotEl);
            } else if (!e.target.classList.contains('slot-checkbox')) {
                const touch = e.touches[0];
                startDrag({ clientY: touch.clientY, clientX: touch.clientX, preventDefault: () => e.preventDefault() }, slot, slotEl);
            }
        }, { passive: false });

        slotEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('.slot-checkbox') || e.target.closest('.slot-resize-handle')) return;
            if (recentlyDragged || isResizing) return;
            if (draggedSlot && draggedSlot.moved) return;
            openSlotEditor(slot);
        });

        container.appendChild(slotEl);
    });

    updateSelectionToolbar();
}



function startDrag(e, slot, slotEl) {
    draggedSlot = { slot, slotEl, startY: e.clientY, startX: e.clientX, moved: false };
    dragStartY = e.clientY;
    slotEl.classList.add('dragging');
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    e.preventDefault();
}

function onDragMove(e) {
    if (!draggedSlot) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    
    const dx = Math.abs(clientX - draggedSlot.startX);
    const dy = Math.abs(clientY - draggedSlot.startY);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (!draggedSlot.moved && distance < DRAG_THRESHOLD) {
        return;
    }

    draggedSlot.moved = true;
    const deltaY = clientY - dragStartY;
    const currentTop = parseInt(draggedSlot.slotEl.style.top) || 0;
    const newTop = Math.max(0, currentTop + deltaY);
    draggedSlot.slotEl.style.top = newTop + 'px';
    dragStartY = clientY;
}




function onDragEnd() {
    if (!draggedSlot) return;
    const wasMoved = !!draggedSlot.moved;
    if (wasMoved) {
        const newTop = parseInt(draggedSlot.slotEl.style.top) || 0;
        const newStart = pixelsToTime(newTop);
        const duration = timeToMinutes(draggedSlot.slot.end) - timeToMinutes(draggedSlot.slot.start);
        const newEnd = minutesToTime(timeToMinutes(newStart) + duration);
        draggedSlot.slot.start = newStart;
        draggedSlot.slot.end = newEnd;
        draggedSlot.slotEl.classList.remove('dragging');
        renderDaySlots(draggedSlot.slot.day);

        recentlyDragged = true;
        setTimeout(() => recentlyDragged = false, 200);
    } else {
        draggedSlot.slotEl.classList.remove('dragging');
    }

    draggedSlot = null;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
}

function startResize(e, slot, slotEl) {
    isResizing = true;
    resizedSlot = { slot, slotEl, startY: e.clientY };
    dragStartY = e.clientY;
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('touchmove', onResizeMove, { passive: false });
    document.addEventListener('touchend', onResizeEnd);
    e.preventDefault();
    e.stopPropagation();
}

function onResizeMove(e) {
    if (!isResizing || !resizedSlot) return;
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaY = clientY - dragStartY;
    const currentHeight = parseInt(resizedSlot.slotEl.style.height) || SLOT_HEIGHT_PX;
    const newHeight = Math.max(SLOT_HEIGHT_PX / 6, currentHeight + deltaY);
    resizedSlot.slotEl.style.height = newHeight + 'px';
    dragStartY = clientY;
}


function onResizeEnd() {
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
    renderDaySlots(resizedSlot.slot.day);

    // brief block to prevent click immediately after resizing
    recentlyDragged = true;
    setTimeout(() => recentlyDragged = false, 200);

    isResizing = false;
    resizedSlot = null;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
}

function toggleSlotSelection(slotId) {
    if (selectedSlots.has(slotId)) {
        selectedSlots.delete(slotId);
    } else {
        selectedSlots.add(slotId);
    }
    dayNames.forEach(day => renderDaySlots(day));
}

function clearSelection() {
    selectedSlots.clear();
    dayNames.forEach(day => renderDaySlots(day));
}

function updateSelectionToolbar() {
    const toolbar = document.getElementById('selectionToolbar');
    const info = document.getElementById('selectionInfo');
    const count = selectedSlots.size;
    if (count > 0) {
        toolbar.classList.add('show');
        info.textContent = `${count} slot${count === 1 ? '' : 's'} selected`;
    } else {
        toolbar.classList.remove('show');
    }
}

function openSlotEditor(slot) {
    currentEditingSlot = slot;

    // find or create modal overlay
    let modal = document.getElementById('slotEditorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'slotEditorModal';
        modal.className = 'modal-overlay hidden';
        document.body.appendChild(modal);
    }

    // build modal content (removed search input)
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
        <div class="modal-content modal-card" role="dialog" aria-modal="true" aria-labelledby="slotEditorTitle">
            <div class="modal-header">
                <h3 id="slotEditorTitle">Edit Slot — ${dayNamesDisplay[slot.day]} ${slot.start}</h3>
                <button class="modal-close" id="slotEditorCloseBtn" aria-label="Close">×</button>
            </div>

            <div class="modal-body">
                <div class="form-row">
                    <label>Activity Name</label>
                    <input type="text" id="slotName" value="${slot.name || ''}" placeholder="e.g. Work, Gym">
                </div>

                <div class="form-row emoji-picker-modal-wrapper">
                    <label>Emoji / Icon</label>
                    <div class="emoji-selected-preview">Selected: <span id="selectedEmojiPreview">${slot.emoji || selectedSlotEmoji || '📅'}</span></div>

                    <div class="emoji-picker-controls">
                        <div class="emoji-cat-tabs">${categoriesHtml}</div>
                    </div>

                    <div class="emoji-grid-modal-wrapper">
                        ${emojisHtml}
                    </div>
                </div>

                <div class="form-row">
                    <label>Description (optional)</label>
                    <textarea id="slotDescription" rows="3" placeholder="Notes...">${slot.description || ''}</textarea>
                </div>
            </div>

            <div class="modal-footer">
                <div class="left-actions">
                    ${slot.name ? '<button class="btn-danger" id="slotEditorDeleteBtn">Delete</button>' : ''}
                </div>
                <div class="right-actions">
                    <button class="btn-secondary" id="slotEditorCancelBtn">Cancel</button>
                    <button class="btn-primary" id="slotEditorSaveBtn">Save</button>
                </div>
            </div>
        </div>
    `;

    // show modal
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // set initial selected emoji variable and preview
    selectedSlotEmoji = slot.emoji || selectedSlotEmoji || '📅';
    const preview = modal.querySelector('#selectedEmojiPreview');
    if (preview) preview.textContent = selectedSlotEmoji;

    // event wiring
    const closeBtn = modal.querySelector('#slotEditorCloseBtn');
    const cancelBtn = modal.querySelector('#slotEditorCancelBtn');
    const saveBtn = modal.querySelector('#slotEditorSaveBtn');
    const deleteBtn = modal.querySelector('#slotEditorDeleteBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeSlotEditor);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSlotEditor);
    if (saveBtn) saveBtn.addEventListener('click', () => {
        // update currentEditingSlot values from modal fields then save
        if (!currentEditingSlot) return;
        currentEditingSlot.name = (modal.querySelector('#slotName') || { value: '' }).value.trim();
        currentEditingSlot.emoji = selectedSlotEmoji;
        currentEditingSlot.description = (modal.querySelector('#slotDescription') || { value: '' }).value.trim();
        renderDaySlots(currentEditingSlot.day);
        closeSlotEditor();
        showToast('✅ Slot saved!');
    });
    if (deleteBtn) deleteBtn.addEventListener('click', () => {
        // set currentEditingSlot then delegate
        currentEditingSlot = slot;
        deleteCurrentSlot();
    });

    // emoji interaction (delegated)
    const gridWrapper = modal.querySelector('.emoji-grid-modal-wrapper');
    gridWrapper.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.emoji-btn-modal');
        if (!btn) return;
        const emoji = btn.dataset.emoji;
        // select and update preview + visual state
        selectEmoji(emoji);
        const p = modal.querySelector('#selectedEmojiPreview');
        if (p) p.textContent = emoji;
        modal.querySelectorAll('.emoji-btn-modal.selected').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });

    // category tabs behaviour
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

    // default show first category and highlight selected emoji
    const firstTab = modal.querySelector('.emoji-cat-tab');
    if (firstTab) firstTab.click();
    // highlight currently selected emoji button if present
    modal.querySelectorAll(`.emoji-btn-modal[data-emoji="${selectedSlotEmoji}"]`).forEach(b => b.classList.add('selected'));

    // keyboard: ESC to close
    const keyHandler = (ke) => { if (ke.key === 'Escape') closeSlotEditor(); };
    modal._keyHandler = keyHandler;
    document.addEventListener('keydown', keyHandler);

    // focus input
    setTimeout(() => {
        const input = modal.querySelector('#slotName');
        if (input) input.focus();
    }, 50);
}

function closeSlotEditor() {
    const modal = document.getElementById('slotEditorModal');
    if (!modal) return;

    // rimuovi key handler se impostato
    if (modal._keyHandler) {
        document.removeEventListener('keydown', modal._keyHandler);
        delete modal._keyHandler;
    }

    // togli classe e inline style, rimuovi body lock
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');

    // rimuovi il nodo per evitare listener anonimi residui; verrà ricreato da openSlotEditor
    modal.remove();

    currentEditingSlot = null;
}

function selectEmoji(emoji) {
    // update global selected emoji and any visible previews
    selectedSlotEmoji = emoji;
    const p1 = document.getElementById('selectedEmojiPreview');
    if (p1) p1.textContent = emoji;
    const p2 = document.getElementById('selectedEmoji');
    if (p2) p2.textContent = emoji;
    // also update sport/hobby buttons if present (fallback)
    const sportBtn = document.getElementById('sportEmojiBtn');
    if (sportBtn) sportBtn.textContent = emoji;
    const hobbyBtn = document.getElementById('hobbyEmojiBtn');
    if (hobbyBtn) hobbyBtn.textContent = emoji;
}

function saveSlotEdits() {
    if (!currentEditingSlot) return;
    currentEditingSlot.name = document.getElementById('slotName').value.trim();
    currentEditingSlot.emoji = selectedSlotEmoji;
    currentEditingSlot.description = document.getElementById('slotDescription').value.trim();
    renderDaySlots(currentEditingSlot.day);
    closeSlotEditor();
    showToast('✅ Slot saved!');
}

function deleteCurrentSlot() {
    if (!currentEditingSlot) return;
    if (confirm('Are you sure you want to delete this slot?')) {
        const day = currentEditingSlot.day;
        const slotId = currentEditingSlot.id;
        weeklySlots[day] = weeklySlots[day].filter(s => s.id !== slotId);
        categories[day].forEach(cat => {
            cat.slotIds = cat.slotIds.filter(id => id !== slotId);
        });
        categories[day] = categories[day].filter(cat => cat.slotIds.length > 0);
        renderDaySlots(day);
        closeSlotEditor();
        showToast('🗑️ Slot deleted');
    }
}

function resetCalendar() {
    if (confirm('Are you sure you want to reset the entire calendar?')) {
        slotIdCounter = 0;
        categoryIdCounter = 0;
        selectedSlots.clear();
        dayNames.forEach(day => {
            weeklySlots[day] = [];
            categories[day] = [];
            renderDaySlots(day);
        });
        showToast('🔄 Calendar reset');
    }
}

function openCategoryModal() {
    if (selectedSlots.size < 2) {
        showToast('⚠️ Select at least 2 slots to create a category!');
        return;
    }
    const slots = Array.from(selectedSlots).map(id => {
        for (const day of dayNames) {
            const slot = weeklySlots[day].find(s => s.id === id);
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
    
    document.getElementById('categorySlotsList').textContent = slotsList;
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryModal').classList.remove('hidden');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.add('hidden');
}

function createCategory() {
    const name = document.getElementById('categoryName').value.trim().toUpperCase();
    if (!name) {
        showToast('⚠️ Enter a category name!');
        return;
    }
    const slotsByDay = {};
    for (const slotId of selectedSlots) {
        for (const day of dayNames) {
            const slot = weeklySlots[day].find(s => s.id === slotId);
            if (slot) {
                if (!slotsByDay[day]) slotsByDay[day] = [];
                slotsByDay[day].push(slotId);
                break;
            }
        }
    }
    Object.keys(slotsByDay).forEach(day => {
        categories[day].push({
            id: categoryIdCounter++,
            name,
            slotIds: slotsByDay[day]
        });
    });
    selectedSlots.clear();
    Object.keys(slotsByDay).forEach(day => renderDaySlots(day));
    closeCategoryModal();
    showToast(`✅ Category "${name}" created!`);
}

function viewCategory(category, day) {
    const allCategorySlots = [];
    dayNames.forEach(d => {
        const dayCat = categories[d].find(c => c.name === category.name);
        if (dayCat) {
            const slots = weeklySlots[d].filter(s => dayCat.slotIds.includes(s.id));
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
            categories[d] = categories[d].filter(c => c.name !== category.name);
            renderDaySlots(d);
        });
        showToast('🗑️ Category deleted');
    }
}

function setupDaySelectors() {
    document.querySelectorAll('.days-selector .day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.section');
            const day = this.dataset.day;
            if (section.id === 'section2') {
                if (selectedSportDays.has(day)) {
                    selectedSportDays.delete(day);
                    this.classList.remove('selected');
                } else {
                    selectedSportDays.add(day);
                    this.classList.add('selected');
                }
            } else if (section.id === 'section3') {
                if (selectedHobbyDays.has(day)) {
                    selectedHobbyDays.delete(day);
                    this.classList.remove('selected');
                } else {
                    selectedHobbyDays.add(day);
                    this.classList.add('selected');
                }
            }
        });
    });
}

function initializeEmojiPickers() {
    createEmojiPicker('sportEmojiBtn', 'sportEmojiDropdown', (emoji) => {
        selectedSportEmoji = emoji;
        document.getElementById('sportEmojiBtn').textContent = emoji;
    });
    createEmojiPicker('hobbyEmojiBtn', 'hobbyEmojiDropdown', (emoji) => {
        selectedHobbyEmoji = emoji;
        document.getElementById('hobbyEmojiBtn').textContent = emoji;
    });
}

function initCharCounter() {
    const textarea = document.getElementById('userDescription');
    const counter = document.getElementById('charCount');
    
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }
}

function createEmojiPicker(btnId, dropdownId, onSelect) {
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

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    const progress = ((currentStep - 1) / 3) * 80;
    progressFill.style.width = progress + '%';
}

function goToSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section' + section).classList.add('active');
    currentStep = section;
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addSport(name, emoji, days, startTime, endTime) {
    if (!name) return;
    sports.push({ 
        id: Date.now(), 
        name, 
        emoji: emoji || '⚽',
        days: days || [],
        startTime: startTime || null,
        endTime: endTime || null
    });
    renderSports();
    showToast(`✅ ${emoji} ${name} added!`);
}

function addCustomSport() {
    const name = document.getElementById('sportName').value.trim();
    const startTime = document.getElementById('sportStartTime').value || null;
    const endTime = document.getElementById('sportEndTime').value || null;
    if (!name) {
        showToast('⚠️ Enter the sport name!');
        return;
    }
    if (selectedSportDays.size === 0) {
        showToast('⚠️ Select at least one day!');
        return;
    }
    addSport(name, selectedSportEmoji, Array.from(selectedSportDays), startTime, endTime);
    document.getElementById('sportName').value = '';
    document.getElementById('sportStartTime').value = '';
    document.getElementById('sportEndTime').value = '';
    document.getElementById('sportEmojiBtn').textContent = '⚽';
    selectedSportEmoji = '⚽';
    selectedSportDays.clear();
    document.querySelectorAll('#section2 .day-btn').forEach(d => d.classList.remove('selected'));
}

function renderSports() {
    const container = document.getElementById('sportsList');
    if (sports.length === 0) {
        container.innerHTML = '<p class="empty-state">No sports added yet</p>';
        return;
    }
    container.innerHTML = sports.map(sport => {
        const daysStr = sport.days.map(d => dayNamesDisplay[d]).join(', ');
        const timeStr = sport.startTime && sport.endTime ? ` (${sport.startTime}-${sport.endTime})` : '';
        return `
            <div class="item-tag">
                <span>${sport.emoji} ${sport.name} - ${daysStr}${timeStr}</span>
                <button type="button" onclick="removeSport(${sport.id})">×</button>
            </div>
        `;
    }).join('');
}

function removeSport(sportId) {
    sports = sports.filter(s => s.id !== sportId);
    renderSports();
    showToast('🗑️ Sport removed');
}

function addHobby(name, emoji, days, startTime, endTime) {
    if (!name) return;
    hobbies.push({ 
        id: Date.now(), 
        name, 
        emoji: emoji || '🎨',
        days: days || [],
        startTime: startTime || null,
        endTime: endTime || null
    });
    renderHobbies();
    showToast(`✅ ${emoji} ${name} added!`);
}

function addCustomHobby() {
    const name = document.getElementById('hobbyName').value.trim();
    const startTime = document.getElementById('hobbyStartTime').value || null;
    const endTime = document.getElementById('hobbyEndTime').value || null;
    if (!name) {
        showToast('⚠️ Enter the hobby name!');
        return;
    }
    if (selectedHobbyDays.size === 0) {
        showToast('⚠️ Select at least one day!');
        return;
    }
    addHobby(name, selectedHobbyEmoji, Array.from(selectedHobbyDays), startTime, endTime);
    document.getElementById('hobbyName').value = '';
    document.getElementById('hobbyStartTime').value = '';
    document.getElementById('hobbyEndTime').value = '';
    document.getElementById('hobbyEmojiBtn').textContent = '📚';
    selectedHobbyEmoji = '📚';
    selectedHobbyDays.clear();
    document.querySelectorAll('#section3 .day-btn').forEach(d => d.classList.remove('selected'));
}

function renderHobbies() {
    const container = document.getElementById('hobbiesList');
    if (hobbies.length === 0) {
        container.innerHTML = '<p class="empty-state">No hobbies added yet</p>';
        return;
    }
    container.innerHTML = hobbies.map(hobby => {
        const daysStr = hobby.days.map(d => dayNamesDisplay[d]).join(', ');
        const timeStr = hobby.startTime && hobby.endTime ? ` (${hobby.startTime}-${hobby.endTime})` : '';
        return `
            <div class="item-tag">
                <span>${hobby.emoji} ${hobby.name} - ${daysStr}${timeStr}</span>
                <button type="button" onclick="removeHobby(${hobby.id})">×</button>
            </div>
        `;
    }).join('');
}

function removeHobby(hobbyId) {
    hobbies = hobbies.filter(h => h.id !== hobbyId);
    renderHobbies();
    showToast('🗑️ Hobby removed');
}

async function finishSetup() {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
        showToast('❌ User not found');
        window.location.href = '/login.html';
        return;
    }

    document.getElementById('setupView').classList.add('hidden');
    document.getElementById('loadingView').classList.remove('hidden');

    const userDescription = document.getElementById('userDescription').value.trim();
    const dailyBibleVerse = document.getElementById('dailyBibleVerse').checked;

    const allSlots = [];
    const allCategories = [];
    
    dayNames.forEach(day => {
        weeklySlots[day].forEach(slot => {
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
        
        categories[day].forEach(category => {
            const categorySlots = weeklySlots[day].filter(s => category.slotIds.includes(s.id));
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
        userDescription: userDescription,
        dailyBibleVerse: dailyBibleVerse,
        slots: allSlots,
        categories: allCategories,
        sports: sports.map(s => ({
            name: s.name,
            emoji: s.emoji,
            days: s.days,
            startTime: s.startTime,
            endTime: s.endTime
        })),
        hobbies: hobbies.map(h => ({
            name: h.name,
            emoji: h.emoji,
            days: h.days,
            startTime: h.startTime,
            endTime: h.endTime
        })),
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:3000/api/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                data: scheduleData
            })
        });

        if (response.ok) {
            setTimeout(() => {
                window.location.href = '/pwa/index.html';
            }, 2000);
        } else {
            throw new Error('Onboarding failed');
        }
    } catch (error) {
        console.error('Onboarding error:', error);
        showToast('⚠️ Something went wrong. Redirecting anyway...');
        setTimeout(() => {
            window.location.href = '/pwa/index.html';
        }, 1000);
    }
}

function showToast(message) {
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

document.addEventListener('DOMContentLoaded', () => {
    initializeWeeklyCalendar();
    initializeEmojiPickers();
    setupDaySelectors();
    initCharCounter();
    updateProgress();
    
    document.getElementById('nextToSportsBtn').addEventListener('click', () => goToSection(2));
    document.getElementById('backToScheduleBtn').addEventListener('click', () => goToSection(1));
    document.getElementById('nextToHobbiesBtn').addEventListener('click', () => goToSection(3));
    document.getElementById('backToSportsBtn').addEventListener('click', () => goToSection(2));
    document.getElementById('finishSetupBtn').addEventListener('click', finishSetup);
    document.getElementById('resetCalendarBtn').addEventListener('click', resetCalendar);
    document.getElementById('createCategoryBtn').addEventListener('click', openCategoryModal);
    document.getElementById('clearSelectionBtn').addEventListener('click', clearSelection);
    document.getElementById('closeCategoryModal').addEventListener('click', closeCategoryModal);
    document.getElementById('cancelCategoryBtn').addEventListener('click', closeCategoryModal);
    document.getElementById('saveCategoryBtn').addEventListener('click', createCategory);
    document.getElementById('addSportBtn').addEventListener('click', addCustomSport);
    document.getElementById('addHobbyBtn').addEventListener('click', addCustomHobby);
});