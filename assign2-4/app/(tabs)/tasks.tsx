import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet,Text ,TextInput, FlatList, TouchableOpacity, Animated} from "react-native";
import ProgressBar from "../components/progressBar";


// manually creating space between each element 
function Seperator(){
  return <View style={styles.separator}></View>
}

type Task = { 
  id: string; 
  title: string; 
  completed:boolean; 
  fade: Animated.Value;
}


export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [progress, setProgress] = useState(0);

  // bounce animation for task addition
  const bounceTask = useRef(new Animated.Value(1)).current;

  const addTask = () => {
    if (newTask.trim() === "") return;

    const fadeEffect = new Animated.Value(0);

    const task: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: newTask,
      completed: false,
      fade: fadeEffect,
    };
    setTasks([...tasks, task]);
    setNewTask("");

    // animatioon to fade in task added
    Animated.timing(fadeEffect, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // bounce animation function
  const bounce = (id: string) => {
    bounceTask.setValue(1);

    Animated.sequence([
      Animated.timing(bounceTask, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceTask, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    toggleTask(id);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // progress when tasks change
  useEffect(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const newProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    setProgress(newProgress);
  }, [tasks]);

  let barColor = progress >= 100 ? "green" : "blue";

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={progress}
        min={0}
        max={100}
        barColor={barColor}
        backColor="#ddd"
        borderColor="black"
      />

      <Seperator />
      <Text style={styles.text}>{progress}%</Text>
      <Seperator />

      <Seperator />

      <Text style={styles.text}>Task Manager</Text>
      <Seperator />
      <View style = { styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Seperator />

      <Button title="Add" onPress={addTask} />
      <Seperator />
      </View>
    

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {

          const animationStyle = { opacity: item.fade,
            transform: [{ scale: bounceTask }],
          };

          return (
            <Animated.View style={[styles.taskContainer, animationStyle]}>
              <TouchableOpacity onPress={() => bounce(item.id)} style={{ flex: 1 }}>
                <Text style={item.completed ? styles.taskTextCompleted : styles.taskText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
              <Button title="Delete" color="red" onPress={() => deleteTask(item.id)} />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:0,
    padding: 10,
    backgroundColor: "#1e1e1e",
    paddingTop:30
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  input: {
    flex:1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom:10,
    color: "#000",
    backgroundColor:"#ccc",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  taskContainer: {
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
    fontSize: 16,
    color: "#fff",
  },
  taskTextCompleted: {
    fontSize: 16,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  separator: {
    height: 1,
    margin:10,
  },
});

