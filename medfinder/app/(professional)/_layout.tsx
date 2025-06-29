import { Stack } from 'expo-router';

export default function ProfessionalLayout() {
  return (
    <Stack
      screenOptions={{
       
        headerStyle: {
          backgroundColor: '#004766', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="home" 
        options={{
          title: 'Início Profissional',
        }}
      />
      <Stack.Screen
        name="pending" 
        options={{
          title: 'Agendamentos Pendentes',
        }}
      />
      <Stack.Screen
        name="history" 
        options={{
          title: 'Histórico de Atendimentos',
        }}
      />
      <Stack.Screen
        name="setAvailability"
        options={{
          title: 'Definir Disponibilidade',
        }}
      />
      <Stack.Screen
        name="upload-results"
        options={{
          title: 'Enviar Resultados',
        }}
      />
      <Stack.Screen
        name="selectTime"
        options={{
          title: 'Selecionar Horário',
        }}
      />
    </Stack>
  );
}