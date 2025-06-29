import { Stack } from 'expo-router';

export default function AdminLayout() {
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
        name="admin-dashboard"
        options={{
          title: 'Dashboard do Admin',
        }}
      />
      <Stack.Screen
        name="appointments"
        options={{
          title: 'Gerenciar Agendamentos',
        }}
      />
      <Stack.Screen
        name="register-professional"
        options={{
          title: 'Registrar Novo Profissional',
        }}
      />
    </Stack>
  );
}