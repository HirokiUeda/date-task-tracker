import { NextRequest, NextResponse } from 'next/server' // Next.js の Edge/Node 互換レスポンス API
import { prisma } from '@/app/lib/prisma'                        // Prisma クライアント
import { z } from 'zod'                                 // スキーマ＆バリデーションライブラリ

/** Zod で「受信する JSON はこういう形だよ」と宣言 */
const StatsuSchema = z.object({
    status: z.enum(['DONE', 'SKIPPED', 'PENDING']), // ステータスは列挙型で定義
})

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    try {
        const body = await req.json() // リクエスト JSON を取得
        const { status } = StatsuSchema.parse(body) // バリデーション + 型安全に取り出し

        // URL パラメータから ID を取得
        const { id } = await context.params

        // Prisma でタスクのステータスを更新
        const task = await prisma.task.update({
            where: { id }, // ID で検索
            data: { status }, // ステータスを更新
        })

        // 200 OK + 更新されたタスクを返す
        return NextResponse.json(task)

    } catch (err: any) {
        // Zod の構造エラーなら 400、その他は 500
        if (err.name === 'ZodError')
            return NextResponse.json({ error: err.issues }, { status: 400 })
        // Prisma のレコードが見つからないエラー
        if (err.code === 'P2025')  
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        // URL パラメータから ID を取得
        const { id } = await context.params

        // Prisma でタスクを削除
        await prisma.task.delete({
            where: { id }, // ID で検索
        })

        // 204 No Content を返す
        return new NextResponse(null, { status: 204 })

    } catch (err: any) {
        // Prisma のレコードが見つからないエラー
        if (err.code === 'P2025')  
            return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}