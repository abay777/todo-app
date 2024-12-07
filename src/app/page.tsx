
import ToDoUI from "@/components/TodoUi";
import AddTaskModal from "@/components/AddTaskModel";

export default function Home() {
  return (
    <div className="max-w-md mx-auto my-10">
      <h1 className="text-2xl font-bold text-center">To-Do List</h1>
      <ToDoUI/>
      
    </div>
  );
}
