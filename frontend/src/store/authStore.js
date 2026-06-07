import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      set({ user: data.user, token: data.token, isLoading: false });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      set({ user: data.user, token: data.token, isLoading: false });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  hydrate: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },
}));
