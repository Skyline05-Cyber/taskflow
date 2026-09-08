import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import TaskForm from '../components/TaskForm';
import TaskRow from '../components/TaskRow';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const { tasks: fetched } = await api.listTasks(params);
      setTasks(fetched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  async function handleCreate(task) {
    const { task: created } = await api.createTask(task);
    setTasks((prev) => [created, ...prev]);
  }

  async function handleToggle(task) {
    const previous = tasks;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, is_complete: !t.is_complete } : t)));
    try {
      await api.updateTask(task.id, { is_complete: !task.is_complete });
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(task.id);
    } catch (err) {
      setTasks(previous);
      setError(err.message);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="brand">TaskFlow</div>
        <div>
          <span className="subtitle" style={{ marginRight: '1rem' }}>{user?.email}</span>
          <button type="button" className="secondary" onClick={handleSignOut}>Log out</button>
        </div>
      </div>

      <h1>Your tasks</h1>
      <p className="subtitle">Visible only to you — enforced at the database level.</p>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm onCreate={handleCreate} />

      <div className="toolbar">
        <div className="filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="incomplete">Incomplete</option>
            <option value="complete">Complete</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="subtitle">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>Nothing here yet. Add your first task above.</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
