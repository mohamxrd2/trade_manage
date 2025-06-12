import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const userId = 'cmbqrbf2200000cx4sanh7gb6'

  await prisma.product.createMany({
    data: [
      {
        name: 'Sac de riz',
        quantity: 100,
        purchasePrice: 15000,
        imageUrl: 'https://example.com/rice.jpg',
        userId: userId,
      },
      {
        name: 'Carton de lait',
        quantity: 50,
        purchasePrice: 8000,
        imageUrl: 'https://example.com/lait.jpg',
        userId: userId,
      },
      {
        name: 'Bouteille d’huile',
        quantity: 200,
        purchasePrice: 1200,
        imageUrl: 'https://example.com/oil.jpg',
        userId: userId,
      },
    ],
  })

  console.log('Produits insérés avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
