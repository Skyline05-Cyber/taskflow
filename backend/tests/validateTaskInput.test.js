import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTaskInput } from '../controllers/validateTaskInput.js';

test('rejects empty title', () => {
  const errors = validateTaskInput({ title: '   ' });
  assert.ok(errors.some((e) => e.includes('title')));
});

test('rejects invalid priority', () => {
  const errors = validateTaskInput({ title: 'Buy milk', priority: 'urgent' });
  assert.ok(errors.some((e) => e.includes('priority')));
});

test('rejects malformed due_date', () => {
  const errors = validateTaskInput({ title: 'Buy milk', due_date: 'not-a-date' });
  assert.ok(errors.some((e) => e.includes('due_date')));
});

test('accepts a valid full task', () => {
  const errors = validateTaskInput({ title: 'Buy milk', priority: 'high', due_date: '2026-09-10' });
  assert.deepEqual(errors, []);
});

test('partial update skips missing fields', () => {
  const errors = validateTaskInput({ is_complete: true }, { partial: true });
  assert.deepEqual(errors, []);
});

test('partial update still validates provided fields', () => {
  const errors = validateTaskInput({ priority: 'nope' }, { partial: true });
  assert.ok(errors.length > 0);
});
