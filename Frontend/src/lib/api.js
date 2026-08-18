const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("dailytracker_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request("/auth/me"),

  getTasks: () => request("/tasks"),

  addTask: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    }),

  updateTask: (id, task) =>
    request(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(task),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};
