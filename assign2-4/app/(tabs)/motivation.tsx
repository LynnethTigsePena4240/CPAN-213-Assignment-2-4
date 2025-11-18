import { View, Text, StyleSheet } from 'react-native';

export default function MotivationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Motivation Tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
  },
});
