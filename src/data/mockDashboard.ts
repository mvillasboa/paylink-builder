export const mockStats = {
  revenue: {
    current: 145250000,
    previous: 132400000,
    change: 9.7,
  },
  transactions: {
    current: 247,
    previous: 218,
    change: 13.3,
  },
  conversionRate: {
    current: 68.5,
    previous: 64.2,
    change: 6.7,
  },
  activeClients: {
    current: 89,
    previous: 76,
    change: 17.1,
  },
};

export const mockRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
  procesados: Math.floor(Math.random() * 8000) + 2000,
  pendientes: Math.floor(Math.random() * 3000) + 500,
}));

export const mockPaymentMethods = [
  { name: 'Visa', transactions: 142, color: 'hsl(var(--primary))' },
  { name: 'Mastercard', transactions: 89, color: 'hsl(var(--secondary))' },
  { name: 'American Express', transactions: 34, color: 'hsl(var(--accent))' },
];

export const mockLinkStatus = [
  { name: 'Activos', value: 45, color: 'hsl(var(--accent))' },
  { name: 'Pagados', value: 123, color: 'hsl(var(--primary))' },
  { name: 'Expirados', value: 28, color: 'hsl(var(--muted))' },
  { name: 'Cancelados', value: 12, color: 'hsl(var(--destructive))' },
];

export const mockTransactions = [
  {
    id: 'TRX-00123',
    client: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    amount: 2500000,
    method: 'Visa',
    status: 'completed' as const,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'TRX-00122',
    client: { name: 'María González', email: 'maria.g@email.com' },
    amount: 1800000,
    method: 'Mastercard',
    status: 'completed' as const,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'TRX-00121',
    client: { name: 'Carlos López', email: 'carlos.lopez@email.com' },
    amount: 3200000,
    method: 'American Express',
    status: 'pending' as const,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'TRX-00119',
    client: { name: 'Roberto Silva', email: 'roberto.silva@email.com' },
    amount: 4500000,
    method: 'Visa',
    status: 'failed' as const,
    date: new Date(Date.now() - 36 * 60 * 60 * 1000),
  },
  {
    id: 'TRX-00118',
    client: { name: 'Laura Hernández', email: 'laura.h@email.com' },
    amount: 1200000,
    method: 'Mastercard',
    status: 'completed' as const,
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

export const mockPaymentLinks = [
  {
    id: 'LNK-001',
    name: 'Pago Mensualidad Marzo',
    client: { name: 'Juan Pérez', email: 'juan.perez@email.com' },
    amount: 2500000,
    status: 'active' as const,
    views: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  },
  {
    id: 'LNK-002',
    name: 'Servicio Premium',
    client: { name: 'María González', email: 'maria.g@email.com' },
    amount: 5000000,
    status: 'sent' as const,
    views: 1,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
  },
  {
    id: 'LNK-003',
    name: 'Consultoría Febrero',
    client: { name: 'Carlos López', email: 'carlos.lopez@email.com' },
    amount: 8500000,
    status: 'viewed' as const,
    views: 5,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 'LNK-004',
    name: 'Paquete Anual',
    client: { name: 'Ana Martínez', email: 'ana.martinez@email.com' },
    amount: 12000000,
    status: 'active' as const,
    views: 8,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 96 * 60 * 60 * 1000),
  },
  {
    id: 'LNK-005',
    name: 'Servicio de Diseño',
    client: { name: 'Roberto Silva', email: 'roberto.silva@email.com' },
    amount: 3500000,
    status: 'not_viewed' as const,
    views: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    expiresAt: new Date(Date.now() + 120 * 60 * 60 * 1000),
  },
];

export const mockActivity = [
  {
    id: 1,
    type: 'card_registered' as const,
    message: 'Juan Pérez registró su tarjeta',
    time: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 2,
    type: 'link_sent' as const,
    message: 'Link enviado a María González',
    time: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 3,
    type: 'payment_completed' as const,
    message: 'Pago completado por ₲ 2.500.000 PYG',
    time: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 4,
    type: 'link_viewed' as const,
    message: 'Carlos López vio el link de pago',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];
