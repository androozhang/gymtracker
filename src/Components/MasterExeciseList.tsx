import React, { FC } from 'react';
import { View, FlatList, Text, TouchableHighlight, Button, StyleSheet } from 'react-native';
import { Exercise } from '../navigations/types';

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
    <View style={styles.container}>
      <Text style={styles.heading}>
        Master Exercises List
      </Text>
      <FlatList
        data={masterExercises}
        style={{ width: '100%', height: '100%'}}
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
      <Button title="Cancel" onPress={onClose} />
    </View>
  );
};

// In the MasterExercisesList component
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
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      alignContent: 'center',
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
  
  
  

export default MasterExercisesList;
