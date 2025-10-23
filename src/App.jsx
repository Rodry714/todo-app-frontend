import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./services/api";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { showAddTaskModal, showEditTaskModal, showConfirmDelete } from "./utils/alerts";

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Error fetching tasks");
    }
  };

  const addTask = async () => {
    const data = await showAddTaskModal();
    if (!data) return;
    try {
      await API.post("/tasks", {
        title: data.title,
        description: data.description,
        priority: data.priority || "normal",
      });
      toast.success("Task created successfully");
      fetchTasks();
    } catch {
      toast.error("Error creating task");
    }
  };

  const editTask = async (task) => {
    const data = await showEditTaskModal(task);
    if (!data) return;
    try {
      await API.put(`/tasks/${task.id}`, {
        title: data.title,
        description: data.description,
        completed: task.completed,
        priority: task.priority || "normal",
      });
      toast.success("Tarea actualizada correctamente");
      fetchTasks();
    } catch {
      toast.error("Error al actualizar la tarea");
    }
  };

  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task.id}`, {
      title: task.title,
      description: task.description,
      completed: !task.completed,
      priority: task.priority || "normal",
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const confirmed = await showConfirmDelete();
    if (!confirmed) return;
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filtros + búsqueda
  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "uncompleted") return !task.completed;
        return true;
      })
      .filter((task) => {
        if (!q) return true;
        return (
          (task.title || "").toLowerCase().includes(q) ||
          (task.description || "").toLowerCase().includes(q)
        );
      });
  }, [tasks, filter, search]);

  // Progreso del dia del usuario
  const todayStats = useMemo(() => {
    const today = new Date();
    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
    const todays = tasks.filter((t) => isSameDay(new Date(t.created_at), today));
    const done = todays.filter((t) => t.completed).length;
    const total = todays.length;
    return {
      done,
      total,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  }, [tasks]);

  return (
    <div>
      {/* Sidebar izquierdo*/}
      <aside className={`sidebar-left ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-left-content">
          {/* Título */}
          <h1 className="sidebar-title">TO-DO LIST</h1>
          
          <ul className="sidebar-menu">
            <li>
              <button
                onClick={addTask}
                type="button"
                className="sidebar-button-primary"
              >
                Agregar nueva tarea
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("all")}
                className={`sidebar-button ${filter === "all" ? "active" : ""}`}
              >
                <span>Todas las tareas</span>
                <span className="task-count">{tasks.length}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("completed")}
                className={`sidebar-button ${filter === "completed" ? "active" : ""}`}
              >
                <span>Tareas completadas</span>
                <span className="task-count">{tasks.filter(t => t.completed).length}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("uncompleted")}
                className={`sidebar-button ${filter === "uncompleted" ? "active" : ""}`}
              >
                <span>Tareas sin completar</span>
                <span className="task-count">{tasks.filter(t => !t.completed).length}</span>
              </button>
            </li>
            <li className="separator">
              <button
                onClick={handleLogout}
                className="sidebar-button"
              >
                <span>Cerrar sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* SIDEBAR DERECHO - Usuario */}
      <aside className={`sidebar-right ${isRightPanelOpen ? "open" : ""}`}>
        <div className="sidebar-right-content">
          <div className="user-profile">
            <img className="user-avatar" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
            <h3 className="user-name">Usuario</h3>
            <p className="user-email">user@example.com</p>
          </div>
          <ul className="user-stats">
            <li>
              <div className="stat-item">
                <span className="stat-label">Tareas Pendientes</span>
                <p className="stat-value">{tasks.filter(t => !t.completed).length}</p>
              </div>
            </li>
            <li>
              <div className="stat-item">
                <span className="stat-label">Progreso del día</span>
                <p className="stat-value">{todayStats.percent}%</p>
                <p className="stat-subtext">{todayStats.done}/{todayStats.total} completadas</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* OVERLAY - COMENTADO */}
      {/* {(isSidebarOpen || isRightPanelOpen) && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightPanelOpen(false);
          }}
        />
      )} */}

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <div className="main-container">
          {/* Barra de búsqueda */}
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="search-container">
              <div className="search-icon">
                <svg fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                placeholder="Buscar tareas..."
              />
            </div>
          </form>

          {/* Grid de cards */}
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <h5 className="task-title">
                    {task.title}
                  </h5>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <button
                    onClick={() => toggleComplete(task)}
                    className={`task-status-button ${
                      task.completed ? "completed" : "pending"
                    }`}
                  >
                    {task.completed ? "Completada" : "Pendiente"}
                  </button>
                  <div className="task-actions">
                    <button
                      onClick={() => editTask(task)}
                      className="task-edit-button"
                      title="Editar tarea"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="task-delete-button"
                      title="Eliminar tarea"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
