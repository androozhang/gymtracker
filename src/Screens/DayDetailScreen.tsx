import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, Button, View, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Exercise, RootStackParamList } from '../navigations/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import MasterExercisesList from '../components/MasterExeciseList';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExerciseChart from '../components/ExerciseChart';
import { HistoryEntry, SetDetail } from '../navigations/types';
import { useFirebase } from '../services/FirebaseContext';


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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [showMasterExercisesModal, setShowMasterExercisesModal] = useState(false);
  const [masterExercises, setMasterExercises] = useState<Exercise[]>([]);
  const [newExerciseTitle, setNewExerciseTitle] = useState(editingExercise ? editingExercise.title : '');
  const [newExerciseSets, setNewExerciseSets] = useState(editingExercise ? editingExercise.sets : 3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8');  
  const { user } = useFirebase();
  const userRef = firestore().collection('users').doc(user?.uid);
  const exercisesRef = userRef.collection('workoutPlans').doc(weekSet).collection("days").doc(day).collection('exercises');
  const masterExercisesRef = userRef.collection('masterExercises');
  const [value, setValue] = useState(editingExercise? editingExercise.sets.toString() : '3');
  const [visibleData, setVisibleData] = useState<HistoryEntry[]>([]);
  const [allData, setAllData] = useState<HistoryEntry[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  

  const fetchHistory = async () => {
    if (user) {
      try {
        if (editingExercise) {
          const querySnapshot = await exercisesRef.doc(editingExercise.id).collection("history").get();
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
    }
  };

  useEffect(() => {
    if (editingExercise) {
      fetchHistory();
    }
  }, [editingExercise]);

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
    console.log("text", text)
    console.log("newsetDetail[index].repRange", newSetDetail[index].repRange)
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

  const [showMasterExercisesList, setShowMasterExercisesList] = useState(false);
  const openMasterExercisesList = () => {
    setShowMasterExercisesList(true);
  };
  const closeMasterExercisesList = () => {
    setShowMasterExercisesList(false);
  };

  const fetchMasterExercises = async () => {
    if (user) {
      try {
        const querySnapshot = await masterExercisesRef.get();
        const masterExercises: Exercise[] = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          const exercise: Exercise = {
            id: documentSnapshot.id,
            title: data.title,
            sets: data.sets,
            repRange: data.repRange,
            setDetail: data.setDetail || [{ set: 1, weight: 0, repRange: `10` }],  // Set default value if setDetail is not present
            reference: data.reference,
          };
          // Only add the exercise to the masterExercises array if it is not already in the current day
          if (data.reference && !data.reference.includes(`${user}/workoutPlans/${weekSet}/days/${day}`)) {
            masterExercises.push(exercise);
          }
        });
        setMasterExercises(masterExercises);
      } catch (error) {
        console.error("Error fetching master exercises:", error);
      }
    }
  };

  
  async function refreshExercises() {
    if (user) {
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
            setDetail: data.setDetail || [{ set: 1, weight: 0, repRange: `10` }],  // Set default value if setDetail is not present
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
  }

  useEffect(() => {
    refreshExercises();
    fetchMasterExercises();
  }, []);

  
  useEffect(() => {
    if (editingExercise) {
      setNewExerciseTitle(editingExercise.title);
      setNewExerciseSets(editingExercise.sets);
      setSetDetail(editingExercise.setDetail);
      setValue(editingExercise.sets.toString());
    }
  } , [editingExercise]);
  

  const addExercise = async () => {
    if (user) {
      const currentDate = new Date().toISOString().split('T')[0];
      try {
        const exerciseRef = await exercisesRef.add({
          title: newExerciseTitle,
          sets: value,
          repRange: newExerciseRepRange,
          setDetail: setDetail,  // Add the setDetail to the exercise
          reference: [`${user.uid}/workoutPlans/${weekSet}/days/${day}`],
        });
    
        // Get the ID of the added exercise
        const exerciseId = exerciseRef.id;
    
        // Add exercise to masterExercisesRef with the same ID
        await masterExercisesRef.doc(exerciseId).set({
          title: newExerciseTitle,
          sets: value,
          repRange: newExerciseRepRange,
          setDetail: setDetail,  // Add the setDetail to the exercise
          reference: [`${user.uid}/workoutPlans/${weekSet}/days/${day}`],
        });

        await masterExercisesRef.doc(exerciseId).collection('history').doc(currentDate).set({
          date: currentDate,
          sets: newExerciseSets,
          setDetail: setDetail,
        });
    
        // Add the exercise to the day's subcollection under the "exercises" collection
        const dayRef = userRef.collection('workoutPlans').doc(weekSet).collection("days").doc(day);
        const exerciseHistoryRef = dayRef.collection('exercises').doc(exerciseId);
    
        // Add the exercise to the day's subcollection
        await exerciseHistoryRef.set({
          title: newExerciseTitle,
          sets: value,
          repRange: newExerciseRepRange,
          setDetail: setDetail,
          reference: [`${user.uid}/workoutPlans/${weekSet}/days/${day}`],
        });
    
        // Add history entry to the "history" subcollection
        await exerciseHistoryRef.collection('history').doc(currentDate).set({
          date: currentDate,
          sets: newExerciseSets,
          setDetail: setDetail,
        });
    
        setNewExerciseTitle('');
        setNewExerciseSets(3);
        setNewExerciseRepRange('8-12');
        setSetDetail([{ set: 1, weight: 0, repRange: `10` }]);  // Reset setDetail
    
        refreshExercises();
        setShowAddExerciseModal(false);
      } catch (error) {
        console.error("Error adding exercise:", error);
      }
    }
    else {
      console.error("User not logged in");
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowAddExerciseModal(true);
    setNewExerciseTitle(exercise.title);
    setNewExerciseSets(exercise.sets);
    setNewExerciseRepRange(exercise.repRange);
    setSetDetail(exercise.setDetail);
  };

  const updateExercise = async () => {
    if (user) {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        if (editingExercise && editingExercise.reference) {
          await Promise.all(
            editingExercise.reference.map(async (reference) => {
              const exerciseDocRef = firestore()
                .collection('users')
                .doc(reference)
                .collection('exercises')
                .doc(editingExercise.id);
               
              const historyEntryRef = exerciseDocRef.collection('history').doc(currentDate);
              // Check if there's an entry for the current day
              const existingEntrySnapshot = await historyEntryRef.get();
    
              if (existingEntrySnapshot.exists) {
                // Update the existing entry for the current day
                await historyEntryRef.update({
                  date: currentDate,
                  sets: newExerciseSets,
                  setDetail: setDetail,
                });
  
                await exerciseDocRef.update({
                  title: newExerciseTitle,
                  sets: newExerciseSets,
                  setDetail: setDetail,
                });
  
              } else {
                // Add a new entry for the current day
                await exerciseDocRef.update({
                  title: newExerciseTitle,
                  sets: newExerciseSets,
                  setDetail: setDetail,
                });
    
                await historyEntryRef.set({
                  date: currentDate,
                  sets: newExerciseSets,
                  setDetail: setDetail,
                });
              }
            })
          );
    
          // Update the master exercise
          const masterExerciseRef = masterExercisesRef.doc(editingExercise.id);
          const masterHistoryEntryRef = masterExerciseRef.collection('history').doc(currentDate);
    
          // Check if there's an entry for the current day in the master exercise
          const existingMasterEntrySnapshot = await masterHistoryEntryRef.get();
          if (existingMasterEntrySnapshot.exists) {
            // Update the existing entry for the master exercise
            await masterHistoryEntryRef.update({
              date: currentDate,
              sets: newExerciseSets,
              setDetail: setDetail,
            });
  
            await masterExerciseRef.update({
              title: newExerciseTitle,
              sets: value,
              setDetail: setDetail,
            });
            console.log(masterExerciseRef.path)
  
          } else {
            // Add a new entry for the current day for the master exercise
            await masterExerciseRef.update({
              title: newExerciseTitle,
              sets: value,
              setDetail: setDetail,
            });
    
            await masterHistoryEntryRef.set({
              date: currentDate,
              sets: newExerciseSets,
              setDetail: setDetail,
            });
          }
    
          refreshExercises();
          setShowAddExerciseModal(false);
          setEditingExercise(null);
        }
      } catch (error) {
        console.error("Error updating exercise:", error);
      }
    }
    else
    {
      console.error("User not logged in");
    }
  };
  
  


  const deleteExercise = async () => {
    try {
      if (editingExercise && user) {
        const masterExerciseRef = masterExercisesRef.doc(editingExercise.id);
        const masterExerciseDoc = await masterExerciseRef.get();
        const masterExerciseData = masterExerciseDoc.data();
        const masterExerciseReference: String[] = masterExerciseData?.reference || [];
  
        // Remove the current day's reference from the master exercise
        const updatedMasterExerciseReference = masterExerciseReference.filter(ref => ref !== `${user.uid}/workoutPlans/${weekSet}/days/${day}`);
        
        // Update the master exercise with the new reference
        await masterExerciseRef.update({
          reference: updatedMasterExerciseReference,
        });
  
        await exercisesRef.doc(editingExercise.id).delete();
        refreshExercises();

      setShowAddExerciseModal(false);
      setEditingExercise(null);

      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  
  const addMasterExerciseToCurrentDay = async (masterExercise: Exercise) => {
    if (user) {
      try { 
        const existingReference = masterExercise.reference || [];
        await exercisesRef.doc(masterExercise.id).set({
          title: masterExercise.title,
          sets: masterExercise.sets,
          repRange: masterExercise.repRange,
          setDetail: masterExercise.setDetail, 
          reference: [...existingReference, `${user.uid}/workoutPlans/${weekSet}/days/${day}`],
        });
  
        await masterExercisesRef.doc(masterExercise.id).set({
          title: newExerciseTitle,
          sets: value,
          repRange: newExerciseRepRange,
          setDetail: setDetail,  
          reference: [...existingReference, `${user.uid}/workoutPlans/${weekSet}/days/${day}`],
        });
  
        closeMasterExercisesList();
        refreshExercises();
    
        setShowMasterExercisesModal(false);
      } catch (error) {
        console.error("Error adding master exercise to current day:", error);
      }
    }
  };
  

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{`Details for ${day}`}</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleEditExercise(item)}>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseTitle}>Exercise Title: {item.title}</Text>
              <Text>Sets: {item.setDetail.length}</Text>
              <Text>Weight: {item.setDetail[0].weight}lbs x {item.setDetail[0].repRange}-{item.setDetail[item.setDetail.length - 1].repRange}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
      <View style={styles.addBox}>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setShowAddOptionModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      </View>



      <Modal
        visible={showAddExerciseModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddExerciseModal(false);
          setEditingExercise(null);
        }}
        presentationStyle='pageSheet'
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
            {editingExercise ? <ExerciseChart history={visibleData}/> : null}
            <Button title="Add Set" onPress={addSet} />


            <Button title={editingExercise ? 'Update' : 'Add'} onPress={editingExercise ? updateExercise : addExercise} />
            {editingExercise && (
              <Button title="Delete" onPress={deleteExercise} color="red" />
            )}
            <Button title="Cancel" onPress={() => {
              setShowAddExerciseModal(false);
              setEditingExercise(null);
              setNewExerciseTitle('');
            }} />
          </View>
        </View>
      </Modal>




      <Modal
        visible={showAddOptionModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowAddOptionModal(false);
        }}
        presentationStyle='pageSheet'
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Add Exercise" onPress={() => {
          setEditingExercise(null);
          setShowAddExerciseModal(true);
          setNewExerciseTitle('');
          setNewExerciseSets(3);
          setNewExerciseRepRange('8-12');
          setSetDetail([{ set: 1, weight: 0, repRange: `10` }]);
          setShowAddOptionModal(false);
        }} />
        <Button title="Add Exercise from Master Exercise Directory" onPress={() => {
          openMasterExercisesList();
          setShowAddOptionModal(false);
        }} />
        <Button title="Cancel" onPress={() => {
          setShowAddOptionModal(false);
        }} />
        </View>





      </Modal>
      {showMasterExercisesList && (
        <Modal
        visible={showMasterExercisesList}
        animationType="slide"
        transparent={true}
        onRequestClose={closeMasterExercisesList}
      >
        <MasterExercisesList
          masterExercises={masterExercises}
          addMasterExerciseToCurrentDay={addMasterExerciseToCurrentDay}
          onClose={closeMasterExercisesList}
        />
      </Modal>
      )}
    </View>
  );
};

export default DayDetailScreen;

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
  },
  plusButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
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
  addBox: {
    alignItems: 'center',
  }
  // ... (Add more styles as needed)
});
