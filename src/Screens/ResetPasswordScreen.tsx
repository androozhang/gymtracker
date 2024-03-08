import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'

const ResetPasswordScreen = () => {

  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const triggerResetEmail = async () => {
    await auth().sendPasswordResetEmail(email);
    navigation.navigate("Login")
  }

  return (
    <View style={style.container}>
      <Image source={require('../../assets/nutritionist.png')} style={{ width: 250, height: 250, alignSelf: 'center'}}></Image>
      <TextInput value={email} style={style.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
      <View style={{marginVertical: 6}}>
          <TouchableOpacity style={style.loginButton} onPress={triggerResetEmail}>
                <Text style={style.loginButtonText}>Reset Password</Text>
          </TouchableOpacity>
          </View>
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

