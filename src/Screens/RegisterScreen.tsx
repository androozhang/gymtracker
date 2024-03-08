import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const db = firestore();
  const navigation = useNavigation();

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      const user: FirebaseAuthTypes.User | null = response.user;
  
      if (user) {
  
        // Create user document
        const userDoc = db.collection('users').doc(user.uid);
        await userDoc.set({
          name: name,
          email: email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        alert("Check your emails for verification!");
      } else {
        console.error('User is null.');
      }
    } catch (error: any) {
      alert('Sign up failed: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={style.container}>
      <View>
        <Image source={require('../../assets/landscape.png')} style={{ width: 250, height: 250, alignSelf: 'center'}}></Image>
        <TextInput value={name} style={style.input} placeholder='Name' autoCapitalize='words' onChangeText={(text) => setName(text)}></TextInput>
        <TextInput value={email} style={style.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
        <TextInput secureTextEntry={true} value={password} style={style.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{marginVertical: 6}}>
          <TouchableOpacity style={style.loginButton} onPress={signUp}>
                <Text style={style.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default RegisterScreen;

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
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 0,
    borderColor: 'black',
    borderWidth: 0.5,
    shadowColor: 'rgba(0,0,0, 1)', 
    shadowOffset: { height: 3, width: 3 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    minWidth: '100%',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
  },
});
