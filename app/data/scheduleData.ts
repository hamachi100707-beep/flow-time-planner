export type Task = {
  id: number;
  title: string;
  start: string; // "09:00"
  end: string;   // "09:30"
  date: string;  // "2025-10-24"
}

export const sampleTasks: Task[] = [
  { id: 1, title: "朝の準備", start: "07:00", end: "07:30", date: "2025-10-24" },
  { id: 2, title: "仕事開始", start: "09:00", end: "12:00", date: "2025-10-24" },
]
