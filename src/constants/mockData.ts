import { Category, RentalStatus, GearItem, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    trustScore: 98,
    isVerified: true,
    location: 'Brooklyn, NY',
    joinDate: 'Oct 2023',
    bio: 'Professional photographer and outdoor enthusiast. Happy to share my backup gear with responsible neighbors.',
    badges: ['Super Lender', 'ID Verified', 'Fast Responder']
  },
  {
    id: 'u2',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    trustScore: 94,
    isVerified: true,
    location: 'Queens, NY',
    joinDate: 'Jan 2024',
    bio: 'DIY enthusiast and maker. I have a variety of power tools that deserve more use.',
    badges: ['Verified Neighbor', 'ID Verified']
  }
];

export const MOCK_GEAR: GearItem[] = [
  {
    id: 'g1',
    ownerId: 'u1',
    name: 'Sony A7IV Mirrorless Camera',
    description: 'The perfect hybrid camera. Includes 28-70mm lens, 2 batteries, and 128GB SD card.',
    category: Category.PHOTOGRAPHY,
    pricePerDay: 45,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'
    ],
    status: RentalStatus.AVAILABLE,
    location: 'Brooklyn, NY',
    tags: ['Sony', 'Full Frame', 'Hybrid'],
    rating: 4.9,
    reviewCount: 24
  },
  {
    id: 'g2',
    ownerId: 'u2',
    name: 'DeWalt 20V MAX Drill Set',
    description: 'Powerful brushless drill with 2 batteries and charger. Great for home projects.',
    category: Category.TOOLS,
    pricePerDay: 15,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop'
    ],
    status: RentalStatus.AVAILABLE,
    location: 'Queens, NY',
    tags: ['DeWalt', 'Power Tool', 'DIY'],
    rating: 4.8,
    reviewCount: 12
  },
  {
    id: 'g3',
    ownerId: 'u1',
    name: 'DJI Mavic 3 Classic',
    description: 'Professional drone with Hasselblad camera. Includes controller and fly more kit.',
    category: Category.PHOTOGRAPHY,
    pricePerDay: 65,
    images: [
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=600&fit=crop'
    ],
    status: RentalStatus.RENTED,
    location: 'Brooklyn, NY',
    tags: ['Drone', 'DJI', '4K'],
    rating: 5.0,
    reviewCount: 8
  },
  {
    id: 'g4',
    ownerId: 'u2',
    name: 'Coleman 4-Person Tent',
    description: 'Easy-up tent, perfect for weekend camping. Clean and waterproof.',
    category: Category.OUTDOOR,
    pricePerDay: 20,
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop'
    ],
    status: RentalStatus.AVAILABLE,
    location: 'Queens, NY',
    tags: ['Camping', 'Outdoor', 'Tent'],
    rating: 4.5,
    reviewCount: 15
  }
];
