import { NextRequest, NextResponse } from 'next/server' // Next.js の Edge/Node 互換レスポンス API
import { prisma } from '@/app/lib/prisma'                        // Prisma クライアント
import { z } from 'zod'                                 // スキーマ＆バリデーションライブラリ
import { parse, isValid } from 'date-fns'               // 日付文字列 ⇆ Date 変換ユーティリティ

/** Zod で「受信する JSON はこういう形だよ」と宣言 */
const TaskCreateSchema = z.object({
  date: z.string(),          // '2025-05-28' を期待
  title: z.string().min(1),  // 空文字は禁止
})

/** HTTP POST ハンドラ */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()                                // リクエスト JSON を取得
    const { date, title } = TaskCreateSchema.parse(body)        // バリデーション + 型安全に取り出し

    /** 文字列 'YYYY-MM-DD' → JS Date へ */
    const parsed = parse(date, 'yyyy-MM-dd', new Date())
    if (!isValid(parsed)) {                                      // 変換失敗なら 400 Bad Request
      return NextResponse.json(
        { error: 'Invalid date format, use YYYY-MM-DD' },
        { status: 400 },
      )
    }

    /** DB INSERT */
    const task = await prisma.task.create({
      data: { date: parsed, title },                             // status はデフォルトで PENDING
    })

    /** 201 Created + 生成レコードを返す */
    return NextResponse.json(task, { status: 201 })

  } catch (err: any) {
    /** Zod の構造エラーなら 400、その他は 500 */
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
