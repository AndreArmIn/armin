import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const government = await prisma.government.findUnique({
            where: { id },
            include: {
                weaponsOwned: {
                    include: { weaponType: true },
                },
                transactionsTo: {
                    include: { weapon: { include: { weaponType: true } } },
                    orderBy: { timestamp: 'desc' },
                    take: 10,
                },
            },
        })

        if (!government) {
            return NextResponse.json({ error: 'Government not found' }, { status: 404 })
        }

        return NextResponse.json(government)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch government' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const government = await prisma.government.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(government)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update government' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.government.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete government' }, { status: 500 })
    }
}
