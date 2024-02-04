import { View, Text, FlatList, TouchableHighlight, Button, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise } from '../navigations/types';
import DropDownPicker from 'react-native-dropdown-picker';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from '@expo/vector-icons/Ionicons';

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
  
  const [value, setValue] = useState(editingExercise? editingExercise.sets : '3');

  const [setDetail, setSetDetail] = useState([
    { set: 1, weight: 0, repRange: `10` }, // Initial set
  ]);
  const addSet = () => {
    const newSet = { set: setDetail.length + 1, weight: 0, repRange: `10` };
    setSetDetail([...setDetail, newSet]);
  };
  const updateRepRange = (index: number, text: string) => {
    const newSetDetail = [...setDetail];
    newSetDetail[index].repRange = text;
    setSetDetail(newSetDetail);
  };
  const updateWeight = (index: number, text: string) => {
    const newSetDetail = [...setDetail];
    newSetDetail[index].weight = parseInt(text) || 0;
    setSetDetail(newSetDetail);
  }
  const handleDeleteSet = (index: number) => {
    const newSetDetail = setDetail.filter((set, i) => i !== index);
    setSetDetail(newSetDetail);
  };

  const addExercise = async () => {
    try {
      await masterExerciseDirectoryRef.add({
        title: newExerciseTitle,
        sets: value,
        repRange: newExerciseRepRange,
        setDetail: setDetail,
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
      const masterExercises: Exercise[] = [];
      querySnapshot.forEach(documentSnapshot => {
        const data = documentSnapshot.data();
        const exercise: Exercise = {
          id: documentSnapshot.id,
          title: data.title,
          sets: data.sets,
          repRange: data.repRange,
          setDetail: data.setDetail, 
          reference: data.reference,
          history: data.history,
        };  
        console.log(data.setDetail);
        masterExercises.push(exercise);
      });
      setMasterExerciseDirectory(masterExercises);
    } catch (error) {
      console.error("Error fetching master exercises:", error);
    }
  };
  
  const handleDeleteExercise = async () => {
    try {
      if (editingExercise) {
        await Promise.all(
          editingExercise.reference.map(async (reference) => {
            await firestore()
              .collection('users')
              .doc(reference)
              .collection('exercises')
              .doc(editingExercise.id)
              .delete();
          })
        );
        await masterExerciseDirectoryRef.doc(editingExercise.id).delete();
        fetchMasterExerciseDirectory();
        setShowAddExerciseModal(false);
        setEditingExercise(null);
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  }

  const updateExercise = async () => {
    try {
      if (editingExercise) {
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
                setDetail: setDetail,  
              });
          })
        );
        await masterExerciseDirectoryRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: value,
          setDetail: setDetail, 
        });
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


  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowAddExerciseModal(true);
    setNewExerciseTitle(exercise.title);
    setNewExerciseSets(exercise.sets);
    setNewExerciseRepRange(exercise.repRange);
    setSetDetail(exercise.setDetail);
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
        transparent={false}
        presentationStyle='pageSheet'
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
            {setDetail.map((setDetail, index) => (
              <View key={`setDetail-${index}`} style={styles.setDetailContainer}>
                <Text style={styles.setDetailText}>
                  Set {setDetail.set}
                </Text>
                <TextInput
                  style={styles.setInput}
                  placeholder={`Weight`}
                  value={setDetail.weight.toString()}
                  onChangeText={(text) => updateWeight(index, text)}
                />
                 <Text style={styles.label}>lbs</Text>
                <TextInput
                  style={styles.setInput}
                  placeholder={`Reps`}
                  value={setDetail.repRange}
                  onChangeText={(text) => updateRepRange(index, text)}
                />
                <Text style={styles.label}>reps</Text>
                <TouchableOpacity onPress={() => handleDeleteSet(index)}>
                  <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <Button title={editingExercise ? 'Update' : 'Add'} onPress={editingExercise ? updateExercise : addExercise} />
            <Button title="Delete" onPress={() => handleDeleteExercise()} />
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
  setDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setDetailText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  setInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    paddingRight: 10,
  },
});
