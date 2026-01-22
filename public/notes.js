// --- macOS Notes 多条便签逻辑 (public/notes.js) ---

let notes = [];
let currentNoteId = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. 从本地恢复数据
    const saved = localStorage.getItem('mac_notes_data');
    notes = saved ? JSON.parse(saved) : [];

    // 2. 绑定 DOM 元素
    const textarea = document.getElementById('notes-textarea');
    const listContainer = document.getElementById('notes-sidebar-list');

    // 3. 初始化渲染
    renderNoteList();
    
    // 如果有便签，默认打开第一条
    if (notes.length > 0) {
        selectNote(notes[0].id);
    }

    // 4. 监听输入，实时保存当前便签
    textarea.addEventListener('input', (e) => {
        if (!currentNoteId) return;
        const note = notes.find(n => n.id === currentNoteId);
        if (note) {
            note.content = e.target.value;
            // 取第一行作为标题预览
            note.title = note.content.split('\n')[0].substring(0, 15) || "无标题便签";
            saveToLocal();
            updateSidebarItem(note);
        }
    });
});

// 保存到 localStorage
function saveToLocal() {
    localStorage.setItem('mac_notes_data', JSON.stringify(notes));
}

// 渲染左侧列表
// 在 public/notes.js 中找到此函数并对齐
function renderNoteList() {
    const listContainer = document.getElementById('notes-sidebar-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = notes.map(note => `
        <div class="note-list-item ${note.id === currentNoteId ? 'active' : ''}" 
             id="side-note-${note.id}"
             onclick="selectNote('${note.id}')">
            <div class="note-item-title">${note.title || '新便签'}</div>
            <div class="note-item-date">${note.date}</div>
        </div>
    `).join('');
}

// 选择某条便签
window.selectNote = function(id) {
    currentNoteId = id;
    const note = notes.find(n => n.id === id);
    const textarea = document.getElementById('notes-textarea');
    
    // 切换高亮
    document.querySelectorAll('.note-list-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`side-note-${id}`)?.classList.add('active');
    
    textarea.value = note ? note.content : "";
    textarea.disabled = !note;
};

// 新建便签
window.createNewNote = function() {
    const newNote = {
        id: 'note_' + Date.now(),
        title: '新便签',
        content: '',
        date: new Date().toLocaleDateString()
    };
    notes.unshift(newNote); // 加到最前面
    saveToLocal();
    renderNoteList();
    selectNote(newNote.id);
    document.getElementById('notes-textarea').focus();
};

// 删除当前便签
window.deleteCurrentNote = function() {
    if (!currentNoteId) return;
    if (!confirm('确定要删除这条便签吗？')) return;
    
    notes = notes.filter(n => n.id !== currentNoteId);
    saveToLocal();
    renderNoteList();
    
    if (notes.length > 0) {
        selectNote(notes[0].id);
    } else {
        currentNoteId = null;
        document.getElementById('notes-textarea').value = "";
        document.getElementById('notes-textarea').disabled = true;
    }
};

// 导出当前便签
window.exportNote = function() {
    const content = document.getElementById('notes-textarea').value;
    if (!content) return alert('没内容可导出的');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `便签_${currentNoteId}.txt`;
    a.click();
};

// 局部更新侧边栏标题预览
function updateSidebarItem(note) {
    const item = document.getElementById(`side-note-${note.id}`);
    if (item) {
        item.querySelector('.note-item-title').innerText = note.title;
    }
}