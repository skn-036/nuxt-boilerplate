export const useAuthSession = () => {
  const auth = useAuth();
  const state = useAuthState();

  const user = computed(() => auth.data.value || null);

  const isAuthenticated = computed(() => {
    return auth.status.value === 'authenticated' && Boolean(user.value?._id);
  });

  const isSuperAdmin = computed(() => userIsSuperAdmin(user.value));

  const hasPermission = (permissionValues: string | string[] | RegExp = []) => {
    return userHasPermission(permissionValues, user.value);
  };

  return {
    ...auth,
    ...state,
    isAuthenticated,
    isSuperAdmin,
    user,
    hasPermission,
  };
};
