import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'

const ResetPasswordScreen = () => {

  const [email, setEmail] = useState('')
  const auth = getAuth();
  const navigation = useNavigation();

  const triggerResetEmail = async () => {
    await sendPasswordResetEmail(auth, email);
    navigation.navigate("Login")
  }

  return (
    <View style={style.container}>
      <TextInput value={email} style={style.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
      <Button title="Reset Password" onPress={triggerResetEmail}/>
    </View>
  )
}

export default ResetPasswordScreen

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

