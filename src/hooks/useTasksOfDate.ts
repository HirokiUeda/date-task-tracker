// src/hooks/useTasksOfDate.ts
import useSWR from 'swr'                          // ① SWR 本体

/* ------------ 型定義 ------------ */
export interface Task {                            // ② Task レコードの TS 型
  id: string
  date: string
  title: string
  status: 'PENDING' | 'DONE' | 'SKIPPED'
  createdAt: string
  updatedAt: string
}

/* API テキストを JSON に変換する汎用 fetcher */
// fetch(url)でAPI からデータを取得し、JSON に変換する関数
const fetcher = (url: string) => fetch(url).then(r => r.json()) // ③

/* メインフック：日付を渡すと tasks / mutate を返す */
export function useTasksOfDate(date?: Date) {      // ④ date は undefined 許容

  /* ⑤ YYYY-MM-DD に変換（date が無いときは null でフェッチ停止） */
  // 指定日に紐づくタスクを取得するためのキー（/api/tasuks/date/2025-05-29）を生成
  const key = date ? `/api/tasks/date/${date.toISOString().slice(0, 10)}` : null

  /* ⑥ SWR 実行：key が null なら fetch も走らない */
  // date:取得結果、error:エラー、mutate:再取得用関数
  // keyを変えれば自動で別データを取り直す
  const { data, error, mutate } = useSWR<Task[]>(key, fetcher)

  return {
    tasks: data ?? [],                             // ⑦ undefined を空配列に
    isLoading: !data && !error,                    // ⑧ ローディング判定
    mutate,                                        // ⑨ 再取得用
  }
}
