import { MenuPackage } from '../types';

export const MENU_PACKAGES: MenuPackage[] = [
  {
    id: 'solo',
    name: 'SOLO',
    tag: 'SOLO - 15K',
    tagline: 'Personal Feast · Wrap, Wings, Salad & Cake',
    priceFormatted: '15K',
    priceAmount: 15000,
    items: [
      'Beef Wrap',
      '6pc Chicken Wings',
      'Chicken Salad',
      'Mini Ice Cream Cake'
    ],
    description: 'Perfect personal feast crafted for a satisfying solo indulgence.',
    paystackLink: 'https://paystack.com/pay/zaddys-solo-15k'
  },
  {
    id: 'date',
    name: 'DATE',
    tag: 'DATE - 22K',
    tagline: 'Loaded Fries & Wings Pairing for Moments',
    priceFormatted: '22K',
    priceAmount: 22000,
    items: [
      'Loaded Fries',
      '10pc Chicken Wings',
      'Beef Wrap',
      'Mini Ice Cream Cake'
    ],
    popular: true,
    description: 'The ultimate culinary pairing designed for sharing unforgettable moments.',
    paystackLink: 'https://paystack.com/pay/zaddys-date-22k'
  },
  {
    id: 'big',
    name: 'BIG',
    tag: 'BIG - 28K',
    tagline: 'Double Wrap & 12pc Glazed Wings Sharing Platter',
    priceFormatted: '28K',
    priceAmount: 28000,
    items: [
      '1 Loaded Fries',
      '12pc Chicken Wings',
      '2 Wraps',
      'Large Ice Cream Cake'
    ],
    description: 'Generous sharing platter for hungry duos and close celebrations.',
    paystackLink: 'https://paystack.com/pay/zaddys-big-28k'
  },
  {
    id: 'maxi',
    name: 'MAXI',
    tag: 'MAXI - 35K',
    tagline: 'The Ultimate Creamery & Grill Celebration Feast',
    priceFormatted: '35K',
    priceAmount: 35000,
    items: [
      '2 Loaded Fries',
      '15pc Chicken Wings',
      '2 wraps',
      '1 Large Ice Cream Cake',
      'Chicken Salad'
    ],
    description: 'The monumental feast packed with wings, gourmet loaded fries, wraps, salad, and cake.',
    paystackLink: 'https://paystack.com/pay/zaddys-maxi-35k'
  }
];

export const BRAND_DETAILS = {
  website: 'www.zaddys.ng',
  phone: '+234 805 459 3037',
  phoneClean: '+2348054593037',
  bankName: 'moniepoint mfb',
  accountNumber: '5688721644',
  brandName: 'Zaddys',
  tagline: 'Creamery & Grill',
  colors: {
    primaryRed: '#D3121B', // Rich crimson matching flyer
    primaryDarkRed: '#B80E16',
    canvasCream: '#FAF7F2',
    textDark: '#1E1B19',
    mutedGray: '#6E6763',
    borderSepia: '#E8E3DA'
  }
};
