import { View, Text, TextInput, StyleSheet, ActivityIndicator, Image, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useFirebase } from '../services/FirebaseContext';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { useEffect } from 'react';



GoogleSignin.configure({
  webClientId: '583572974340-aj4c7m0c5cm7psfgi6qdso981tjiaoiv.apps.googleusercontent.com',
});

const LoginScreen = () => {
  const [name, setName] = React.useState(''); 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const db = firestore();
  const navigation = useNavigation();
  const { user } = useFirebase();
  
  const signIn = async() => {
    setLoading(true);
    try {
      // check if email is verified before logging in
      const response = await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      alert('Sign in failed: ' + error.message);
      //console.log(error);
    } finally {
      setLoading(false);
    }
  }

  
  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
  
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
  
    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

    // add user to firestore
    const response = await auth().signInWithCredential(appleCredential);
    const user = response.user;
    if (user) {
      const usersCollection = firestore().collection('users');
      const userDocRef = firestore().doc('users/' + user.uid);
      const userData = {
        userId: user.uid,
        name: name,
        email: email,
      };
      await userDocRef.set(userData);
    }
  
    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  }
  
  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    return appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
  }, []);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // add user to firestore
    const response = await auth().signInWithCredential(googleCredential);
    const user = response.user;
    if (user) {
      const usersCollection = firestore().collection('users');
      const userDocRef = firestore().doc('users/' + user.uid);
      const userData = {
        userId: user.uid,
        name: name,
        email: email,
      };
      await userDocRef.set(userData);
    }
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }


  return (
    <View style={styles.container}>
      <View>
        <View style={{marginVertical: 6}}>
        <Image source={require('../../assets/logo_transparent.png')} style={{ width: 150, height: 100, alignSelf: 'center'}} />
        <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} />
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
              
              <TouchableOpacity style={styles.loginButton} onPress={signIn}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <View style={{borderColor: 'black', borderWidth: 0.5, width: '100%',  marginVertical: 25}}></View>
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.loginButtonText}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('ResetPassword')}>
                <Text style={styles.loginButtonText}>Forgot Password</Text>
              </TouchableOpacity>
            
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
              <Text>Or Continue With</Text>
              <View style={styles.buttonContainer}>
                <AppleButton
                  buttonStyle={AppleButton.Style.WHITE}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={styles.appleButton}
                  onPress={() => onAppleButtonPress()}
                />
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Icon}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={() => onGoogleButtonPress()}
                  disabled={loading}
                />
              </View>
            </View>

          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    marginTop: 0,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  appleButton: {
    width: 45,
    height: 45,
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: '#dd4b39',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;