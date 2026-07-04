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
  avatar: 'https://i.pravatar.cc/240?img=15',
  memberSince: '2024',
  enrolledCount: 6,
};

export const userService = {
  getCurrentUser(): Promise<User> {
    return simulateNetwork(CURRENT_USER);
  },
};
