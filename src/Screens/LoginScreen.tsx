import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../services/FirebaseConfig'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { addDoc, setDoc, collection, doc, DocumentReference, getFirestore } from 'firebase/firestore';

const LoginScreen = () => {
  const [name, setName] = React.useState(''); 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const navigation = useNavigation();
  
  const signIn = async() => {
    setLoading(true);
    try {
      // check if email is verified before logging in
      if (auth.currentUser?.emailVerified === false) {
        alert('Please verify your email before logging in.');
        return;
      }
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert('Sign in failed: ' + error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput value={email} style={style.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput secureTextEntry={true} value={password} style={style.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
    { loading ? (<ActivityIndicator size="large" color="#0000ff" /> 
    ) : ( 
        <> 
          <Button title="Login" onPress={signIn} />
          <Button title="Create Account" onPress={() => navigation.navigate("Register")} />
        </>
    )}
        </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

const style = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4, 
        height: 50, 
        borderWidth: 1, 
        borderRadius: 4, 
        padding: 10, 
        backgroundColor: '#fff'
    }
});