import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const weaponId = searchParams.get('weaponId')
        const govId = searchParams.get('govId')
        const limit = parseInt(searchParams.get('limit') || '50')

        const transactions = await prisma.transaction.findMany({
            where: {
                ...(type && { type: type as any }),
                ...(weaponId && { weaponId }),
                ...(govId && {
                    OR: [{ fromId: govId }, { toId: govId }],
                }),
            },
            include: {
                weapon: { include: { weaponType: true } },
                equipment: true,
                fromGovernment: true,
                toGovernment: true,
            },
            orderBy: { timestamp: 'desc' },
            take: limit,
        })

        return NextResponse.json(transactions)
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            type,
            weaponId,
            equipmentId,
            fromId,
            toId,
            contractNumber,
            value,
            currency,
            details,
            notes,
            timestamp,
        } = body

        if (!type) {
            return NextResponse.json({ error: 'Transaction type is required' }, { status: 400 })
        }

        // Update weapon status based on transaction type
        if (weaponId) {
            const statusMap: Record<string, string> = {
                Sale: 'Sold',
                Delivery: 'Sold',
                Reception: 'Sold',
                Return: 'Available',
                Repair: 'UnderRepair',
                Replacement: 'Available',
                Destruction: 'Destroyed',
                Donation: 'Donated',
            }

            const newStatus = statusMap[type]
            if (newStatus) {
                await prisma.weapon.update({
                    where: { id: weaponId },
                    data: {
                        status: newStatus as any,
                        currentOwnerId: type === 'Sale' || type === 'Delivery' || type === 'Donation'
                            ? toId || null
                            : type === 'Return'
                                ? null
                                : undefined,
                    },
                })
            }
        }

        const transaction = await prisma.transaction.create({
            data: {
                type,
                weaponId: weaponId || null,
                equipmentId: equipmentId || null,
                fromId: fromId || null,
                toId: toId || null,
                contractNumber,
                value: value ? parseFloat(value) : null,
                currency: currency || 'USD',
                details,
                notes,
                timestamp: timestamp ? new Date(timestamp) : new Date(),
            },
            include: {
                weapon: { include: { weaponType: true } },
                equipment: true,
                fromGovernment: true,
                toGovernment: true,
            },
        })

        return NextResponse.json(transaction, { status: 201 })
    } catch (error) {
        console.error('Error creating transaction:', error)
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }
}
