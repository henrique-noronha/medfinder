import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { registerStyles as styles, gradientColors } from '../styles/registerstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterProfessionalScreen() {
  const router = useRouter();

  // Campos de entrada necessários
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [emailContact, setEmailContact] = useState('');
  const [placesOfService, setPlacesOfService] = useState<string[]>([]);
  const [acceptsInsurance, setAcceptsInsurance] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);

  // Modal para locais de atendimento
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');

  // Modal para especializações
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');

  // Formatação de CPF no formato 000.000.000-00
  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  // Formatação de telefone no formato (00) 0 0000-0000
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  // Formatação de data no formato DD/MM/AAAA
  const formatBirthDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  // Função para remover um endereço da lista
  const removeAddress = (index: number) => {
    setPlacesOfService((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para remover uma especialização da lista
  const removeSpecialty = (index: number) => {
    setSpecialties((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    try {
      if (!fullName || !cpf || !birthDate || !gender || !phone || !emailContact || placesOfService.length === 0 || specialties.length === 0) {
        Alert.alert('Erro', 'Preencha todos os campos.');
        return;
      }

      const professionalId = `${fullName}-${Date.now()}`;
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
      });

      Alert.alert('Sucesso', 'Profissional cadastrado com sucesso!');
      router.replace('../auth/admin-dashboard');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro no cadastro', error.message);
    }
  };

  const handleAddAddress = () => {
    if (!city || !state || !zipCode || !street) {
      Alert.alert('Erro', 'Preencha todos os campos do endereço.');
      return;
    }

    const fullAddress = `${street}, ${city}, ${state}, CEP: ${zipCode}`;
    setPlacesOfService((prev) => [...prev, fullAddress]);
    setCity('');
    setState('');
    setZipCode('');
    setStreet('');
    setAddressModalVisible(false);
  };

  const handleAddSpecialty = () => {
    if (!newSpecialty) {
      Alert.alert('Erro', 'Digite uma especialização.');
      return;
    }

    setSpecialties((prev) => [...prev, newSpecialty]);
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
            placeholder="Email para contato"
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
            <Text style={{ color: '#000' }}>Adicionar locais de atendimento</Text>
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
            <Text style={{ color: '#000' }}>Adicionar especializações</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={addressModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Local de Atendimento</Text>
              <TextInput
                style={styles.input}
                placeholder="Cidade"
                placeholderTextColor="#ccc"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Estado"
                placeholderTextColor="#ccc"
                value={state}
                onChangeText={setState}
              />
              <TextInput
                style={styles.input}
                placeholder="CEP"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={zipCode}
                onChangeText={setZipCode}
              />
              <TextInput
                style={styles.input}
                placeholder="Endereço"
                placeholderTextColor="#ccc"
                value={street}
                onChangeText={setStreet}
              />

              <TouchableOpacity style={styles.button} onPress={handleAddAddress}>
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff4444' }]}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={specialtyModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Especialização</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a especialização"
                placeholderTextColor="#ccc"
                value={newSpecialty}
                onChangeText={setNewSpecialty}
              />

              <TouchableOpacity style={styles.button} onPress={handleAddSpecialty}>
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ff4444' }]}
                onPress={() => setSpecialtyModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.registerText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}