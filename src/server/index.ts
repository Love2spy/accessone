import express from 'express';
import { json } from 'express';
import db from './db';

const app = express();

app.use(json());

// Subcontractors
app.get('/api/subcontractors', (req, res) => {
  const subcontractors = db.prepare('SELECT * FROM subcontractors').all();
  res.json(subcontractors.map(s => ({
    ...s,
    specialties: JSON.parse(s.specialties),
    pastPerformance: JSON.parse(s.past_performance),
    quotes: s.quotes ? JSON.parse(s.quotes) : null,
    statusUpdatedAt: s.status_updated_at,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  })));
});

app.post('/api/subcontractors', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`
    INSERT INTO subcontractors (
      id, name, location, contact, email, specialties, rating, status,
      status_updated_at, notes, past_performance, quotes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.id,
    data.name,
    data.location,
    data.contact,
    data.email,
    JSON.stringify(data.specialties),
    data.rating,
    data.status,
    data.statusUpdatedAt,
    data.notes,
    JSON.stringify(data.pastPerformance),
    data.quotes ? JSON.stringify(data.quotes) : null
  );

  res.json({ id: result.lastInsertRowid, ...data });
});

// Proposals
app.get('/api/proposals', (req, res) => {
  const proposals = db.prepare('SELECT * FROM proposals').all();
  res.json(proposals.map(p => ({
    ...p,
    content: p.content ? JSON.parse(p.content) : null,
    dueDate: p.due_date,
    opportunityId: p.opportunity_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  })));
});

app.post('/api/proposals', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`
    INSERT INTO proposals (
      id, title, opportunity_id, due_date, status, progress, content
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.id,
    data.title,
    data.opportunityId,
    data.dueDate,
    data.status,
    data.progress,
    JSON.stringify(data.content)
  );

  res.json({ id: result.lastInsertRowid, ...data });
});

// Templates
app.get('/api/templates', (req, res) => {
  const templates = db.prepare('SELECT * FROM templates').all();
  res.json(templates.map(t => ({
    ...t,
    tags: JSON.parse(t.tags)
  })));
});

app.post('/api/templates', (req, res) => {
  const data = req.body;
  const stmt = db.prepare(`
    INSERT INTO templates (id, name, category, content, tags)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.id,
    data.name,
    data.category,
    data.content,
    JSON.stringify(data.tags)
  );

  res.json({ id: result.lastInsertRowid, ...data });
});

// Auth
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, company } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, company)
      VALUES (?, ?, ?, ?, ?)
    `);

    const id = crypto.randomUUID();
    stmt.run(id, email, password, name, company);
    
    res.json({ id, email, name, company });
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      company: user.company 
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});