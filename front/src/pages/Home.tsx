import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { TaskCard } from "@/components/TaskCard";
import type { Task } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { toast } from "@/hooks/use-toast";

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);


  useEffect(() => {
    axios.get("http://localhost:8080/tasks", { withCredentials: true })
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.error(err));
  }, []);

  const handleAddTask = async ({ title, description }: { title: string; description: string }) => {
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


  const handleToggleComplete = async (id: string) => {

    try {
      const res = await axios.patch(
        `http://localhost:8080/tasks/${id}`,
        { done: !tasks.find(task => task.id === id)?.done },
        { withCredentials: true }
      );

      console.log("[Home] Task alternada:", res.data.task);
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      );
    } catch (err) {
      console.error("Erro ao alternar tarefa", err);
    }

  };

  const handleDeleteTask = async (id: string) => {

    try {
      const res = await axios.delete(
        `http://localhost:8080/tasks/${id}`,
        { withCredentials: true }
      );

      setTasks(prev => prev.filter(task => task.id !== id));
      console.log(res);
      toast({
        title: "Task removida",
        description: "A task foi removida com sucesso.",
      });

    } catch (err) {
      console.error("Erro ao remover tarefa", err);
    }
  };

  const completedCount = tasks.filter(task => task.done).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Add Task Form */}
          <TaskForm onAddTask={handleAddTask} />

          {/* Tasks Stats */}
          {tasks.length > 0 && (
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span>Total: {totalCount} tasks</span>
              <span>•</span>
              <span>Concluídas: {completedCount}</span>
              <span>•</span>
              <span>Pendentes: {totalCount - completedCount}</span>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">Nenhuma task ainda</p>
                  <p className="text-sm">
                    Comece adicionando sua primeira task acima
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 max-w-2xl mx-auto">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
