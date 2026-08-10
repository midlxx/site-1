async function loadData() {
  try {
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const serverData = await response.json();
    window.users = serverData.users || [];
    window.tickets = serverData.tickets || [];

    console.log('Данные успешно загружены из data.json');
  } catch (error) {
    console.error('Критическая ошибка загрузки данных:', error);
    // Резервные данные: только админ
    window.users = [{ username: 'admin', password: 'admin', isAdmin: true }];
    window.tickets = [];
  }
}

async function saveData() {
  const data = { users: window.users, tickets: window.tickets };

  try {
    // Попытка сохранить через fetch (работает только на сервере)
    const response = await fetch('data.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      console.log('Данные успешно сохранены в data.json');
    } else {
      throw new Error('Ошибка сохранения: ' + response.status);
    }
  } catch (error) {
    console.warn('Сохранение не удалось (требуется сервер):', error);
    // Для локальной разработки сохраняем в LocalStorage
    localStorage.setItem('chatAppData', JSON.stringify(data));
    console.log('Данные сохранены в LocalStorage');
  }
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
    console.log('Загруженные пользователи:', window.users);

    const user = window.users.find(u =>
      u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', username);
      console.log('Успешный вход пользователя:', username);

      if (username === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    } else {
      console.warn('Неверный логин или пароль для:', username);
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
    const existingUser = window.users.find(u => u.username === username);

    if (existingUser) {
      alert('Пользователь с таким логином уже существует!');
      return;
    }

    window.users.push({
      username: username,
      password: password,
      isAdmin: false
    });

    saveData().then(() => {
      alert('Регистрация успешна! Теперь войдите в систему.');
      window.location.href = 'index.html';
    });
  });
}
