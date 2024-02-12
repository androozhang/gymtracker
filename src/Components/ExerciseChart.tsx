import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { LineChart } from 'react-native-chart-kit';

interface ExerciseChartProps {
  history?: Array<{
    date: string;
    setDetail: Array<{
      set: number;
      weight: number;
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

  if (!history || history.length === 0) {
    return <Text>No data</Text>;
  }

  const formattedData = {
    labels: history.map((day) => formatDate(day.date)),
    datasets: [
      {
        data: history.map((day) => day.setDetail[0].weight),
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
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default ExerciseChart;
