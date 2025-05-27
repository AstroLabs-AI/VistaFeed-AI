import { useAuth } from '@/hooks/use-auth';

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest(
  url: string,
  options: ApiRequestOptions = {}
): Promise<Response> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  // Get the auth store instance
  const authStore = useAuth.getState();
  
  if (requireAuth) {
    const token = await authStore.getToken();
    
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }
  
  // Always include credentials for cookies
  fetchOptions.credentials = 'include';
  
  const response = await fetch(url, fetchOptions);
  
  // If unauthorized, try to refresh token and retry once
  if (response.status === 401 && requireAuth) {
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        authStore.login(data.user, data.accessToken);
        
        // Retry the original request with new token
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${data.accessToken}`,
        };
        
        return fetch(url, fetchOptions);
      }
    } catch (error) {
      console.error('Token refresh failed during API request:', error);
    }
    
    // If refresh fails, logout and redirect
    authStore.logout();
  }
  
  return response;
}

// Convenience methods
export const api = {
  get: (url: string, options?: ApiRequestOptions) => 
    apiRequest(url, { ...options, method: 'GET' }),
  
  post: (url: string, body?: any, options?: ApiRequestOptions) => 
    apiRequest(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  put: (url: string, body?: any, options?: ApiRequestOptions) => 
    apiRequest(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  delete: (url: string, options?: ApiRequestOptions) => 
    apiRequest(url, { ...options, method: 'DELETE' }),
};