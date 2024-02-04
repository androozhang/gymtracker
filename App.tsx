import React from 'react'; 
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/services/FirebaseConfig';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DayDetailScreen from './src/screens/DayDetailScreen';
import type { RootStackParamList } from './src/navigations/types';
import MasterExerciseDirectoryScreen from './src/screens/MasterExerciseDirectoryScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

// Create navigators with specified param lists
const HomeStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Define screen components
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </ProfileStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
      />
      <HomeStack.Screen
        name="DayDetail"
        component={DayDetailScreen}
      />
      <HomeStack.Screen
        name="MasterExerciseDirectory"
        component={MasterExerciseDirectoryScreen}
      />
    </HomeStack.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>

  );
}

// Main App component
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {user ? (
          <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen name='Home' component={HomeStackScreen} options={{ headerShown: false }} />
            <Tab.Screen name='Profile' component={ProfileStackScreen} options={{ headerShown: false }} />
          </Tab.Navigator>
        ) : (
          <AuthStackScreen />
        )}
      </NavigationContainer>
    </Provider>
  );
}
