import React, { FC } from 'react';
import { View, FlatList, Text, TouchableHighlight, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../navigations/types';
import Ionicons from '@expo/vector-icons/Ionicons';

interface MasterExercisesListProps {
  masterExercises: Exercise[];
  addMasterExerciseToCurrentDay: (exercise: Exercise) => void;
  onClose: () => void;
}

const MasterExercisesList: FC<MasterExercisesListProps> = ({
  masterExercises,
  addMasterExerciseToCurrentDay,
  onClose,
}) => {

  return (
    <View>
      <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
        <Text style={styles.heading}>
          Master Exercises List
        </Text>
        <TouchableOpacity onPress={() => {
               onClose();
            }} style={{marginLeft: 'auto',}}>
              <Ionicons name="return-down-back-outline" size={24} color="black" />
            </TouchableOpacity>
      </View>
      <FlatList
        data={masterExercises}
        style={{paddingTop: 10, paddingBottom: 10}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => addMasterExerciseToCurrentDay(item)}>
            <View style={styles.exerciseItem}>
              <Text style={styles.exerciseTitle}>{item.title ? item.title: 'No name'}</Text>
              <Text>Sets: {item.setDetail.length}</Text>
              <Text>{item.setDetail[0].weight}lbs {item.setDetail[0].repRange}-{item.setDetail[item.setDetail.length - 1].repRange}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

// In the MasterExercisesList component
const styles = StyleSheet.create({
    heading: {
      fontSize: 24,
      fontWeight: '300',
      width: '100%',
      textAlign: 'center',
      height: 'auto'
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      alignContent: 'center',
    },
    exerciseItem: {
      backgroundColor: 'white',
      padding: 14,
      marginBottom: 8,
      borderRadius: 8,
      elevation: 2,
      borderColor: 'black',
      borderWidth: 0.5,
      shadowColor: 'rgba(0,0,0, 1)', 
      shadowOffset: { height: 3, width: 3 }, 
      shadowOpacity: 1, 
      shadowRadius: 0, 
      width: '99%'
    },
    exerciseTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    touchableButton: {
      flexDirection: 'row',
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 8,
      bottom: '30%',
      marginHorizontal: 0,
      borderColor: 'black',
      borderWidth: 0.5,
      shadowColor: 'rgba(0,0,0, 1)', 
      shadowOffset: { height: 3, width: 3 }, 
      shadowOpacity: 1, 
      shadowRadius: 0, 
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  
  

export default MasterExercisesList;
