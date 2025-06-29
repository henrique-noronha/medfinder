import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // <-- Usando a função padrão
import { getFirestore } from 'firebase/firestore';

// Suas configurações do Firebase continuam vindo das variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

// --- LÓGICA DE INICIALIZAÇÃO SEGURA ---
// Isso evita que o app seja inicializado múltiplas vezes, um erro comum no Expo.
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// --- INSTÂNCIAS EXPORTADAS DIRETAMENTE ---
// Criamos e exportamos as instâncias uma única vez. Isso já funciona como um singleton.
// A função getAuth() já é otimizada para React Native e cuidará da persistência.
export const auth = getAuth(app);
export const db = getFirestore(app);