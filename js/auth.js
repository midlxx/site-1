async function loadData() {
  try {
    const response = await fetch('data.json');
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
}

function login(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Заполните все поля!');
    return;
  }

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

function register(event) {
  event.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (!username || !password || !confirmPassword) {
    alert('Заполните все поля!');
    return;
  }

  if (password !== confirmPassword) {
    alert('Пароли не совпадают!');
    return;
  }

  loadData().then(() => {
    // Проверяем, существует ли пользователь
    const existingUser = window.users.find(u => u.username === username);

    if (existingUser) {
      alert('Пользователь с таким логином уже существует!');
      return;
    }

    // Добавляем нового пользователя
    window.users.push({
      username: username,
    // Добавляем нового пользователя
    window.users.push({
      username: username,
      password: password,
      isAdmin: false
    });

    saveData();

    alert('Регистрация успешна! Теперь войдите в систему.');
    window.location.href = 'index.html';
  });
}
