import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  DayDetail: { day: string, weekSet: number};
  Login: undefined;
  Profile: undefined;
};

export type Exercise = {
  title: string;
  sets: number;
  repRange: string;
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