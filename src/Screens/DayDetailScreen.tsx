import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, Button, View, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise, RootStackParamList } from '../navigations/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define types for route and navigation props
type DayDetailScreenRouteProp = RouteProp<RootStackParamList, 'DayDetail'>;
type DayDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DayDetail'>;

// Combine route and navigation props into a single type
type DayDetailScreenProps = {
  route: DayDetailScreenRouteProp;
  navigation: DayDetailScreenNavigationProp;
};

const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ route }) => {
  const { day, weekSet } = route.params;
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [newExerciseTitle, setNewExerciseTitle] = useState(editingExercise ? editingExercise.title : '');
  const [newExerciseSets, setNewExerciseSets] = useState(editingExercise ? editingExercise.sets : 3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState(editingExercise ? editingExercise.repRange : '8-12');  
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
    setEditingExercise({ ...exercise }); // Create a new object
    setShowAddExerciseModal(true);
  };

  const updateExercise = async () => {
    try {
      if (editingExercise) {
        await exercisesRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: newExerciseSets,
          repRange: newExerciseRepRange,
        });

        refreshExercises();
        setShowAddExerciseModal(false);
        setEditingExercise(null);
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  const deleteExercise = async () => {
    try {
      if (editingExercise) {
        await exercisesRef.doc(editingExercise.id).delete();
        refreshExercises();
        setShowAddExerciseModal(false);
        setEditingExercise(null);
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
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
      <Modal
        visible={showAddExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddExerciseModal(false);
          setEditingExercise(null);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white' }}>
            <Text>{editingExercise ? 'Edit Exercise' : 'Add Exercise'}</Text>
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
            <Button title={editingExercise ? 'Update' : 'Add'} onPress={editingExercise ? updateExercise : addExercise} />
            {editingExercise && (
              <Button title="Delete" onPress={deleteExercise} color="red" />
            )}
            <Button title="Cancel" onPress={() => {
              setShowAddExerciseModal(false);
              setEditingExercise(null);
            }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
