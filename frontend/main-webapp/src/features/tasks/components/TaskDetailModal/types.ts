import type { Task, TaskStatus, Assignee } from "../../types";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  value?: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  user: Assignee;
  content: string;
  timestamp: string;
}

export interface TaskDetail extends Task {
  status: TaskStatus;
  subTasks: SubTask[];
  activities: ActivityItem[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  key: string;
}

export interface TaskDetailModalProps {
  task: TaskDetail;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskDetail) => void;
}
