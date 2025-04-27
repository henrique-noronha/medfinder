// Importa Firebase App
import { initializeApp } from "firebase/app";
// Importa o Analytics
//import { getAnalytics } from "firebase/analytics";
// Importa a Autenticação
import { getAuth } from "firebase/auth";

// Configurações do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8xd20LD2oCnlq3VKUzQHi2q-wuFTaI84",
  authDomain: "medfinder-app-1fb3d.firebaseapp.com",
  projectId: "medfinder-app-1fb3d",
  storageBucket: "medfinder-app-1fb3d.firebasestorage.googleapis.com",
  messagingSenderId: "620910891707",
  appId: "1:620910891707:web:7a53c883494d10b07c0f9e",
  measurementId: "G-SVT6WCJ6GF"
};

// Inicializa o App
const app = initializeApp(firebaseConfig);
// Inicializa o Analytics
//const analytics = getAnalytics(app);
// Inicializa a Autenticação
export const auth = getAuth(app);

// Se quiser exportar também o app pra outras coisas
export { app };
