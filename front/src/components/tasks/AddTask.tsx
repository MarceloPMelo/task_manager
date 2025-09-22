import React, { useState } from 'react'
import axios from "axios";

interface AddTaskProps {
  onAdd: (title: string, description: string) => void
}

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => { // ⬅️ adiciona o async aqui
    e.preventDefault()

    try {
      console.log("Add task attempt. Title: ", title, " description: ", description)

      const response = await axios.post(
        "http://localhost:8080/tasks",
        { title, description },
        { withCredentials: true }
      );
      const data = response.data;
      console.log("Task adicionada: ", data);

      // chama o callback para atualizar a lista no pai
      onAdd(title, description)

      // limpa os inputs
      setTitle("")
      setDescription("")

    } catch (error: any) {
      if (error.response) {
        console.error("Erro ao adicionar task:", error.response.status, error.response.data);
      } else {
        console.error("Erro:", error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: 600 }}>
      <input
        type="text"
        placeholder="Título da task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6 }}
        required
      />
      <textarea
        placeholder="Descrição da task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, minHeight: '60px', resize: 'vertical' }}
        required
      />
      <button type="submit" style={{ padding: '10px 16px', borderRadius: 6, border: 'none', background: '#646cff', color: '#fff', cursor: 'pointer', alignSelf: 'flex-start' }}>
        Adicionar Task
      </button>
    </form>
  )
}

export default AddTask
