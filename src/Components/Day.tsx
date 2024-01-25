import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

interface DayProps {
  day: string;
  weekSet: string;
}

const Day = (props: DayProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DayDetail', { day: props.day, weekSet: props.weekSet});
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Text>{props.day}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Day;
