import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/Services/FirebaseConfig';
import LoginScreen from './src/Screens/LoginScreen';
import HomeScreen from './src/Screens/HomeScreen';
import ProfileScreen from './src/Screens/ProfileScreen';
import DayDetailScreen from './src/Screens/DayDetailScreen';
import {
  RootStackParamList,
  HomeStackNavigationProp,
  ProfileStackNavigationProp,
  AppNavigationProps,
  AppRouteProps,
} from './src/Navigations/types';

const HomeStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileStack" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

function HomeStackScreen({ navigation }: AppNavigationProps<'HomeStack'>) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeStack" component={HomeScreen} />
      <HomeStack.Screen
        name="DayDetailScreen"
        component={DayDetailScreen}
        initialParams={{ day: '' }}
      />
    </HomeStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Tab.Screen name="HomeStack" component={HomeStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileStack" component={ProfileStackScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Tab.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
