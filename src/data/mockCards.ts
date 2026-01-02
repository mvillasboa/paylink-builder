export interface SavedCard {
  id: string;
  lastFourDigits: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover';
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  addedDate: Date;
  lastUsed?: Date;
}

export const mockSavedCards: SavedCard[] = [
  {
    id: 'card-001',
    lastFourDigits: '4242',
    cardBrand: 'visa',
    cardholderName: 'JUAN PÉREZ GARCÍA',
    expiryMonth: '12',
    expiryYear: '26',
    isDefault: true,
    addedDate: new Date(2024, 0, 15),
    lastUsed: new Date(2024, 2, 1),
  },
  {
    id: 'card-002',
    lastFourDigits: '5555',
    cardBrand: 'mastercard',
    cardholderName: 'JUAN PÉREZ GARCÍA',
    expiryMonth: '08',
    expiryYear: '25',
    isDefault: false,
    addedDate: new Date(2023, 11, 20),
    lastUsed: new Date(2024, 1, 15),
  },
  {
    id: 'card-003',
    lastFourDigits: '1234',
    cardBrand: 'amex',
    cardholderName: 'JUAN PÉREZ GARCÍA',
    expiryMonth: '03',
    expiryYear: '27',
    isDefault: false,
    addedDate: new Date(2024, 1, 5),
  },
];

export const cardBrandNames = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
};

export const cardBrandColors = {
  visa: 'from-primary to-primary-light text-primary-foreground',
  mastercard: 'from-secondary to-secondary-light text-secondary-foreground',
  amex: 'from-primary to-secondary text-primary-foreground',
  discover: 'from-accent to-accent/80 text-accent-foreground',
};
