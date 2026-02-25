import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const governments = await prisma.government.findMany({
            include: {
                _count: {
                    select: { weaponsOwned: true, transactionsTo: true },
                },
            },
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(governments)
    } catch (error) {
        console.error('Error fetching governments:', error)
        return NextResponse.json({ error: 'Failed to fetch governments' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, countryCode, contactEmail, contactPerson, phone, address } = body

        if (!name || !countryCode || !contactEmail) {
            return NextResponse.json(
                { error: 'Name, countryCode, and contactEmail are required' },
                { status: 400 }
            )
        }

        const government = await prisma.government.create({
            data: { name, countryCode, contactEmail, contactPerson, phone, address },
        })

        return NextResponse.json(government, { status: 201 })
    } catch (error) {
        console.error('Error creating government:', error)
        return NextResponse.json({ error: 'Failed to create government' }, { status: 500 })
    }
}
