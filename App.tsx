import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/Services/FirebaseConfig';
import HomeScreen from './src/Screens/HomeScreen';

const InsideStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    </InsideStack.Navigator>
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
        <Stack.Screen name='InsideLayout' component={InsideLayout} options={{ headerShown:false}} />
        ) : (
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown:false}} />
        )}
      </Stack.Navigator>

   </NavigationContainer>
  );
}


