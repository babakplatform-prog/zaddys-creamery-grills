import React, { useState } from 'react';
import { MenuPackage } from '../types';
import { X, Plus, Edit2, Trash2, Check, RefreshCw, Link as LinkIcon, Sparkles } from 'lucide-react';
import { saveProducts, resetProductsToDefault } from '../services/storage';

interface ProductManagerModalProps {
  products: MenuPackage[];
  onClose: () => void;
  onProductsUpdated: (updated: MenuPackage[]) => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  products,
  onClose,
  onProductsUpdated,
}) => {
  const [editingPkg, setEditingPkg] = useState<MenuPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [tagline, setTagline] = useState('');
  const [priceAmount, setPriceAmount] = useState<number>(15000);
  const [priceFormatted, setPriceFormatted] = useState('15K');
  const [itemsText, setItemsText] = useState('');
  const [paystackLink, setPaystackLink] = useState('');

  const handleStartEdit = (pkg: MenuPackage) => {
    setEditingPkg(pkg);
    setIsCreating(false);
    setName(pkg.name);
    setTag(pkg.tag);
    setTagline(pkg.tagline || '');
    setPriceAmount(pkg.priceAmount);
    setPriceFormatted(pkg.priceFormatted);
    setItemsText(pkg.items.join('\n'));
    setPaystackLink(pkg.paystackLink || '');
  };

  const handleStartCreate = () => {
    setEditingPkg(null);
    setIsCreating(true);
    setName('NEW PACK');
    setTag('NEW PACK - 20K');
    setTagline('Gourmet wings & creamery dessert');
    setPriceAmount(20000);
    setPriceFormatted('20K');
    setItemsText('Loaded Fries\n8pc Chicken Wings\nMini Cake');
    setPaystackLink('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const items = itemsText
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    let updatedList: MenuPackage[];

    if (isCreating) {
      const newPkg: MenuPackage = {
        id: `pkg_${Date.now()}`,
        name: name.trim().toUpperCase(),
        tag: tag.trim(),
        tagline: tagline.trim(),
        priceAmount: Number(priceAmount),
        priceFormatted: priceFormatted.trim(),
        items,
        paystackLink: paystackLink.trim() || undefined,
      };
      updatedList = [...products, newPkg];
    } else if (editingPkg) {
      updatedList = products.map((p) => {
        if (p.id === editingPkg.id) {
          return {
            ...p,
            name: name.trim().toUpperCase(),
            tag: tag.trim(),
            tagline: tagline.trim(),
            priceAmount: Number(priceAmount),
            priceFormatted: priceFormatted.trim(),
            items,
            paystackLink: paystackLink.trim() || undefined,
          };
        }
        return p;
      });
    } else {
      return;
    }

    saveProducts(updatedList);
    onProductsUpdated(updatedList);
    setEditingPkg(null);
    setIsCreating(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    if (products.length <= 1) {
      alert('You must keep at least 1 menu package.');
      return;
    }
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    onProductsUpdated(updated);
    if (editingPkg?.id === id) {
      setEditingPkg(null);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset menu packages back to the original 4 packages from the flyer?')) {
      const defs = resetProductsToDefault();
      onProductsUpdated(defs);
      setEditingPkg(null);
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl border border-[#E6E0D5] shadow-2xl overflow-hidden font-sans-ui flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE7DC] bg-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D3121B]" />
            <div>
              <h3 className="font-semibold text-[#1E1B19] text-base sm:text-lg">
                Dynamic Product &amp; Menu Manager
              </h3>
              <p className="text-2xs text-[#756E68]">
                Dynamically update package names, taglines, prices, items &amp; Paystack payment links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#7A736E] hover:text-[#1E1B19] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1E1B19] text-xs uppercase tracking-wider">
              Active Packages ({products.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B635D] hover:text-[#1E1B19] bg-white border border-[#DDD5C9] rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Flyer Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleStartCreate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#D3121B] hover:bg-[#B80E16] rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package</span>
              </button>
            </div>
          </div>

          {/* Form Editor when active */}
          {(editingPkg || isCreating) && (
            <form onSubmit={handleSave} className="p-5 bg-white border border-[#D3121B]/30 rounded-xl space-y-4 shadow-sm animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
                <h4 className="font-semibold text-sm text-[#D3121B]">
                  {isCreating ? 'Create New Package' : `Editing ${editingPkg?.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPkg(null);
                    setIsCreating(false);
                  }}
                  className="text-xs text-[#7A736E] hover:text-[#1E1B19]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Display Tag (e.g. SOLO - 15K) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                    Price in ₦ NGN *
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={priceAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPriceAmount(val);
                      setPriceFormatted(`${Math.round(val / 1000)}K`);
                    }}
                    className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Tagline (Clickable on menu) *
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Loaded Fries & Wings Pairing for Moments"
                  className="w-full px-3 py-2 text-sm bg-[#FAF7F2] border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Items Included (One item per line) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={itemsText}
                  onChange={(e) => setItemsText(e.target.value)}
                  placeholder="Beef Wrap&#10;6pc Chicken Wings&#10;Chicken Salad&#10;Mini Ice Cream Cake"
                  className="w-full px-3 py-2 text-sm font-serif-luxury bg-[#FAF7F2] border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D3121B]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4541] mb-1">
                  Custom Paystack Payment Link (Optional)
                </label>
                <input
                  type="url"
                  value={paystackLink}
                  onChange={(e) => setPaystackLink(e.target.value)}
                  placeholder="https://paystack.com/pay/your-link or leave blank for dynamic checkout"
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#DDD5C9] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0ba4db]/30"
                />
                <p className="text-2xs text-[#7A736E] mt-1">
                  If left blank, customers will use Paystack inline checkout with instant redirection to homepage.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D3121B] hover:bg-[#B80E16] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          )}

          {/* List of packages */}
          <div className="space-y-3">
            {products.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 bg-white border border-[#E8E1D5] rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury font-bold text-lg text-[#D3121B]">
                      {pkg.tag}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4A4541] border border-[#E3DBD0]">
                      ₦{pkg.priceAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5550] italic">
                    Tagline: "{pkg.tagline || 'No tagline set'}"
                  </p>
                  <p className="text-2xs text-[#8A827B]">
                    {pkg.items.join(' · ')}
                  </p>
                  {pkg.paystackLink && (
                    <div className="flex items-center gap-1 text-2xs text-[#0ba4db] font-mono pt-0.5">
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate max-w-[280px]">{pkg.paystackLink}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(pkg)}
                    className="p-2 text-xs font-medium text-[#4A4541] hover:text-[#D3121B] hover:bg-[#FAF7F2] rounded-lg border border-[#DDD5C9] transition-colors cursor-pointer"
                    title="Edit package"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    title="Delete package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
