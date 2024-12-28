import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthCredentials {
  username: string;
  password: string;
  email?: string;
}

interface AuthResponse {
  message: string;
  user: User;
}

export function useUser() {
  const { toast } = useToast();

  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Login failed');
      }

      return response.json();
    },
    onSuccess: ({ message }) => {
      toast({
        title: "Success",
        description: message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: ({ message }) => {
      toast({
        title: "Success",
        description: message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation<{ message: string }, Error>({
    mutationFn: async () => {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Logout failed');
      }

      return response.json();
    },
    onSuccess: ({ message }) => {
      toast({
        title: "Success",
        description: message,
      });
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}