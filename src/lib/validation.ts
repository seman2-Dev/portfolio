export interface ContactInput { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by client (instant feedback) and server (authoritative). */
export function validateContact(v: ContactInput): ContactErrors {
  const e: ContactErrors = {};
  const name = v.name.trim(), email = v.email.trim(), msg = v.message.trim();
  if (name.length < 2) e.name = "Please enter your name (min 2 characters).";
  else if (name.length > 100) e.name = "Name is too long (max 100).";
  if (!EMAIL.test(email) || email.length > 254) e.email = "Please enter a valid email address.";
  if (msg.length < 10) e.message = "Message should be at least 10 characters.";
  else if (msg.length > 5000) e.message = "Message is too long (max 5000).";
  return e;
}
