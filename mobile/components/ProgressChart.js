import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function ProgressChart({ data, title }) {
  if (!data || Object.keys(data).length === 0) {
    return <Text style={styles.empty}>No data available</Text>;
  }

  const chartData = Object.entries(data).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    population: count,
    color: getColor(name),
    legendFontColor: '#333',
    legendFontSize: 12
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={200}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}

function getColor(key) {
  const colors = {
    happy: '#4CAF50', sad: '#2196F3', angry: '#F44336', neutral: '#9E9E9E',
    stressed: '#FF9800', excited: '#FFC107', productive: '#8BC34A',
    distraction: '#FF5722', physical: '#00BCD4', emotional: '#E91E63',
    social: '#9C27B0'
  };
  return colors[key] || '#ccc';
}

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  style: { borderRadius: 16 }
};

const styles = StyleSheet.create({
  container: { marginVertical: 15, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10, alignSelf: 'flex-start' },
  empty: { textAlign: 'center', color: '#999', marginVertical: 20 }
});