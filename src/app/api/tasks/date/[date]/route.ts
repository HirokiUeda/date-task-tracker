import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { fromZonedTime  } from 'date-fns-tz'

export async function GET( _req: NextRequest, context: { params: { date: string } }           // URL パラメータ 'YYYY-MM-DD'
) {
    // URL パラメータから日付文字列を取得し、JST の Date オブジェクトに変換
    const { date } = await context.params

    // 日付文字列 'YYYY-MM-DD' を JST の Date オブジェクトに変換
    const local = parseISO(date)        // 文字列→JST Date)
    
    // JST の 00:00 と 23:59 を UTC に変換
    const utcStart = fromZonedTime (startOfDay(local), 'Asia/Tokyo') // JST 00:00→UTC
    const utcEnd   = fromZonedTime (endOfDay(local),   'Asia/Tokyo') // JST 23:59→UTC
    
    // Prisma で範囲検索
    // UTC の 00:00 と 23:59 の間にあるタスクを取得
    const tasks = await prisma.task.findMany({                   // 範囲検索
        where: { date: { gte: utcStart, lte: utcEnd } },
        orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(tasks)                              // 200 OK + JSON
}

