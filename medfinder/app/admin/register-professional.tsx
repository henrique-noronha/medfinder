import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { registerStyles as styles, gradientColors } from '../styles/registerstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

const PRINCIPAIS_CONVENIOS = [
  "Amil",
  "Bradesco Saúde",
  "SulAmérica",
  "Unimed",
  "NotreDame Intermédica",
  "Porto Seguro Saúde",
  "Golden Cross",
  "Allianz Saúde",
  "Sompo Saúde",
  "Servir",
  "Outro (Específico)",
];

export default function RegisterProfessionalScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [placesOfService, setPlacesOfService] = useState<string[]>([]);
  
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);

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

  const removeAddress = (index: number) => setPlacesOfService((prev) => prev.filter((_, i) => i !== index));
  const removeSpecialty = (index: number) => setSpecialties((prev) => prev.filter((_, i) => i !== index));
  
  const handleToggleInsurance = (insuranceName: string) => {
    setSelectedInsurances((prevSelected) =>
      prevSelected.includes(insuranceName)
        ? prevSelected.filter((item) => item !== insuranceName)
        : [...prevSelected, insuranceName]
    );
  };
  
  const removeSelectedInsurance = (insuranceNameToRemove: string) => {
    setSelectedInsurances((prev) => prev.filter((insurance) => insurance !== insuranceNameToRemove));
  };

  const handleRegister = async () => {
    if (!fullName || !cpf || !birthDate || !gender || !phone || !emailContact || placesOfService.length === 0 || specialties.length === 0 || !authUid.trim() || selectedInsurances.length === 0 ) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios, incluindo o Auth UID e ao menos um Convênio.');
      return;
    }
    if (authUid.trim().length < 20) {
        Alert.alert('Erro', 'O Auth UID do Profissional parece inválido.');
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
        acceptedInsurances: selectedInsurances,
        authUid: trimmedAuthUid,
      });

      const userDocRef = doc(db, 'users', trimmedAuthUid);
      const userDataForUsersCollection = {
        email: emailContact, 
        fullName: fullName,
        role: 'profissional',
        cpf: cpf,
      };
      await setDoc(userDocRef, userDataForUsersCollection, { merge: true });

      Alert.alert('Sucesso', 'Profissional cadastrado e vinculado com sucesso!');
      setFullName(''); setCpf(''); setBirthDate(''); setGender(''); setPhone('');
      setEmailContact(''); setAuthUid(''); setPlacesOfService([]);
      setSpecialties([]); setSelectedInsurances([]);
      router.replace('../auth/admin-dashboard');
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message || 'Ocorreu um erro desconhecido.');
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
    setCity(''); setStateValue(''); setZipCode(''); setStreet('');
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
        <Text style={styles.title}>Cadastro de <Text style={styles.strong}>Profissional</Text></Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" value={cpf} onChangeText={(text) => setCpf(formatCpf(text))} />
          <TextInput style={styles.input} placeholder="Data de nascimento (DD/MM/AAAA)" keyboardType="numeric" value={birthDate} onChangeText={(text) => setBirthDate(formatBirthDate(text))} />
          <Text style={styles.label}>Auth UID do Profissional (Firebase)</Text>
          <TextInput style={styles.input} placeholder="Cole o Auth UID da conta Firebase" value={authUid} onChangeText={setAuthUid} autoCapitalize="none" />
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerContainer}> 
            <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker} itemStyle={styles.pickerItem}>
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Feminino" value="Feminino" />
              <Picker.Item label="Outro" value="Outro" />
            </Picker>
          </View>
          <TextInput style={styles.input} placeholder="Telefone" keyboardType="numeric" value={phone} onChangeText={(text) => setPhone(formatPhone(text))} />
          <TextInput style={styles.input} placeholder="Email para contato (do perfil)" keyboardType="email-address" autoCapitalize="none" value={emailContact} onChangeText={setEmailContact} />
          
          <Text style={styles.label}>Locais de Atendimento</Text>
          {placesOfService.map((address, index) => ( <View key={index} style={styles.listItem}><Text style={styles.listText}>{address}</Text><TouchableOpacity onPress={() => removeAddress(index)} style={styles.removeButton}><Text style={styles.removeButtonText}>Remover</Text></TouchableOpacity></View> ))}
          <TouchableOpacity style={[styles.input, styles.addressInput]} onPress={() => setAddressModalVisible(true)}><Text style={styles.inputText || {color: '#333'}}>Adicionar locais de atendimento</Text></TouchableOpacity>
          
          <Text style={styles.label}>Especializações</Text>
          {specialties.map((specialty, index) => ( <View key={index} style={styles.listItem}><Text style={styles.listText}>{specialty}</Text><TouchableOpacity onPress={() => removeSpecialty(index)} style={styles.removeButton}><Text style={styles.removeButtonText}>Remover</Text></TouchableOpacity></View> ))}
          <TouchableOpacity style={[styles.input, styles.specialtiesInput]} onPress={() => setSpecialtyModalVisible(true)}><Text style={styles.inputText || {color: '#333'}}>Adicionar especializações</Text></TouchableOpacity>

          <Text style={styles.label}>Convênios Atendidos</Text>
          {selectedInsurances.length > 0 ? (
            selectedInsurances.map((insurance, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{insurance}</Text>
                <TouchableOpacity onPress={() => removeSelectedInsurance(insurance)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyListText}>Nenhum convênio selecionado.</Text>
          )}
          <TouchableOpacity style={[styles.input, styles.addressInput]} onPress={() => setInsuranceModalVisible(true)}>
            <Text style={styles.inputText || {color: '#333'}}>Selecionar Convênios</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isRegistering}>
            {isRegistering ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar Profissional</Text>}
          </TouchableOpacity>
        </View>

        <Modal visible={addressModalVisible} animationType="slide" transparent onRequestClose={() => setAddressModalVisible(false)}>
          <View style={styles.modalContainer}><View style={styles.modalContent}><Text style={styles.modalTitle}>Adicionar Local</Text><TextInput style={styles.input} placeholder="Rua, Número, Bairro" value={street} onChangeText={setStreet} /><TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} /><TextInput style={styles.input} placeholder="Estado (UF)" value={stateValue} onChangeText={setStateValue} maxLength={2} autoCapitalize="characters" /><TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={zipCode} onChangeText={setZipCode} /><TouchableOpacity style={styles.button} onPress={handleAddAddress}><Text style={styles.buttonText}>Adicionar</Text></TouchableOpacity><TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setAddressModalVisible(false)}><Text style={[styles.buttonText, {color: '#333'}]}>Cancelar</Text></TouchableOpacity></View></View>
        </Modal>
        <Modal visible={specialtyModalVisible} animationType="slide" transparent onRequestClose={() => setSpecialtyModalVisible(false)}>
          <View style={styles.modalContainer}><View style={styles.modalContent}><Text style={styles.modalTitle}>Adicionar Especialização</Text><TextInput style={styles.input} placeholder="Nome da Especialização" value={newSpecialty} onChangeText={setNewSpecialty} /><TouchableOpacity style={styles.button} onPress={handleAddSpecialty}><Text style={styles.buttonText}>Adicionar</Text></TouchableOpacity><TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setSpecialtyModalVisible(false)}><Text style={[styles.buttonText, {color: '#333'}]}>Cancelar</Text></TouchableOpacity></View></View>
        </Modal>

        {/* Modal para Seleção de Convênios */}
        <Modal visible={insuranceModalVisible} transparent animationType="slide" onRequestClose={() => setInsuranceModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione os Convênios</Text>
              <ScrollView style={styles.insuranceModalScrollView}> 
                {PRINCIPAIS_CONVENIOS.map((insurance) => (
                  <TouchableOpacity
                    key={insurance}
                    style={styles.checkboxContainer}
                    onPress={() => handleToggleInsurance(insurance)}
                  >
                    <Feather
                      name={selectedInsurances.includes(insurance) ? "check-square" : "square"}
                      size={24}
                      color={selectedInsurances.includes(insurance) ? "#FF8C00" : "#ccc"}
                    />
                    <Text style={styles.checkboxLabel}>{insurance}</Text> 
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={[styles.button, {marginTop: 15}]} onPress={() => setInsuranceModalVisible(false)}>
                <Text style={styles.buttonText}>Confirmar Seleção</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => router.back()} style={{marginTop: 10, marginBottom: 50}}>
          <Text style={styles.registerText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
