import { View, Text, FlatList, TouchableHighlight, Button, ScrollView, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Exercise, HistoryEntry } from '../navigations/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExerciseChart from '../components/ExerciseChart';
import { useFirebase } from '../services/FirebaseContext';


const MasterExerciseDirectoryScreen = () => {
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const { user } = useFirebase();
  const userRef = firestore().collection('users').doc(user?.uid);
  const masterExerciseDirectoryRef = userRef.collection('masterExercises'); 
  const [masterExerciseDirectory, setMasterExerciseDirectory] = useState<Exercise[]>([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [newExerciseTitle, setNewExerciseTitle] = useState(editingExercise ? editingExercise.title : '');
  const [newExerciseSets, setNewExerciseSets] = useState(editingExercise ? editingExercise.sets : 3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8-12');  
  const [visibleData, setVisibleData] = useState<HistoryEntry[]>([]);
  const [allData, setAllData] = useState<HistoryEntry[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const fetchHistory = async () => {
    try {
      if (editingExercise) {
        const querySnapshot = await masterExerciseDirectoryRef.doc(editingExercise.id).collection("history").get();
        const history: HistoryEntry[] = [];
  
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          const entry: HistoryEntry = {
            date: data.date,
            sets: data.sets,
            setDetail: data.setDetail,
          };
          history.push(entry);
        });

        setAllData(history);
        setVisibleData(history);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  

  useEffect(() => {
    if (editingExercise) {
      fetchHistory();
    }
  }, [editingExercise]);
  
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
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      if (editingExercise && user) {
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
            const exerciseDocRef = firestore()
            .collection('users')
            .doc(reference)
            .collection('exercises')
            .doc(editingExercise.id);
            const historyRef = exerciseDocRef.collection('history').doc(currentDate);
            const existingEntrySnapshot = await historyRef.get();
            if (existingEntrySnapshot) {
              await historyRef.update({
                date: currentDate,
                sets: newExerciseSets,
                setDetail: setDetail,
              });

              await exerciseDocRef.update({
                title: newExerciseTitle,
                sets: newExerciseSets,
                setDetail: setDetail,
              });
            }
            else {
              await historyRef.update({
                date: currentDate,
                sets: newExerciseSets,
                setDetail: setDetail,
              });

              await exerciseDocRef.set({
                title: newExerciseTitle,
                sets: newExerciseSets,
                setDetail: setDetail,
              });
            }
              
          })
        );
        await masterExerciseDirectoryRef.doc(editingExercise.id).update({
          title: newExerciseTitle,
          sets: value,
          setDetail: setDetail, 
        });

        await masterExerciseDirectoryRef.doc(editingExercise.id).collection('history').doc(currentDate).set({
          date: currentDate,
          sets: newExerciseSets,
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
      <Text style={styles.heading}>Master Exercise List</Text>
      <FlatList
        data={masterExerciseDirectory}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => handleEditExercise(item)}
          >
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseTitle}>{item.title ? item.title: 'No name'}</Text>
              <Text>Sets: {item.setDetail.length}</Text>
              <Text>{item.setDetail[0].weight}lbs {item.setDetail[0].repRange}-{item.setDetail[item.setDetail.length - 1].repRange}</Text>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 20,}}>
          <View style={{ width: '100%', height: '100%', padding: 20, backgroundColor: 'white' }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 16, width: '100%', textAlign: 'center',}}>{editingExercise ? 'Edit Exercise' : 'Add Exercise'}</Text>
            <TextInput
              placeholder="Title"
              value={newExerciseTitle}
              onChangeText={text => setNewExerciseTitle(text)}
              style={{ borderColor: 'gray', padding: 8, marginBottom: 10, fontSize: 16 }}
            />
            <ScrollView>
              <View>
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
            </View>
            </ScrollView>
            {editingExercise ? <ExerciseChart history={visibleData}/> : null}
            <TouchableOpacity style={styles.touchableButton} onPress={addSet}>
              <Text style={styles.buttonText}>Add Set</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableButton}
              onPress={editingExercise ? updateExercise : addExercise}
            >
              <Text style={styles.buttonText}>
                {editingExercise ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.touchableButton, styles.deleteButton]}
              onPress={() => handleDeleteExercise()}
            >
              <Text style={[[styles.buttonText]]}>
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableButton}
              onPress={() => {
                setShowAddExerciseModal(false);
                setEditingExercise(null);
              }}
            >
              <Text style={styles.buttonText}>
                Cancel
              </Text>
            </TouchableOpacity>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 56,
    width: '100%',
    textAlign: 'center',
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
  touchableButton: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    color: 'black',
    backgroundColor: '#3498db'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Red color for delete button
  },
});
