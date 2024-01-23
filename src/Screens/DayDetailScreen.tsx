import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
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
  sets: number;
  repRange: string;
}

type User = {
  id: string;
  name: string;
  email: string;
}

const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ route }) => {
  const { day } = route.params;
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExerciseTitle, setNewExerciseTitle] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState(3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8-12');
  const user = FIREBASE_AUTH.currentUser?.uid;

  const userRef = firestore().collection('userCollection').doc(user);
  const exercisesRef = userRef.collection(day);

  const refreshExercises = async () => {
    try {
      const querySnapshot = await exercisesRef.get();
      const exercises: Exercise[] = [];

      querySnapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        const exercise: Exercise = {
          id: documentSnapshot.id,
          title: data.title,
          sets: data.sets,
          repRange: data.repRange,
        };
        exercises.push(exercise);
      });

      setExercises(exercises);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    // Fetch exercises when the component mounts
    refreshExercises();
  }, []); // Empty dependency array ensures it only runs once

  const addExercise = async () => {
    try {
      await exercisesRef.add({
        title: newExerciseTitle,
        sets: newExerciseSets,
        repRange: newExerciseRepRange,
      });
      // Reset form fields
      setNewExerciseTitle('');
      setNewExerciseSets(3);
      setNewExerciseRepRange('8-12');
      // Fetch exercises after adding a new one
      refreshExercises();
      setShowAddExerciseModal(false);
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>{`Details for ${day}`}</Text>
            <Button title="Add Exercise" onPress={() => setShowAddExerciseModal(true)} />
            <FlatList
  data={exercises}
  renderItem={({ item }) => (
    <TouchableHighlight
      onPress={() => {
        // Handle editing the exercise (e.g., open another modal)
        console.log(`Edit exercise ${item.id}`);
      }}
    >
      <View>
        <Text>Exercise Title: {item.title}</Text>
        <Text>Sets: {item.sets}</Text>
        <Text>Rep Range: {item.repRange}</Text>
      </View>
    </TouchableHighlight>
  )}
/>
      {/* Add Exercise Modal */}
      <Modal
        visible={showAddExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddExerciseModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white' }}>
            <Text>Add Exercise</Text>
            <TextInput
              placeholder="Title"
              value={newExerciseTitle}
              onChangeText={text => setNewExerciseTitle(text)}
            />
            <TextInput
              placeholder="Sets"
              value={newExerciseSets.toString()}
              onChangeText={text => setNewExerciseSets(parseInt(text) || 0)}
            />
            <TextInput
              placeholder="Rep Range"
              value={newExerciseRepRange}
              onChangeText={text => setNewExerciseRepRange(text)}
            />
            <Button title="Add" onPress={addExercise} />
            <Button title="Cancel" onPress={() => setShowAddExerciseModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
