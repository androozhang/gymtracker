import { StyleSheet, View, Button } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileScreen = ({ navigation }: RouterProps) => {
  

  return (
    <View style={{top: 100}}>
      <Button title="Logout" onPress={() => auth().signOut()} />
      <Button title="Delete Account" onPress={() => auth().currentUser?.delete()} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
