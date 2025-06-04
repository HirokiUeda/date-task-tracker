'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ja } from 'date-fns/locale'

export default function Home() {
  // 今日を選択した日付として初期化
  const [selected, setSelected] = useState<Date | undefined>(new Date());

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

      {/* ⑥ 後続 Day 9 でタスクリストをここへ */}
    </main>
  );
}
