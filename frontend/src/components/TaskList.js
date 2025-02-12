import { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const API_URL = "http://localhost:5000/tasks";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await axios.get(API_URL);
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const { data } = await axios.post(API_URL, { text: newTask });
    setTasks([...tasks, data]);
    setNewTask("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const updateTask = async (id, text) => {
    const { data } = await axios.put(`${API_URL}/${id}`, { text });
    setTasks(tasks.map((task) => (task._id === id ? data : task)));
  };

  const toggleCompletion = async (id) => {
  const task = tasks.find((task) => task._id === id);
  const { data } = await axios.put(`${API_URL}/${id}`, {
    text: task.text,
    completed: !task.completed,
  });
  setTasks(tasks.map((task) => (task._id === id ? data : task)));
};


  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  return (
    <div className="max-w-2xl w-full mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>
      <div className="flex mb-4">
        <input
          className="border p-2 flex-1 rounded-l"
          placeholder="Enter a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <TaskItem
                      task={task}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      toggleCompletion={toggleCompletion}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
