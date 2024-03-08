import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DayDetailScreen from './src/screens/DayDetailScreen';
import type { RootStackParamList } from './src/navigations/types';
import MasterExerciseDirectoryScreen from './src/screens/MasterExerciseDirectoryScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import { FirebaseProvider } from './src/services/FirebaseContext'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

const HomeStack = createNativeStackNavigator<RootStackParamList>();
const ProfileStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function ProfileStackScreen() {
  const navigation = useNavigation();
  return (
    <ProfileStack.Navigator
      screenOptions={{
      headerShown: false,
      headerLeft: () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
       ),
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
    </ProfileStack.Navigator>
  );
}

function HomeStackScreen() {
  const navigation = useNavigation();
  return (
    <HomeStack.Navigator
      screenOptions={{
      headerShown: false,
      headerLeft: () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
       ),
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <HomeStack.Screen name="DayDetail" component={DayDetailScreen} options={{headerShown: true, headerTransparent: true, headerTitle: ''}}/>
      <HomeStack.Screen
        name="MasterExerciseDirectory"
        component={MasterExerciseDirectoryScreen}
        options={{headerShown: true, headerTransparent: true, headerTitle: ''}}
      />
    </HomeStack.Navigator>
  );
}

function AuthStackScreen() {
  const navigation = useNavigation();
  return (
    <AuthStack.Navigator
      screenOptions={{
      headerShown: false,
      headerLeft: () => (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
       ),
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, headerTransparent: true, headerTitle: ''}}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, headerTransparent: true, headerTitle: ''}}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: true, headerTransparent: true, headerTitle: ''}}
      />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth().onAuthStateChanged(userState => {
      setUser(userState);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);



  return (
    <FirebaseProvider>
      <NavigationContainer>
        {user ? (
          <Tab.Navigator initialRouteName="Home" screenOptions={{
            tabBarStyle: { height: '10%', alignContent: 'center', justifyContent: 'center', backgroundColor: 'white', borderTopColor: 'black', borderTopWidth: 0.5, paddingTop: 5},
          }}>
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                headerShown: false,
                tabBarIcon: ({focused}) => {return focused ? 
                <Ionicons name="home-sharp" size={24} color="black"/> : 
                <Ionicons name="home-outline" size={24} color="black" />},
                tabBarLabelStyle: {color: 'black', fontSize: 12},
                
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileStackScreen}
              options={{ headerShown: false,
                tabBarIcon: ({focused}) => {return focused ? 
                  <Ionicons name="person" size={24} color="black" /> : 
                  <Ionicons name="person-outline" size={24} color="black" />},
                  tabBarLabelStyle: {color: 'black', fontSize: 12},
                }}
            />
          </Tab.Navigator>
        ) : (
          <AuthStackScreen />
        )}
      </NavigationContainer>
    </FirebaseProvider>
  );
}
