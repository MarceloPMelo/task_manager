import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import AddTask from '../components/tasks/AddTask'

const HomePage = () => {
  const handleAddTask = (title: string, description: string) => {
    console.log('Tarefa adicionada:', title, description)
  }

  return (
    <div>
      <Navbar />
      <AddTask onAdd={handleAddTask} />
    </div>
  )
}

export default HomePage
