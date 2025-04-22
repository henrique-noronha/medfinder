import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { registerStyles as styles, gradientColors } from '../styles/registerstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();

  const [cpf, setCpf] = useState('');

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    let formatted = '';
    if (digits.length <= 3) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }

    return formatted;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      <View style={styles.logo}>
        <Text style={styles.logoText}>MedFinder</Text>
      </View>

      <Text style={styles.title}>
        Crie sua conta no <Text style={styles.strong}>MedFinder</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#ccc"
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
          placeholder="Email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // lógica de cadastro
          }}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.registerText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>

  );
}
