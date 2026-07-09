export type AdminRole = 'super_admin' | 'support_agent' | 'moderator' | 'finance_admin';
export type AdminPermission =
  | 'VIEW_USERS' | 'SUSPEND_USERS' | 'APPROVE_SELLERS' | 'ISSUE_REFUNDS'
  | 'TERMINATE_STREAMS' | 'APPROVE_PAYOUTS' | 'VIEW_ANALYTICS'
  | 'MANAGE_CATEGORIES' | 'VIEW_REPORTS' | 'MANAGE_ADMINS';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isTotpEnabled: boolean;
  lastLoginAt?: string;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  isBanned: boolean;
  isEmailVerified: boolean;
  isSuspended: boolean;
  suspendedUntil?: string;
  banReason?: string;
  sellerProfile?: SellerProfile | null;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SellerProfile {
  status: string;
  primaryCategory?: string;
  subcategory?: string;
  sellerType?: string;
  businessAddress?: any;
  averageEarningRange?: string;
  identityDocUrl?: string;
  businessLicenseUrl?: string;
  bio?: string;
  appliedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
}

export interface AdminRecord {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId: { _id: string; name: string; slug: string } | null;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type ListingType = 'auction' | 'buy_it_now' | 'giveaway';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'sold_out' | 'reserved' | 'ended';
export type ProductCondition = 'new' | 'like_new' | 'excellent' | 'good' | 'fair';

export interface ProductSeller {
  _id: string;
  username: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface Product {
  _id: string;
  sellerId: ProductSeller | string;
  title: string;
  description: string;
  category: string;
  condition: ProductCondition;
  listingType: ListingType;
  status: ProductStatus;
  price: number;
  startingPrice?: number;
  currentHighBid: number;
  auctionEndsAt?: string;
  quantity: number;
  quantitySold: number;
  images: string[];
  flashSale: boolean;
  acceptOffers: boolean;
  reserveForLive: boolean;
  hazardousMaterials: boolean;
  tags: string[];
  viewsCount: number;
  createdAt: string;
}

export interface ProductPaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryPaginatedResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  users?: T[];
  sellers?: T[];
  admins?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}
