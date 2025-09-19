import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type UserRole = 'ADMIN' | 'CUSTOMER' | null;

export function useUserRole() {
  const { user, token } = useAuth(); // make sure you return token from useAuth
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!token) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch role');

        const data = await res.json();
        setRole(data.role as UserRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [token]);

  const isAdmin = role === 'ADMIN';

  return { role, loading, isAdmin };
}
