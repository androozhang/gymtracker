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
      <Text style={styles.title}>
        Master Exercises List
      </Text>
      <FlatList
        data={masterExercises}
        style={{ width: '100%', height: '100%'}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => addMasterExerciseToCurrentDay(item)}>
            <View style={styles.exerciseItem}>
              <Text>Exercise Title: {item.title}</Text>
              <Text>Sets: {item.sets}</Text>
              <Text>Rep Range: {item.repRange}</Text>
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
      backgroundColor: 'white',
      padding: 60,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      alignContent: 'center',
    },
    exerciseItem: {
      marginBottom: 16,
    },
  });
  
  
  

export default MasterExercisesList;
