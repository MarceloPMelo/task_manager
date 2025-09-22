import React, { useCallback, useState } from 'react'
import AddTask from '../components/tasks/AddTask'
import TaskItem, { type Task } from '../components/tasks/TaskItem'

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleAddTask = useCallback((title: string) => {
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...prev,
    ])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [])

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <header style={{ width: '100%', maxWidth: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Minhas Tasks</h1>
      </header>

      <AddTask onAdd={handleAddTask} />

      <section style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
        {tasks.length === 0 ? (
          <p style={{ color: '#777', textAlign: 'center' }}>Nenhuma task ainda. Adicione a primeira!</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} />
          ))
        )}
      </section>
    </div>
  )
}

export default Home 