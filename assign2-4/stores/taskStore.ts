import { useState, useEffect } from 'react';

export type Task = {
    id: string;
    title: string;
    completed: boolean;
};

let tasksState: Task[] = [];
let listeners: Array<() => void> = [];

const emitChange = () => {
    listeners.forEach(listener => listener());
};

const updateTasks = (newTasks: Task[]) => {
    tasksState = newTasks;
    emitChange();
};

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>(tasksState);

    useEffect(() => {
        const listener = () => {
            setTasks(tasksState);
        };

        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const addTask = (title: string) => {
        if (title.trim() === "") return;
        const task: Task = {
            id: Date.now().toString(),
            title: title,
            completed: false,
        };
        updateTasks([...tasksState, task]);
    };

    const toggleTask = (id: string) => {
        const newTasks = tasksState.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        updateTasks(newTasks);
    };

    const deleteTask = (id: string) => {
        const newTasks = tasksState.filter((task) => task.id !== id);
        updateTasks(newTasks);
    };

    const getTopTasks = (): Task[] => {
        return tasksState
            .filter(task => !task.completed)
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .slice(0, 3);
    };

    const getProgress = (): number => {
        const totalCount = tasksState.length;
        if (totalCount === 0) {
            return 0;
        }
        const completedCount = tasksState.filter((t) => t.completed).length;
        return Math.round((completedCount / totalCount) * 100);
    }

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        getTopTasks,
        getProgress
    };
};