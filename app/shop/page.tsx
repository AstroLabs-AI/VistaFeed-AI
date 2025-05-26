'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Palette, Sparkles, Crown, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'avatar' | 'theme' | 'animation' | 'accessory';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  isOwned: boolean;
  isEquipped: boolean;
}

const mockShopItems: ShopItem[] = [
  {
    id: '1',
    name: 'Cyber Agent Avatar',
    description: 'Futuristic cyberpunk-style avatar for your AI agents',
    price: 299,
    category: 'avatar',
    rarity: 'epic',
    image: 'https://imgcdn.stablediffusionweb.com/2024/12/22/14b67f49-2341-4677-8655-e667e7b6f9ba.jpg',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: '2',
    name: 'Holographic Theme',
    description: 'Stunning holographic interface theme with rainbow effects',
    price: 199,
    category: 'theme',
    rarity: 'rare',
    image: 'https://thumbs.dreamstime.com/z/vector-holographic-background-bright-colors-rainbow-metal-texture-mobile-interfaces-applications-books-206689657.jpg',
    isOwned: true,
    isEquipped: true,
  },
  {
    id: '3',
    name: 'Quantum Particles',
    description: 'Animated quantum particle effects for agent interactions',
    price: 149,
    category: 'animation',
    rarity: 'rare',
    image: 'https://i.ytimg.com/vi/KyoSqjyaD0s/hqdefault.jpg',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: '4',
    name: 'Golden Crown',
    description: 'Prestigious golden crown accessory for premium agents',
    price: 499,
    category: 'accessory',
    rarity: 'legendary',
    image: 'https://i.ytimg.com/vi/Ow14BejXqio/maxresdefault.jpg',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: '5',
    name: 'Neural Network Avatar',
    description: 'Scientific neural network-inspired avatar design',
    price: 249,
    category: 'avatar',
    rarity: 'rare',
    image: 'https://i.pinimg.com/originals/69/76/2e/69762e89cf1b18f241ff622501cc01cd.png',
    isOwned: false,
    isEquipped: false,
  },
  {
    id: '6',
    name: 'Matrix Code Theme',
    description: 'Classic matrix-style green code theme',
    price: 179,
    category: 'theme',
    rarity: 'common',
    image: 'https://cdn.pixabay.com/photo/2022/06/07/06/13/matrix-7247571_1280.png',
    isOwned: true,
    isEquipped: false,
  },
];

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

const rarityIcons = {
  common: Star,
  rare: Gem,
  epic: Crown,
  legendary: Sparkles,
};

const categoryIcons = {
  avatar: Palette,
  theme: Sparkles,
  animation: Star,
  accessory: Crown,
};

export default function ShopPage() {
  const [items, setItems] = useState<ShopItem[]>(mockShopItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userCoins, setUserCoins] = useState(1250);
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const validateAuth = async () => {
      setIsChecking(true);
      const isValid = await checkAuth();
      if (!isValid) {
        router.push('/');
        return;
      }
      setIsChecking(false);
    };

    validateAuth();
  }, [checkAuth, router]);

  const filteredItems = items.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const purchaseItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && !item.isOwned && userCoins >= item.price) {
      setItems(items.map(i => 
        i.id === itemId ? { ...i, isOwned: true } : i
      ));
      setUserCoins(userCoins - item.price);
    }
  };

  const equipItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && item.isOwned) {
      setItems(items.map(i => 
        i.id === itemId 
          ? { ...i, isEquipped: !i.isEquipped }
          : i.category === item.category 
            ? { ...i, isEquipped: false }
            : i
      ));
    }
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingBag },
    { id: 'avatar', name: 'Avatars', icon: Palette },
    { id: 'theme', name: 'Themes', icon: Sparkles },
    { id: 'animation', name: 'Animations', icon: Star },
    { id: 'accessory', name: 'Accessories', icon: Crown },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Agent <span className="gradient-text">Shop</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Customize your AI agents with unique avatars, themes, and accessories
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
            <Gem className="w-5 h-5" />
            <span className="font-bold">{userCoins.toLocaleString()}</span>
            <span className="text-sm">coins</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Items</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{items.length}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Owned</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {items.filter(i => i.isOwned).length}
                  </p>
                </div>
                <Palette className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50 dark:border-purple-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Equipped</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {items.filter(i => i.isEquipped).length}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200/50 dark:border-orange-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Legendary</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {items.filter(i => i.rarity === 'legendary').length}
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => {
                const RarityIcon = rarityIcons[item.rarity];
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      {/* Image */}
                      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Rarity Badge */}
                        <div className="absolute top-2 right-2">
                          <Badge className={`${rarityColors[item.rarity]} text-white`}>
                            <RarityIcon className="w-3 h-3 mr-1" />
                            {item.rarity}
                          </Badge>
                        </div>

                        {/* Owned/Equipped Badges */}
                        {item.isOwned && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-500 text-white">
                              Owned
                            </Badge>
                          </div>
                        )}
                        
                        {item.isEquipped && (
                          <div className="absolute bottom-2 left-2">
                            <Badge className="bg-blue-500 text-white">
                              Equipped
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Gem className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-lg">{item.price}</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {item.category}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {!item.isOwned ? (
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={() => purchaseItem(item.id)}
                              disabled={userCoins < item.price}
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              {userCoins >= item.price ? 'Purchase' : 'Insufficient Coins'}
                            </Button>
                          ) : (
                            <Button
                              variant={item.isEquipped ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => equipItem(item.id)}
                            >
                              {item.isEquipped ? 'Unequip' : 'Equip'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No items in this category
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check back later for new items!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}