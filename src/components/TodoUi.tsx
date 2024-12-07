'use client';
import React, { useEffect, useState, useRef } from "react";
import { format, addDays, startOfMonth, endOfMonth, parseISO } from "date-fns";
import AddTaskModal from "./AddTaskModel";
import useTodoStore from "@/store/TodoStore";

const ToDoUI: React.FC = () => {
  const { currentDay, setDay, todos, toggleTodo, deleteTodo, editTodo } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [monthDates, setMonthDates] = useState<Date[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return format(today, "yyyy-MM-dd");
  };

  useEffect(() => {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const dates:any = [];
    let current = start;
    while (current <= end) {
      dates.push(current);
      current = addDays(current, 1);
    }
    setMonthDates(dates);

    const today = getTodayDate();
    setDay(today);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        const todayIndex = dates.findIndex((date:any) => format(date, "yyyy-MM-dd") === today);
        if (todayIndex >= 0) {
          const todayElement = scrollContainerRef.current.children[todayIndex] as HTMLElement;
          todayElement.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
      }
    }, 100);
  }, [setDay]);

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setDay(formattedDate);
  };

  const handleEditSubmit = (id: number) => {
    if (editData.title.trim() && editData.description.trim()) {
      editTodo(currentDay, id, editData);
      setEditingId(null);
      setEditData({ title: "", description: "" });
    }
  };

  const isCurrentDayToday = (): boolean => {
    const today = getTodayDate();
    return currentDay === today;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Scrollable Date Picker */}
        <div
          ref={scrollContainerRef}
          className="p-4 flex overflow-x-auto no-scrollbar gap-4"
        >
          {monthDates.map((date, index) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const isSelected = currentDay === formattedDate;

            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`flex flex-col items-center justify-center w-12 h-12 p-4 cursor-pointer ${
                  isSelected
                    ? "bg-black text-white rounded-xl"
                    : "text-gray-500 hover:bg-gray-300"
                }`}
              >
                <span className="text-sm font-bold">
                  {format(date, "E").charAt(0)}
                </span>
                <span className="text-xs">{format(date, "d")}</span>
              </div>
            );
          })}
        </div>

        {/* Task List */}
        <div className="p-4">
          <h2 className="text-lg font-bold">
            {isCurrentDayToday() ? "Today" : format(parseISO(currentDay), "EEEE, MMMM d, yyyy")}
          </h2>
          <div className="space-y-4 mt-4">
            {todos[currentDay]?.length > 0 ? (
              todos[currentDay]?.map((todo) => (
                <div
                  key={todo.id}
                  className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div
                        onClick={() => toggleTodo(currentDay, todo.id)}
                        className={`w-6 h-6 flex items-center justify-center rounded-full border-2 cursor-pointer ${
                          todo.completed
                            ? "bg-black border-black text-white"
                            : "border-gray-400 text-gray-400"
                        }`}
                      >
                        {todo.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      {editingId === todo.id ? (
                        <div className="flex flex-col ml-3">
                          <input
                            type="text"
                            value={editData.title}
                            onChange={(e) =>
                              setEditData({ ...editData, title: e.target.value })
                            }
                            placeholder="Edit title"
                            className="mb-2 p-1 border rounded"
                          />
                          <textarea
                            value={editData.description}
                            onChange={(e) =>
                              setEditData({ ...editData, description: e.target.value })
                            }
                            placeholder="Edit description"
                            className="p-1 border rounded"
                          />
                        </div>
                      ) : (
                        <div className="ml-3">
                          <h3
                            className={`font-semibold ${
                              todo.completed ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {todo.title}
                          </h3>
                          <p className="text-sm text-gray-500">{todo.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {editingId === todo.id ? (
                        <button
                          onClick={() => handleEditSubmit(todo.id)}
                          className="text-green-500"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(todo.id);
                            setEditData({
                              title: todo.title,
                              description: todo.description,
                            });
                          }}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteTodo(currentDay, todo.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                {isCurrentDayToday() ? "No tasks for today." : "No tasks for this day."}
              </p>
            )}
          </div>
        </div>

        {/* Add Task Button */}
        <div className="flex items-center justify-center p-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 p-2 text-black border-black border-2 font-bold rounded-full text-2xl text-center align-middle "
          >
            +
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ToDoUI;
