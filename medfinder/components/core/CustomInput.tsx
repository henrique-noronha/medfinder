// components/core/CustomInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definindo as propriedades que o componente aceita
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

export default function CustomInput({
  label,
  placeholder,
  value,
  setValue,
  editable = true,
  keyboardType = 'default',
  iconName,
}: CustomInputProps) {
  return (
    <View style={styles.inputOuterContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, !editable && styles.inputDisabled]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={editable ? "#666" : "#aaa"}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={setValue}
          editable={editable}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

// Estilos específicos para este componente
const styles = StyleSheet.create({
  inputOuterContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#000', 
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    paddingRight: 15,
    fontSize: 16,
    color: '#333',
  },
});
