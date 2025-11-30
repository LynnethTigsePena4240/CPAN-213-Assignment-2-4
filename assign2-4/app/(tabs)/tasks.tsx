import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import ProgressBar from "../components/progressBar";
import { useTasks } from "../../stores/taskStore";

function Seperator() {
  return <View style={styles.separator}></View>
}

export default function TaskPage() {
  const { tasks, addTask, toggleTask, deleteTask, getProgress } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [progress, setProgress] = useState(0);

  // bounce animation for task addition
  const bounceTask = useRef(new Animated.Value(1)).current;

  const handleAddTask = () => {
    addTask(newTask);
    setNewTask("");

    // animatioon to fade in task added
    Animated.timing(fadeEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const newProgress = getProgress();
    setProgress(newProgress);
  }, [tasks]);

  let barColor = progress >= 100 ? "green" : (progress >= 50 ? "yellow" : "red");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>

      <Seperator />

      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          min={0}
          max={100}
          barColor={barColor}
          backColor="#ddd"
          borderColor="black"
        />

        <Seperator />
        <Text style={styles.percentageText}>{progress}% Completed</Text>
      </View>

      <Seperator />

      <Text style={styles.hintText}>Tap a task name to mark it complete!</Text>
      <Seperator />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Add" onPress={handleAddTask} />
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity style={styles.button} onPress={() => toggleTask(item.id)}>
              <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    padding: 10,
    backgroundColor: "#1e1e1e",
    paddingTop: 30
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  progressSection: {
    width: '33%',
    alignSelf: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  hintText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#aaa",
    textAlign: "center",
    marginBottom: 5,
  },
  inputContainer: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    color: "#000",
    backgroundColor: "#ccc",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  taskContainer: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingRight: 40,

  },
  taskText: {
    fontSize: 18,
    color: "#fff",
  },
  taskTextCompleted: {
    fontSize: 18,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  separator: {
    height: 10,
  },
});