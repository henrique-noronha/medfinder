import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './styles/homestyles';


export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

const handleSearch = async () => {
  const professionalsRef = collection(db, 'healthcareProfessionals');

  let combinedResults = [];

  if (searchQuery.trim()) {
    // Busca por especialidade
    const qSpecialty = query(professionalsRef, where('specialties', 'array-contains', searchQuery));
    const specialtySnapshot = await getDocs(qSpecialty);
    const specialtyResults = specialtySnapshot.docs.map(doc => doc.data());

    // Busca por nome
    const allSnapshot = await getDocs(professionalsRef);
    const nameResults = allSnapshot.docs
      .map(doc => doc.data())
      .filter(doc => doc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Combinar e remover duplicatas
    const combinedResultsMap = new Map();
    [...specialtyResults, ...nameResults].forEach(item => {
      combinedResultsMap.set(item.emailContact, item);
    });

    combinedResults = Array.from(combinedResultsMap.values());
  } else {
    // Buscar todos os profissionais se não tiver query
    const allSnapshot = await getDocs(professionalsRef);
    combinedResults = allSnapshot.docs.map(doc => doc.data());
  }

  router.push({
    pathname: '/search',
    params: {
      results: JSON.stringify(combinedResults),
    },
  });
};


  return (
    <LinearGradient colors={['#71C9F8', '#3167AF']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.appTitleContainer}>
            <Text style={styles.appTitleText}>MedFinder</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação */}
        <Text style={styles.greetingText}>Seja bem-vindo, Usuário!</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>O que você procura?</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cardiologista"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="book-open" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <Feather name="help-circle" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="thermometer-half" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
