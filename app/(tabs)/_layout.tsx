import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, tabBarShowLabel: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerTintColor: 'white',
          // headerStyle: {
          //   backgroundColor: Colors.primary,
          // },
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="th-large" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerLeft: () => (
            <FontAwesome
              name="search"
              size={25}
              color={'white'}
              style={{ marginLeft: 15, padding: 10 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="grow"
        options={{
          title: 'Grow your Customers',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dollar" color={color} />,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerLeft: () => (
            <FontAwesome
              name="line-chart"
              size={25}
              color={'white'}
              style={{ marginLeft: 15, padding: 10 }}
            />
          ),
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
          headerLeft: () => (
            <FontAwesome
              name="question-circle"
              size={25}
              color={'white'}
              style={{ marginLeft: 15, padding: 10 }}
            />
          ),
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
          headerLeft: () => (
            <FontAwesome
              name="user-plus"
              size={25}
              color={'white'}
              style={{ marginLeft: 15, padding: 10 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
