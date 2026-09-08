import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import { validateTaskInput, PRIORITIES } from './validateTaskInput.js';

export { validateTaskInput };

export async function listTasks(req, res) {
  const { status, priority, sort = 'created_at', order = 'desc' } = req.query;

  let query = supabaseAdmin
    .from('tasks')
    .select('*')
    .eq('user_id', req.user.id);

  if (status === 'complete') query = query.eq('is_complete', true);
  if (status === 'incomplete') query = query.eq('is_complete', false);
  if (priority && PRIORITIES.has(priority)) query = query.eq('priority', priority);

  // whitelist sort columns so we're not just passing whatever the client sends
  // straight into the query builder
  const sortableColumns = new Set(['created_at', 'due_date', 'priority', 'title']);
  const sortColumn = sortableColumns.has(sort) ? sort : 'created_at';
  query = query.order(sortColumn, { ascending: order === 'asc' });

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Failed to load tasks' });
  res.json({ tasks: data });
}

export async function createTask(req, res) {
  const errors = validateTaskInput(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const { title, description = null, priority = 'medium', due_date = null } = req.body;

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert({ user_id: req.user.id, title: title.trim(), description, priority, due_date })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Failed to create task' });
  res.status(201).json({ task: data });
}

export async function updateTask(req, res) {
  const { id } = req.params;
  const errors = validateTaskInput(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });

  const allowedFields = ['title', 'description', 'priority', 'due_date', 'is_complete'];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (updates.title) updates.title = updates.title.trim();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id) // without this a user could PATCH someone else's task id
    .select()
    .maybeSingle(); // maybeSingle, not single — a mismatched id/owner is a 404, not a 500

  if (error) return res.status(500).json({ error: 'Failed to update task' });
  if (!data) return res.status(404).json({ error: 'Task not found' });
  res.json({ task: data });
}

export async function deleteTask(req, res) {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Failed to delete task' });
  if (!data) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
}
