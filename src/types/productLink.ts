export type ProductLinkStatus = 'active' | 'used' | 'expired' | 'cancelled';

export interface ProductLink {
  id: string;
  user_id: string;
  product_id: string;
  token: string;
  short_code?: string;
  status: ProductLinkStatus;
  expires_at?: string;
  max_uses?: number;
  uses_count: number;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductLinkData {
  product_id: string;
  expires_at?: string;
  max_uses?: number;
  internal_notes?: string;
}
