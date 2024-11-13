import React from 'react';

const Cart = ({ tasks, toggleCompletion, deleteTask, editTask }) => {
  return (
    <div className="task-list " 
    >
      {tasks.map((task) => (
        <div className="task mb-3 p-3 border-2 rounded" style={{ backgroundColor: '#111827', border: '  ' }} key={task.id}>
          <div className={`d-flex justify-content-between ${task.completed ? 'text-decoration-line-through' : ''}`}>
            <div>
              <h4>{task.title}</h4>
              <p className="mx-3" style={{ color: '#6c757d' }}>{task.description}</p>
              <p><strong>Due Date:</strong> {task.dueDate}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
            </div>
            <div>
              <button className="btn btn-success me-2" onClick={() => toggleCompletion(task.id)}>
                {task.completed ? 'Undo' : 'Mark as Done'}
              </button>
              <button className="btn btn-warning me-2" onClick={() => editTask(task)}> {/* Call editTask when clicked */}
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
