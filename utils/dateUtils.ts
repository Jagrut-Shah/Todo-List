
import * as chrono from 'chrono-node';

export const parseTaskInput = (input: string): { title: string; dueDate: Date | null } => {
  const results = chrono.parse(input);
  
  if (results.length === 0) {
    return { title: input.trim(), dueDate: null };
  }

  // Extract the date from the first match
  const dueDate = results[0].start.date();
  
  // Remove the date string from the original title
  const dateString = results[0].text;
  const title = input.replace(dateString, '').replace(/\s+/g, ' ').trim();

  return { title: title || 'Untitled Task', dueDate };
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isOverdue = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Compare timestamps for precise overdue check
  return date.getTime() < today.getTime();
};

export const isUpcoming = (date: Date) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
};
