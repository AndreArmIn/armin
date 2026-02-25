import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const status = searchParams.get('status')

        const equipment = await prisma.equipment.findMany({
            where: {
                ...(category && { category: category as any }),
                ...(status && { status }),
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(equipment)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, serialNumber, category, brand, quantity, description, status } = body

        if (!name || !category) {
            return NextResponse.json(
                { error: 'name and category are required' },
                { status: 400 }
            )
        }

        const equipment = await prisma.equipment.create({
            data: {
                name,
                serialNumber: serialNumber || null,
                category,
                brand,
                quantity: quantity || 1,
                description,
                status: status || 'Available',
            },
        })

        return NextResponse.json(equipment, { status: 201 })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Serial number already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 })
    }
}
