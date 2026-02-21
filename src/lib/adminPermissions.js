export const ADMIN_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  POSTS_MANAGER: "POSTS_MANAGER",
  POSTS_EDITOR: "POSTS_EDITOR",
  POSTS_WRITER: "POSTS_WRITER",
  CLIENT: "CLIENT",
};

export const POST_EDITING_POLICIES = {
  OWNER_ONLY: "OWNER_ONLY",
  SUPER_ADMIN_CONTENT_ONLY: "SUPER_ADMIN_CONTENT_ONLY",
};

const PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: {
    canManageAdminUsers: true,
    canAccessAllAdminSections: true,
    canCreatePost: true,
    canEditPost: true,
    canDeletePost: true,
    canPublishPost: true,
  },
  [ADMIN_ROLES.POSTS_MANAGER]: {
    canManageAdminUsers: false,
    canAccessAllAdminSections: false,
    canCreatePost: true,
    canEditPost: true,
    canDeletePost: true,
    canPublishPost: true,
  },
  [ADMIN_ROLES.POSTS_EDITOR]: {
    canManageAdminUsers: false,
    canAccessAllAdminSections: false,
    canCreatePost: false,
    canEditPost: true,
    canDeletePost: false,
    canPublishPost: false,
  },
  [ADMIN_ROLES.POSTS_WRITER]: {
    canManageAdminUsers: false,
    canAccessAllAdminSections: false,
    canCreatePost: true,
    canEditPost: false,
    canDeletePost: false,
    canPublishPost: false,
  },
  [ADMIN_ROLES.CLIENT]: {
    canManageAdminUsers: false,
    canAccessAllAdminSections: false,
    canCreatePost: true,
    canEditPost: true,
    canDeletePost: true,
    canPublishPost: true,
  },
};

export const ASSIGNABLE_ROLES = [
  ADMIN_ROLES.POSTS_MANAGER,
  ADMIN_ROLES.POSTS_EDITOR,
  ADMIN_ROLES.POSTS_WRITER,
  ADMIN_ROLES.SUPER_ADMIN,
];

export function normalizeAdminRole(role) {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized in PERMISSIONS) return normalized;
  return ADMIN_ROLES.POSTS_WRITER;
}

export function getAdminPermissions(role) {
  const normalized = normalizeAdminRole(role);
  return {
    role: normalized,
    ...PERMISSIONS[normalized],
  };
}

export function can(role, permissionKey) {
  const permissions = getAdminPermissions(role);
  return Boolean(permissions?.[permissionKey]);
}
