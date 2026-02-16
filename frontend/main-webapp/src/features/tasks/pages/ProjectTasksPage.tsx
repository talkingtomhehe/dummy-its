import { useState } from "react";
import { useParams } from "react-router-dom";
import { TaskToolbar, TaskKanbanBoard, TaskListView, GanttView, TaskCalendarView, TaskDetailModal } from "../components";
import type { TaskDetail } from "../components";
import { ExpandArrowIcon } from "../components/Icons";
import CreateTaskModal from "../../projects/components/CreateTaskModal";
import type { Stage, ViewMode, Task } from "../types";

// Mock data for demonstration - matches Figma design
const mockStages: Stage[] = [
  {
    id: "stage-1",
    title: "Stage 1",
    tasks: [
      {
        id: "task-1",
        title: "Design",
        description: "Create UI/UX design for the website",
        priority: "medium",
        progress: 75,
        dueDate: "Oct 1, 2026",
        assignees: [
          { id: "1", name: "Alice" },
          { id: "2", name: "Bob" },
          { id: "3", name: "Charlie" },
        ],
        tags: [
          { id: "tag-1", type: "department", label: "DevOps" },
          { id: "tag-2", type: "scope", label: "Internal" },
        ],
      },
      {
        id: "task-2",
        title: "Design",
        description: "Design system components",
        priority: "medium",
        progress: 75,
        dueDate: "Oct 1, 2026",
        assignees: [
          { id: "1", name: "Alice" },
          { id: "2", name: "Bob" },
          { id: "3", name: "Charlie" },
        ],
        tags: [
          { id: "tag-3", type: "department", label: "DevOps" },
          { id: "tag-4", type: "scope", label: "Internal" },
        ],
      },
    ],
  },
  {
    id: "stage-2",
    title: "Stage 2",
    tasks: [
      {
        id: "task-3",
        title: "Development",
        description: "Frontend implementation",
        priority: "high",
        progress: 30,
        dueDate: "Oct 15, 2026",
        assignees: [
          { id: "4", name: "David" },
          { id: "5", name: "Eve" },
        ],
        tags: [
          { id: "tag-5", type: "department", label: "Frontend" },
        ],
      },
      {
        id: "task-4",
        title: "Testing",
        description: "QA and testing phase",
        priority: "low",
        progress: 0,
        dueDate: "Nov 1, 2026",
        assignees: [
          { id: "6", name: "Frank" },
        ],
        tags: [
          { id: "tag-6", type: "scope", label: "QA" },
        ],
      },
    ],
  },
];

export default function ProjectTasksPage() {
  const { projectId: _projectId } = useParams<{ projectId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [stages, setStages] = useState<Stage[]>(mockStages);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  // Project name would come from API based on projectId
  // TODO: Fetch project details using _projectId
  const projectName = "ABC Website";

  // Convert basic Task to TaskDetail for modal
  const convertToTaskDetail = (task: Task): TaskDetail => ({
    ...task,
    status: "on_track", // Default status, would come from API
    subTasks: [
      { id: "st-1", title: "Research available OAuth 2.0 libraries for Node.js", completed: true },
      { id: "st-2", title: "Configure API credentials in Google Cloud Console", completed: false },
      { id: "st-3", title: "Implement callback route handler", completed: false },
    ],
    activities: [
      {
        id: "act-1",
        user: "Sarah Jenkins",
        action: "changed status to",
        value: "In Progress",
        timestamp: "10 mins ago",
      },
    ],
    comments: [
      {
        id: "cmt-1",
        user: { id: "1", name: "Sarah Jenkins", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        content: "Let's prioritize the Google SSO implementation first.",
        timestamp: "2 hours ago",
      },
    ],
    createdAt: "Oct 20, 2023 9:41 AM",
    updatedAt: "4 hours ago",
    key: "DEV-162",
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(convertToTaskDetail(task));
    setIsModalOpen(true);
  };

  const handleTaskSave = (updatedTask: TaskDetail) => {
    // Update the task in stages
    const updatedStages = stages.map((stage) => ({
      ...stage,
      tasks: stage.tasks.map((t) =>
        t.id === updatedTask.id
          ? {
            ...t,
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            progress: updatedTask.progress,
            dueDate: updatedTask.dueDate,
            assignees: updatedTask.assignees,
          }
          : t
      ),
    }));
    setStages(updatedStages);
    console.log("Task saved:", updatedTask);
  };

  const handleFilter = () => {
    // TODO: Implement filter modal
    console.log("Open filter modal");
  };

  const handleAddStage = () => {
    const newStage: Stage = {
      id: `stage-${stages.length + 1}`,
      title: `Stage ${stages.length + 1}`,
      tasks: [],
    };
    setStages([...stages, newStage]);
  };

  const handleAddTask = (stageId: string) => {
    setSelectedStageId(stageId);
    setIsCreateTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[1440px] mx-auto gap-3 relative">
      {/* Sidebar Collapse Toggle - Left Edge */}
      {/* <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -left-10 top-4 z-10 bg-primary/20 hover:bg-primary/30 rounded-r-[20px] flex items-center justify-center w-10 h-[60px] transition-colors"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ExpandArrowIcon />
      </button> */}

      {/* Toolbar */}
      <TaskToolbar
        projectName={projectName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilter={handleFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "kanban" && (
          <TaskKanbanBoard
            stages={stages}
            onAddStage={handleAddStage}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        )}

        {viewMode === "list" && (
          <TaskListView
            stages={stages}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
          />
        )}

        {viewMode === "timeline" && (
          <GanttView />
        )}

        {viewMode === "calendar" && (
          <TaskCalendarView
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleTaskSave}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setIsCreateTaskModalOpen(false);
          setSelectedStageId(null);
        }}
        onSubmit={(data) => {
          console.log("Create task:", data, "in stage:", selectedStageId);
          // TODO: Implement API call to create task
          setIsCreateTaskModalOpen(false);
          setSelectedStageId(null);
        }}
      />
    </div>
  );
}
