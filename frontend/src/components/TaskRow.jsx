function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const date = new Date(`${dueDate}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TaskRow({ task, onToggle, onDelete }) {
  const dueLabel = formatDueDate(task.due_date);

  return (
    <li className={`task-row ${task.is_complete ? 'is-complete' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.is_complete}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.is_complete ? 'incomplete' : 'complete'}`}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
          {dueLabel && <span>Due {dueLabel}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button type="button" className="text" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </li>
  );
}
