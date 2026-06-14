export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SUPPORT_AGENT: 'support_agent',
  MODERATOR: 'moderator',
  FINANCE_ADMIN: 'finance_admin',
} as const;

export const ADMIN_PERMISSIONS = {
  VIEW_USERS: 'VIEW_USERS',
  SUSPEND_USERS: 'SUSPEND_USERS',
  APPROVE_SELLERS: 'APPROVE_SELLERS',
  ISSUE_REFUNDS: 'ISSUE_REFUNDS',
  TERMINATE_STREAMS: 'TERMINATE_STREAMS',
  APPROVE_PAYOUTS: 'APPROVE_PAYOUTS',
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  MANAGE_CATEGORIES: 'MANAGE_CATEGORIES',
  VIEW_REPORTS: 'VIEW_REPORTS',
  MANAGE_ADMINS: 'MANAGE_ADMINS',
} as const;

export const SELLER_STATUS_LABELS: Record<string, string> = {
  none: 'None',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
  needs_more_information: 'Needs Info',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  seller: 'Seller',
  moderator: 'Moderator',
  cohost: 'Co-host',
  admin: 'Admin',
};

export const TOKEN_KEY = 'admin_token';
export const ADMIN_KEY = 'admin_user';
