import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { LineChart } from 'react-native-chart-kit';

interface ExerciseChartProps {
  history?: Array<{
    date: string;
    setDetail: Array<{
      set: number;
      weight: string;
      repRange: string;
    }>;
  }>;
}

const ExerciseChart: React.FC<ExerciseChartProps> = ({ history }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(1, 50, 32, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const emptyData = {
    labels: ['No Data'],
    datasets: [
      {
        data: [0],
      },
    ],
  };

  if (!history || history.length === 0) {
    return <LineChart
          data={emptyData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 20,
            borderRadius: 16,
            borderColor: '#000',
            borderWidth: 1,
          }}
        />;
  }

  const formattedData = {
    labels: history.map((day) => formatDate(day.date)),
    datasets: [
      {
        data: history.map((day) => parseInt(day.setDetail[0].weight)),
      },
    ],
  };

  return (
    <View>
      <LineChart
        data={formattedData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 20,
          borderRadius: 16,
          borderColor: '#000',
          borderWidth: 1,
        }}
      />
    </View>
  );
};

export default ExerciseChart;
