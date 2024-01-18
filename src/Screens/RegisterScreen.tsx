import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../Services/FirebaseConfig';
import { FIRESTORE_DB } from '../../Services/FirebaseConfig';  
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const RegisterScreen = () => {
    const [name, setName] = React.useState(''); 
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH;
    const myCollection = collection(FIRESTORE_DB, 'myCollection');
    const navigation = useNavigation();

    const signUp = async() => {
        setLoading(true);
        try {
          const response = await createUserWithEmailAndPassword(auth, email, password);
          const userCollection = collection(FIRESTORE_DB, 'userCollection');
          const userData = {
            userId: response.user.uid,
            name: name,
            email: email,
          };
          const newDocRef = await addDoc(userCollection, userData);
          console.log('New document added with ID:', newDocRef.id);
          alert("Check your emails!")
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
          <Button title="Create Account" onPress={signUp} />
          <Button title="Already have an account" onPress={() => navigation.navigate("Login")} />
        </>
    )}
        </KeyboardAvoidingView>
    </View>
  )
}

export default RegisterScreen

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