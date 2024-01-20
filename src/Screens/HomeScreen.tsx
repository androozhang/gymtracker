import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../Services/FirebaseConfig';
import Day from '../Components/Day';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const HomeScreen = ({navigation}: RouterProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <FlatList
      data={days}
      renderItem={({ item }) => <Day day={item} />}
      keyExtractor={(item) => item}
    />
  );
};

export default HomeScreen;