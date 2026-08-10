async function loadData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const serverData = await response.json();
    window.users = serverData.users || [];
    window.tickets = serverData.tickets || [];
  } catch (error) {
    console.error('Критическая ошибка загрузки данных:', error);
    window.users = [{ username: 'admin', password: 'admin', isAdmin: true }];
    window.tickets = [];
  }
}

async function register(event) {
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

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
      alert('Регистрация успешна! Теперь войдите в систему.');
      window.location.href = 'index.html';
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    alert('Ошибка сети. Проверьте сервер.');
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

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('currentUser', username);
      if (data.isAdmin) {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'user.html';
      }
    } else {
      alert(data.error);
    }
  })
  .catch(error => {
    console.error('Ошибка входа:', error);
    alert('Ошибка сети. Проверьте сервер.');
  });
}
