import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Exercise } from '../navigations/types';
import { RootState } from './store';

interface ExercisesState {
    exercises: Exercise[];
    editingExercise: Exercise | null;
    loading: boolean;
}

const initialState: ExercisesState = {
    exercises: [],
    editingExercise: null,
    loading: true,
  };
  
  const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {
      setExercises: (state, action: PayloadAction<Exercise[]>) => {
        state.exercises = action.payload;
        state.loading = false;
      },
      setEditingExercise: (state, action: PayloadAction<Exercise | null>) => {
        state.editingExercise = action.payload;
      },
    },
  });
  
  export const { setExercises, setEditingExercise } = exercisesSlice.actions;
  
  export const selectExercises = (state: RootState) => state.exercises;
  
  export default exercisesSlice.reducer;