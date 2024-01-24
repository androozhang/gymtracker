import { StyleSheet, View, Text, Pressable, FlatList, Button } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import Day from '../components/Day';
import { HomeStackNavigationProp } from '../navigations/types';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface RouterProps {
  navigation: HomeStackNavigationProp;
}

const HomeScreen = ({navigation}: RouterProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [open, setOpen] = useState(false);
  const [weekSet, setWeekSet] = useState(1);
  const [items, setItems] = useState([
    {label: '1', weekSet: '1'},
    {label: '2', weekSet: '2'}
  ]);

  return (
    <>
    <Text>{weekSet}</Text>
    <DropDownPicker
      open={open}
      value={weekSet}
      items={items}
      setOpen={setOpen}
      setValue={setWeekSet}
      setItems={setItems}
    />
    <FlatList
      data={days}
      renderItem={({ item }) => <Day day={item} weekSet={weekSet}/>}
      keyExtractor={(item) => item}
    />
    </>
  );
};

export default HomeScreen;