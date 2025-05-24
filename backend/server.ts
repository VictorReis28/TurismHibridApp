import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

dotenv.config({ path: '../database/.env' });

async function main() {
  const fastify = Fastify();
  fastify.register(cors, { origin: '*' });

  const db = await mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // --- Auth ---
  fastify.post('/auth/register', async (req, reply) => {
    const { email, password, name } = req.body as any;
    if (!email || !password || !name)
      return reply.status(400).send({ message: 'Campos obrigatórios' });
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [
      email,
    ]);
    if ((rows as any[]).length > 0)
      return reply.status(400).send({ message: 'Email já cadastrado' });
    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await db.query(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [id, email, hash, name]
    );
    return reply.send({ user: { id, email, name } });
  });

  fastify.post('/auth/login', async (req, reply) => {
    const { email, password } = req.body as any;
    const [rows] = await db.query(
      'SELECT id, email, name, password, avatar FROM users WHERE email = ?',
      [email]
    );
    const user = (rows as any[])[0];
    if (!user)
      return reply.status(400).send({ message: 'Usuário não encontrado' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.status(400).send({ message: 'Senha incorreta' });
    delete user.password;
    return reply.send({ user });
  });

  // --- Biometria ---
  fastify.get('/users/:id/biometrics', async (req, reply) => {
    const { id } = req.params as any;
    const [rows] = await db.query(
      'SELECT enabled FROM user_biometrics WHERE user_id = ?',
      [id]
    );
    return reply.send({ enabled: (rows as any[])[0]?.enabled || false });
  });

  fastify.put('/users/:id/biometrics', async (req, reply) => {
    const { id } = req.params as any;
    const { enabled } = req.body as any;
    await db.query(
      'INSERT INTO user_biometrics (user_id, enabled) VALUES (?, ?) ON DUPLICATE KEY UPDATE enabled = ?',
      [id, !!enabled, !!enabled]
    );
    return reply.send({ enabled: !!enabled });
  });

  // --- Avatar ---
  fastify.put('/users/:id/avatar', async (req, reply) => {
    const { id } = req.params as any;
    const { avatar } = req.body as any;
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatar, id]);
    return reply.send({ success: true });
  });

  // --- Atrações ---
  fastify.get('/attractions', async (req, reply) => {
    const [rows] = await db.query(
      `SELECT a.id, a.name, a.description, a.image, a.rating, a.reviews, c.name as category, a.latitude, a.longitude
       FROM attractions a
       LEFT JOIN categories c ON a.category_id = c.id`
    );
    return reply.send(rows);
  });

  fastify.post('/attractions', async (req, reply) => {
    const { name, description, category, image, latitude, longitude } =
      req.body as any;
    if (!name || !description || !category || !latitude || !longitude)
      return reply.status(400).send({ message: 'Campos obrigatórios' });
    // Buscar id da categoria
    const [catRows] = await db.query(
      'SELECT id FROM categories WHERE name = ?',
      [category]
    );
    const category_id = (catRows as any[])[0]?.id;
    if (!category_id)
      return reply.status(400).send({ message: 'Categoria inválida' });
    const id = randomUUID();
    await db.query(
      'INSERT INTO attractions (id, name, description, image, category_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, image, category_id, latitude, longitude]
    );
    return reply.send({ id });
  });

  fastify.delete('/attractions', async (req, reply) => {
    const { ids } = req.body as any;
    if (!Array.isArray(ids) || ids.length === 0)
      return reply.status(400).send({ message: 'IDs obrigatórios' });
    await db.query('DELETE FROM attractions WHERE id IN (?)', [ids]);
    return reply.send({ success: true });
  });

  // --- Categorias ---
  fastify.post('/categories', async (req, reply) => {
    const { name } = req.body as any;
    if (!name) return reply.status(400).send({ message: 'Nome obrigatório' });
    const [rows] = await db.query('SELECT id FROM categories WHERE name = ?', [
      name,
    ]);
    if ((rows as any[]).length > 0)
      return reply.status(400).send({ message: 'Categoria já existe' });
    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return reply.send({ success: true });
  });

  // --- Inicialização ---
  fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Fastify server rodando em ${address}`);
  });
}

main().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
  process.exit(1);
});
