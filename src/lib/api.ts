import { storage } from './storage';

export async function login(email: string, password: string) {
  try {
    const user = storage.users.authenticate(email, password);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function register(email: string, password: string) {
  try {
    const user = storage.users.create(email, password);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch (error) {
    throw new Error('Registration failed');
  }
}

export async function fetchMessages() {
  return { messages: storage.messages.getAll() };
}

export async function sendMessage(content: string, senderId: string) {
  try {
    const message = storage.messages.create(content, senderId);
    return { message };
  } catch (error) {
    throw new Error('Failed to send message');
  }
}