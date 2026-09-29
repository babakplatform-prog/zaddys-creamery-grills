export interface MenuItem {
  name: string;
  quantity?: string;
}

export interface MenuPackage {
  id: string;
  name: string;
  tag: string;
  tagline: string; // Dynamic tagline for the package
  priceFormatted: string; // e.g. "15K"
  priceAmount: number; // in NGN e.g. 15000
  items: string[];
  description?: string;
  popular?: boolean;
  paystackLink?: string; // Direct Paystack payment link URL
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  authProvider: 'google' | 'apple' | 'email';
  avatarUrl?: string;
}

export interface OrderItem {
  packageId: string;
  packageName: string;
  packagePrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  reference: string;
  packageId: string;
  packageName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  paystackChannel: string;
}
