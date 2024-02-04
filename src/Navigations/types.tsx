import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  DayDetail: { day: string, weekSet: string};
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
  Profile: undefined;
  MasterExerciseDirectory: undefined;
};

export type Exercise = {
  id: string;
  title: string;
  sets: number;
  repRange: string;
  setDetail: Array<{
    set: number;
    weight: number;
    repRange: string;
  }>;
  reference: string[];
  history: Array<{
    date: string;
    setDetail: Array<{
      set: number;
      weight: number;
      repRange: string;
    }>;
  }>;
  // ... other properties
};


export type HomeStackNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type ProfileStackNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export type AppNavigationProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
};

export type AppRouteProps<T extends keyof RootStackParamList> = {
  route: { params?: RootStackParamList[T] } & ParamListBase;
};

declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }