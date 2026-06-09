export interface MobileSubscription {
  id: string;
  merchant: string;
  concept: string;
  amount: number;
  frequency: 'Mensual' | 'Anual' | 'Semanal';
  nextChargeDate: Date;
  status: 'active' | 'paused' | 'cancelled';
  cardLast4: string;
  cardBrand: 'visa' | 'mastercard' | 'amex';
  icon: string;
  totalInstallments?: number;
  paidInstallments?: number;
}

export const mockMobileSubscriptions: MobileSubscription[] = [
  {
    id: 'sub-1',
    merchant: 'Netflix Paraguay',
    concept: 'Plan Premium',
    amount: 75000,
    frequency: 'Mensual',
    nextChargeDate: new Date(Date.now() + 5 * 86400000),
    status: 'active',
    cardLast4: '4242',
    cardBrand: 'visa',
    icon: '🎬',
  },
  {
    id: 'sub-2',
    merchant: 'Gimnasio Activo',
    concept: 'Membresía mensual',
    amount: 250000,
    frequency: 'Mensual',
    nextChargeDate: new Date(Date.now() + 12 * 86400000),
    status: 'active',
    cardLast4: '5555',
    cardBrand: 'mastercard',
    icon: '💪',
  },
  {
    id: 'sub-3',
    merchant: 'Spotify',
    concept: 'Familiar',
    amount: 45000,
    frequency: 'Mensual',
    nextChargeDate: new Date(Date.now() + 18 * 86400000),
    status: 'active',
    cardLast4: '4242',
    cardBrand: 'visa',
    icon: '🎵',
  },
  {
    id: 'sub-4',
    merchant: 'Revista Digital ABC',
    concept: 'Suscripción anual',
    amount: 480000,
    frequency: 'Anual',
    nextChargeDate: new Date(Date.now() + 90 * 86400000),
    status: 'paused',
    cardLast4: '1234',
    cardBrand: 'amex',
    icon: '📰',
  },
  {
    id: 'sub-5',
    merchant: 'Cloud Storage Pro',
    concept: '2TB',
    amount: 35000,
    frequency: 'Mensual',
    nextChargeDate: new Date(Date.now() + 25 * 86400000),
    status: 'active',
    cardLast4: '5555',
    cardBrand: 'mastercard',
    icon: '☁️',
  },
];

export interface MobilePayment {
  id: string;
  merchant: string;
  concept: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  cardLast4: string;
  cardBrand: 'visa' | 'mastercard' | 'amex';
  type: 'subscription' | 'one-time';
}

const merchantsPool = [
  { name: 'Netflix Paraguay', concept: 'Plan Premium', type: 'subscription' as const },
  { name: 'Spotify', concept: 'Familiar', type: 'subscription' as const },
  { name: 'Gimnasio Activo', concept: 'Membresía', type: 'subscription' as const },
  { name: 'Cloud Storage Pro', concept: '2TB', type: 'subscription' as const },
  { name: 'Tienda Online XYZ', concept: 'Compra producto', type: 'one-time' as const },
  { name: 'Restaurante La Plaza', concept: 'Reserva', type: 'one-time' as const },
  { name: 'Farmacia Central', concept: 'Compra', type: 'one-time' as const },
];

export const mockMobilePayments: MobilePayment[] = Array.from({ length: 18 }, (_, i) => {
  const m = merchantsPool[i % merchantsPool.length];
  const cards = [
    { last4: '4242', brand: 'visa' as const },
    { last4: '5555', brand: 'mastercard' as const },
    { last4: '1234', brand: 'amex' as const },
  ];
  const card = cards[i % 3];
  const statusRand = Math.random();
  const status: MobilePayment['status'] =
    statusRand < 0.85 ? 'completed' : statusRand < 0.95 ? 'pending' : 'failed';
  return {
    id: `pay-${1000 + i}`,
    merchant: m.name,
    concept: m.concept,
    amount: Math.floor(Math.random() * 400000) + 30000,
    date: new Date(Date.now() - i * 2 * 86400000 - Math.random() * 86400000),
    status,
    cardLast4: card.last4,
    cardBrand: card.brand,
    type: m.type,
  };
});
