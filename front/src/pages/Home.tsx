import { useEffect, useState } from "react";
import AddTask from '../components/tasks/AddTask';
import TaskCard from '../components/tasks/TaskCard'; // importar o novo componente
import axios from "axios";
import {Header}   from "../components/Header";

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/tasks", { withCredentials: true })
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.error(err));
  }, []);

  const handleAddTask = async (title: string, description: string) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/tasks",
        { title, description, done: false },
        { withCredentials: true }
      );
      setTasks(prev => [...prev, res.data.task]);
      console.log("[Home] Task adicionada:", res.data.task);
    } catch (err) {
      console.error("Erro ao adicionar tarefa", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        <AddTask onAdd={handleAddTask} />

        <h2 className="text-2xl font-bold my-6">Minhas Tasks</h2>
        <div className="flex flex-col gap-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              done={task.done}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
