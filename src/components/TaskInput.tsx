// src/components/TaskInput.tsx
'use client'                                       // ① React フックを使うのでクライアント
import { useState } from 'react'

type Props = {
  date: Date | undefined       // ② 選択中の日付（カレンダーから受取）
  onSuccess: () => void        // ③ 登録成功後に呼ぶコールバック（mutate）
}

export default function TaskInput({ date, onSuccess }: Props) {
  const [title, setTitle] = useState('')           // ④ 入力値のローカル state

  /** 登録ボタンを押したときの処理 */
  const handleSubmit = async () => {               // ⑤
    if (!date || title.trim() === '') return       // ⑥ 日付 or タイトルが空なら何もしない

    /* ⑦ API へ POST */
    // タスク登録
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date.toISOString().slice(0, 10),     // ⑧ YYYY-MM-DD
        title,
      }),
    }).then(res => {
      if (res.ok) {
        setTitle('')                               // ⑨ フォームリセット
        onSuccess()                                // ⑩ 親に成功通知（SWR mutate）
      }
    })
  }

  return (
    <div className="mt-4 flex gap-2">
      {/* ⑪ 入力ボックス */}
      <input
        className="flex-1 border px-2 py-1 rounded"
        placeholder="タスク名を入力…"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      {/* ⑫ 登録ボタン（空入力や日付未選択で disabled） */}
      <button
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-400"
        disabled={!date || title.trim() === ''}
        onClick={handleSubmit}
      >
        登録
      </button>
    </div>
  )
}
