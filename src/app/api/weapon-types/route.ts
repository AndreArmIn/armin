import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')

        const weaponTypes = await prisma.weaponType.findMany({
            where: {
                ...(category && { category: category as any }),
                ...(brand && { brand: { contains: brand, mode: 'insensitive' } }),
            },
            include: {
                _count: { select: { weapons: true } },
            },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        })

        return NextResponse.json(weaponTypes)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch weapon types' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, category, brand, description } = body

        if (!name || !category || !brand) {
            return NextResponse.json(
                { error: 'name, category, and brand are required' },
                { status: 400 }
            )
        }

        const weaponType = await prisma.weaponType.create({
            data: { name, category, brand, description },
        })

        return NextResponse.json(weaponType, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create weapon type' }, { status: 500 })
    }
}
