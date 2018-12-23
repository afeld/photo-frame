interface FBPermission {
  permission: string;
  status: string;
}

interface FBPermissionsResponse {
  data: FBPermission[];
}

export const SCOPES = new Set(["user_friends", "user_photos"]);

export const arePermissionsGranted = (perms: FBPermission[]) => {
  // convert to a Set
  const grantedScopes = new Set();
  perms.forEach((perm: FBPermission) => {
    if (perm.status === "granted") {
      grantedScopes.add(perm.permission);
    }
  });

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
  for (const scope of SCOPES) {
    if (!grantedScopes.has(scope)) {
      // missing scope
      console.error(`Missing ${scope} scope.`);
      return false;
    }
  }

  // has all scopes
  return true;
};

const confirmPermissions = (
  FB: fb.FacebookStatic,
  cb: (hasPermissions: boolean) => void
) => {
  FB.api("me/permissions", (permsResponse: FBPermissionsResponse) => {
    cb(arePermissionsGranted(permsResponse.data));
  });
};

export default confirmPermissions;
