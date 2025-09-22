import React from 'react'

export interface Task {
  id: number
  title: string
  description: string
  userId: number
}

interface TaskItemProps {
  task: Task
  onToggle?: (id: number) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px', border: '1px solid #eee', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="checkbox"
          onChange={() => onToggle?.(task.id)}
        />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{task.title}</h3>
      </div>
      {task.description && (
        <p style={{ margin: 0, fontSize: 14, color: '#666', marginLeft: 28 }}>{task.description}</p>
      )}
    </div>
  )
}

export default TaskItem 