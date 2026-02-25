import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const status = searchParams.get('status')
        const ownerId = searchParams.get('ownerId')

        const weapons = await prisma.weapon.findMany({
            where: {
                ...(status && { status: status as any }),
                ...(ownerId && { currentOwnerId: ownerId }),
                ...(category && { weaponType: { category: category as any } }),
            },
            include: {
                weaponType: true,
                currentOwner: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(weapons)
    } catch (error) {
        console.error('Error fetching weapons:', error)
        return NextResponse.json({ error: 'Failed to fetch weapons' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { serialNumber, weaponTypeId, status, currentOwnerId, notes, acquisitionDate } = body

        if (!serialNumber || !weaponTypeId) {
            return NextResponse.json(
                { error: 'serialNumber and weaponTypeId are required' },
                { status: 400 }
            )
        }

        const weapon = await prisma.weapon.create({
            data: {
                serialNumber,
                weaponTypeId,
                status: status || 'Available',
                currentOwnerId: currentOwnerId || null,
                notes,
                acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : null,
            },
            include: { weaponType: true, currentOwner: true },
        })

        return NextResponse.json(weapon, { status: 201 })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Serial number already exists' }, { status: 409 })
        }
        console.error('Error creating weapon:', error)
        return NextResponse.json({ error: 'Failed to create weapon' }, { status: 500 })
    }
}
