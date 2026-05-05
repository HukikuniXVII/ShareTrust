import { GearItem, User } from '../types';

export const api = {
  async getGearItems(): Promise<GearItem[]> {
    const res = await fetch('/api/gear');
    if (!res.ok) throw new Error('Failed to fetch gear items');
    return res.json();
  },

  async getGearItem(id: string): Promise<GearItem> {
    const res = await fetch(`/api/gear/${id}`);
    if (!res.ok) throw new Error('Failed to fetch gear item');
    return res.json();
  },

  async createGearItem(data: any, token: string): Promise<GearItem> {
    const res = await fetch('/api/gear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create gear item');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async getUser(id: string): Promise<User> {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }
};
