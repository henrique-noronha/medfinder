import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
export default function EditProfile() {
  const router = useRouter();

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid); 
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setNome(userData.fullName || ''); 
            setCpf(userData.cpf || '');
            setEmail(userData.email || '');
            setTelefone(userData.telefone || ''); 
          } else {
            setError('Dados do usuário não encontrados.');
          }
        } else {
          setError('Usuário não autenticado.');
          router.replace('/auth/login'); // Redireciona para o login se não estiver autenticado
        }
      } catch (e: any) {
        console.error('Erro ao buscar dados do usuário:', e);
        setError('Erro ao buscar dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (loading || !auth.currentUser) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        fullName: nome, 
        telefone: telefone, 
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back(); // Ou navegue para outra tela
    } catch (e: any) {
      console.error('Erro ao atualizar o perfil:', e);
      Alert.alert('Erro', 'Erro ao atualizar o perfil.');
      setError('Erro ao atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View><Text>Carregando dados...</Text></View>;
  }

  if (error) {
    return <View><Text>Erro: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back('/home')}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>MedFinder</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
          <Ionicons name="notifications-outline" size={24} color="black" style={{ marginLeft: 10 }} />
        </View>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <CustomInput label="CPF" placeholder="000.000.000-00" value={cpf} setValue={setCpf} editable={false} />
        <CustomInput label="Nome" placeholder="João Silva" value={nome} setValue={setNome} />
        <CustomInput label="Endereço de e-mail" placeholder="joao@mail.com" value={email} setValue={setEmail} editable={false} />
        <CustomInput label="Telefone" placeholder="(00) 0 0000-0000" value={telefone} setValue={setTelefone} />

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={loading}>
          <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type CustomInputProps = {
  label: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  editable?: boolean;
};

function CustomInput({ label, placeholder, value, setValue, editable = true }: CustomInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          editable={editable}
        />
        {editable && (
          <Ionicons name="pencil-outline" size={20} color="gray" />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#62B5F6',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: '#F97F51',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formContainer: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#F97F51',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});