const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Заполните все поля!' });
  }

  try {
    const dataPath = path.join(__dirname, '../data.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

    // Проверяем, существует ли пользователь
    const existingUser = data.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким логином уже существует!' });
    }

    // Добавляем нового пользователя
    data.users.push({
      username: username,
      password: password,
      isAdmin: false
    });

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

    res.json({ success: true, message: 'Регистрация успешна!' });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
