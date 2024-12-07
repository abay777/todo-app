import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

// Define a Todo item structure with title, description, and other fields
interface Todo {
  id: number;
  title: string; // Task title
  description: string; // Task description
  completed: boolean; // Completion status
}

// TodoStore defines the state and actions for managing the to-do list
interface TodoStore {
  todos: Record<string, Todo[]>; // Tasks grouped by date (key = yyyy-MM-dd)
  currentDay: string; // Selected date (yyyy-MM-dd)
  setDay: (date: string) => void; // Action to set the current day
  addTodo: (date: string, title: string, description: string) => void; // Add a new to-do item
  toggleTodo: (date: string, id: number) => void; // Toggle the completion status of a task
  editTodo: (date: string, id: number, updates: { title: string; description: string }) => void; // Edit a task
  deleteTodo: (date: string, id: number) => void; // Delete a task
}

// Zustand store implementation
const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: {}, // Default empty todos
      currentDay: format(new Date(), "yyyy-MM-dd"), // Default to today's date
      setDay: (date) => set({ currentDay: date }), // Set the current day
      addTodo: (date, title, description) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: [
              ...(state.todos[date] || []),
              { id: Date.now(), title, description, completed: false },
            ],
          },
        })),
      toggleTodo: (date, id) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: state.todos[date].map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          },
        })),
      editTodo: (date, id, updates) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: state.todos[date].map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            ),
          },
        })),
      deleteTodo: (date, id) =>
        set((state) => ({
          todos: {
            ...state.todos,
            [date]: state.todos[date].filter((todo) => todo.id !== id),
          },
        })),
    }),
    { name: "todo-storage" } // Local storage key for persistence
  )
);

export default useTodoStore;
