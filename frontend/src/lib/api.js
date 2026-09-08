import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = body.errors ? body.errors.join(', ') : body.error || 'Request failed';
    throw new Error(message);
  }

  return body;
}

export const api = {
  listTasks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (task) => request('/api/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, updates) => request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
