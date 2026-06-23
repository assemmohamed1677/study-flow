export interface task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  priority: taskPriority;
  status: taskStatus;
}

type taskPriority = 'low' | 'medium' | 'high';
type taskStatus = 'OPEN' | 'INPROGRESS' | 'DONE';
