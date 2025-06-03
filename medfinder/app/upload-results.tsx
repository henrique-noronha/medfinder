import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { uploadResultsStyles as styles, gradientColors } from './styles/upload-resultsStyles'; 

export default function UploadResultsScreenDemo() {
  const router = useRouter();

  const [targetUserUID, setTargetUserUID] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePickDocumentDemo = () => {
    if (selectedFileName) {
      setSelectedFileName(null);
    } else {
      setSelectedFileName('exemplo_resultado.pdf');
    }
  };

  const handleUploadDemo = async () => {
    if (!selectedFileName) {
      Alert.alert('Demonstração', 'Nenhum arquivo selecionado para enviar.');
      return;
    }
    if (!targetUserUID.trim()) {
      Alert.alert('Demonstração', 'Por favor, insira o UID do usuário paciente.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
        setIsUploading(false);
        Alert.alert('Demonstração', `Arquivo "${selectedFileName}" enviado para o usuário ${targetUserUID}! (Simulação)`);
        setSelectedFileName(null);
        setTargetUserUID('');
      }
    }, 200);
  };

  return (
    <LinearGradient colors={gradientColors} style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Enviar Resultado</Text>

        <TextInput
          style={styles.input}
          placeholder="UID do Paciente"
          placeholderTextColor="#888" 
          value={targetUserUID}
          onChangeText={setTargetUserUID}
          autoCapitalize="none"
          editable={!isUploading}
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isUploading && styles.disabledButton]}
          onPress={handlePickDocumentDemo}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>
            {selectedFileName ? `Alterar PDF` : 'Selecionar Arquivo'}
          </Text>
        </TouchableOpacity>

        {selectedFileName && !isUploading && (
          <Text style={styles.fileNameText}>
            Arquivo: {selectedFileName}
          </Text>
        )}

        {isUploading && (
          <View style={styles.uploadProgressContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.uploadProgressText}>Enviando: {uploadProgress}%</Text>
            {selectedFileName && <Text style={styles.fileNameText}>Arquivo: {selectedFileName}</Text>}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.successButton,
            (isUploading || !selectedFileName) && styles.disabledButton
          ]}
          onPress={handleUploadDemo}
          disabled={isUploading || !selectedFileName}
        >
          <Text style={styles.buttonText}>Enviar Resultado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
              styles.button,
              styles.secondaryButton,
              isUploading && styles.disabledButton
          ]}
          onPress={() => router.back()}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}