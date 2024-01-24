import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import React from 'react';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileScreen = ({navigation}: RouterProps) => {
  return (
    <View>
      <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} />
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})