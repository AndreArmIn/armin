import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const [
            totalGovernments,
            totalWeapons,
            totalEquipment,
            totalTransactions,
            weaponsByStatus,
            recentTransactions,
            transactionsByType,
            totalValue,
        ] = await Promise.all([
            prisma.government.count(),
            prisma.weapon.count(),
            prisma.equipment.count(),
            prisma.transaction.count(),
            prisma.weapon.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            prisma.transaction.findMany({
                take: 5,
                orderBy: { timestamp: 'desc' },
                include: {
                    weapon: { include: { weaponType: true } },
                    fromGovernment: true,
                    toGovernment: true,
                },
            }),
            prisma.transaction.groupBy({
                by: ['type'],
                _count: { type: true },
            }),
            prisma.transaction.aggregate({
                _sum: { value: true },
                where: { type: 'Sale' },
            }),
        ])

        return NextResponse.json({
            totalGovernments,
            totalWeapons,
            totalEquipment,
            totalTransactions,
            weaponsByStatus,
            recentTransactions,
            transactionsByType,
            totalSalesValue: totalValue._sum.value || 0,
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
