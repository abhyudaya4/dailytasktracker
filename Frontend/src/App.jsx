import React, { useState, useMemo, useEffect } from "react";
import { api } from "./lib/api";
import {
  LayoutDashboard,
  ClipboardList,
  Calendar as CalendarIcon,
  BarChart3,
  FolderKanban,
  Settings,
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  Search,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  X,
  Menu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

/* ---------------------------------------------------------
   Design tokens
--------------------------------------------------------- */
const C = {
  primary: "#7C3AED",
  primaryDark: "#6D28D9",
  primaryLight: "#EDE9FE",
  sidebarFrom: "#1E1B4B",
  sidebarTo: "#241F5C",
  bg: "#F5F5FB",
  card: "#FFFFFF",
  text: "#1E1B33",
  muted: "#8B8AA0",
  border: "#ECEBF5",
  success: "#22C55E",
  successBg: "#DCFCE7",
  warning: "#F59E0B",
  warningBg: "#FEF3C7",
  danger: "#EF4444",
  dangerBg: "#FEE2E2",
};

const CATEGORY_COLORS = {
  Study: "#7C3AED",
  Work: "#F59E0B",
  Personal: "#22C55E",
  Health: "#EF4444",
};

const PRIORITY_COLORS = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "taskForm", label: "Add Task", icon: ClipboardList },
  { id: "taskList", label: "My Tasks", icon: FolderKanban },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "statistics", label: "Statistics", icon: BarChart3 },
];


const fmtDate = (iso) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

function getlocalDateKey(date = new Date()){
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


/* ---------------------------------------------------------
   Shared UI bits
--------------------------------------------------------- */
function Sidebar({ current, onNavigate, userName, isOpen, onClose }) {
  const handleNavigate = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop - mobile/tablet only, shown while drawer is open */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(15, 13, 38, 0.55)" }}
        aria-hidden={!isOpen}
      />

      <div
        className={`flex flex-col justify-between shrink-0 fixed md:static inset-y-0 left-0 z-50 w-[78vw] max-w-[280px] sm:w-64 md:w-56 lg:w-[220px] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ background: `linear-gradient(180deg, ${C.sidebarFrom}, ${C.sidebarTo})`, color: "#fff" }}
      >
        <div>
          <div className="flex items-center justify-between gap-2 px-5 py-6">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.primary }}>
                <CheckCircle2 size={18} color="#fff" />
              </div>
              <span className="font-semibold text-lg tracking-tight truncate">DailyTracker</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg shrink-0"
              style={{ color: "#B9B7D6" }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="mt-2 px-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
                  style={{
                    background: active ? C.primary : "transparent",
                    color: active ? "#fff" : "#B9B7D6",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mt-1 text-left"
              style={{ color: "#B9B7D6" }}
            >
              <Settings size={17} />
              Settings
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
            style={{ background: C.primaryLight, color: C.primary }}
          >
            {userName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs truncate" style={{ color: "#8A88AE" }}>
              {userName.split(" ")[0].toLowerCase()}@email.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: C.card, border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}

function Dot({ color }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />;
}

function StatusBadge({ status }) {
  const done = status === "Done";
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: done ? C.successBg : C.warningBg, color: done ? "#15803D" : "#B45309" }}
    >
      {done ? "Done" : "Pending"}
    </span>
  );
}

/* ---------------------------------------------------------
   1. DASHBOARD
--------------------------------------------------------- */
function Dashboard({ tasks, toggleTask, onNavigate, userName }) {
  const today = getlocalDateKey();
  const todayTasks = tasks.filter((t) => t.date === today);
  const completedToday = todayTasks.filter((t) => t.status === "Done").length;
  const progress = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;
  const completedThisWeek = tasks.filter((t) => t.status === "Done").length;
  const { currentStreak } = calculateStreaks(tasks);
  const upcoming = tasks
    .filter((t) => t.date > today)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  const r = 40;
  const circumference = 2 * Math.PI * r;

  const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
};

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: C.text }}>
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: C.primaryLight }}>
          <Sparkles size={16} color={C.primary} className="shrink-0" />
          <span className="text-sm font-medium" style={{ color: C.primaryDark }}>
            "Small steps every day lead to big results."
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <svg width="88" height="88" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke={C.border} strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={C.primary}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill={C.text}>
              {progress}%
            </text>
          </svg>
          <div>
            <p className="text-xs mb-1" style={{ color: C.muted }}>
              Today's Progress
            </p>
            <p className="text-sm font-semibold" style={{ color: C.text }}>
              {completedToday} of {todayTasks.length}
            </p>
            <p className="text-xs" style={{ color: C.muted }}>
              tasks completed
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            All Tasks
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold" style={{ color: C.text }}>
              {tasks.length}
            </span>
            <ClipboardList size={22} color={C.primary} />
          </div>
          <p className="text-xs mt-2" style={{ color: C.muted }}>
            This Week
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            Completed
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold" style={{ color: C.text }}>
              {completedThisWeek}
            </span>
            <CheckCircle2 size={22} color={C.success} />
          </div>
          <p className="text-xs mt-2" style={{ color: C.muted }}>
            This Week
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-xs mb-3" style={{ color: C.muted }}>
            Streak
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold" style={{ color: C.text }}>
              {currentStreak}
            </span>
            <Flame size={22} color="#F97316" />
          </div>
          <p className="text-xs mt-2" style={{ color: C.muted }}>
            Days
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: C.text }}>
              Today's Tasks
            </h3>
            <button onClick={() => onNavigate("taskList")} className="text-sm font-medium" style={{ color: C.primary }}>
              View All
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {todayTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTask(t.id)}>
                    {t.status === "Done" ? (
                      <CheckCircle2 size={19} color={C.success} />
                    ) : (
                      <Circle size={19} color={C.muted} />
                    )}
                  </button>
                  <span
                    className="text-sm"
                    style={{
                      color: t.status === "Done" ? C.muted : C.text,
                      textDecoration: t.status === "Done" ? "line-through" : "none",
                    }}
                  >
                    {t.title}
                  </span>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate("taskForm")}
            className="flex items-center gap-2 text-sm font-medium mt-4"
            style={{ color: C.primary }}
          >
            <Plus size={16} /> Add New Task
          </button>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: C.text }}>
            Upcoming
          </h3>
          <div className="flex flex-col gap-4">
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: CATEGORY_COLORS[t.category] }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: C.text }}>
                    {t.title}
                  </p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {fmtDate(t.date)}, {t.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate("calendar")}
            className="text-sm font-medium mt-4"
            style={{ color: C.primary }}
          >
            View Calendar
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   2. TASK FORM
--------------------------------------------------------- */
function TaskForm({ addTask, onNavigate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Study",
    priority: "High",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    recurring: false,
  });
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const submit = () => {
    if (!form.title.trim()) {
      setError("Enter a task title first");
      return;
    }
    addTask(form);
    setForm({ title: "", description: "", category: "Study", priority: "High", date: new Date().toISOString().slice(0, 10), time: "10:00", recurring: false });
    setError("");
    onNavigate("taskList");
  };

  const inputStyle = {
    width: "100%",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 14,
    color: C.text,
    outline: "none",
    background: "#FAFAFD",
  };
  const labelStyle = { fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6, display: "block" };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex justify-center">
      <Card className="p-5 sm:p-6 md:p-8 w-full" style={{ maxWidth: 620 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.primaryLight }}>
            <ClipboardList size={20} color={C.primary} />
          </div>
          <div>
            <h2 className="font-semibold text-lg" style={{ color: C.text }}>
              Add New Task
            </h2>
            <p className="text-sm" style={{ color: C.muted }}>
              Create a new task to stay productive.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Task Title *</label>
            <input
              style={inputStyle}
              placeholder="e.g. Study React for 2 hours"
              value={form.title}
              onChange={update("title")}
            />
            {error && (
              <p className="text-xs mt-1" style={{ color: C.danger }}>
                {error}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              placeholder="Add more details about this task..."
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={update("category")}>
                {Object.keys(CATEGORY_COLORS).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={form.priority} onChange={update("priority")}>
                {Object.keys(PRIORITY_COLORS).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Date</label>
              <input type="date" style={inputStyle} value={form.date} onChange={update("date")} />
            </div>
            <div>
              <label style={labelStyle}>Time (Optional)</label>
              <input type="time" style={inputStyle} value={form.time} onChange={update("time")} />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium" style={{ color: C.text }}>
              Recurring Task
            </span>
            <button
              onClick={() => setForm((f) => ({ ...f, recurring: !f.recurring }))}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ background: form.recurring ? C.primary : "#D9D8E8" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: form.recurring ? 22 : 2 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: C.primary }}
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   3. TASK LIST
--------------------------------------------------------- */
function TaskList({ tasks, toggleTask, deleteTask, onNavigate }) {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    let list = tasks;
    if (tab === "Today") list = list.filter((t) => t.date === getlocalDateKey());
    if (tab === "Pending") list = list.filter((t) => t.status === "Pending");
    if (tab === "Completed") list = list.filter((t) => t.status === "Done");
    if (query.trim()) list = list.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [tasks, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const changeTab = (t) => {
    setTab(t);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: C.text }}>
            My Tasks
          </h1>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Manage all your tasks
          </p>
        </div>
        <button
          onClick={() => onNavigate("taskForm")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white shrink-0"
          style={{ background: C.primary }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "#F2F1FA" }}>
            {["All", "Today", "Pending", "Completed"].map((t) => (
              <button
                key={t}
                onClick={() => changeTab(t)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
                style={{ background: tab === t ? "#fff" : "transparent", color: tab === t ? C.primary : C.muted }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 sm:flex-initial" style={{ border: `1px solid ${C.border}` }}>
              <Search size={15} color={C.muted} className="shrink-0" />
              <input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="text-sm outline-none w-full sm:w-[150px]"
              />
            </div>
            <button className="p-2.5 rounded-xl shrink-0" style={{ border: `1px solid ${C.border}` }}>
              <Filter size={15} color={C.muted} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr style={{ color: C.muted, textAlign: "left" }}>
              <th className="pb-3 font-medium">Task</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Priority</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t) => (
              <tr key={t.id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td className="py-3 pr-3" style={{ color: C.text }}>
                  {t.title}
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <Dot color={CATEGORY_COLORS[t.category]} /> {t.category}
                  </span>
                </td>
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <Dot color={PRIORITY_COLORS[t.priority]} /> {t.priority}
                  </span>
                </td>
                <td className="py-3" style={{ color: C.muted }}>
                  {fmtDate(t.date)}
                </td>
                <td className="py-3">
                  <button onClick={() => toggleTask(t.id)}>
                    <StatusBadge status={t.status} />
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => onNavigate("taskForm")}>
                      <Pencil size={15} color={C.muted} />
                    </button>
                    <button onClick={() => deleteTask(t._id)}>
                      <Trash2 size={15} color={C.danger} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center" style={{ color: C.muted }}>
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-xs" style={{ color: C.muted }}>
            Showing {pageItems.length ? (page - 1) * pageSize + 1 : 0} to {(page - 1) * pageSize + pageItems.length} of{" "}
            {filtered.length} tasks
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg"
              style={{ border: `1px solid ${C.border}` }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className="w-7 h-7 rounded-lg text-xs font-medium"
                style={{
                  background: page === i + 1 ? C.primary : "transparent",
                  color: page === i + 1 ? "#fff" : C.text,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg"
              style={{ border: `1px solid ${C.border}` }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------
   4. CALENDAR
--------------------------------------------------------- */
function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const grid = [];
  for (let i = startWeekday - 1; i >= 0; i--) {
    grid.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) grid.push({ day: d, current: true });
  let next = 1;
  while (grid.length % 7 !== 0) {
    grid.push({ day: next++, current: false });
  }
  return grid;
}

function CalendarPage({ tasks, onNavigate }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7); // August (0-indexed)
  const [selected, setSelected] = useState("2026-08-16");

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month]);
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long" });

  const dateKey = (day) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const tasksOn = (key) => tasks.filter((t) => t.date === key);
  const selectedTasks = tasksOn(selected);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6" style={{ color: C.text }}>
        Calendar
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                <ChevronLeft size={15} />
              </button>
              <h3 className="font-semibold" style={{ color: C.text }}>
                {monthName} {year}
              </h3>
              <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                <ChevronRight size={15} />
              </button>
            </div>
            <span
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: C.primaryLight, color: C.primaryDark }}
            >
              Month
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium py-1" style={{ color: C.muted }}>
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell, i) => {
              const key = dateKey(cell.day);
              const isSelected = cell.current && key === selected;
              const dayTasks = cell.current ? tasksOn(key) : [];
              return (
                <button
                  key={i}
                  disabled={!cell.current}
                  onClick={() => setSelected(key)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm"
                  style={{
                    background: isSelected ? C.primary : "transparent",
                    color: !cell.current ? "#D3D2E5" : isSelected ? "#fff" : C.text,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {cell.day}
                  {dayTasks.length > 0 && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: isSelected ? "#fff" : C.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-1" style={{ color: C.text }}>
            Tasks on {fmtDate(selected)}
          </h3>
          <p className="text-xs mb-4" style={{ color: C.muted }}>
            {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""} scheduled
          </p>
          <div className="flex flex-col gap-3">
            {selectedTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {t.status === "Done" ? (
                    <CheckCircle2 size={17} color={C.success} />
                  ) : (
                    <Circle size={17} color={C.muted} />
                  )}
                  <span
                    className="text-sm"
                    style={{
                      color: t.status === "Done" ? C.muted : C.text,
                      textDecoration: t.status === "Done" ? "line-through" : "none",
                    }}
                  >
                    {t.title}
                  </span>
                </div>
                <span className="text-xs flex items-center gap-1" style={{ color: C.muted }}>
                  <Clock size={12} /> {t.time}
                </span>
              </div>
            ))}
            {selectedTasks.length === 0 && (
              <p className="text-sm py-4 text-center" style={{ color: C.muted }}>
                No tasks scheduled for this day.
              </p>
            )}
          </div>
          <button
            onClick={() => onNavigate("taskForm")}
            className="flex items-center gap-2 text-sm font-medium mt-4"
            style={{ color: C.primary }}
          >
            <Plus size={16} /> Add Task
          </button>
        </Card>
      </div>
    </div>
  );
}

const dateKeyToUTC = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

const getDaysDifference = (date1, date2) => {
  return Math.round(
    (dateKeyToUTC(date1) - dateKeyToUTC(date2)) / (1000 * 60 * 60 * 24)
  );
};

function getCurrentWeek() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const day = today.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);

  monday.setDate(
    today.getDate() + diff
  );

  return Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday);

      date.setDate(
        monday.getDate() + index
      );

    return {
      key: getlocalDateKey(date),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    };
  });
};

const calculateStreaks = (tasks) => {
  const completedDates = [
    ...new Set(
      tasks
        .filter((task) => task.status === "Done" && task.date)
        .map((task) => task.date)
    ),
  ];

  if (completedDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  const sortedDates = completedDates.sort();

  // -------------------------
  // Best historical streak
  // -------------------------
  let bestStreak = 1;
  let runningStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const difference = getDaysDifference(
      sortedDates[i],
      sortedDates[i - 1]
    );

    if (difference === 1) {
      runningStreak++;
    } else {
      runningStreak = 1;
    }

    bestStreak = Math.max(bestStreak, runningStreak);
  }

  // -------------------------
  // Current streak
  // -------------------------
  const completedSet = new Set(completedDates);

  const todayKey = getlocalDateKey();

  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // If user hasn't completed a task today,
  // continue counting from yesterday.
  if (!completedSet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let currentStreak = 0;

  while (true) {
    const key = getlocalDateKey(cursor);

    if (!completedSet.has(key)) {
      break;
    }

    currentStreak++;

    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    currentStreak,
    bestStreak,
  };
};

/* ---------------------------------------------------------
   5. STATISTICS
--------------------------------------------------------- */
function Statistics({ tasks }) {
  const statistics = useMemo(() => {
    const week = getCurrentWeek();
    const weekKeys = new Set(week.map((day) => day.key));

    // -------------------------
    // Current week's tasks
    // -------------------------
    const weeklyTasks = tasks.filter((task) =>
      weekKeys.has(task.date)
    );

    const weeklyCompleted = weeklyTasks.filter(
      (task) => task.status === "Done"
    );

    const total = weeklyTasks.length;
    const completed = weeklyCompleted.length;

    const completionRate = total
      ? Math.round((completed / total) * 100)
      : 0;

    // -------------------------
    // Weekly overview
    // -------------------------
    const weeklyOverview = week.map((day) => {
      const dayTasks = weeklyTasks.filter(
        (task) => task.date === day.key
      );

      const completedTasks = dayTasks.filter(
        (task) => task.status === "Done"
      ).length;

      return {
        day: day.label,
        Completed: completedTasks,
        Pending: dayTasks.length - completedTasks,
      };
    });

    // -------------------------
    // Category distribution
    // -------------------------
    const categoryCounts = {};

    weeklyTasks.forEach((task) => {
      const category = task.category || "Other";

      categoryCounts[category] =
        (categoryCounts[category] || 0) + 1;
    });

    const categoryDist = Object.entries(categoryCounts).map(
      ([name, count]) => ({
        name,
        count,
        value: total
          ? Math.round((count / total) * 100)
          : 0,
      })
    );

    // -------------------------
    // Productivity trend
    // -------------------------
    const productivityTrend = week.map((day) => {
      const dayTasks = weeklyTasks.filter(
        (task) => task.date === day.key
      );

      const completedTasks = dayTasks.filter(
        (task) => task.status === "Done"
      ).length;

      return {
        day: day.label,
        rate: dayTasks.length
          ? Math.round((completedTasks / dayTasks.length) * 100)
          : 0,
      };
    });

    // -------------------------
    // Streak
    // -------------------------
    const streaks = calculateStreaks(tasks);

    return {
      total,
      completed,
      completionRate,
      weeklyOverview,
      categoryDist,
      productivityTrend,
      currentStreak: streaks.currentStreak,
      bestStreak: streaks.bestStreak,
    };
  }, [tasks]);

  const donutData = [
    {
      name: "Completed",
      value: statistics.completionRate,
    },
    {
      name: "Remaining",
      value: 100 - statistics.completionRate,
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: C.text }}
          >
            Statistics
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: C.muted }}
          >
            Track your productivity
          </p>
        </div>

        <span
          className="text-sm font-medium px-4 py-2 rounded-xl self-start"
          style={{
            background: C.primaryLight,
            color: C.primaryDark,
          }}
        >
          This Week
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">

        <Card className="p-4 sm:p-5">
          <p
            className="text-xs mb-2"
            style={{ color: C.muted }}
          >
            Total Tasks
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: C.text }}
          >
            {statistics.total}
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: C.muted }}
          >
            This Week
          </p>
        </Card>

        <Card className="p-5">
          <p
            className="text-xs mb-2"
            style={{ color: C.muted }}
          >
            Completed
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: C.text }}
          >
            {statistics.completed}
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: C.success }}
          >
            {statistics.total
              ? `${statistics.completionRate}% completion`
              : "No tasks completed"}
          </p>
        </Card>

        <Card className="p-5">
          <p
            className="text-xs mb-2"
            style={{ color: C.muted }}
          >
            Completion Rate
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: C.text }}
          >
            {statistics.completionRate}%
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: C.muted }}
          >
            This Week
          </p>
        </Card>

        <Card className="p-5">
          <p
            className="text-xs mb-2"
            style={{ color: C.muted }}
          >
            Current Streak
          </p>

          <p
            className="text-2xl font-bold"
            style={{ color: C.text }}
          >
            {statistics.currentStreak}{" "}
            {statistics.currentStreak === 1
              ? "Day"
              : "Days"}
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: C.success }}
          >
            Best: {statistics.bestStreak}{" "}
            {statistics.bestStreak === 1
              ? "day"
              : "days"}
          </p>
        </Card>

      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Weekly Overview */}
        <Card className="p-5 lg:col-span-2">
          <h3
            className="font-semibold mb-4"
            style={{ color: C.text }}
          >
            Tasks Overview
          </h3>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={statistics.weeklyOverview}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={C.border}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="Completed"
                fill={C.success}
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="Pending"
                fill={C.warning}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Rate */}
        <Card className="p-5">
          <h3
            className="font-semibold mb-2"
            style={{ color: C.text }}
          >
            Completion Rate
          </h3>

          <div
            className="relative flex items-center justify-center"
            style={{ height: 200 }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell fill={C.primary} />
                  <Cell fill={C.border} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute flex flex-col items-center">
              <span
                className="text-2xl font-bold"
                style={{ color: C.text }}
              >
                {statistics.completionRate}%
              </span>

              <span
                className="text-xs"
                style={{ color: C.muted }}
              >
                Completed
              </span>
            </div>
          </div>
        </Card>

      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Category Distribution */}
        <Card className="p-5">
          <h3
            className="font-semibold mb-4"
            style={{ color: C.text }}
          >
            Category Wise Distribution
          </h3>

          {statistics.categoryDist.length === 0 ? (
            <div
              className="h-48 flex items-center justify-center text-sm"
              style={{ color: C.muted }}
            >
              No task data available for this week.
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer
                width="55%"
                height={180}
              >
                <PieChart>
                  <Pie
                    data={statistics.categoryDist}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={75}
                    stroke="none"
                  >
                    {statistics.categoryDist.map(
                      (item, index) => (
                        <Cell
                          key={item.name}
                          fill={
                            CATEGORY_COLORS[item.name] ||
                            [
                              C.primary,
                              C.warning,
                              C.success,
                              C.danger,
                            ][index % 4]
                          }
                        />
                      )
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-col gap-2">
                {statistics.categoryDist.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Dot
                      color={
                        CATEGORY_COLORS[item.name] ||
                        C.primary
                      }
                    />

                    <span style={{ color: C.text }}>
                      {item.name}
                    </span>

                    <span style={{ color: C.muted }}>
                      {item.value}% ({item.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Productivity Trend */}
        <Card className="p-5">
          <h3
            className="font-semibold mb-4"
            style={{ color: C.text }}
          >
            Productivity Trend
          </h3>

          <ResponsiveContainer
            width="100%"
            height={180}
          >
            <LineChart
              data={statistics.productivityTrend}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={C.border}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fontSize: 12,
                  fill: C.muted,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Productivity",
                ]}
              />

              <Line
                type="monotone"
                dataKey="rate"
                stroke={C.primary}
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: C.primary,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );

}

/* ---------------------------------------------------------
   APP ROOT
--------------------------------------------------------- */
export default function App({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close the mobile drawer automatically if the viewport grows past the
  // mobile breakpoint (e.g. rotating a tablet or resizing a browser window).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e) => {
      if (e.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    api.getTasks()
      .then((data) => setTasks(data.tasks || []))
      .catch((err) => {
        console.error(err);
        if (err.message.toLowerCase().includes("token") || err.message.toLowerCase().includes("unauthorized")) {
          onLogout();
        }
      })
      .finally(() => setLoading(false));
  }, [onLogout]);

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id || t._id === id);
    if (!task) return;
    const taskId = task.id || task._id;
    const updated = await api.updateTask(taskId, {
      status: task.status === "Done" ? "Pending" : "Done",
    });
    setTasks((prev) => prev.map((t) => (t.id === id || t._id === id ? updated.task : t)));
  };

  const deleteTask = async (_id) => {
    await api.deleteTask(_id);
    setTasks((prev) => prev.filter((t) => t._id !== _id));
  };

  const addTask = async (form) => {
    const result = await api.addTask(form);
    setTasks((prev) => [...prev, result.task]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-sm" style={{ color: C.muted }}>Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ background: C.bg, minHeight: "100vh", fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      {/* Mobile top bar: logo + hamburger, hidden at md and up */}
      <div
        className="flex items-center justify-between px-4 py-3 md:hidden sticky top-0 z-30"
        style={{ background: `linear-gradient(180deg, ${C.sidebarFrom}, ${C.sidebarTo})`, color: "#fff" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.primary }}>
            <CheckCircle2 size={16} color="#fff" />
          </div>
          <span className="font-semibold text-base tracking-tight truncate">DailyTracker</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(true)}
          className="p-1.5 rounded-lg shrink-0"
          style={{ color: "#fff" }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sidebar
        current={page}
        onNavigate={setPage}
        userName={user?.name || "User"}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 min-w-0 overflow-auto">
        <div className="flex justify-end px-4 sm:px-6 md:px-8 pt-4">
          <button
            onClick={onLogout}
            className="text-xs font-medium px-3 py-2 rounded-lg"
            style={{ color: C.danger, background: C.dangerBg }}
          >
            Logout
          </button>
        </div>
        {page === "dashboard" && <Dashboard tasks={tasks} toggleTask={toggleTask} onNavigate={setPage} userName={user?.name || "User"} />}
        {page === "taskForm" && <TaskForm addTask={addTask} onNavigate={setPage} />}
        {page === "taskList" && (
          <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} onNavigate={setPage} />
        )}
        {page === "calendar" && <CalendarPage tasks={tasks} onNavigate={setPage} />}
        {page === "statistics" && <Statistics tasks={tasks} />}
      </div>
    </div>
  );
}