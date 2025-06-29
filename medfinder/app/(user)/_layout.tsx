import { Stack } from 'expo-router';
import { Button } from 'react-native'; 
import { useRouter } from 'expo-router'; 

export default function UserLayout() {
  const router = useRouter(); 

  return (
    <Stack
      initialRouteName="home"
      screenOptions={{
        headerStyle: { backgroundColor: '#004766' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="home" options={{ title: 'Início' }} />
      <Stack.Screen name="search" options={{ title: 'Buscar Profissionais' }} />
      <Stack.Screen name="results" options={{ title: 'Resultados da Busca' }} />
      <Stack.Screen name="scheduleUser" options={{ title: 'Agendar Consulta' }} />
      <Stack.Screen name="selectTime" options={{ title: 'Selecionar Horário' }} />

      <Stack.Screen
        name="pending"
        options={{
          title: 'Agendamentos Pendentes',
      
          headerLeft: () => (
            <Button
              onPress={() => router.replace('/(user)/home')} 
              title="Home" 
              color="#fff"
            />
          ),
        }}
      />

      <Stack.Screen name="history" options={{ title: 'Meu Histórico' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notificações' }} />
      <Stack.Screen name="edit" options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="help" options={{ title: 'Ajuda e Suporte' }} />
    </Stack>
  );
}