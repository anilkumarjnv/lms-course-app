/** The signed-in user (mock — a real app would hydrate this from auth/session). */
export interface User {
  id: string;
  name: string;
  email: string;
  /** Remote avatar URL. */
  avatar: string;
  /** Year the account was created, e.g. "2024". */
  memberSince: string;
  enrolledCount: number;
}
