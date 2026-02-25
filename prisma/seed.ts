import { PrismaClient, WeaponCategory, WeaponStatus, EquipmentCategory, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Governments
    const usa = await prisma.government.upsert({
        where: { id: 'gov-usa-001' },
        update: {},
        create: {
            id: 'gov-usa-001',
            name: 'United States Department of Defense',
            countryCode: 'US',
            contactEmail: 'procurement@dod.gov',
            contactPerson: 'Gen. James Mitchell',
            phone: '+1-703-555-0100',
            address: 'The Pentagon, Arlington, VA 22202',
        },
    })

    const ita = await prisma.government.upsert({
        where: { id: 'gov-ita-001' },
        update: {},
        create: {
            id: 'gov-ita-001',
            name: 'Ministero della Difesa Italiano',
            countryCode: 'IT',
            contactEmail: 'acquisizioni@difesa.it',
            contactPerson: 'Gen. Marco Rossi',
            phone: '+39-06-555-0200',
            address: 'Via XX Settembre 8, 00187 Roma',
        },
    })

    const deu = await prisma.government.upsert({
        where: { id: 'gov-deu-001' },
        update: {},
        create: {
            id: 'gov-deu-001',
            name: 'Bundesministerium der Verteidigung',
            countryCode: 'DE',
            contactEmail: 'beschaffung@bmvg.bund.de',
            contactPerson: 'Gen. Klaus Weber',
            phone: '+49-30-555-0300',
            address: 'Stauffenbergstraße 18, 10785 Berlin',
        },
    })

    // Weapon Types
    const ar15Type = await prisma.weaponType.upsert({
        where: { id: 'wt-ar15-001' },
        update: {},
        create: {
            id: 'wt-ar15-001',
            name: 'M4A1 Carbine',
            category: WeaponCategory.SmallArms,
            brand: 'Colt Defense',
            description: 'Fucile d\'assalto standard NATO, calibro 5.56mm',
        },
    })

    const beretta = await prisma.weaponType.upsert({
        where: { id: 'wt-beretta-001' },
        update: {},
        create: {
            id: 'wt-beretta-001',
            name: 'Beretta ARX200',
            category: WeaponCategory.SmallArms,
            brand: 'Beretta',
            description: 'Fucile d\'assalto italiano, calibro 7.62mm NATO',
        },
    })

    const howitzer = await prisma.weaponType.upsert({
        where: { id: 'wt-how-001' },
        update: {},
        create: {
            id: 'wt-how-001',
            name: 'M777 Howitzer',
            category: WeaponCategory.Artillery,
            brand: 'BAE Systems',
            description: 'Obice ultraleggero da 155mm',
        },
    })

    const leopard = await prisma.weaponType.upsert({
        where: { id: 'wt-leo-001' },
        update: {},
        create: {
            id: 'wt-leo-001',
            name: 'Leopard 2A7',
            category: WeaponCategory.ArmoredVehicles,
            brand: 'Rheinmetall',
            description: 'Carro armato da battaglia principale di ultima generazione',
        },
    })

    const f35 = await prisma.weaponType.upsert({
        where: { id: 'wt-f35-001' },
        update: {},
        create: {
            id: 'wt-f35-001',
            name: 'F-35A Lightning II',
            category: WeaponCategory.Aircraft,
            brand: 'Lockheed Martin',
            description: 'Cacciabombardiere stealth multiruolo di quinta generazione',
        },
    })

    // Weapons
    const weapon1 = await prisma.weapon.upsert({
        where: { serialNumber: 'M4A1-2024-001' },
        update: {},
        create: {
            serialNumber: 'M4A1-2024-001',
            weaponTypeId: ar15Type.id,
            status: WeaponStatus.Sold,
            currentOwnerId: usa.id,
            acquisitionDate: new Date('2024-01-15'),
        },
    })

    const weapon2 = await prisma.weapon.upsert({
        where: { serialNumber: 'ARX200-2024-001' },
        update: {},
        create: {
            serialNumber: 'ARX200-2024-001',
            weaponTypeId: beretta.id,
            status: WeaponStatus.Available,
            acquisitionDate: new Date('2024-03-10'),
        },
    })

    const weapon3 = await prisma.weapon.upsert({
        where: { serialNumber: 'LEO2A7-2023-001' },
        update: {},
        create: {
            serialNumber: 'LEO2A7-2023-001',
            weaponTypeId: leopard.id,
            status: WeaponStatus.Sold,
            currentOwnerId: deu.id,
            acquisitionDate: new Date('2023-06-20'),
        },
    })

    const weapon4 = await prisma.weapon.upsert({
        where: { serialNumber: 'F35A-2024-001' },
        update: {},
        create: {
            serialNumber: 'F35A-2024-001',
            weaponTypeId: f35.id,
            status: WeaponStatus.Sold,
            currentOwnerId: ita.id,
            acquisitionDate: new Date('2024-02-28'),
        },
    })

    // Equipment
    const vest = await prisma.equipment.upsert({
        where: { serialNumber: 'VEST-2024-001' },
        update: {},
        create: {
            name: 'Giubbotto Antiproiettile CRITICA III+',
            serialNumber: 'VEST-2024-001',
            category: EquipmentCategory.ProtectiveGear,
            brand: 'Point Blank',
            quantity: 500,
            description: 'Giubbotto antiproiettile livello III+ con piastre ceramiche',
            status: 'Available',
        },
    })

    const nvg = await prisma.equipment.upsert({
        where: { serialNumber: 'NVG-2024-001' },
        update: {},
        create: {
            name: 'Visore Notturno AN/PVS-14',
            serialNumber: 'NVG-2024-001',
            category: EquipmentCategory.Optics,
            brand: 'L3Harris',
            quantity: 200,
            description: 'Monoculare per visione notturna generazione III',
            status: 'Available',
        },
    })

    // Transactions
    await prisma.transaction.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'tx-001',
                type: TransactionType.Sale,
                weaponId: weapon1.id,
                toId: usa.id,
                contractNumber: 'CONTRACT-US-2024-001',
                value: 1200000,
                currency: 'USD',
                details: 'Vendita di 1000 unità M4A1 al Dipartimento della Difesa USA',
                timestamp: new Date('2024-01-15'),
            },
            {
                id: 'tx-002',
                type: TransactionType.Delivery,
                weaponId: weapon1.id,
                toId: usa.id,
                contractNumber: 'CONTRACT-US-2024-001',
                details: 'Consegna completata via trasporto aereo militare',
                timestamp: new Date('2024-02-01'),
            },
            {
                id: 'tx-003',
                type: TransactionType.Sale,
                weaponId: weapon4.id,
                toId: ita.id,
                contractNumber: 'CONTRACT-IT-2024-001',
                value: 95000000,
                currency: 'EUR',
                details: 'Contratto di acquisto F-35A per l\'Aeronautica Militare Italiana',
                timestamp: new Date('2024-02-28'),
            },
            {
                id: 'tx-004',
                type: TransactionType.Sale,
                weaponId: weapon3.id,
                toId: deu.id,
                contractNumber: 'CONTRACT-DE-2023-001',
                value: 15000000,
                currency: 'EUR',
                details: 'Fornitura Leopard 2A7 per la Bundeswehr',
                timestamp: new Date('2023-06-20'),
            },
            {
                id: 'tx-005',
                type: TransactionType.Repair,
                weaponId: weapon3.id,
                fromId: deu.id,
                details: 'Manutenzione programmata - revisione motore e sistema di puntamento',
                timestamp: new Date('2024-01-10'),
            },
        ],
    })

    console.log('✅ Database seeded successfully!')
    console.log(`  - ${3} governments created`)
    console.log(`  - ${5} weapon types created`)
    console.log(`  - ${4} weapons created`)
    console.log(`  - ${2} equipment items created`)
    console.log(`  - ${5} transactions created`)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
