import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import { Exercise } from '../navigations/types';

const userRef = firestore().collection('users').doc(FIREBASE_AUTH.currentUser?.uid);
const masterExerciseDirectoryRef = userRef.collection('masterExerciseDirectory');

const MasterExerciseDirectoryScreen = () => {
  const [masterExerciseDirectory, setMasterExerciseDirectory] = useState<Exercise[]>([]);

  useEffect(() => {
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
          };
          exercises.push(exercise);
        });

        setMasterExerciseDirectory(exercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchMasterExerciseDirectory();
  }, []);

  return (
    <View>
      <Text>MasterExerciseDirectoryScreen</Text>
      <FlatList
        data={masterExerciseDirectory}
        renderItem={({ item }) => (
          <TouchableHighlight
            onPress={() => console.log(item.id)}
          >
            <View>
              <Text>Exercise Title: {item.title}</Text>
              <Text>Sets: {item.sets}</Text>
              <Text>Rep Range: {item.repRange}</Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

export default MasterExerciseDirectoryScreen;
