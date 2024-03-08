import React from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
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
    } catch (error: any) {
      console.error('Error deleting account:', error.message);
    }
  };

  const handleSendFeedback = () => {
    Linking.openURL('mailto:zandrew129@gmail.com?subject=Feedback');
  };

  const handleHelperAndSupport = () => {
    Linking.openURL('mailto:zandrew129@gmail.com?subject=Help and Support');
  };

  const handleReviewOnAppStore = () => {
    Linking.openURL('https://apps.apple.com/us/app/6478719205');
  };

  const renderButton = (text: string, onPress: () => void, isDeleteButton: boolean = false) => (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color="black" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View>
        <Image
          source={require('../../assets/newspaper.png')}
          style={{ width: 250, height: 250, alignSelf: 'center'}}
        />
      </View>
      <View style={{borderColor: 'black', borderWidth: 0.5, width: '100%',  marginBottom: 15}}></View>
      <View style={styles.buttonContainer}>
        {renderButton('Logout', () => auth().signOut())}
        {renderButton('Delete Account', showDeleteConfirmation, true)}
        {renderButton('Send Feedback', handleSendFeedback)}
        {renderButton('Helper and Support', handleHelperAndSupport)}
        {renderButton('Review on App Store', handleReviewOnAppStore)}
      </View>
      <Text style={{marginTop: 30}}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 0,
    marginTop: '20%',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 15,
    borderColor: 'black',
    borderWidth: 0.5,
    shadowColor: 'rgba(0,0,0, 1)', 
    shadowOffset: { height: 3, width: 3 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '200',
  },
  deleteButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButtonText: {
    color: 'black',
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});

export default ProfileScreen;
