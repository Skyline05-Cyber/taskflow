import { Link } from 'react-router-dom';

// A few fake rows just to show what the list actually looks like once you're using it.
// Not wired to anything real — purely a preview.
const previewTasks = [
  { title: 'Renew passport', priority: 'high', done: false },
  { title: 'Call the dentist back', priority: 'medium', done: false },
  { title: 'Ship the quarterly report', priority: 'high', done: true },
  { title: 'Water the plants', priority: 'low', done: false },
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="brand">TaskFlow</div>
        <nav>
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/signup" className="nav-link nav-link-cta">Sign up</Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-copy">
          <h1>
            A quiet place to keep<br />
            track of what matters.
          </h1>
          <p className="landing-lede">
            No boards, no workspaces, no notifications you have to mute.
            Just a list that's yours, and stays yours — every task is
            locked to your account at the database level, not just
            hidden behind a login screen.
          </p>
          <Link to="/signup" className="landing-cta">Start your list</Link>
          <p className="landing-fine-print">Free. Takes about a minute.</p>
        </div>

        <div className="landing-preview" aria-hidden="true">
          <div className="preview-window">
            <div className="preview-window-bar">
              <span /><span /><span />
            </div>
            <ul className="preview-list">
              {previewTasks.map((task) => (
                <li key={task.title} className={task.done ? 'is-complete' : ''}>
                  <span className="preview-check" />
                  <span className="preview-title">{task.title}</span>
                  <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <p>Built with React, Express, and Supabase.</p>
      </footer>
    </div>
  );
}
