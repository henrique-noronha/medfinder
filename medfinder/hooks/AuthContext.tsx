import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { router, Href } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

type AuthContextData = {
  user: User | null;
  role: 'user' | 'professional' | 'admin' | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// --- CORREÇÃO: A função agora retorna um componente JSX válido ---
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#004766' }}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'professional' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role || 'user');
        } else {
          setRole('user');
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/(auth)/login' as Href);
      return;
    }
    
    if (user && role) {
      if (role === 'admin') {
        router.replace('/(admin)/admin-dashboard' as Href);
      } else if (role === 'professional') {
        router.replace('/(professional)/home' as Href);
      } else {
        router.replace('/(user)/home' as Href);
      }
    }
  }, [user, role, loading]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}