import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cart from "./Cart";
import "./App.css";

const App = () => {
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
    setIsFormVisible(true);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
    setEditTaskId(null);
  };

  const filterTasks = (status) => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      let matchesStatus = false;

      // Check for status filter (Upcoming, Completed, Overdue)
      if (status === "upcoming") {
        // For upcoming tasks, filter by not completed and task date not expired
        matchesStatus = !task.completed && new Date(task.dueDate) > new Date();
      } else if (status === "completed") {
        // For completed tasks, filter by tasks that are completed
        matchesStatus = task.completed;
      } else if (status === "overdue") {
        // For overdue tasks, filter by tasks that are not completed and due date passed
        matchesStatus = !task.completed && new Date(task.dueDate) < new Date();
      }

      // Check for priority filter
      const matchesPriority =
        filterPriority === "All" || task.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  const [upComing, setUpComing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [overdue, setOverdue] = useState(false);

  const toggleUpComing = () => {
    setUpComing((prev) => !prev);
  };
  const toggleCompleted = () => {
    setCompleted((prev) => !prev);
  };
  const toggleOverdue = () => {
    setOverdue((prev) => !prev);
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
          <button className="btn btn-success" onClick={toggleFormVisibility}>
            {isFormVisible ? (
              <>
                Close <i className="fas fa-chevron-up ms-1"></i>
              </>
            ) : (
              <>
                Add New Task <i className="fas fa-chevron-down ms-1"></i>
              </>
            )}
          </button>
        </div>

        {/* Task Form with Transition */}
        <div
          className={`form-container ${isFormVisible ? "visible" : "hidden"}`}
          style={{
            transition: "height 0.5s ease, opacity 0.5s ease",
          }}
        >
          <div
            className="row rounded-2 p-2 align-items-stretch"
            style={{ backgroundColor: "#444d5d" }}
          >
            <div className="col-md-6 d-flex flex-column justify-content-between">
              <div className="mb-3 ">
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
            <div className="col-md-6 mb-3">
              <textarea
                className="form-control "
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{ minHeight: "150px" }}
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
        </div>
      </div>

      {/* ----------------------------------------- */}
      {/* Filter and Search Section */}
      <div className="row mb-4 mt-5 d-flex align-items-center">
        {/* <div className="col-md-2">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Tasks</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div> */}

        <div className="col-md-3">
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

        <div className="col-md-9">
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

      <div className="my-2 row ">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            className="btn"
            onClick={toggleUpComing}
            style={{
              backgroundColor: "#0c0b0b",
              color: "#0aad38",
              fontSize: "20px", // Larger font
              fontWeight: "bold",
              padding: "10px 20px", // Add padding for better spacing
              width: "fit-content", // Shrink the button's width to fit the text
              borderRadius: "5px", // Optional: Rounded corners for aesthetics
            }}
          >
            
            {upComing ? (
              <>
                Close <i className="fas fa-chevron-up ms-1"></i>
              </>
            ) : (
              <>
                Upcoming Task <i className="fas fa-chevron-down ms-1"></i>
              </>
            )}
          </button>
         
          <hr
            style={{
              marginTop: "10px", // Space between button and line
              width: "100%", // Full width of the container
              height: "2px", // Line thickness
              backgroundColor: "#000000", // Pure black color for the line
              border: "none",
            }}
          />
        </div>
        {upComing && (
          <div>
            <Cart
              tasks={filterTasks("upcoming")}
              toggleCompletion={toggleCompletion}
              deleteTask={deleteTask}
              editTask={editTask} // Pass the editTask function to Cart
            />
          </div>
        )}
      </div>

      <div className="my-2 row ">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            className="btn"
            onClick={toggleCompleted}
            style={{
              backgroundColor: "#0c0b0b",
              color: "#c4c9f3",
              fontSize: "20px", // Larger font
              fontWeight: "bold",
              padding: "10px 20px", // Add padding for better spacing
              width: "fit-content", // Shrink the button's width to fit the text
              borderRadius: "5px", // Optional: Rounded corners for aesthetics
            }}
          >
            {completed ? (
              <>
                Close <i className="fas fa-chevron-up ms-1"></i>
              </>
            ) : (
              <>
                Completed Task <i className="fas fa-chevron-down ms-1"></i>
              </>
            )}
          </button>
          <hr
            style={{
              marginTop: "10px", // Space between button and line
              width: "100%", // Full width of the container
              height: "2px", // Line thickness
              backgroundColor: "#000000", // Pure black color for the line
              border: "none",
            }}
          />
        </div>
        {completed && (
          <Cart
            tasks={filterTasks("completed")}
            toggleCompletion={toggleCompletion}
            deleteTask={deleteTask}
            editTask={editTask} // Pass the editTask function to Cart
          />
        )}
      </div>

      <div className="my-2 row">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            className="btn btn-danger"
            onClick={toggleOverdue}
            style={{
              backgroundColor: "#0c0b0b",
              color: "#b70606",
              fontSize: "20px", // Larger font
              fontWeight: "bold",
              padding: "10px 20px", // Add padding for better spacing
              width: "fit-content", // Shrink the button's width to fit the text
              borderRadius: "5px",
              border:"none" // Optional: Rounded corners for aesthetics
            }}
          >
            {overdue ? (
              <>
                Close <i className="fas fa-chevron-up ms-1"></i>
              </>
            ) : (
              <>
                Overdue Task <i className="fas fa-chevron-down ms-1"></i>
              </>
            )}
          </button>
          <hr
            style={{
              marginTop: "10px", // Space between button and line
              width: "100%", // Full width of the container
              height: "2px", // Line thickness
              backgroundColor: "#000000", // Pure black color for the line
              border: "none",
            }}
          />
        </div>
        {overdue && (
          <Cart
            tasks={filterTasks("overdue")}
            toggleCompletion={toggleCompletion}
            deleteTask={deleteTask}
            editTask={editTask} // Pass the editTask function to Cart
          />
        )}
      </div>

      {/* <Cart
        tasks={filterTasks()}
        toggleCompletion={toggleCompletion}
        deleteTask={deleteTask}
        editTask={editTask} // Pass the editTask function to Cart
      /> */}
    </div>
  );
};

export default App;
