export type TaskPriority = "urgent" | "high" | "medium" | "low";

export type TaskStatus = "to_do" | "on_track" | "off_track" | "on_hold" | "done";

export type TagType = "department" | "scope";

export interface Tag {
  id: string;
  type: TagType;
  label: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  progress: number;
  dueDate: string;
  assignees: Assignee[];
  tags?: Tag[];
}

export interface Stage {
  id: string;
  title: string;
  tasks: Task[];
}

export type ViewMode = "kanban" | "list" | "timeline" | "calendar";
