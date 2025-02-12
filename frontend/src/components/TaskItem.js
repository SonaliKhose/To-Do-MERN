import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

export default function TaskItem({
  task,
  deleteTask,
  updateTask,
  toggleCompletion,
  provided,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing && editedText.trim()) {
      updateTask(task._id, editedText);
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && editedText.trim()) {
      updateTask(task._id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <li
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className="flex justify-between items-center p-2 border-b bg-gray-50 rounded"
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleCompletion(task._id)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        {isEditing ? (
          <input
            className="border p-1 flex-1 mr-2 rounded"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        ) : (
          <span
            className={`flex-1 ${task.completed ? 'line-through' : ''}`}
            onDoubleClick={handleEdit}
          >
            {task.text}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <button onClick={handleEdit} className="text-blue-500">
          <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
        </button>
        <button onClick={() => deleteTask(task._id)} className="text-red-500">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
}
