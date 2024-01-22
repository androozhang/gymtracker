import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../Navigations/types';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../Services/FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';

// Define types for route and navigation props
type DayDetailScreenRouteProp = RouteProp<RootStackParamList, 'DayDetail'>;
type DayDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DayDetail'>;

// Combine route and navigation props into a single type
type DayDetailScreenProps = {
  route: DayDetailScreenRouteProp;
  navigation: DayDetailScreenNavigationProp;
};

type Exercise = {
  id: string;
  title: string;
}

type User = {
  id: string;
  name: string;
  email: string;
}

const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ route }) => {
  const { day } = route.params;
  const [exercises, setExercises] = React.useState<Exercise[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [users, setUsers] = useState<User[]>([]); 

  useEffect(() => {
    const subscriber = firestore()
      .collection('userCollection')
      .onSnapshot(querySnapshot => {
        const users: User[] = [];

        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          const user: User = {
            id: documentSnapshot.id,
            name: data.name,
            email: data.email,
          };
          users.push(user);
        });

        setUsers(users);
        setLoading(false);
      });
  
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      <Text>{`Details for ${day}`}</Text>
      <FlatList
      data={users}
      renderItem={({ item }) => (
        <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>User ID: {item.id}</Text>
          <Text>User Name: {item.name}</Text>
        </View>
      )}
    />
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
