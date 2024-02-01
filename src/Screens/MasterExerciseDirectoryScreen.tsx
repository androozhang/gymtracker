import { View, Text, FlatList, TouchableHighlight, Button, TextInput, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise } from '../navigations/types';
import DropDownPicker from 'react-native-dropdown-picker';
import { LineChart } from 'react-native-chart-kit';

const MasterExerciseDirectoryScreen = () => {
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const user = FIREBASE_AUTH.currentUser?.uid;
  const userRef = firestore().collection('users').doc(FIREBASE_AUTH.currentUser?.uid);
  const masterExerciseDirectoryRef = userRef.collection('masterExercises'); 
  const [masterExerciseDirectory, setMasterExerciseDirectory] = useState<Exercise[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(editingExercise? editingExercise.sets : '3');
  const [items, setItems] = useState([
    {label: '1 Set', value: '1'},
    {label: '2 Sets', value: '2'},
    {label: '3 Sets', value: '3'},
    {label: '4 Sets', value: '4'},
    {label: '5 Sets', value: '5'},
    {label: '6 Sets', value: '6'},   
  ]);

  const addExercise = async () => {
    try {
      await masterExerciseDirectoryRef.add({
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

      setNewExerciseTitle('');
      setNewExerciseSets(3);
      setNewExerciseRepRange('8-12');

      fetchMasterExerciseDirectory();
      setShowAddExerciseModal(false);
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const fetchMasterExerciseDirectory = async () => {
    try {
      const querySnapshot = await masterExerciseDirectoryRef.get();
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

      setMasterExerciseDirectory(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };
  
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
  }, [value]); 

  const updateExercise = async () => {
    try {
      if (editingExercise) {
        console.log('editingExercise:', newExerciseTitle);
        await masterExerciseDirectoryRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: value,
          firstRange: firstRange,
          secondRange: secondRange,
          thirdRange: thirdRange,
          forthRange: forthRange,
          fifthRange: fifthRange,
          sixthRange: sixthRange,
        });
        await Promise.all(
          editingExercise.reference.map(async (reference) => {
            await firestore()
              .collection('users')
              .doc(reference)
              .collection('exercises')
              .doc(editingExercise.id)
              .update({
                title: newExerciseTitle,
                sets: value,
                firstRange: firstRange,
                secondRange: secondRange,
                thirdRange: thirdRange,
                forthRange: forthRange,
                fifthRange: fifthRange,
                sixthRange: sixthRange,
              });
          })
        );
  
        fetchMasterExerciseDirectory();
        setShowAddExerciseModal(false);
        setEditingExercise(null);
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };
  

  useEffect(() => {

    fetchMasterExerciseDirectory();
  }, []);

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
      setValue(editingExercise.sets.toString());
    }
  } , [editingExercise]);
  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowAddExerciseModal(true);
  };

  return (
    <View style={styles.container}>
      <Text>MasterExerciseDirectoryScreen</Text>
      <FlatList
        data={masterExerciseDirectory}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => handleEditExercise(item)}
          >
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseTitle}>Exercise Title: {item.title}</Text>
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

export default MasterExerciseDirectoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  exerciseItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
