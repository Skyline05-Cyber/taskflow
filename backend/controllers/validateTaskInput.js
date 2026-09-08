const PRIORITIES = new Set(['low', 'medium', 'high']);

/**
 * Pure function, no I/O — kept separate from tasksController.js so it can be
 * unit tested without needing a Supabase connection or environment variables.
 */
export function validateTaskInput(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push('title is required and cannot be empty');
    } else if (body.title.length > 200) {
      errors.push('title must be 200 characters or fewer');
    }
  }
  if (body.priority !== undefined && !PRIORITIES.has(body.priority)) {
    errors.push('priority must be one of: low, medium, high');
  }
  if (body.due_date !== undefined && body.due_date !== null) {
    if (Number.isNaN(Date.parse(body.due_date))) {
      errors.push('due_date must be a valid date');
    }
  }
  return errors;
}

export { PRIORITIES };
