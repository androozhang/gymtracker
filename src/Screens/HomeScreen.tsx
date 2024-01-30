import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../services/FirebaseConfig';
import Day from '../components/Day';
import { HomeStackNavigationProp } from '../navigations/types';
import DropDownPicker from 'react-native-dropdown-picker';

interface RouterProps {
  navigation: HomeStackNavigationProp;
}

const HomeScreen = ({ navigation }: RouterProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('firstSet');
  const [items, setItems] = useState([
    { label: 'First Set', value: 'firstSet' },
    { label: 'Second Set', value: 'secondSet' },
    { label: 'Third Set', value: 'thirdSet' },
  ]);

  const renderDayCard = (day: string) => (
    <TouchableOpacity style={styles.dayCard} onPress={() => navigation.navigate('DayDetail', { day, weekSet: value })}>
      <Text style={styles.dayText}>{day}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        labelStyle={styles.dropdownLabel}
        dropDownContainerStyle={styles.dropdownListContainer}
      />
      <FlatList
        data={days}
        renderItem={({ item }) => renderDayCard(item)}
        keyExtractor={(item) => item}
      />
      <Button title="Exercise Directory" onPress={() => navigation.navigate('MasterExerciseDirectory')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '50%',
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownLabel: {
    fontSize: 16,
    textAlign: 'center',
  },
  dropdownListContainer: {
    backgroundColor: '#fafafa',
  },
  dayCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    justifyContent: 'center',
  },
});

export default HomeScreen;
