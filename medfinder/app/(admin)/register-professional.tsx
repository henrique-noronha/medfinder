import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { registerStyles as styles, gradientColors } from '@/styles/register-professionalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

import AddressModal from '@/components/admin/AddressModal';
import SpecialtyModal from '@/components/admin/SpecialtyModal';
import InsuranceModal from '@/components/admin/InsuranceModal';

const INITIAL_STATE = {
  fullName: '',
  cpf: '',
  birthDate: '',
  gender: '', 
  phone: '',
  emailContact: '',
  authUid: '',
  placesOfService: [] as string[],
  specialties: [] as string[],
  selectedInsurances: [] as string[],
};

export default function RegisterProfessionalScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isRegistering, setIsRegistering] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);

  // Adicione este useEffect para logar o valor inicial e qualquer mudança do gender
  useEffect(() => {
    console.log("RegisterProfessionalScreen - formData.gender inicial ou alterado:", formData.gender, "Tipo:", typeof formData.gender);
  }, [formData.gender]);

  // Função genérica para atualizar os campos do formulário
  const handleUpdateField = (field: keyof typeof INITIAL_STATE, value: any) => {
    if (field === 'gender') {
      value = String(value || ''); 
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCpf = (value: string): string => {
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 9) {
      cleanedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanedValue.length > 6) {
      cleanedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (cleanedValue.length > 3) {
      cleanedValue = cleanedValue.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    return cleanedValue;
  };

  const formatPhone = (value: string): string => {
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 11) {
      cleanedValue = cleanedValue.substring(0, 11);
    }
    if (cleanedValue.length > 10) {
      cleanedValue = cleanedValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanedValue.length > 6) {
      cleanedValue = cleanedValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanedValue.length > 2) {
      cleanedValue = cleanedValue.replace(/(\d{2})(\d+)/, '($1) $2');
    }
    return cleanedValue;
  };

  const formatBirthDate = (value: string): string => {
    let cleanedValue = value.replace(/\D/g, '');
    if (cleanedValue.length > 8) {
      cleanedValue = cleanedValue.substring(0, 8);
    }
    if (cleanedValue.length > 4) {
      cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    } else if (cleanedValue.length > 2) {
      cleanedValue = cleanedValue.replace(/(\d{2})(\d{2})/, '$1/$2');
    }
    return cleanedValue;
  };

  const removeListItem = (field: 'placesOfService' | 'specialties' | 'selectedInsurances', index: number) => {
    handleUpdateField(field, formData[field].filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    const { fullName, cpf, birthDate, gender, phone, emailContact, placesOfService, specialties, authUid, selectedInsurances } = formData;
    if (!fullName || !cpf || !birthDate || !gender || !phone || !emailContact || placesOfService.length === 0 || specialties.length === 0 || !authUid.trim() || selectedInsurances.length === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (authUid.trim().length < 20) { 
      Alert.alert('Erro', 'O Auth UID do Profissional parece inválido. Verifique se copiou corretamente.');
      return;
    }
    setIsRegistering(true);
    try {
      const professionalId = `${fullName.replace(/\s+/g, '-')}-${Date.now()}`;
      await setDoc(doc(db, 'healthcareProfessionals', professionalId), {
        ...formData,
        authUid: formData.authUid.trim(),
      });
      await setDoc(doc(db, 'users', formData.authUid.trim()), {
        role: 'professional',
      }, { merge: true });

      Alert.alert('Sucesso', 'Profissional cadastrado com sucesso!');
      setFormData(INITIAL_STATE);
      router.back();
    } catch (error: any) {
      console.error("Erro ao cadastrar profissional: ", error);
      Alert.alert('Erro no cadastro', error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Cadastro de <Text style={styles.strong}>Profissional</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#888"
            value={formData.fullName}
            onChangeText={(text) => handleUpdateField('fullName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.cpf}
            onChangeText={(text) => handleUpdateField('cpf', formatCpf(text))}
            maxLength={14} 
          />
          <TextInput
            style={styles.input}
            placeholder="Data de nascimento (DD/MM/AAAA)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.birthDate}
            onChangeText={(text) => handleUpdateField('birthDate', formatBirthDate(text))}
            maxLength={10} 
          />
          <TextInput
            style={styles.input}
            placeholder="Auth UID da conta Firebase"
            placeholderTextColor="#888"
            value={formData.authUid}
            onChangeText={(text) => handleUpdateField('authUid', text)}
            autoCapitalize="none"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender || ''}
              onValueChange={(value) => {
                console.log("Picker - onValueChange recebido:", value, "Tipo:", typeof value);
                handleUpdateField('gender', value);
              }}
              style={styles.picker}
              itemStyle={styles.pickerItem} 
            >
              <Picker.Item label="Selecione o Gênero..." value="" color="#888" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.phone}
            onChangeText={(text) => handleUpdateField('phone', formatPhone(text))}
            maxLength={15} 
          />
          <TextInput
            style={styles.input}
            placeholder="Email para contato"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.emailContact}
            onChangeText={(text) => handleUpdateField('emailContact', text)}
          />

          {/* Seção de Endereços */}
          <Text style={styles.label}>Locais de Atendimento</Text>
          {formData.placesOfService.length === 0 ? (
            <Text style={styles.emptyListText}>Nenhum local adicionado.</Text>
          ) : (
            formData.placesOfService.map((address, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{address}</Text>
                <TouchableOpacity onPress={() => removeListItem('placesOfService', index)}>
                  <Feather name="x-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => setAddressModalVisible(true)}>
            <Text style={styles.addButtonText}>Adicionar Endereço</Text>
          </TouchableOpacity>

          {/* Seção de Especialidades */}
          <Text style={styles.label}>Especializações</Text>
          {formData.specialties.length === 0 ? (
            <Text style={styles.emptyListText}>Nenhuma especialidade adicionada.</Text>
          ) : (
            formData.specialties.map((specialty, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{specialty}</Text>
                <TouchableOpacity onPress={() => removeListItem('specialties', index)}>
                  <Feather name="x-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => setSpecialtyModalVisible(true)}>
            <Text  style={styles.addButtonText}>Adicionar Especialidade</Text>
          </TouchableOpacity>

          {/* Seção de Convênios */}
          <Text style={styles.label}>Convênios Atendidos</Text>
          {formData.selectedInsurances.length === 0 ? (
            <Text style={styles.emptyListText}>Nenhum convênio selecionado.</Text>
          ) : (
            formData.selectedInsurances.map((insurance, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{insurance}</Text>
                <TouchableOpacity onPress={() => removeListItem('selectedInsurances', index)}>
                  <Feather name="x-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => setInsuranceModalVisible(true)}>
            <Text style={styles.addButtonText}>Selecionar Convênios</Text>
          </TouchableOpacity>

          {/* Botão de Cadastro */}
          <TouchableOpacity style={[styles.button, { marginTop: 30 }]} onPress={handleRegister} disabled={isRegistering}>
            {isRegistering ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar Profissional</Text>}
          </TouchableOpacity>
        </View>

        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10, marginBottom: 50 }}>
          <Text style={styles.registerText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Renderização dos Modais - Ficam fora do ScrollView para aparecerem por cima */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onAddAddress={(address) => {
          handleUpdateField('placesOfService', [...formData.placesOfService, address]);
          setAddressModalVisible(false);
        }}
      />
      <SpecialtyModal
        visible={specialtyModalVisible}
        onClose={() => setSpecialtyModalVisible(false)}
        onAddSpecialty={(specialty) => {
          handleUpdateField('specialties', [...formData.specialties, specialty]);
          setSpecialtyModalVisible(false);
        }}
      />
      <InsuranceModal
        visible={insuranceModalVisible}
        onClose={() => setInsuranceModalVisible(false)}
        currentlySelected={formData.selectedInsurances}
        onConfirmSelection={(selection) => {
          handleUpdateField('selectedInsurances', selection);
        }}
      />
    </View>
  );
}