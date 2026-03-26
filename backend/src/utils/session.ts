export interface SetuSession {
  userId: string;
  role: 'staff' | 'admin' | 'deo' | 'state';
  schoolId: string;
  name: string;
}

export const getSession = (): SetuSession | null => {
  try {
    const raw = localStorage.getItem('setu_session');
    return raw ? (JSON.parse(raw) as SetuSession) : null;
  } catch {
    return null;
  }
};

export const setSession = (data: SetuSession): void => {
  localStorage.setItem('setu_session', JSON.stringify(data));
};

export const clearSession = (): void => {
  localStorage.removeItem('setu_session');
  localStorage.removeItem('sessionToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  sessionStorage.clear();
};

export const isAdmin = (): boolean => {
  const session = getSession();
  return session !== null && (session.role === 'admin' || session.role === 'deo' || session.role === 'state');
};
