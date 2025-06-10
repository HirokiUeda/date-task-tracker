'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ja } from 'date-fns/locale'
import TaskInput from '@/components/TaskInput'     // ① 入力コンポーネント
import { useTasksOfDate } from '@/hooks/useTasksOfDate' // ② SWR フック
import StatusToggle from '@/components/StatusToggle'

export default function Home() {
  // 今日を選択した日付として初期化
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  /* ③ 選択日のタスクを取得 */
  const { tasks, isLoading, mutate } = useTasksOfDate(selected)

  return (
    <main className="p-6">
      {/* ④ 選択日を上部に表示 */}
      <h1 className="mb-4 text-xl font-bold">
        {selected ? format(selected, 'yyyy年MM月dd日') : '日付を選択'}
      </h1>

      {/* ⑤ カレンダー本体 */}
      <DayPicker
        mode="single"                    // 1 日だけ選択する
        locale={ja}                      // 日本語ロケールを指定
        weekStartsOn={1}                 // 月曜始まり（0=日曜）
        selected={selected}
        onSelect={setSelected}           // クリックで state 更新
        showOutsideDays                  // 前後の月の日も表示
      />

      {/* ⑤ 入力欄：登録成功時 mutate() を呼ぶ */}
      <TaskInput date={selected} onSuccess={mutate} />

      {/* ⑥ タスクリスト */}
      <ul className="mt-4 space-y-1">
        {isLoading && <li>Loading…</li>}
        {/* 取得したタスク分処理を回す */}
        {tasks.map(t => (
          <li key={t.id} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            {/* タスク名表示 */}
            {t.title}
            {/* ラジオボタン表示 */}
            <StatusToggle id={t.id} init={t.status} onSuccess={mutate} />
          </li>
        ))}
        {!isLoading && tasks.length === 0 && <li>タスクなし</li>}
      </ul>
    </main>
  );
}
