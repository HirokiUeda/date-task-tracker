'use client'
import { useState } from 'react'

// コンポーネントが受け取るpropsの型定義
type Props = {
  id: string                    // タスク ID
  init: 'PENDING' | 'DONE' | 'SKIPPED'
  onSuccess: () => void         // mutate を受け取る
}

export default function StatusToggle({ id, init, onSuccess }: Props) {
  const [status, setStatus] = useState(init)        // ① ローカル状態

  /* ② ラジオ変更 → PATCH 発火 */
  //  ラジオ変更時に呼ぶ非同期ハンドラ
  const update = async (newStatus: typeof status) => {
    setStatus(newStatus)                            // 楽観的 UI

    // API へ PATCH リクエスト
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) setStatus(init)                    // 失敗時ロールバック
    onSuccess()                                     // 再フェッチ
  }

  //  画面に描画される部分
  return (
    <div className="flex gap-2">
      {(['PENDING', 'DONE', 'SKIPPED'] as const).map(v => (
        <label key={v} className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={id}                                // 同一タスク内で排他
            // vと現在のステータス値が一致したときにチェック
            checked={status === v}
            onChange={() => update(v)}
          />
          <span>
            {v === 'PENDING' ? '—' : v === 'DONE' ? '✓' : '×'}
          </span>
        </label>
      ))}
    </div>
  )
}
