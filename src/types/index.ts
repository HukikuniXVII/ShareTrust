export enum Category {
  PHOTOGRAPHY = "Photography",
  TOOLS = "Tools",
  OUTDOOR = "Outdoor",
  ELECTRONICS = "Electronics",
  OTHER = "Other"
}

export enum RentalStatus {
  AVAILABLE = "Available",
  RENTED = "Rented",
  MAINTENANCE = "Maintenance"
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  trustScore: number;
  isVerified: boolean;
  location: string;
  joinDate: string;
  bio: string;
  badges: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GearItem {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: Category;
  pricePerDay: number;
  images: string[];
  status: RentalStatus;
  location: string;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface RentalRequest {
  id: string;
  itemId: string;
  requesterId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}
