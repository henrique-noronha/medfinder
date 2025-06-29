import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { modalStyles as styles } from '@/styles/modalStyles';

const PRINCIPAIS_CONVENIOS = [ "Amil", "Bradesco Saúde", "SulAmérica", "Unimed", "NotreDame Intermédica", "Porto Seguro Saúde", "Golden Cross", "Allianz Saúde", "Sompo Saúde", "Servir", "Outro (Específico)" ];

type InsuranceModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirmSelection: (selection: string[]) => void;
  currentlySelected: string[];
};

export default function InsuranceModal({ visible, onClose, onConfirmSelection, currentlySelected }: InsuranceModalProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(currentlySelected);

  useEffect(() => {
    if (visible) {
      setLocalSelection(currentlySelected);
    }
  }, [visible, currentlySelected]);

  const handleToggle = (insuranceName: string) => {
    setLocalSelection(prev => prev.includes(insuranceName) ? prev.filter(item => item !== insuranceName) : [...prev, insuranceName]);
  };

  const handleConfirm = () => {
    onConfirmSelection(localSelection);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlayFromBottom}>
        <View style={styles.modalContentFromBottom}>
          <Text style={styles.modalTitle}>Selecione os Convênios</Text>
          <ScrollView style={styles.scrollView}>
            {PRINCIPAIS_CONVENIOS.map((insurance) => (
              <TouchableOpacity key={insurance} style={styles.checkboxContainer} onPress={() => handleToggle(insurance)}>
                <Feather name={localSelection.includes(insurance) ? "check-square" : "square"} size={24} color={localSelection.includes(insurance) ? "#007AFF" : "#ccc"} />
                <Text style={styles.checkboxLabel}>{insurance}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirmar Seleção</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
// --- MUDANÇA: A definição de 'StyleSheet.create' foi removida daqui ---