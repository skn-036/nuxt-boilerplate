export const userIsSuperAdmin = (user?: AuthUser | null) => {
  if (!user) return false;
  return (user?.roles || [])?.some(
    (role) => role.type === 'system' && role.name === 'Super Admin',
  );
};

export const userHasPermission = (
  permissionValues: string | string[] | RegExp = [],
  user?: AuthUser | null,
) => {
  if (!user) return false;
  if (userIsSuperAdmin(user)) return true;

  const requiredPermissions: string[] | RegExp =
    permissionValues instanceof RegExp
      ? permissionValues
      : typeof permissionValues === 'string'
        ? [permissionValues]
        : permissionValues;

  const userPermissionValues = (user?.roles || [])
    .map((role) =>
      (role?.permissions || []).map((permission) => permission.value),
    )
    .flat();

  if (Array.isArray(requiredPermissions)) {
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissionValues.includes(permission),
    );
    if (hasPermission) return true;
  }

  if (requiredPermissions instanceof RegExp) {
    const hasPermission = userPermissionValues.some((permission) =>
      requiredPermissions.test(permission),
    );
    if (hasPermission) return true;
  }

  return false;
};
