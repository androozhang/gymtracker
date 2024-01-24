import React, { useState } from 'react';
import { Modal, Text, TextInput, Button, View } from 'react-native';
import { Exercise } from '../navigations/types';

type ExerciseModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdd: (newExercise: Exercise) => void;
};

const ExerciseModal: React.FC<ExerciseModalProps> = ({ visible, onClose, onAdd }) => {
  const [newExerciseTitle, setNewExerciseTitle] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState(3);
  const [newExerciseRepRange, setNewExerciseRepRange] = useState('8-12');

  const addExercise = () => {
    const newExercise: Exercise = {
        title: newExerciseTitle,
        sets: newExerciseSets,
        repRange: newExerciseRepRange,
      };
    onAdd(newExercise);
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
