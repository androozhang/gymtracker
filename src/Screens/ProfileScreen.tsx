import React from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const ProfileScreen = ({ navigation }: RouterProps) => {
  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Delete', onPress: () => handleDeleteAccount() },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = async () => {
    try {
      await auth().currentUser?.delete();
      // You may want to navigate to a different screen after deleting the account.
      // For example: navigation.navigate('Welcome');
    } catch (error: any) {
      console.error('Error deleting account:', error.message);
      // Handle error accordingly, show error message, etc.
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => auth().signOut()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={showDeleteConfirmation}>
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default ProfileScreen;
