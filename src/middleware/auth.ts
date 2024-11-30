import { useAuthStore } from '../store/authStore';
import { validateToken } from '../services/api';

export async function checkAuth() {
  const { token, logout } = useAuthStore.getState();
  
  if (!token) {
    logout();
    return false;
  }

  const isValid = await validateToken(token);
  if (!isValid) {
    logout();
    return false;
  }

  return true;
}

export function getAuthHeaders() {
  const { token } = useAuthStore.getState();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}