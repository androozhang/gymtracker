import React, { useEffect, useState } from 'react';
import { Modal, Text, TextInput, Button, View, FlatList, StyleSheet, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise, RootStackParamList } from '../navigations/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import MasterExercisesList from '../components/MasterExeciseList';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";



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
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [showMasterExercisesModal, setShowMasterExercisesModal] = useState(false);
  const [masterExercises, setMasterExercises] = useState<Exercise[]>([]);
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
  const [value, setValue] = useState(editingExercise? editingExercise.sets.toString() : '3');
  const [items, setItems] = useState([
    {label: '1 Set', value: '1'},
    {label: '2 Sets', value: '2'},
    {label: '3 Sets', value: '3'},
    {label: '4 Sets', value: '4'},
    {label: '5 Sets', value: '5'},
    {label: '6 Sets', value: '6'},   
  ]);

  const [showMasterExercisesList, setShowMasterExercisesList] = useState(false);

  // Temp data for line chart
  const screenWidth = Dimensions.get("window").width;
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };


  // Function to open the master exercises list
  const openMasterExercisesList = () => {
    setShowMasterExercisesList(true);
  };

  // Function to close the master exercises list
  const closeMasterExercisesList = () => {
    setShowMasterExercisesList(false);
  };

  const fetchMasterExercises = async () => {
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
          firstRange: data.firstRange,
          secondRange: data.secondRange,
          thirdRange: data.thirdRange,
          forthRange: data.forthRange,
          fifthRange: data.fifthRange,
          sixthRange: data.sixthRange,
          reference: data.reference,
        };
        // Only add the exercise to the masterExercises array if it is not already in the current day
        if (!data.reference.includes(`${user}/workoutPlans/${weekSet}/days/${day}`)) {
          masterExercises.push(exercise);
        }
      });
      console.log(masterExercises)
      setMasterExercises(masterExercises);
    } catch (error) {
      console.error("Error fetching master exercises:", error);
    }
  };

  
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
    fetchMasterExercises();
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
      setValue(editingExercise.sets.toString());
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
        reference: [`${user}/workoutPlans/${weekSet}/days/${day}`],
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
        const masterExerciseRef = masterExercisesRef.doc(editingExercise.id);
        const masterExerciseDoc = await masterExerciseRef.get();
        const masterExerciseData = masterExerciseDoc.data();
        const masterExerciseReference: String[] = masterExerciseData?.reference || [];
  
        // Remove the current day's reference from the master exercise
        const updatedMasterExerciseReference = masterExerciseReference.filter(ref => ref !== `${user}/workoutPlans/${weekSet}/days/${day}`);
        
        // Update the master exercise with the new reference
        await masterExerciseRef.update({
          title: editingExercise.title,
          sets: editingExercise.sets,
          firstRange: editingExercise.firstRange,
          secondRange: editingExercise.secondRange,
          thirdRange: editingExercise.thirdRange,
          forthRange: editingExercise.forthRange,
          fifthRange: editingExercise.fifthRange,
          sixthRange: editingExercise.sixthRange,
          reference: updatedMasterExerciseReference,
        });
  
        // Delete the exercise from the current day
        await exercisesRef.doc(editingExercise.id).delete();
        refreshExercises();

      // Close the modal
      setShowAddExerciseModal(false);
      setEditingExercise(null);

      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const addMasterExerciseToCurrentDay = async (masterExercise: Exercise) => {
    try { 
      // Add the selected exercise to the current day
      const existingReference = masterExercise.reference || [];
      
      await exercisesRef.doc(masterExercise.id).set({
        title: masterExercise.title,
        sets: masterExercise.sets,
        repRange: masterExercise.repRange,
        firstRange: masterExercise.firstRange,
        secondRange: masterExercise.secondRange,
        thirdRange: masterExercise.thirdRange,
        forthRange: masterExercise.forthRange,
        fifthRange: masterExercise.fifthRange,
        sixthRange: masterExercise.sixthRange,
        reference: [...existingReference, `${user}/workoutPlans/${weekSet}/days/${day}`],
      });

      await masterExercisesRef.doc(masterExercise.id).set({
        title: newExerciseTitle,
        sets: value,
        repRange: newExerciseRepRange,
        firstRange: firstRange,
        secondRange: secondRange,
        thirdRange: thirdRange,
        forthRange: forthRange,
        fifthRange: fifthRange,
        sixthRange: sixthRange,
        reference: [...existingReference, `${user}/workoutPlans/${weekSet}/days/${day}`],
      });

      closeMasterExercisesList();
      // Update the state to refresh the exercises
      refreshExercises();
  
      // Close the modal
      setShowMasterExercisesModal(false);
    } catch (error) {
      console.error("Error adding master exercise to current day:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{`Details for ${day}`}</Text>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setShowAddOptionModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleEditExercise(item)}>
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
            <LineChart
              data={data}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
            />
            


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
          setShowAddExerciseModal(true);
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
  // ... (Add more styles as needed)
});
