import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onCreate({ title: title.trim(), priority, due_date: dueDate || null });
      setTitle('');
      setPriority('medium');
      setDueDate('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field" style={{ flexGrow: 3 }}>
        <label htmlFor="new-task-title">New task</label>
        <input
          id="new-task-title"
          type="text"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>
      <div className="field">
        <label htmlFor="new-task-priority">Priority</label>
        <select id="new-task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="new-task-due">Due date</label>
        <input id="new-task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <button type="submit" disabled={submitting || !title.trim()}>Add task</button>
    </form>
  );
}
