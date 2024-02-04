import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit';

interface ExerciseChartProps {
    setDetail: Array<{
      set: number;
      weight: number;
      repRange: string;
    }>;
  }

const ExerciseChart: React.FC<ExerciseChartProps> = ({ setDetail }) => {
    
    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
      };

      const data = {
        labels: setDetail.map((set) => `Set ${set.set}`),
        datasets: [
          {
            data: setDetail.map((set) => set.weight),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ['Weight Progress'],
      };
    
      return (
        <View>
          <LineChart data={data} width={screenWidth} height={220} chartConfig={chartConfig} />
        </View>
      );
    };

export default ExerciseChart