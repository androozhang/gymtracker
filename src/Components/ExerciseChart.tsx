import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit';

interface ExerciseChartProps {
    history: Array<{ 
        date: string;
        setDetail: Array<{
            set: number;
            weight: number;
            repRange: string;
        }>;
    }>;
  }

const ExerciseChart: React.FC<ExerciseChartProps> = ({ history }) => {
    
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
        labels: history.map((item) => item.date),
        datasets: [
          {
            data: history.map((item) => item.setDetail.reduce((acc, set) => acc + set.weight, 0)),
          }
        ]
      };
    
      return (
        <View>
          <LineChart data={data} width={screenWidth} height={220} chartConfig={chartConfig} />
        </View>
      );
    };

export default ExerciseChart