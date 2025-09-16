import { Tabs } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const Tabroot = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // Active tab color
        tabBarInactiveTintColor: 'gray',  // Inactive tab color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="memberList"
        options={{
          title: 'Members',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pendingApproval"
        options={{
          title: 'Approval',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pending-actions" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Tabroot;