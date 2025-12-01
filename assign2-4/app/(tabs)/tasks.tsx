import { useEffect, useRef, useState } from "react";
import { Animated, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { useTasks } from "../../stores/taskStore";
import ProgressBar from "../components/progressBar";

const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#173981ff' : '#4b86adff',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
});

function Separator() {
  return <View style={styles.separator}></View>
}

// fade animation when task is added
function TaskFade({item, onToggle, onDelete}) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  // fade in effect
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // fade out when deleting task
  const deleteTask = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onDelete(item.id);
    }); 
  };

  return (
    <Animated.View style={[styles.taskContainer, { opacity: fadeAnimation }]}>
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.button}> 
        <Button title="Delete" onPress={deleteTask} />
      </View>
     
    </Animated.View>
  )
}

export default function TaskPage() {
  const { tasks, addTask, toggleTask, deleteTask, getProgress } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [progress, setProgress] = useState(0);
  // add a notification when tasks are added/deleted
  const [notification, setNotification] = useState(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  const handleAddTask = () => {
    const title = newTask.trim();
    if (title === "") {
      setNotification("Please enter a task.");
      return;
    }
    addTask(newTask);
    setNotification('New task added: "' + newTask + '"');
    setNewTask("");
  };

  useEffect(() => {
    const newProgress = getProgress();
    setProgress(newProgress);
  }, [tasks]);

  // notify user for 3 seconds
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => { setNotification(null); }, 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  let barColor = progress >= 100 ? "green" : (progress >= 50 ? "yellow" : "red");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Task Manager</Text>

      {notification && (
        <View style={ styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}

      <Separator />

      <View style={styles.progressSection}>
        <ProgressBar
          progress={progress}
          min={0}
          max={100}
          barColor={barColor}
          backColor="#ddd"
          borderColor="black"
        />

        <Separator />
        <Text style={styles.percentageText}>{progress}% Completed</Text>
      </View>

      <Separator />
      <Text style={styles.hintText}>Tap a task name to mark it complete!</Text>
      <Separator />

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, ]}
          placeholder="Add a new task"
          placeholderTextColor={isDarkMode ? "#999999" : "#555555"}
          value={newTask}
          onChangeText={setNewTask}
        />
        <View style = { styles.button}>
        <Button title="Add" onPress={handleAddTask} />
        </View>
      </View>


      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskFade
            item={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={(id) => { 
              deleteTask(id); 
              setNotification('Task deleted: "' + item.title + '"'); }} 
          />
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
    backgroundColor: "#4b86adff",
    paddingTop: 70
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
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
    color: "#333333",
    backgroundColor: "#ccc",
  },
  button: {
    width:90,
    borderRadius:10, 
    overflow: "hidden", 
  },
  notificationText: {
    color: "white",
    fontWeight: "bold",
    textAlign:"center",
    padding:10,
    margin:3
  },
  notification:{
    width:150,
    position:"absolute", 
    top:50, 
    right:200, 
    borderRadius:5,
    backgroundColor:"#3e6ca9ff",
  },
  taskContainer: {
    width: '75%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#3e6ca9ff",
    borderRadius: 8,
    paddingRight: 40,

  },
  taskText: {
    margin: 10,
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