import Colors from '@/constants/Colors';
import { useAuth } from '@/Contexts/AuthContexts';
import { useUser } from '@/Contexts/UserContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { logout, setIsLoggedIn } = useAuth();
  const { userDetails } = useUser();
  console.log(userDetails);
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    console.log('Logged out, navigating to /');
    router.replace('/Login/login');
  };

  // Get initials and username
  const username = userDetails?.name || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.header}>
        {/* Profile section */}
        <TouchableOpacity style={styles.profileSection} activeOpacity={0.7} onPress={() => router.push('/profile')}>
          {/* Profile Initials Circle */}
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>{initials}</Text>
          </View>
          {/* Hello and Username */}
          <View>
            <Text style={styles.helloText}>Hello</Text>
            <Text style={styles.usernameText}>{username}</Text>
          </View>
        </TouchableOpacity>
        {/* Right side icons */}
        <View style={styles.iconSection}>
          <TouchableOpacity style={styles.iconButton} onPress={() => { /* Help action */ }}>
            <MaterialIcons name="help-outline" size={28} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* Bell action */ }}>
            <Ionicons name="notifications-outline" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text>Home Screen</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInitials: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  helloText: {
    fontSize: 14,
    color: Colors.white,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});