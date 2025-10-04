import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import api, { setAuthToken, getAuthToken } from '../api/client';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: getAuthToken(),
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, error: null, user: action.payload.user || null, token: action.payload.token || null };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions.
   * Exposes: isAuthenticated, user, token, login, register, logout
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setAuthToken(state.token || null);
  }, [state.token]);

  useEffect(() => {
    const handler = () => {
      dispatch({ type: 'LOGOUT' });
    };
    window.addEventListener('app:unauthorized', handler);
    return () => window.removeEventListener('app:unauthorized', handler);
  }, []);

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    login: async (email, password) => {
      dispatch({ type: 'START' });
      try {
        const res = await api.auth.login(email, password);
        const token = res?.token || res?.access_token || res?.data?.token;
        const user = res?.user || null;
        if (!token) throw new Error('Missing token in response');
        dispatch({ type: 'SUCCESS', payload: { token, user } });
        return true;
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e.message || 'Login failed' });
        return false;
      }
    },
    // PUBLIC_INTERFACE
    register: async (email, password) => {
      dispatch({ type: 'START' });
      try {
        const res = await api.auth.register(email, password);
        const token = res?.token || res?.access_token || res?.data?.token;
        const user = res?.user || null;
        if (!token) throw new Error('Missing token in response');
        dispatch({ type: 'SUCCESS', payload: { token, user } });
        return true;
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e.message || 'Register failed' });
        return false;
      }
    },
    // PUBLIC_INTERFACE
    logout: () => {
      setAuthToken(null);
      dispatch({ type: 'LOGOUT' });
    },
  }), []);

  const value = useMemo(() => ({
    ...state,
    isAuthenticated: Boolean(state.token),
    ...actions,
  }), [state, actions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access authentication context values. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
