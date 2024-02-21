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
    <View>
      <Button title="Logout" onPress={() => auth().signOut()} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
