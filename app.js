// tapTrack - Main Application

// ================== State ==================
let state = {
    isTracking: false,
    startTime: null,
    checkInTime: null,
    records: [],
    selectedTags: [],
    format: 'minute',
    theme: 'light',
    lang: 'en'
};

// ================== i18n ==================
const i18n = {
    en: {
        tagline: "Track your time, understand your life",
        displayFormat: "Display Format:",
        formatMinute: "Minute",
        formatHour: "Hour",
        formatTomato: "Tomato Clock",
        formatSecond: "Second",
        checkIn: "Check In",
        checkOut: "Check Out",
        readyToTrack: "Ready to track",
        idleStatus: "⏸️ Idle - Click Check In to start",
        trackingStatus: "⏱️ Recording...",
        todayRecords: "Today's Records",
        noRecords: "No records yet today",
        analytics: "Time Analytics",
        dailyTrend: "Daily Trend (Last 14 Days)",
        timeDistribution: "Time Distribution",
        totalToday: "Total Today",
        avgSession: "Avg Session",
        sessions: "Sessions",
        longest: "Longest",
        weeklyAvg: "This Day Avg",
        insights: "Insights",
        needMoreData: "Track more to get insights",
        sessionComplete: "Session Complete!",
        timeAdjustment: "Time Adjustment:",
        comment: "Comment",
        voiceNote: "Voice Note",
        startRecording: "Start Recording",
        stopRecording: "Stop Recording",
        tags: "Tags",
        save: "Save",
        skip: "Skip",
        checkInFirst: "Click Check In to start",
        nowTracking: "Now tracking...",
        exportSuccess: "Data exported!",
        importSuccess: "Data imported!",
        importError: "Import failed"
    },
    zh: {
        tagline: "记录时间，理解生活",
        displayFormat: "显示格式：",
        formatMinute: "分钟",
        formatHour: "小时",
        formatTomato: "番茄钟",
        formatSecond: "秒",
        checkIn: "签到",
        checkOut: "签退",
        readyToTrack: "准备记录",
        idleStatus: "⏸️ 点击签到开始",
        trackingStatus: "⏱️ 记录中...",
        todayRecords: "今日记录",
        noRecords: "今天还没有记录",
        analytics: "时间分析",
        dailyTrend: "每日趋势",
        timeDistribution: "时间分布",
        totalToday: "今日总计",
        avgSession: "平均时长",
        sessions: "次数",
        longest: "最长",
        weeklyAvg: "本周平均",
        insights: "洞察",
        needMoreData: "记录更多获得洞察",
        sessionComplete: "会话完成！",
        timeAdjustment: "时间调整：",
        comment: "备注",
        voiceNote: "语音备注",
        startRecording: "开始录音",
        stopRecording: "停止录音",
        tags: "标签",
        save: "保存",
        skip: "跳过",
        checkInFirst: "点击签到开始",
        nowTracking: "正在记录...",
        exportSuccess: "导出成功！",
        importSuccess: "导入成功！",
        importError: "导入失败"
    }
};

const quotes = {
    en: [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
        { text: "Lost time is never found again.", author: "Benjamin Franklin" },
        { text: "The future depends on what you do today.", author: "Gandhi" },
        { text: "Don't watch the clock; keep going.", author: "Sam Levenson" },
        { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" }
    ],
    zh: [
        { text: "种一棵树最好的时间是十年前，其次是现在。", author: "谚语" },
        { text: "时间就像海绵里的水，只要愿挤，总还是有的。", author: "鲁迅" },
        { text: "完成工作的方法是爱惜每一分钟。", author: "达尔文" },
        { text: "你热爱生命吗？那就不要浪费时间。", author: "富兰克林" },
        { text: "千里之行，始于足下。", author: "老子" },
        { text: "今日事今日毕。", author: "谚语" }
    ]
};

const STORAGE_KEY = 'taptrack_records';
const THEME_KEY = 'taptrack_theme';
const LANG_KEY = 'taptrack_lang';
const COLOR_KEY = 'taptrack_color';

// ================== DOM Elements ==================
const checkInBtn = document.getElementById('check-in-btn');
const checkOutBtn = document.getElementById('check-out-btn');
const formatSelect = document.getElementById('format-select');
const statusEl = document.getElementById('session-status');
const recordsList = document.getElementById('records-list');
const commentModal = document.getElementById('comment-modal');
const commentInput = document.getElementById('comment-input');
const voiceBtn = document.getElementById('voice-btn');
const voiceStatus = document.getElementById('voice-status');
const voiceIcon = document.getElementById('voice-icon');
const voiceText = document.getElementById('voice-text');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const sessionDurationDisplay = document.getElementById('session-duration-display');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const colorPicker = document.getElementById('color-picker');
const adjustHours = document.getElementById('adjust-hours');
const adjustMinutes = document.getElementById('adjust-minutes');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    loadRecords();
    updateStats();
    updateI18n();
    updateQuote();
    setupEventListeners();
});

function loadState() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', state.theme);
        themeToggle.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    }
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang) {
        state.lang = savedLang;
        document.documentElement.lang = state.lang;
    }
    const savedColor = localStorage.getItem(COLOR_KEY);
    if (savedColor) {
        applyThemeColor(savedColor);
        colorPicker.value = savedColor;
    }
}

function applyThemeColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-dark', adjustBrightness(color, -20));
}

function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0xFF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0xFF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function setupEventListeners() {
    checkInBtn.addEventListener('click', checkIn);
    checkOutBtn.addEventListener('click', checkOut);
    formatSelect.addEventListener('change', (e) => {
        state.format = e.target.value;
        localStorage.setItem('taptrack_format', state.format);
    });
    formatSelect.value = localStorage.getItem('taptrack_format') || 'minute';
    state.format = formatSelect.value;
    themeToggle.addEventListener('click', toggleTheme);
    langToggle.addEventListener('click', toggleLang);
    colorPicker.addEventListener('input', (e) => applyThemeColor(e.target.value));
    colorPicker.addEventListener('change', (e) => localStorage.setItem(COLOR_KEY, e.target.value));
    exportBtn.addEventListener('click', exportToMarkdown);
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', importFromMarkdown);
    saveBtn.addEventListener('click', saveSession);
    cancelBtn.addEventListener('click', skipSession);
    setupTagInput();
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            if (state.selectedTags.includes(tag)) {
                removeTag(tag);
                btn.classList.remove('selected');
            } else {
                addTag(tag);
                btn.classList.add('selected');
            }
        });
    });
    voiceBtn.addEventListener('click', toggleVoiceRecording);
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    themeToggle.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, state.theme);
}

function toggleLang() {
    state.lang = state.lang === 'en' ? 'zh' : 'en';
    document.documentElement.lang = state.lang;
    localStorage.setItem(LANG_KEY, state.lang);
    updateI18n();
}

function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[state.lang][key]) el.textContent = i18n[state.lang][key];
    });
    document.querySelectorAll('#format-select option').forEach(opt => {
        const key = opt.getAttribute('data-i18n');
        if (key && i18n[state.lang][key]) opt.textContent = i18n[state.lang][key];
    });
}

function checkIn() {
    state.isTracking = true;
    state.checkInTime = Date.now();
    checkInBtn.disabled = true;
    checkOutBtn.disabled = false;
    statusEl.textContent = i18n[state.lang].nowTracking;
    statusEl.classList.add('active');
    updateQuote();
}

function checkOut() {
    state.isTracking = false;
    const endTime = Date.now();
    const rawDuration = Math.floor((endTime - state.checkInTime) / 1000);
    sessionDurationDisplay.textContent = `Duration: ${Math.floor(rawDuration / 60)}m`;
    commentModal.classList.add('show');
    checkInBtn.disabled = false;
    checkOutBtn.disabled = true;
    statusEl.textContent = i18n[state.lang].checkInFirst;
    statusEl.classList.remove('active');
    updateQuote();
}

function updateQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const langQuotes = quotes[state.lang];
    const q = langQuotes[Math.floor(Math.random() * langQuotes.length)];
    quoteText.textContent = `"${q.text}"`;
    quoteAuthor.textContent = `- ${q.author}`;
}

function saveSession() {
    const endTime = Date.now();
    const rawDuration = Math.floor((endTime - state.checkInTime) / 1000);
    const adjustSec = (parseInt(adjustHours.value) || 0) * 3600 + (parseInt(adjustMinutes.value) || 0) * 60;
    const duration = Math.max(0, rawDuration - adjustSec);
    
    const record = {
        id: Date.now(),
        startTime: state.checkInTime,
        endTime: endTime,
        rawDuration: rawDuration,
        duration: duration,
        adjustSeconds: adjustSec,
        comment: commentInput.value.trim(),
        tags: [...state.selectedTags]
    };
    
    state.records.push(record);
    saveRecords();
    resetModal();
    updateRecordsList();
    updateStats();
    generateRecommendations();
    updateQuote();
}

function skipSession() {
    const endTime = Date.now();
    const rawDuration = Math.floor((endTime - state.checkInTime) / 1000);
    const adjustSec = (parseInt(adjustHours.value) || 0) * 3600 + (parseInt(adjustMinutes.value) || 0) * 60;
    const duration = Math.max(0, rawDuration - adjustSec);
    
    state.records.push({
        id: Date.now(),
        startTime: state.checkInTime,
        endTime: endTime,
        rawDuration: rawDuration,
        duration: duration,
        adjustSeconds: adjustSec,
        comment: '',
        tags: []
    });
    saveRecords();
    resetModal();
    updateRecordsList();
    updateStats();
    generateRecommendations();
    updateQuote();
}

function resetModal() {
    commentModal.classList.remove('show');
    commentInput.value = '';
    adjustHours.value = 0;
    adjustMinutes.value = 0;
    state.selectedTags = [];
    updateTagsDisplay();
    document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
    stopVoiceRecording();
}

function setupTagInput() {
    const input = document.getElementById('tag-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                addTag(input.value.trim());
                input.value = '';
            }
        });
    }
}

function addTag(tag) {
    if (!state.selectedTags.includes(tag)) {
        state.selectedTags.push(tag);
        updateTagsDisplay();
    }
}

function removeTag(tag) {
    state.selectedTags = state.selectedTags.filter(t => t !== tag);
    updateTagsDisplay();
}

function updateTagsDisplay() {
    const container = document.getElementById('tags-container');
    if (!container) return;
    container.innerHTML = state.selectedTags.map(tag => `
        <span class="tag">${tag}<span class="tag-remove" onclick="removeTag('${tag}')">×</span></span>
    `).join('') + '<input type="text" id="tag-input" placeholder="Add tag...">';
    setupTagInput();
}

let recognition = null;
let isRecording = false;

function toggleVoiceRecording() {
    if (isRecording) stopVoiceRecording();
    else startVoiceRecording();
}

function startVoiceRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        voiceStatus.textContent = 'Not supported';
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        commentInput.value = transcript;
    };
    recognition.start();
    isRecording = true;
    voiceBtn.classList.add('recording');
    voiceIcon.textContent = '⏹️';
    voiceText.textContent = i18n[state.lang].stopRecording;
    voiceStatus.textContent = 'Recording...';
}

function stopVoiceRecording() {
    if (recognition) { recognition.stop(); recognition = null; }
    isRecording = false;
    voiceBtn.classList.remove('recording');
    voiceIcon.textContent = '🎤';
    voiceText.textContent = i18n[state.lang].startRecording;
    if (voiceStatus.textContent === 'Recording...') voiceStatus.textContent = '';
}

function loadRecords() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) state.records = JSON.parse(saved);
    } catch (e) { console.error(e); }
    updateRecordsList();
    generateRecommendations();
}

function saveRecords() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records)); } catch (e) { console.error(e); }
}

function updateRecordsList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = state.records.filter(r => {
        const d = new Date(r.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    
    if (todayRecords.length === 0) {
        recordsList.innerHTML = `<p class="empty-state">${i18n[state.lang].noRecords}</p>`;
        return;
    }
    
    recordsList.innerHTML = todayRecords.slice().reverse().map(r => {
        const t = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
        <div class="record-item">
            <div>
                <div class="record-time">${t}</div>
                <div class="record-duration">${Math.floor(r.duration / 60)}m</div>
                ${r.comment ? `<div class="record-comment">"${r.comment}"</div>` : ''}
                ${r.tags.length ? `<div class="record-tags">${r.tags.map(tag => `<span class="record-tag">${tag}</span>`).join('')}</div>` : ''}
            </div>
        </div>`;
    }).join('');
}

function updateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = state.records.filter(r => {
        const d = new Date(r.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    
    if (todayRecords.length === 0) {
        ['total-time', 'avg-session', 'session-count', 'longest-session', 'weekly-avg'].forEach(id => document.getElementById(id).textContent = '0');
        return;
    }
    
    const totalSec = todayRecords.reduce((sum, r) => sum + r.duration, 0);
    const avgSec = totalSec / todayRecords.length;
    const longestSec = Math.max(...todayRecords.map(r => r.duration));
    const dayOfWeek = today.getDay();
    const sameDayRecords = state.records.filter(r => new Date(r.startTime).getDay() === dayOfWeek);
    const weeklyAvg = sameDayRecords.length > 0 ? Math.floor(sameDayRecords.reduce((sum, r) => sum + r.duration, 0) / sameDayRecords.length / 60) : 0;
    
    document.getElementById('total-time').textContent = Math.floor(totalSec / 60);
    document.getElementById('avg-session').textContent = Math.round(avgSec / 60);
    document.getElementById('session-count').textContent = todayRecords.length;
    document.getElementById('longest-session').textContent = Math.floor(longestSec / 60);
    document.getElementById('weekly-avg').textContent = weeklyAvg;
    
    updateDailyChart();
    updateDistributionChart();
}

function updateDailyChart() {
    const ctx = document.getElementById('daily-chart');
    if (!ctx) return;
    const days = [], data = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dayStr = d.toLocaleDateString(state.lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' });
        const dayRecords = state.records.filter(r => {
            const rd = new Date(r.startTime);
            rd.setHours(0, 0, 0, 0);
            return rd.getTime() === d.getTime();
        });
        days.push(dayStr);
        data.push(Math.round(dayRecords.reduce((s, r) => s + r.duration, 0) / 60));
    }
    if (window.dailyChart) window.dailyChart.destroy();
    window.dailyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{ label: 'Minutes', data: data, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', borderWidth: 3, fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
}

function updateDistributionChart() {
    const ctx = document.getElementById('distribution-chart');
    if (!ctx) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = state.records.filter(r => {
        const d = new Date(r.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    let morning = 0, afternoon = 0, evening = 0;
    todayRecords.forEach(r => {
        const hour = new Date(r.startTime).getHours();
        const dur = r.duration / 60;
        if (hour >= 6 && hour < 12) morning += dur;
        else if (hour >= 12 && hour < 18) afternoon += dur;
        else evening += dur;
    });
    const labels = state.lang === 'zh' ? ['上午', '下午', '晚上'] : ['Morning', 'Afternoon', 'Evening'];
    if (window.distChart) window.distChart.destroy();
    window.distChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{ data: morning + afternoon + evening > 0 ? [morning, afternoon, evening] : [1, 1, 1], backgroundColor: ['#f59e0b', '#22c55e', '#6366f1'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

function generateRecommendations() {
    const container = document.getElementById('recommendations');
    if (state.records.length < 3) {
        container.innerHTML = `<p class="empty-state">${i18n[state.lang].needMoreData}</p>`;
        return;
    }
    const recommendations = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecords = state.records.filter(r => {
        const d = new Date(r.startTime);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    if (todayRecords.length > 0) {
        const totalMin = todayRecords.reduce((s, r) => s + r.duration, 0) / 60;
        if (totalMin >= 240) recommendations.push({ type: 'success', icon: '🎉', title: 'Great!', content: `${Math.round(totalMin)} min today` });
        else if (totalMin < 60) recommendations.push({ type: 'warning', icon: '📌', title: 'Low activity', content: 'Track more!' });
    }
    const allTags = state.records.flatMap(r => r.tags);
    const tagCounts = {};
    allTags.forEach(tag => tagCounts[tag] = (tagCounts[tag] || 0) + 1);
    const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTag && topTag[1] >= 3) recommendations.push({ type: 'info', icon: '🏷️', title: 'Top', content: `"${topTag[0]}"` });
    
    container.innerHTML = recommendations.map(r => `
    <div class="recommendation-item ${r.type}">
        <div class="rec-icon">${r.icon}</div>
        <div class="rec-content"><h4>${r.title}</h4><p>${r.content}</p></div>
    </div>`).join('');
}

// ================== Export/Import ==================
function exportToMarkdown() {
    if (state.records.length === 0) {
        alert(state.lang === 'zh' ? '没有数据' : 'No data');
        return;
    }
    const sorted = [...state.records].sort((a, b) => b.startTime - a.startTime);
    let md = `# tapTrack Records\n\nExported: ${new Date().toLocaleString()}\n\n---\n\n`;
    
    const grouped = {};
    sorted.forEach(r => {
        const date = new Date(r.startTime).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(r);
    });
    
    Object.entries(grouped).forEach(([date, recs]) => {
        const dayTotal = recs.reduce((s, r) => s + r.duration, 0);
        md += `## ${date} (${Math.floor(dayTotal / 60)} min)\n\n`;
        recs.forEach(r => {
            const start = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const end = new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            md += `### ${start} - ${end} (${Math.floor(r.duration / 60)} min)\n`;
            if (r.comment) md += `> ${r.comment}\n`;
            if (r.tags.length) md += `**Tags:** ${r.tags.join(', ')}\n`;
            md += '\n';
        });
    });
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `taptrack-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    alert(i18n[state.lang].exportSuccess);
}

function importFromMarkdown(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const records = parseMarkdown(e.target.result);
            if (records.length === 0) { alert(i18n[state.lang].importError); return; }
            const existing = new Set(state.records.map(r => r.id));
            const newRecs = records.filter(r => !existing.has(r.id));
            state.records = [...state.records, ...newRecs];
            saveRecords();
            updateRecordsList();
            updateStats();
            generateRecommendations();
            alert(`${i18n[state.lang].importSuccess} (${newRecs.length})`);
        } catch (err) { alert(i18n[state.lang].importError); }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function parseMarkdown(content) {
    const records = [];
    const lines = content.split('\n');
    const timePattern = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*\((\d+)\s*min\)/;
    let currentDate = null;
    
    lines.forEach(line => {
        const dateMatch = line.match(/## (\d{4}-\d{2}-\d{2})/);
        if (dateMatch) { currentDate = new Date(dateMatch[1]); return; }
        const match = line.match(timePattern);
        if (match && currentDate) {
            const [sh, sm] = match[1].split(':').map(Number);
            const [eh, em] = match[2].split(':').map(Number);
            const start = new Date(currentDate); start.setHours(sh, sm, 0, 0);
            const end = new Date(currentDate); end.setHours(eh, em, 0, 0);
            records.push({
                id: Date.now() + Math.random() * 1000,
                startTime: start.getTime(),
                endTime: end.getTime(),
                rawDuration: parseInt(match[3]) * 60,
                duration: parseInt(match[3]) * 60,
                adjustSeconds: 0,
                comment: '',
                tags: []
            });
        }
    });
    return records;
}