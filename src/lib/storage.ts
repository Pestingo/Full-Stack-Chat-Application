import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  username: string;
  created_at: string;
}

// In-memory storage
const users: User[] = [];
const messages: Message[] = [];

// Demo user for quick testing
users.push({
  id: '1',
  email: 'demo@example.com',
  username: 'demo',
  password: 'password123'
});

export const storage = {
  users: {
    create: (email: string, password: string) => {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = {
        id: uuidv4(),
        email,
        username: email.split('@')[0],
        password
      };
      users.push(user);
      return user;
    },
    authenticate: (email: string, password: string) => {
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return user;
    }
  },
  messages: {
    getAll: () => [...messages],
    create: (content: string, userId: string) => {
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      const message = {
        id: uuidv4(),
        content,
        sender_id: userId,
        username: user.username,
        created_at: new Date().toISOString()
      };
      messages.push(message);
      return message;
    }
  }
};