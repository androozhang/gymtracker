import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigations/types';

type DayDetailScreenRouteProp = RouteProp<RootStackParamList, 'DayDetailScreen'>;
type DayDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DayDetailScreen'>;

type DayDetailScreenProps = {
  route: DayDetailScreenRouteProp;
  navigation: DayDetailScreenNavigationProp;
};

const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ route }) => {
  const { day } = route.params;

  return (
    <View>
      <Text>{`Details for ${day}`}</Text>
    </View>
  );
};

export default DayDetailScreen;

const styles = StyleSheet.create({});
