import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import auth from '@react-native-firebase/auth';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileScreen = ({navigation}: RouterProps) => {
  return (
    <View>
      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})