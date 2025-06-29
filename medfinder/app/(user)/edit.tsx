import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useNavigation, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/editstyles';
import { useAuth } from '@/hooks/AuthContext';
import CustomInput from '@/components/core/CustomInput'; 

const INITIAL_STATE = {
  fullName: '',
  cpf: '',
  email: '',
  telefone: '',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user, role } = useAuth(); 

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setIsLoadingData(true);
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            fullName: data.fullName || '',
            cpf: data.cpf || '',
            email: data.email || '',
            telefone: data.telefone || '',
          });
        }
        setIsLoadingData(false);
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateField = (field: keyof typeof INITIAL_STATE, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!formData.fullName.trim() || !formData.telefone.trim()) {
      Alert.alert("Campos Obrigatórios", "Nome e telefone são obrigatórios.");
      return;
    }
    setIsSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        fullName: formData.fullName,
        telefone: formData.telefone,
      });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (e: any) {
      Alert.alert('Erro', 'Erro ao atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
 
  };
  
  if (isLoadingData) {
    return (
      <LinearGradient colors={gradientColors} style={styles.container}>
        <View style={styles.centeredMessage}><ActivityIndicator size="large" color="#FFFFFF" /></View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <View style={styles.headerContainer}>
         <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={28} color="#fff" /></TouchableOpacity>
         <View style={styles.logoContainer}><Image source={require('@/assets/images/logo3.png')} style={styles.logoImage} /></View>
         <TouchableOpacity onPress={handleLogout}><Feather name="log-out" size={24} color="#fff" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.formScrollView} contentContainerStyle={styles.formScrollViewContent}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Editar Perfil</Text>
          <CustomInput label="CPF" placeholder="000.000.000-00" value={formData.cpf} setValue={() => {}} editable={false} iconName="id-card-outline"/>
          <CustomInput label="Nome Completo" placeholder="Seu nome completo" value={formData.fullName} setValue={(text) => handleUpdateField('fullName', text)} iconName="person-outline"/>
          <CustomInput label="Endereço de e-mail" placeholder="seuemail@example.com" value={formData.email} setValue={() => {}} editable={false} iconName="mail-outline"/>
          <CustomInput label="Telefone" placeholder="(00) 00000-0000" value={formData.telefone} setValue={(text) => handleUpdateField('telefone', text)} keyboardType="phone-pad" iconName="call-outline"/>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#fff"/> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}