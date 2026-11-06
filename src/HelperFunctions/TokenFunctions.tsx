import { jwtDecode } from 'jwt-decode';

interface RawTokenPayload {
  NameIdentifier: string; 
  Email: string;
  Role: string;
}

interface CleanUserData {
  userId: string;
  email: string;
  role: string;
}

export function getStoredAccessTokenData(): CleanUserData | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode<RawTokenPayload>(token);
    
    return {
      userId: decoded.NameIdentifier, 
      email: decoded.Email,
      role: decoded.Role
    };
  } catch {
    localStorage.removeItem('accessToken'); 
    return null;
  }
}
