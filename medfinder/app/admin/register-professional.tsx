// admin/register-professional.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { registerStyles as styles, gradientColors } from '../styles/registerstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterProfessionalScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [placesOfService, setPlacesOfService] = useState<string[]>([]);
  const [acceptsInsurance, setAcceptsInsurance] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [authUid, setAuthUid] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [city, setCity] = useState('');
  const [stateValue, setStateValue] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');

  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const removeAddress = (index: number) => {
    setPlacesOfService((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSpecialty = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    if (!fullName || !cpf || !birthDate || !gender || !phone || !emailContact || placesOfService.length === 0 || specialties.length === 0 || !authUid.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios, incluindo o Auth UID do Profissional.');
      return;
    }

    if (authUid.trim().length < 20) { // UIDs do Firebase geralmente têm 28 caracteres
        Alert.alert('Erro', 'O Auth UID do Profissional parece inválido. Verifique o valor inserido.');
        return;
    }
    setIsRegistering(true);
    try {
      const trimmedAuthUid = authUid.trim();
      const professionalId = `${fullName.replace(/\s+/g, '-')}-${Date.now()}`;

      await setDoc(doc(db, 'healthcareProfessionals', professionalId), {
        fullName,
        cpf,
        birthDate,
        gender,
        phone,
        emailContact,
        specialties,
        placesOfService,
        acceptsInsurance: acceptsInsurance === 'Sim',
        authUid: trimmedAuthUid,
      });

      const userDocRef = doc(db, 'users', trimmedAuthUid);
      const userDataForUsersCollection = {
        email: emailContact, // Este será o email no doc 'users'. Idealmente, seria o email de login do Auth.
        fullName: fullName,
        role: 'profissional',
        cpf: cpf,
        // Se você quiser adicionar um timestamp de quando o perfil foi completado/verificado pelo admin:
        // profileLastUpdatedByAdminAt: serverTimestamp(),
      };

      await setDoc(userDocRef, userDataForUsersCollection, { merge: true });

      Alert.alert('Sucesso', 'Profissional cadastrado e vinculado com sucesso!');
      // Limpar campos após o sucesso
      setFullName(''); setCpf(''); setBirthDate(''); setGender(''); setPhone('');
      setEmailContact(''); setAuthUid(''); setPlacesOfService([]);
      setSpecialties([]); setAcceptsInsurance('');
      router.replace('../auth/admin-dashboard');
    } catch (error: any) {
      console.error("Erro detalhado no cadastro:", error);
      Alert.alert('Erro no cadastro', error.message || 'Ocorreu um erro desconhecido. Verifique o console.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAddAddress = () => {
    if (!city || !stateValue || !zipCode || !street) {
      Alert.alert('Erro', 'Preencha todos os campos do endereço.');
      return;
    }
    const fullAddress = `${street}, ${city}, ${stateValue}, CEP: ${zipCode}`;
    setPlacesOfService((prev) => [...prev, fullAddress]);
    setCity('');
    setStateValue('');
    setZipCode('');
    setStreet('');
    setAddressModalVisible(false);
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty.trim()) {
      Alert.alert('Erro', 'Digite uma especialização válida.');
      return;
    }
    setSpecialties((prev) => [...prev, newSpecialty.trim()]);
    setNewSpecialty('');
    setSpecialtyModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MedFinder Pro</Text>
        </View>

        <Text style={styles.title}>
          Cadastro de <Text style={styles.strong}>Profissional</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#ccc"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={cpf}
            onChangeText={(text) => setCpf(formatCpf(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de nascimento (DD/MM/AAAA)"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={birthDate}
            onChangeText={(text) => setBirthDate(formatBirthDate(text))}
          />
          <Text style={styles.label}>Auth UID do Profissional (Firebase)</Text>
          <TextInput
            style={styles.input}
            placeholder="Cole o Auth UID da conta Firebase do profissional"
            placeholderTextColor="#ccc"
            value={authUid}
            onChangeText={setAuthUid}
            autoCapitalize="none"
          />
          <Text style={styles.label}>Gênero</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Feminino" value="Feminino" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={phone}
            onChangeText={(text) => setPhone(formatPhone(text))}
          />
          <TextInput
            style={styles.input}
            placeholder="Email para contato (do perfil)"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailContact}
            onChangeText={setEmailContact}
          />
          <Text style={styles.label}>Locais de Atendimento</Text>
          {placesOfService.map((address, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listText}>{address}</Text>
              <TouchableOpacity onPress={() => removeAddress(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.input, styles.addressInput]}
            onPress={() => setAddressModalVisible(true)}
          >
            <Text style={styles.inputText || {color: '#333'}}>Adicionar locais de atendimento</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Especializações</Text>
          {specialties.map((specialty, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listText}>{specialty}</Text>
              <TouchableOpacity onPress={() => removeSpecialty(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.input, styles.specialtiesInput]}
            onPress={() => setSpecialtyModalVisible(true)}
          >
            <Text style={styles.inputText || {color: '#333'}}>Adicionar especializações</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Convênio</Text>
          <Picker
            selectedValue={acceptsInsurance}
            onValueChange={(itemValue) => setAcceptsInsurance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Sim" value="Sim" />
            <Picker.Item label="Não" value="Não" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isRegistering}>
            {isRegistering ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar Profissional</Text>}
          </TouchableOpacity>
        </View>

        <Modal visible={addressModalVisible} animationType="slide" transparent onRequestClose={() => setAddressModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Local de Atendimento</Text>
              <TextInput style={styles.input} placeholder="Rua, Número, Bairro" value={street} onChangeText={setStreet} />
              <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
              <TextInput style={styles.input} placeholder="Estado (UF)" value={stateValue} onChangeText={setStateValue} maxLength={2} autoCapitalize="characters" />
              <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={zipCode} onChangeText={setZipCode} />
              <TouchableOpacity style={styles.button} onPress={handleAddAddress}><Text style={styles.buttonText}>Adicionar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setAddressModalVisible(false)}><Text style={[styles.buttonText, {color: '#333'}]}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={specialtyModalVisible} animationType="slide" transparent onRequestClose={() => setSpecialtyModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Especialização</Text>
              <TextInput style={styles.input} placeholder="Nome da Especialização" value={newSpecialty} onChangeText={setNewSpecialty} />
              <TouchableOpacity style={styles.button} onPress={handleAddSpecialty}><Text style={styles.buttonText}>Adicionar</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setSpecialtyModalVisible(false)}><Text style={[styles.buttonText, {color: '#333'}]}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20, marginBottom: 40}}>
          <Text style={styles.registerText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}