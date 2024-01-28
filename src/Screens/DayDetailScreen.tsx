import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, Button, View, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise, RootStackParamList } from '../navigations/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8-12');  
  const [firstRange, setFirstRange] = useState(8);
  const [secondRange, setSecondRange] = useState(10);
  const [thirdRange, setThirdRange] = useState(12);
  const [forthRange, setForthRange] = useState(14);
  const [fifthRange, setFifthRange] = useState(0);
  const [sixthRange, setSixthRange] = useState(0);
  const [repRange, setRepRange] = useState([firstRange, secondRange, thirdRange, forthRange, fifthRange, sixthRange]); 
  const user = FIREBASE_AUTH.currentUser?.uid;
  const userRef = firestore().collection('users').doc(user);
  const exercisesRef = userRef.collection('workoutPlans').doc(weekSet).collection("days").doc(day).collection('exercises');
  const masterExercisesRef = userRef.collection('masterExercises');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('3');
  const [items, setItems] = useState([
    {label: '1 Set', value: '1'},
    {label: '2 Sets', value: '2'},
    {label: '3 Sets', value: '3'},
    {label: '4 Sets', value: '4'},
    {label: '5 Sets', value: '5'},
    {label: '6 Sets', value: '6'},   
  ]);


  
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
          firstRange: data.firstRange,
          secondRange: data.secondRange,
          thirdRange: data.thirdRange,
          forthRange: data.forthRange,
          fifthRange: data.fifthRange,
          sixthRange: data.sixthRange,
          reference: data.reference,
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


  useEffect(() => {
    if (value === '1') {
      setRepRange([firstRange]);
      setNewExerciseRepRange(`${firstRange}-${firstRange}`);
    } else if (value === '2') {
      setRepRange([firstRange, secondRange]);
      setNewExerciseRepRange(`${firstRange}-${secondRange}`)
    }
    else if (value === '3') {
      setRepRange([firstRange, secondRange, thirdRange]);
      setNewExerciseRepRange(`${firstRange}-${thirdRange}`)
    }
    else if (value === '4') {
      setRepRange([firstRange, secondRange, thirdRange, forthRange]);
      setNewExerciseRepRange(`${firstRange}-${forthRange}`)
    }
    else if (value === '5') {
      setRepRange([firstRange, secondRange, thirdRange, forthRange, fifthRange]);
      setNewExerciseRepRange(`${firstRange}-${fifthRange}`)
    }
    else if (value === '6') {
      setRepRange([firstRange, secondRange, thirdRange, forthRange, fifthRange, sixthRange]);
      setNewExerciseRepRange(`${firstRange}-${sixthRange}`)
    }
    setLoading(false);
  }, [value]); 

  useEffect(() => {
    if (editingExercise) {
      setNewExerciseTitle(editingExercise.title);
      setNewExerciseSets(editingExercise.sets);
      setFirstRange(editingExercise.firstRange);
      setSecondRange(editingExercise.secondRange);
      setThirdRange(editingExercise.thirdRange);
      setForthRange(editingExercise.forthRange);
      setFifthRange(editingExercise.fifthRange);
      setSixthRange(editingExercise.sixthRange);
    }
  } , [editingExercise]);

  const addExercise = async () => {
    try {
      const exerciseRef = await exercisesRef.add({
        title: newExerciseTitle,
        sets: value,
        repRange: newExerciseRepRange,
        firstRange: firstRange,
        secondRange: secondRange,
        thirdRange: thirdRange,
        forthRange: forthRange,
        fifthRange: fifthRange,
        sixthRange: sixthRange,
      });
  
      // Get the ID of the added exercise
      const exerciseId = exerciseRef.id;
  
      // Add exercise to masterExercisesRef with the same ID
      await masterExercisesRef.doc(exerciseId).set({
        title: newExerciseTitle,
        sets: value,
        repRange: newExerciseRepRange,
        firstRange: firstRange,
        secondRange: secondRange,
        thirdRange: thirdRange,
        forthRange: forthRange,
        fifthRange: fifthRange,
        sixthRange: sixthRange,
        reference: [`${user}/workoutPlans/${weekSet}/days/${day}`],
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
    setEditingExercise(exercise);
    setShowAddExerciseModal(true);
  };

  const updateExercise = async () => {
    try {
      if (editingExercise) {
        await exercisesRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: value,
          firstRange: firstRange,
          secondRange: secondRange,
          thirdRange: thirdRange,
          forthRange: forthRange,
          fifthRange: fifthRange,
          sixthRange: sixthRange,
        });
        console.log(`${editingExercise.id}`)
        await masterExercisesRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: value,
          firstRange: firstRange,
          secondRange: secondRange,
          thirdRange: thirdRange,
          forthRange: forthRange,
          fifthRange: fifthRange,
          sixthRange: sixthRange,
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
        await masterExercisesRef.doc(editingExercise.id).delete();
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleEditExercise(item)}>
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
             <DropDownPicker
              listItemContainerStyle={{
                height: 30
              }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            />
            {repRange.map((item, index) => (
              <TextInput
                key={`repRangeTextInput-${index}`}  
                placeholder={`Set ${index + 1} Rep Range`}
                value={item.toString()}
                onChangeText={text => {
                  const newRepRange = [...repRange];
                  newRepRange[index] = parseInt(text) || 0;
                  setRepRange(newRepRange);
                }}
              />
            ))}
            <Button title={editingExercise ? 'Update' : 'Add'} onPress={editingExercise ? updateExercise : addExercise} />
            {editingExercise && (
              <Button title="Delete" onPress={deleteExercise} color="red" />
            )}
            <Button title="Cancel" onPress={() => {
              setShowAddExerciseModal(false);
              setEditingExercise(null);
              setNewExerciseTitle('');
              setNewExerciseSets(3);
              setFifthRange(0);
              setSixthRange(0);
            }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
