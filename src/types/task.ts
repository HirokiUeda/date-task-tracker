export type TaskStatus = 'PENDING' | 'DONE' | 'SKIPPED'

export interface Task {
  id: string
  date: string          // ISO 8601 にしてクライアントへ返す
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}
