import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './exercisesSlice';

export const store = configureStore({
    reducer: {
        exercises: exercisesReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
