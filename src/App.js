import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cart from "./Cart";
// import "./App.css";

const App = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const saveTasksToLocalStorage = (newTasks) => {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const addOrEditTask = () => {
    if (taskTitle && taskDescription && taskDueDate) {
      const newTask = {
        id: editTaskId ? editTaskId : Date.now(),
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false,
      };

      const updatedTasks = editTaskId
        ? tasks.map((task) => (task.id === editTaskId ? newTask : task))
        : [...tasks, newTask];

      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);

      resetForm();
    }
  };

  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const editTask = (task) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setEditTaskId(task.id);
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
    setEditTaskId(null);
  };

  const filterTasks = () => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Completed" ? task.completed : !task.completed);
      const matchesPriority =
        filterPriority === "All" || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  return (
    <div className="container">
      <header className="text-center my-4">
        <h1>Task Management</h1>
      </header>

      {/* Task Creation Section */}
      <div className="container">
      {/* Toggle Button */}
      <div className="text-center my-3">
        <button className="btn btn-success " onClick={toggleFormVisibility}>
          {isFormVisible ? (<>
      Close <i className="fas fa-chevron-up ms-1"></i>
    </>) : (
    <>
      Add New Task <i className="fas fa-chevron-down ms-1"></i>
    </>
  )}
        </button>
      </div>

      {/* Task Form */}
      {isFormVisible && (
        <div className="row rounded-2 p-2 align-items-stretch"  style={{ backgroundColor: "#444d5d" }}>
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Task Description */}
          <div className="col-md-6">
            <textarea
              className="form-control h-100"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              style={{ minHeight: "180px" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="col-12 d-flex align-items-center my-2">
            <button className="btn btn-primary" onClick={addOrEditTask}>
              {taskTitle ? "Update Task" : "Add Task"}
            </button>
            <button className="btn btn-secondary ms-3" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>

{/* ----------------------------------------- */}
      {/* Filter and Search Section */}
      <div className="row mb-4 mt-5 d-flex align-items-center">
        <div className="col-md-2">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Tasks</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Task List (Cart Component) */}
      <Cart
        tasks={filterTasks()}
        toggleCompletion={toggleCompletion}
        deleteTask={deleteTask}
        editTask={editTask} // Pass the editTask function to Cart
      />
    </div>
  );
};

export default App;
