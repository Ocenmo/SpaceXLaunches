import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CounterProps {
  initialValue?: number;
}

export const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = React.useState(initialValue);

  return (
    <View testID="counter-container">
      <Text testID="counter-value">Count: {count}</Text>
      <TouchableOpacity
        testID="increment-button"
        onPress={() => setCount(count + 1)}
      >
        <Text>Increment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="decrement-button"
        onPress={() => setCount(count - 1)}
      >
        <Text>Decrement</Text>
      </TouchableOpacity>
    </View>
  );
};
