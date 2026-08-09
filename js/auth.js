async function loadData() {
  try {
    const response = await fetch('https://ваш-хостинг/data.json');
    const serverData = await response.json();
    window.users = serverData.users || [];
    window.messages = serverData.messages || [];
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    window.users = [{ username: 'admin', password: 'admin', isAdmin: true }];
    window.messages = [];
  }
}

async function saveData() {
  const data = { users: window.users, messages: window.messages };
  console.warn('Сохранение на облачный диск требует API‑доступа');
  // В текущей реализации сохранение не выполняется — требуется настройка сервера/API
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  loadData().then(() => {
    const user = window.users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', username);
      if (username === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    } else {
      alert('Неверный логин или пароль!');
    }
  });
}
