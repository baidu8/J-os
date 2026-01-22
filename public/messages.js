// --- iMessage 模拟逻辑 (public/messages.js) ---

window.sendMessage = function() {
    const input = document.getElementById('msg-input');
    const flow = document.getElementById('chat-flow');
    if (!input || !input.value.trim()) return;

    // 1. 发送你的消息
    const userMsg = input.value;
    appendBubble('outgoing', userMsg);
    input.value = '';

    // 2. 模拟对方正在输入的状态 (可选，增加真实感)
    // 3. 1秒后自动回复
    setTimeout(() => {
        const replies = [
            "收到！我会尽快回复你的。📬",
            "这个 iMessage 界面做得真不赖！",
            "哈哈哈，我也这么觉得。👍",
            "你可以通过邮件联系我：yourname@example.com",
            "现在的天气真不错，不是吗？☁️"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        appendBubble('incoming', randomReply);
    }, 1000);
};

// 核心：动态生成气泡并自动滚动
function appendBubble(type, text) {
    const flow = document.getElementById('chat-flow');
    if (!flow) return;

    const row = document.createElement('div');
    row.className = `bubble-row ${type}`;
    row.innerHTML = `<div class="bubble">${text}</div>`;
    flow.appendChild(row);
    
    // 关键：发完消息后，对话框自动滚到最底部
    flow.scrollTo({
        top: flow.scrollHeight,
        behavior: 'smooth'
    });
}

// 绑定回车键发送
document.addEventListener('keydown', (e) => {
    // 只有当焦点在消息输入框时才触发
    if (e.key === 'Enter' && document.activeElement.id === 'msg-input') {
        sendMessage();
    }
});