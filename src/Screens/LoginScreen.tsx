import { View, Text, TextInput, StyleSheet, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../services/FirebaseConfig'; 
import { OAuthProvider, createUserWithEmailAndPassword, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { addDoc, setDoc, collection, doc, DocumentReference, getFirestore } from 'firebase/firestore';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';


GoogleSignin.configure({
  webClientId: '583572974340-aj4c7m0c5cm7psfgi6qdso981tjiaoiv.apps.googleusercontent.com',
});

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

  const signInWithApple = async() => {
    try {
      const appleCrendential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      const { identityToken } = appleCrendential;
      if (identityToken) {
        const appleCredential = new OAuthProvider('apple.com');
        const credential = appleCredential.credential({
          idToken: identityToken
        });
        const response = await signInWithCredential(auth, credential);
        const user = response.user;
        if (user) {
          const usersCollection = collection(getFirestore(), 'users');
          const userDocRef = doc(usersCollection, user.uid);
          const userData = {
            userId: user.uid,
            name: name,
            email: email,
          };
          await setDoc(userDocRef, userData);
        }
      }
      
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
        console.log('User cancelled Apple sign in');
      } else {
        console.log('Apple sign in error: ', e);
      }
    }
  }

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return signInWithCredential(auth, googleCredential);
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
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={signInWithApple}
          />
          <Button
            title="Google Sign-In"
            onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
          />
          <Button title="Create Account" onPress={() => navigation.navigate("Register")} />
          <Button title="Forgot Password" onPress={() => navigation.navigate("ResetPassword")} />
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