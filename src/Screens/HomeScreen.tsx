import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../Services/FirebaseConfig';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <Button title="Logout" onPress={FIREBASE_AUTH.signOut} />
    </View>
  );
};

export default HomeScreen;