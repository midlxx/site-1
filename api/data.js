const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    res.status(500).json({ users: [], tickets: [] });
  }
};
