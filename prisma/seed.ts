import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create shop items
  const shopItems = [
    {
      itemType: 'avatar',
      name: 'Cyber Agent Avatar',
      description: 'Futuristic cyberpunk-style avatar for your AI agents',
      price: 299,
      assetUrl: 'https://imgcdn.stablediffusionweb.com/2024/12/22/14b67f49-2341-4677-8655-e667e7b6f9ba.jpg',
      metadata: { rarity: 'epic', category: 'avatar' },
      isActive: true,
    },
    {
      itemType: 'theme',
      name: 'Holographic Theme',
      description: 'Stunning holographic interface theme with rainbow effects',
      price: 199,
      assetUrl: 'https://thumbs.dreamstime.com/z/vector-holographic-background-bright-colors-rainbow-metal-texture-mobile-interfaces-applications-books-206689657.jpg',
      metadata: { rarity: 'rare', category: 'theme' },
      isActive: true,
    },
    {
      itemType: 'animation',
      name: 'Quantum Particles',
      description: 'Animated quantum particle effects for agent interactions',
      price: 149,
      assetUrl: 'https://i.ytimg.com/vi/KyoSqjyaD0s/hqdefault.jpg',
      metadata: { rarity: 'rare', category: 'animation' },
      isActive: true,
    },
    {
      itemType: 'accessory',
      name: 'Golden Crown',
      description: 'Prestigious golden crown accessory for premium agents',
      price: 499,
      assetUrl: 'https://i.ytimg.com/vi/Ow14BejXqio/maxresdefault.jpg',
      metadata: { rarity: 'legendary', category: 'accessory' },
      isActive: true,
    },
    {
      itemType: 'avatar',
      name: 'Neural Network Avatar',
      description: 'Scientific neural network-inspired avatar design',
      price: 249,
      assetUrl: 'https://i.pinimg.com/originals/69/76/2e/69762e89cf1b18f241ff622501cc01cd.png',
      metadata: { rarity: 'rare', category: 'avatar' },
      isActive: true,
    },
    {
      itemType: 'theme',
      name: 'Matrix Code Theme',
      description: 'Classic matrix-style green code theme',
      price: 179,
      assetUrl: 'https://cdn.pixabay.com/photo/2022/06/07/06/13/matrix-7247571_1280.png',
      metadata: { rarity: 'common', category: 'theme' },
      isActive: true,
    },
  ];

  for (const item of shopItems) {
    // Check if item already exists
    const existingItem = await prisma.shopItem.findFirst({
      where: { name: item.name }
    });

    if (!existingItem) {
      await prisma.shopItem.create({
        data: item,
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });