export type Status = 'Pending' | 'In Progress' | 'Complete';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Category = {
  id:string;
  name: string;
  color: string; // hex color code
};

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignee?: User;
  dueDate?: Date;
  categories: Category[];
  subtasks: Subtask[];
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  taskCount: number;
  imageUrl: string;
};
