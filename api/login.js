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

    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
      res.json({
        success: true,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401).json({ error: 'Неверный логин или пароль!' });
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
