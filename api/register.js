import { createClient } from '@supabase/supabase-js';

// Создаем клиент Supabase
// ВАЖНО: Для API-роутов используем SUPABASE_SECRET_KEY
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Экспортируем обработчик (стандартный формат Next.js)
export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен. Используйте POST.' });
  }

  // Получаем данные из тела запроса
  const { username, password } = req.body;

  // Валидация: проверяем, что поля заполнены
  if (!username || !password) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все поля!' });
  }

  try {
    // 1. Проверяем, не существует ли уже пользователь с таким логином
    const { data: existingUser, error: checkError } = await supabase
      .from('users') // <-- Укажите точное имя вашей таблицы в Supabase
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким логином уже зарегистрирован.' });
    }

    // 2. Создаем нового пользователя в базе данных Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          password: password, // ВНИМАНИЕ: В реальном проекте здесь должен быть хеш пароля!
          is_admin: false
        }
      ])
      .select();

    if (error) {
      console.error('Ошибка при сохранении в БД:', error);
      return res.status(500).json({ error: 'Произошла ошибка при регистрации.' });
    }

    // 3. Успешный ответ
    res.status(201).json({
      success: true,
      message: 'Регистрация прошла успешно!',
      user: data
    });

  } catch (error) {
    console.error('Критическая ошибка сервера:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера.' });
  }
}
