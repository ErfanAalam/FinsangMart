import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerTintColor: 'white',
          // headerStyle: {
          //   backgroundColor: Colors.primary,
          // },
          headerShown:false
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Product Categories',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="th-large" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
           backgroundColor: Colors.primary,
          },
        }}
      />
      <Tabs.Screen
        name="grow"
        options={{
          title: 'Grow',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dollar" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
           backgroundColor: Colors.primary,
          },
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: 'Training',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
           backgroundColor: Colors.primary,
          },
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: 'Leads',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
           backgroundColor: Colors.primary,
          },
        }}
      />
    </Tabs>
  );
}
