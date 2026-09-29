import { UserProfile, OrderRecord, MenuPackage } from '../types';
import { MENU_PACKAGES } from '../data/menu';

const USER_KEY = 'zaddys_current_user';
const ALL_USERS_KEY = 'zaddys_all_users';
const ORDERS_KEY = 'zaddys_user_orders';
const PAYSTACK_KEY_STORAGE = 'zaddys_paystack_public_key';
const CUSTOM_LOGO_STORAGE = 'zaddys_custom_logo_data';
const PRODUCTS_KEY = 'zaddys_dynamic_products';

// Demo initial user for testing convenience
export const DEMO_USER: UserProfile = {
  id: 'usr_zaddys_101',
  name: 'Folake Adeyemi',
  email: 'folake@zaddys.ng',
  phone: '+234 805 123 4567',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos',
  createdAt: new Date().toISOString(),
  authProvider: 'google',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
};

// ----------------- Dynamic Product Management -----------------
export const getStoredProducts = (): MenuPackage[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      // Initialize with default packages
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MENU_PACKAGES));
      return MENU_PACKAGES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return MENU_PACKAGES;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading stored products', err);
    return MENU_PACKAGES;
  }
};

export const saveProducts = (products: MenuPackage[]): void => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products', err);
  }
};

export const updateSingleProduct = (updatedPkg: MenuPackage): MenuPackage[] => {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === updatedPkg.id);
  let newProducts: MenuPackage[];
  if (index >= 0) {
    newProducts = [...products];
    newProducts[index] = updatedPkg;
  } else {
    newProducts = [...products, updatedPkg];
  }
  saveProducts(newProducts);
  return newProducts;
};

export const resetProductsToDefault = (): MenuPackage[] => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MENU_PACKAGES));
  return MENU_PACKAGES;
};

// ----------------- User Authentication & Social Auth -----------------
export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stored user', err);
    return null;
  }
};

export const saveUser = (user: UserProfile): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Also save into all users registry
    const allUsers = getAllUsers();
    const existingIndex = allUsers.findIndex(
      (u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      allUsers[existingIndex] = { ...allUsers[existingIndex], ...user };
    } else {
      allUsers.push(user);
    }
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
  } catch (err) {
    console.error('Error saving user', err);
  }
};

export const getAllUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const deleteUserAccount = (userId: string): boolean => {
  try {
    // 1. Remove current session if matches
    const current = getStoredUser();
    if (current?.id === userId) {
      localStorage.removeItem(USER_KEY);
    }

    // 2. Remove from users directory
    const allUsers = getAllUsers().filter((u) => u.id !== userId);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));

    // 3. Purge orders linked to this user's email/id
    if (current?.email) {
      const orders = getStoredOrders().filter(
        (o) => o.customerEmail.toLowerCase() !== current.email.toLowerCase()
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }

    return true;
  } catch (err) {
    console.error('Error deleting user account', err);
    return false;
  }
};

// Social Auth: Continue with Google
export const loginWithGoogle = (email?: string, name?: string): UserProfile => {
  const chosenEmail = email || 'babakplatform@gmail.com';
  const chosenName = name || 'Google Customer';
  const allUsers = getAllUsers();
  const existing = allUsers.find((u) => u.email.toLowerCase() === chosenEmail.toLowerCase());

  const profile: UserProfile = existing
    ? { ...existing, authProvider: 'google' }
    : {
        id: `usr_g_${Date.now()}`,
        name: chosenName,
        email: chosenEmail,
        phone: '+234 805 459 3037',
        address: 'Victoria Island, Lagos, Nigeria',
        createdAt: new Date().toISOString(),
        authProvider: 'google',
      };

  saveUser(profile);
  return profile;
};

// Social Auth: Continue with Apple
export const loginWithApple = (email?: string, name?: string): UserProfile => {
  const chosenEmail = email || 'apple.user@icloud.com';
  const chosenName = name || 'Apple Customer';
  const allUsers = getAllUsers();
  const existing = allUsers.find((u) => u.email.toLowerCase() === chosenEmail.toLowerCase());

  const profile: UserProfile = existing
    ? { ...existing, authProvider: 'apple' }
    : {
        id: `usr_apple_${Date.now()}`,
        name: chosenName,
        email: chosenEmail,
        phone: '+234 802 334 5566',
        address: 'Ikoyi, Lagos, Nigeria',
        createdAt: new Date().toISOString(),
        authProvider: 'apple',
      };

  saveUser(profile);
  return profile;
};

// ----------------- Orders Management -----------------
export const getStoredOrders = (): OrderRecord[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      // Seed a recent sample order for demo testing (placed 20 seconds ago)
      const initialDemoOrder: OrderRecord = {
        id: 'ord_demo_201',
        reference: `PAY-ZAD-${Date.now().toString().slice(-6)}-982`,
        packageId: 'date',
        packageName: 'DATE - 22K',
        amount: 22000,
        customerName: 'Folake Adeyemi',
        customerEmail: 'folake@zaddys.ng',
        customerPhone: '+234 805 123 4567',
        deliveryAddress: '14 Admiralty Way, Lekki Phase 1, Lagos',
        status: 'Preparing',
        createdAt: new Date(Date.now() - 20 * 1000).toISOString(), // 20s ago
        paystackChannel: 'Paystack Card Gateway',
      };
      localStorage.setItem(ORDERS_KEY, JSON.stringify([initialDemoOrder]));
      return [initialDemoOrder];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveOrder = (order: OrderRecord): void => {
  try {
    const current = getStoredOrders();
    const updated = [order, ...current];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving order', err);
  }
};

// ----------------- Paystack & Logo Storage -----------------
export const getPaystackPublicKey = (): string => {
  return localStorage.getItem(PAYSTACK_KEY_STORAGE) || 'pk_test_sample_zaddys_key';
};

export const savePaystackPublicKey = (key: string): void => {
  localStorage.setItem(PAYSTACK_KEY_STORAGE, key.trim());
};

export const getCustomLogo = (): string | null => {
  return localStorage.getItem(CUSTOM_LOGO_STORAGE);
};

export const saveCustomLogo = (dataUrl: string): void => {
  localStorage.setItem(CUSTOM_LOGO_STORAGE, dataUrl);
};

export const removeCustomLogo = (): void => {
  localStorage.removeItem(CUSTOM_LOGO_STORAGE);
};

