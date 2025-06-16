import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'cmbqrbf2200000cx4sanh7gb6';
  const productIds = [
    'cmbsp4bts000vmhi75k76wnjn',
    'cmbsqucd8000zmhi79cas52m7',
    'cmbt7fe770013mhi70n3fyzgn',
  ];

  const transactionsData = Array.from({ length: 20 }).map((_, i) => {
    const isSale = Math.random() > 0.5;
    const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
    const quantity = Math.floor(Math.random() * 5) + 1; // entre 1 et 5
    const amount = Math.floor(Math.random() * 5001) + 1000; // entier entre 1000 et 6000

    return {
      name: `${isSale ? 'Vente' : 'Dépense'} #${i + 1}`,
      type: isSale ? TransactionType.SALE : TransactionType.EXPENSE,
      amount,
      quantity,
      userId,
      productId: randomProductId,
    };
  });

  await prisma.transaction.createMany({
    data: transactionsData,
  });

  console.log('✅ Transactions seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
