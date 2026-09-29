import React, { useState } from 'react';
import { UserProfile, OrderRecord } from '../types';
import { X, User, ShoppingBag, Trash2, ShieldAlert, Check, MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { saveUser, deleteUserAccount, logoutUser } from '../services/storage';
import { DeliveryStatusTracker } from './DeliveryStatusTracker';
import { getGreeting } from '../utils/greeting';

interface UserProfileModalProps {
  user: UserProfile;
  orders: OrderRecord[];
  onClose: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onAccountDeleted: () => void;
  onLogout: () => void;
  onOpenTrackingPage?: (order: OrderRecord) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  orders,
  onClose,
  onUpdateUser,
  onAccountDeleted,
  onLogout,
  onOpenTrackingPage,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'delete'>('profile');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [isSaved, setIsSaved] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const userOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };
    saveUser(updated);
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationText.toUpperCase() !== 'DELETE') return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteUserAccount(user.id);
      setIsDeleting(false);
      onAccountDeleted();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#E6E0D5] shadow-2xl overflow-hidden font-sans-ui flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE7DC] bg-[#F4EFE6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D3121B]/10 text-[#D3121B] flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1E1B19] text-base sm:text-lg">
                  {getGreeting(user.name)}
                </h3>
                {user.authProvider === 'google' && (
                  <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Google Connected
                  </span>
                )}
                {user.authProvider === 'apple' && (
                  <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300 font-medium">
                    Apple ID
                  </span>
                )}
                {user.authProvider === 'email' && (
                  <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    Email Account
                  </span>
                )}
              </div>
              <p className="text-xs text-[#736B65]">{user.email} · Customer Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A736E] hover:text-[#1E1B19] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#EDE7DC] bg-white/50 px-6 gap-6 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#D3121B] text-[#D3121B]'
                : 'border-transparent text-[#6E6761] hover:text-[#1E1B19]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#D3121B] text-[#D3121B]'
                : 'border-transparent text-[#6E6761] hover:text-[#1E1B19]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'delete'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-[#857D77] hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Account Deletion</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 text-sm bg-gray-100/70 border border-[#E3DBD0] text-[#736B65] rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Member Since
                  </label>
                  <input
                    type="text"
                    disabled
                    value={new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    className="w-full px-3 py-2 text-sm bg-gray-100/70 border border-[#E3DBD0] text-[#736B65] rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Estate, Area, Lagos..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30 focus:border-[#D3121B]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#EDE7DC]">
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-medium text-[#736B65] hover:text-[#1E1B19] transition-colors"
                >
                  Sign Out
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#D3121B] hover:bg-[#B80E16] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 bg-white/50 border border-[#E8E1D5] rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-[#A8A19B] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#1E1B19]">No Orders Yet</p>
                  <p className="text-xs text-[#7A736E] mt-1">
                    Click any red package on the menu to place your first Paystack order!
                  </p>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-white border border-[#E8E1D5] rounded-xl shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-serif-luxury font-bold text-lg text-[#D3121B]">
                          {order.packageName}
                        </span>
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {order.status}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#1E1B19]">
                        ₦{order.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B635D]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A8A19B]" />
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>Ref: <code className="font-mono text-[#1E1B19]">{order.reference}</code></span>
                    </div>

                    <div className="text-xs text-[#4A4541] pt-1 border-t border-[#F0EAE0] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A8A19B] shrink-0" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>

                    {/* Simulated Real-Time Delivery Tracker */}
                    <DeliveryStatusTracker order={order} />

                    {onOpenTrackingPage && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenTrackingPage(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D3121B] hover:bg-[#B80E16] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Open Live Order Tracking Page</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Permanent Account Deletion</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Warning: Deleting your account will immediately and permanently erase:
                </p>
                <ul className="text-xs text-rose-700 list-disc list-inside space-y-1 pl-1">
                  <li>Your user profile, name, and contact details</li>
                  <li>All saved delivery addresses and notes</li>
                  <li>Your complete Paystack order and payment history</li>
                  <li>Your active login session and preferences</li>
                </ul>
                <p className="text-xs font-semibold text-rose-800 pt-1">
                  This action cannot be undone.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-[#4A4541]">
                  To confirm deletion, type <span className="font-mono text-rose-600">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteConfirmationText.toUpperCase() !== 'DELETE' || isDeleting}
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
