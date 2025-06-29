import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { modalStyles as styles } from '@/styles/modalStyles';

type SpecialtyModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddSpecialty: (specialty: string) => void;
};

export default function SpecialtyModal({ visible, onClose, onAddSpecialty }: SpecialtyModalProps) {
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAdd = () => {
    if (!newSpecialty.trim()) {
      Alert.alert('Erro', 'Por favor, digite uma especialização válida.');
      return;
    }
    onAddSpecialty(newSpecialty.trim());
    setNewSpecialty('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Especialização</Text>
          <TextInput style={styles.input} placeholder="Nome da Especialização" placeholderTextColor="#999" value={newSpecialty} onChangeText={setNewSpecialty} />
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
