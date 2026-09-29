import React, { useState, useEffect } from 'react';
import { MenuPackage, UserProfile, OrderRecord } from './types';
import { HeaderNav } from './components/HeaderNav';
import { MenuCard } from './components/MenuCard';
import { PaystackCheckoutModal } from './components/PaystackCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { BrandGuideModal } from './components/BrandGuideModal';
import { ProductManagerModal } from './components/ProductManagerModal';
import { SplashScreen } from './components/SplashScreen';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import {
  getStoredUser,
  getStoredOrders,
  getCustomLogo,
  getStoredProducts,
  saveOrder,
  logoutUser,
} from './services/storage';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<MenuPackage[]>([]);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderRecord | null>(null);

  // Modals state
  const [selectedPackage, setSelectedPackage] = useState<MenuPackage | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBrandGuideOpen, setIsBrandGuideOpen] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data dynamically
  useEffect(() => {
    const loadedUser = getStoredUser();
    const loadedOrders = getStoredOrders();
    const loadedProducts = getStoredProducts();
    setCurrentUser(loadedUser);
    setOrders(loadedOrders);
    setProducts(loadedProducts);
    setCustomLogoUrl(getCustomLogo());

    // Check if user was redirected back from Paystack (e.g. www.zaddys.ng/?reference=...)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const paystackRef = searchParams.get('reference') || searchParams.get('trxref');
      if (paystackRef) {
        const pkgParam = searchParams.get('pkg') || 'solo';
        const matchedPkg = loadedProducts.find((p) => p.id === pkgParam) || loadedProducts[0];

        const newOrder: OrderRecord = {
          id: `ord_${Date.now()}`,
          reference: paystackRef,
          packageId: matchedPkg.id,
          packageName: matchedPkg.tag,
          amount: matchedPkg.priceAmount,
          customerName: loadedUser?.name || 'Valued Customer',
          customerEmail: loadedUser?.email || 'customer@zaddys.ng',
          customerPhone: loadedUser?.phone || '+234 805 459 3037',
          deliveryAddress: loadedUser?.address || 'Lagos Delivery Address',
          status: 'Confirmed',
          createdAt: new Date().toISOString(),
          paystackChannel: 'Paystack Payment Link Callback',
        };

        saveOrder(newOrder);
        setOrders(getStoredOrders());
        setActiveTrackingOrder(newOrder); // Redirect directly to live tracking page!

        // Automatically clean URL parameters so user is returned to clean route
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.error('Error parsing Paystack return URL', e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectPackage = (pkg: MenuPackage, triggerSource?: 'name' | 'tagline') => {
    setSelectedPackage(pkg);
  };

  const handlePaymentSuccess = (order: OrderRecord) => {
    setOrders(getStoredOrders());
    setCurrentUser(getStoredUser());
    setSelectedPackage(null);
    setConfirmedOrder(null);
    setActiveTrackingOrder(order); // Redirect immediately to dedicated order tracking page!
    triggerToast(`Payment verified! Redirected to live order tracking.`);
  };

  const handleReturnToHomepage = () => {
    setConfirmedOrder(null);
    setActiveTrackingOrder(null);
    triggerToast('Returned to homepage (www.zaddys.ng). Our chef is preparing your meal.');
  };

  const handleAccountDeleted = () => {
    setCurrentUser(null);
    setOrders(getStoredOrders());
    setActiveTrackingOrder(null);
    setIsProfileOpen(false);
    triggerToast('Your account and all associated order history have been permanently deleted.');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsProfileOpen(false);
    triggerToast('Signed out successfully.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    const updated = getStoredOrders().map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    localStorage.setItem('zaddys_orders', JSON.stringify(updated));
    setOrders(updated);
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder({ ...activeTrackingOrder, status });
    }
    triggerToast('Delivery confirmed as received! Enjoy your Zaddys feast.');
  };

  // If user is actively tracking an order, show the full OrderTrackingPage
  if (activeTrackingOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1E1B19] text-[#FAF7F2] px-4 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-sans-ui flex items-center gap-2 border border-[#3A3532] animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <OrderTrackingPage
          order={activeTrackingOrder}
          onBackToHome={() => {
            setActiveTrackingOrder(null);
            triggerToast('Returned to homepage (www.zaddys.ng)');
          }}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1B19]">
      {/* Top Header Navigation */}
      <HeaderNav
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenBrandGuide={() => setIsBrandGuideOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onShowSplash={() => setShowSplash(true)}
        latestOrder={orders[0] || null}
        onOpenTracking={() => orders[0] && setActiveTrackingOrder(orders[0])}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1B19] text-[#FAF7F2] px-4 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-sans-ui flex items-center gap-2 border border-[#3A3532] animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Menu Area */}
      <main className="flex-1 py-4 sm:py-8">
        <MenuCard
          products={products}
          currentUser={currentUser}
          onSelectPackage={handleSelectPackage}
          onManageProducts={() => setIsProductManagerOpen(true)}
          customLogoUrl={customLogoUrl}
        />
      </main>

      {/* Modals */}
      {selectedPackage && (
        <PaystackCheckoutModal
          pkg={selectedPackage}
          currentUser={currentUser}
          onClose={() => setSelectedPackage(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onCloseToHome={handleReturnToHomepage}
          onOpenProfile={() => {
            setConfirmedOrder(null);
            setIsProfileOpen(true);
          }}
          onTrackOrder={() => {
            const ord = confirmedOrder;
            setConfirmedOrder(null);
            setActiveTrackingOrder(ord);
          }}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            triggerToast(`Welcome, ${user.name}!`);
          }}
        />
      )}

      {isProfileOpen && currentUser && (
        <UserProfileModal
          user={currentUser}
          orders={orders}
          onClose={() => setIsProfileOpen(false)}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
            triggerToast('Profile updated successfully.');
          }}
          onAccountDeleted={handleAccountDeleted}
          onLogout={handleLogout}
          onOpenTrackingPage={(order) => {
            setIsProfileOpen(false);
            setActiveTrackingOrder(order);
          }}
        />
      )}

      {isBrandGuideOpen && (
        <BrandGuideModal
          onClose={() => setIsBrandGuideOpen(false)}
          customLogoUrl={customLogoUrl}
          onLogoUpdated={(url) => {
            setCustomLogoUrl(url);
            triggerToast('Logo preference updated.');
          }}
          onOpenSplash={() => setShowSplash(true)}
        />
      )}

      {isProductManagerOpen && (
        <ProductManagerModal
          products={products}
          onClose={() => setIsProductManagerOpen(false)}
          onProductsUpdated={(updated) => {
            setProducts(updated);
            triggerToast('Product list dynamically updated.');
          }}
        />
      )}

      {/* Luxury Splash Screen */}
      {showSplash && (
        <SplashScreen
          customLogoUrl={customLogoUrl}
          onComplete={() => setShowSplash(false)}
          onLogoUpdated={(url) => {
            setCustomLogoUrl(url);
            triggerToast('Logo updated successfully.');
          }}
        />
      )}
    </div>
  );
}
