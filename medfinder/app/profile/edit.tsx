import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator, 
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig'; 
import { signOut } from 'firebase/auth';         
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles, { gradientColors } from '../styles/editstyles';

export default function EditProfile() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingData(true);
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
            setUserRole(userData.role || 'paciente'); 
          } else {
            setError('Dados do usuário não encontrados.');
            setUserRole('paciente'); 
          }
        } else {
          setError('Usuário não autenticado.');
          router.replace('/auth/login');
        }
      } catch (e: any) {
        setError('Erro ao buscar dados do usuário.');
        setUserRole('paciente'); 
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleLogout = async () => { 
    try {
      await signOut(auth);
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  };

  const handleSaveProfile = async () => {
    if (isSaving || !auth.currentUser) return;
    if (!nome.trim() || !telefone.trim()) {
        Alert.alert("Campos Obrigatórios", "Nome e telefone são obrigatórios.");
        return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        fullName: nome, 
        telefone: telefone, 
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      if (router.canGoBack()) {
        router.back();
      } else {
        const homePath = userRole === 'profissional' ? '/home-profissional' : '/home';
        router.replace(homePath);
      }
    } catch (e: any) {
      Alert.alert('Erro', 'Erro ao atualizar o perfil.');
      setError('Erro ao atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeaderBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      const homePath = userRole === 'profissional' ? '/home-profissional' : '/home';
      router.replace(homePath);
    }
  };

  if (isLoadingData) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.centeredMessage}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.centeredMessageText}>Carregando dados...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error && !isLoadingData) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.centeredMessage}>
          <Text style={styles.centeredMessageText}>Erro: {error}</Text>
           <TouchableOpacity 
             onPress={() => router.replace(userRole === 'profissional' ? '/home-profissional' : '/home')} 
             style={{marginTop: 20}}
           >
                <Text style={{color: '#fff', textDecorationLine: 'underline'}}>Voltar para Home</Text>
           </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={[styles.headerContainer, { zIndex: 100 }]}>
        <View style={styles.headerLeftGroup}>
          <TouchableOpacity 
            onPress={handleHeaderBackPress} 
            style={[styles.backButton, { zIndex: 10, position: 'relative' }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/logo3.png')} 
                style={styles.logoImage}
              />
          </View>
        </View>
        
        <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}> 
              <Image
                source={{ uri: auth.currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Notificações", "Nenhuma nova notificação.")} style={{ marginLeft: 10 }}>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.formScrollView}
        contentContainerStyle={styles.formScrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Editar Perfil</Text>
          <CustomInput label="CPF" placeholder="000.000.000-00" value={cpf} setValue={setCpf} editable={false} iconName="id-card-outline"/>
          <CustomInput label="Nome Completo" placeholder="Seu nome completo" value={nome} setValue={setNome} iconName="person-outline"/>
          <CustomInput label="Endereço de e-mail" placeholder="seuemail@example.com" value={email} setValue={setEmail} editable={false} iconName="mail-outline"/>
          <CustomInput label="Telefone" placeholder="(00) 00000-0000" value={telefone} setValue={setTelefone} keyboardType="phone-pad" iconName="call-outline"/>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff"/> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

type CustomInputProps = {
  label: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  iconName?: keyof typeof Ionicons.glyphMap;
  maxLength?: number; 
};

function CustomInput({ label, placeholder, value, setValue, editable = true, secureTextEntry = false, keyboardType = 'default', iconName, maxLength }: CustomInputProps) {
  return (
    <View style={styles.inputOuterContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, !editable && styles.inputDisabled]}>
        {iconName && <Ionicons name={iconName} size={20} color={editable ? "#666" : "#aaa"} style={styles.inputIcon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={setValue}
          editable={editable}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
    </View>
  );
}
