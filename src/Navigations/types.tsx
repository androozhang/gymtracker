import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  DayDetail: { day: string, weekSet: string};
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  MasterExerciseDirectory: undefined;
};

export type Exercise = {
  id: string;
  title: string;
  sets: number;
  repRange: number;
  firstRange: number;
  secondRange: number;
  thirdRange: number;
  forthRange: number;
  fifthRange: number;
  sixthRange: number;
  reference: string[];
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