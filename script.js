const socket = io('BACKEND_URL'); // Substitua por sua URL do Vercel (ex: https://chat-cosmico-backend.vercel.app)
const messagesDiv = document.getElementById('chat-messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-button');
const userCount = document.getElementById('user-count');
const clearChat = document.getElementById('clear-chat');

const emojis = ['🌟', '🚀', '🪐', '⭐', '🌙', '☄️', '🛸'];

function loadMessages() {
    socket.on('message', (data) => {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `<strong>${sanitize(data.user || 'Estelar Anônimo')}</strong> ${getRandomEmoji()}: ${sanitize(data.text)}`;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    const user = `Estelar ${Math.floor(Math.random() * 1000)}`;
    socket.emit('message', { user, text });
    input.value = '';
}

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function updateUserCount() {
    socket.on('userCount', (count) => {
        userCount.textContent = `Usuários online: ${count}`;
    });
}

function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

clearChat.addEventListener('click', () => {
    if (confirm('Limpar todo o histórico cósmico?')) {
        socket.emit('clearChat');
        messagesDiv.innerHTML = '';
    }
});

loadMessages();
updateUserCount();