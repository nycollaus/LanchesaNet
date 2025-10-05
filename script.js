const authSection = document.getElementById('auth-section');
const chatSection = document.getElementById('chat-section');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');
const messagesDiv = document.getElementById('chat-messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-button');
const userCount = document.getElementById('user-count');
const clearChat = document.getElementById('clear-chat');

const emojis = ['🌟', '🚀', '🪐', '⭐', '🌙', '☄️', '🛸'];

auth.onAuthStateChanged(user => {
    if (user) {
        authSection.style.display = 'none';
        chatSection.style.display = 'block';
        logoutBtn.style.display = 'block';
        loadMessages();
        updateUserCount();
    } else {
        authSection.style.display = 'block';
        chatSection.style.display = 'none';
        logoutBtn.style.display = 'none';
        messagesDiv.innerHTML = '';
    }
});

loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        authError.textContent = 'Preencha e-mail e senha!';
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            authError.textContent = getFriendlyError(error.code);
        });
});

registerBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        authError.textContent = 'Preencha e-mail e senha!';
        return;
    }
    if (password.length < 6) {
        authError.textContent = 'A senha deve ter pelo menos 6 caracteres!';
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .catch(error => {
            authError.textContent = getFriendlyError(error.code);
        });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

function getFriendlyError(code) {
    switch (code) {
        case 'auth/invalid-email': return 'E-mail inválido!';
        case 'auth/user-not-found': return 'Usuário não encontrado!';
        case 'auth/wrong-password': return 'Senha incorreta!';
        case 'auth/email-already-in-use': return 'E-mail já está em uso!';
        case 'auth/weak-password': return 'A senha é muito fraca!';
        default: return 'Erro: ' + code;
    }
}

function loadMessages() {
    database.ref('messages').orderByChild('timestamp').limitToLast(50).on('value', snapshot => {
        messagesDiv.innerHTML = '';
        snapshot.forEach(child => {
            const msg = child.val();
            const div = document.createElement('div');
            div.className = 'message';
            div.innerHTML = `<strong>${sanitize(msg.user || 'Estelar Anônimo')}</strong> ${getRandomEmoji()}: ${sanitize(msg.text)}`;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, error => {
        console.error('Erro ao carregar mensagens:', error);
    });
}

function sendMessage() {
    const text = input.value.trim();
    if (!text || !auth.currentUser) return;
    
    const user = auth.currentUser.email.split('@')[0];
    const msg = {
        text: text.substring(0, 200),
        user,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    database.ref('messages').push(msg).catch(error => {
        console.error('Erro ao enviar mensagem:', error);
    });
    input.value = '';
}

function getRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function updateUserCount() {
    database.ref('users').on('value', snapshot => {
        const count = snapshot.numChildren();
        userCount.textContent = `Usuários online: ${count}`;
    }, error => {
        console.error('Erro ao atualizar contagem de usuários:', error);
    });
    if (auth.currentUser) {
        const userRef = database.ref('users/' + auth.currentUser.uid);
        userRef.set({ lastActive: firebase.database.ServerValue.TIMESTAMP });
        userRef.onDisconnect().remove();
    }
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
    if (auth.currentUser && confirm('Limpar todo o histórico cósmico?')) {
        database.ref('messages').remove().catch(error => {
            console.error('Erro ao limpar mensagens:', error);
        });
    }
});