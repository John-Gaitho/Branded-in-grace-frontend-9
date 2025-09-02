import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

type UserRole = 'admin' | 'owner' | 'user' | null;

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Note: Your Flask backend doesn't have user roles endpoint yet
        // You'll need to add user roles functionality to your Flask backend
        // For now, we'll default to 'user' role
        setRole('user');
        console.warn('User roles not implemented in Flask backend yet');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin' || role === 'owner';

  return { role, loading, isAdmin };
}