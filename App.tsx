import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './Services/FirebaseConfig';
import Toolbar from './Components/ToolBar';
import RegisterScreen from './src/Screens/RegisterScreen';
import HomeScreen from './src/Screens/HomeScreen';

const InsideStack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home" component={HomeScreen} />
      <InsideStack.Screen name="ToolBar" component={Toolbar} />
    </InsideStack.Navigator>
  )
}

function OutsideLayout() {
  return (
    <OutsideStack.Navigator>
      <OutsideStack.Screen name="Login" component={LoginScreen} />
      <OutsideStack.Screen name="Register" component={RegisterScreen} />
    </OutsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
   <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
        <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown:false}} />
        ) : (
        <>
        <Stack.Screen name='Outside' component={OutsideLayout} options={{ headerShown: false }} />
        </>
        )}
        
      </Stack.Navigator>

   </NavigationContainer>
  );
}


