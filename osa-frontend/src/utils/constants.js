export const DEPARTMENTS = [
  { value: 'STE', label: 'School of Teacher Education' },
  { value: 'CET', label: 'Computer Engineering Technology' },
  { value: 'CCJE', label: 'Criminology and Criminal Justice Education' },
  { value: 'HuSoCom', label: 'Hotel and Restaurant Services Community' },
  { value: 'BSMT', label: 'Marine Transportation' },
  { value: 'SBME', label: 'Marine Engineering' },
  { value: 'CHATME', label: 'Teaching and Maritime Education' }
];

export const PARTNERSHIP_STATUS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'terminated', label: 'Terminated', color: 'red' },
  { value: 'for_renewal', label: 'For Renewal', color: 'yellow' },
  { value: 'non_renewal', label: 'Non-Renewal', color: 'gray' }
];

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'department', label: 'Department' },
  { value: 'viewer', label: 'Viewer' }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHECK_EMAIL: '/auth/check-email',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PARTNERSHIPS: {
    BASE: '/partnerships/',
    STATISTICS: '/partnerships/statistics',
    BY_ID: (id) => `/partnerships/${id}/`
  },
  ADMIN: {
    USERS: '/admin/users/',
    PENDING_USERS: '/admin/users/pending',
    USER_BY_ID: (id) => `/admin/users/${id}/`,
    APPROVE_USER: (id) => `/admin/users/${id}/approve/`,
    REJECT_USER: (id) => `/admin/users/${id}/reject/`,
    CHANGE_USER_PASSWORD: (id) => `/admin/users/${id}/change-password/`,
    AUDIT_LOGS: '/admin/audit-logs',
    DASHBOARD_STATS: '/admin/dashboard-stats'
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'osa_token',
  USER: 'osa_user'
};