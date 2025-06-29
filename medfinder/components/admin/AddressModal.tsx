import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { modalStyles as styles } from '@/styles/modalStyles';

type Address = { street: string; city: string; stateValue: string; zipCode: string };
type AddressModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddAddress: (address: string) => void;
};

export default function AddressModal({ visible, onClose, onAddAddress }: AddressModalProps) {
  const [address, setAddress] = useState<Address>({ street: '', city: '', stateValue: '', zipCode: '' });

  const handleAdd = () => {
    const { street, city, stateValue, zipCode } = address;
    if (!street || !city || !stateValue || !zipCode) {
      Alert.alert('Erro', 'Preencha todos os campos do endereço.');
      return;
    }
    const fullAddress = `${street}, ${city}, ${stateValue.toUpperCase()}, CEP: ${zipCode}`;
    onAddAddress(fullAddress);
    setAddress({ street: '', city: '', stateValue: '', zipCode: '' });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Local de Atendimento</Text>
          <TextInput style={styles.input} placeholder="Rua, Número, Bairro" value={address.street} onChangeText={(text) => setAddress(prev => ({ ...prev, street: text }))} />
          <TextInput style={styles.input} placeholder="Cidade" value={address.city} onChangeText={(text) => setAddress(prev => ({ ...prev, city: text }))} />
          <TextInput style={styles.input} placeholder="Estado (UF)" value={address.stateValue} onChangeText={(text) => setAddress(prev => ({ ...prev, stateValue: text }))} maxLength={2} autoCapitalize="characters" />
          <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={address.zipCode} onChangeText={(text) => setAddress(prev => ({ ...prev, zipCode: text }))} />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
