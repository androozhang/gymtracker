import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  HomeStack: undefined;
  DayDetailScreen: { day: string };
  Login: undefined;
  ProfileStack: undefined;
};

export type HomeStackNavigationProp = StackNavigationProp<RootStackParamList, 'HomeStack'>;
export type ProfileStackNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileStack'>;

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