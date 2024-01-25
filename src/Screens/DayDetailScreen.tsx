import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigations/types';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../services/FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native';
import ExerciseModal from '../components/ExerciseModal';

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
  const { day, weekSet } = route.params;
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExerciseTitle, setNewExerciseTitle] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState(3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8-12');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const user = FIREBASE_AUTH.currentUser?.uid;
  const userRef = firestore().collection('users').doc(user);
  const exercisesRef = userRef.collection('workoutPlans').doc(weekSet).collection("days").doc(day).collection('exercises');

  async function refreshExercises() {
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
  }

  useEffect(() => {
    refreshExercises();
  }, []); 

  const addExercise = async () => {
    try {
      await exercisesRef.add({
        title: newExerciseTitle,
        sets: newExerciseSets,
        repRange: newExerciseRepRange,
      });
      setNewExerciseTitle('');
      setNewExerciseSets(3);
      setNewExerciseRepRange('8-12');

      refreshExercises();
      setShowAddExerciseModal(false);
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const handleEditExercise = (exercise: Exercise) => {

    setShowAddExerciseModal(true)

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
                  onPress={() => handleEditExercise(item)}
                >
                  <View>
                    <Text>Exercise Title: {item.title}</Text>
                    <Text>Sets: {item.sets}</Text>
                    <Text>Rep Range: {item.repRange}</Text>
                  </View>
                </TouchableHighlight>
              )}
            />
        <ExerciseModal
          visible={showAddExerciseModal}
          onClose={() => {setShowAddExerciseModal(false);
                          setEditingExercise(null);}}
          onAdd={addExercise}
          newExerciseTitle={newExerciseTitle}
          setNewExerciseTitle={setNewExerciseTitle}
          newExerciseSets={newExerciseSets}
          setNewExerciseSets={setNewExerciseSets}
          newExerciseRepRange={newExerciseRepRange}
          setNewExerciseRepRange={setNewExerciseRepRange}
          exerciseToEdit={editingExercise}
          />
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
