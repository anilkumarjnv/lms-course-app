/**
 * Mock user service. Keeps the "profile" data out of the screen JSX and behind
 * the same async service boundary as course data.
 */

import type { User } from '@/types/user';
import { simulateNetwork } from '@/utils/delay';

const CURRENT_USER: User = {
  id: 'u1',
  name: 'Anil Kumar',
  email: 'anil@learnhub.app',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  memberSince: '2024',
  enrolledCount: 6,
};

export const userService = {
  getCurrentUser(): Promise<User> {
    return simulateNetwork(CURRENT_USER);
  },
};
