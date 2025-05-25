// Prismaが自動生成するORMクライアントの取り込み
import { PrismaClient } from '@prisma/client'

// グローバル変数の型定義
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? // グローバル変数にPrismaClientが存在しない場合は新規作成
  new PrismaClient({        // なければPrimsaClientを新規作成
    log: ['query'],         // 開発時のみログを出す
  })

// 開発環境のみグローバル変数にPrismaClientを保持する
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
