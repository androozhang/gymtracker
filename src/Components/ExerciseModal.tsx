import React, { useState } from 'react';
import { Modal, Text, TextInput, Button, View } from 'react-native';
import { Exercise } from '../navigations/types';

type ExerciseModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (newExercise: Exercise) => void;
  newExerciseTitle: string;
  setNewExerciseTitle: React.Dispatch<React.SetStateAction<string>>;
  newExerciseSets: number;
  setNewExerciseSets: React.Dispatch<React.SetStateAction<number>>;
  newExerciseRepRange: string;
  setNewExerciseRepRange: React.Dispatch<React.SetStateAction<string>>;
  exerciseToEdit?: Exercise | null;
};

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  visible,
  onClose,
  onAdd,
  newExerciseTitle,
  setNewExerciseTitle,
  newExerciseSets,
  setNewExerciseSets,
  newExerciseRepRange,
  setNewExerciseRepRange,
  exerciseToEdit,
}) => {
  const addExercise = () => {
    const updatedExercise: Exercise = exerciseToEdit
      ? {
          title: newExerciseTitle || exerciseToEdit.title,
          sets: newExerciseSets || exerciseToEdit.sets,
          repRange: newExerciseRepRange || exerciseToEdit.repRange,
        }
      : {
          title: newExerciseTitle,
          sets: newExerciseSets,
          repRange: newExerciseRepRange,
        };
  
    onAdd(updatedExercise);
    setNewExerciseTitle('');
    setNewExerciseSets(3);
    setNewExerciseRepRange('8-12');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, padding: 20, backgroundColor: 'white' }}>
          <Text>Add Exercise</Text>
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
          <Button title="Add" onPress={addExercise} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ExerciseModal;