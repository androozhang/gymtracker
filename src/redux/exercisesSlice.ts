import { createSlice } from '@reduxjs/toolkit';

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState: {
    loading: true,
    list: [],
    editingExercise: null,
  },
  reducers: {
    setExercises: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    setEditingExercise: (state, action) => {
      state.editingExercise = action.payload;
    },
    // ... add more reducers as needed
  },
});

export const { setExercises, setEditingExercise } = exercisesSlice.actions;

export default exercisesSlice.reducer;