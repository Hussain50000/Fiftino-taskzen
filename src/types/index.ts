export type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Done';

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Category = {
  id:string;
  name: string;
  color: string; // e.g. "bg-blue-100 text-blue-800"
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
};
