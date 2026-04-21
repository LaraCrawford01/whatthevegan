export const ADMIN_COOKIE_NAME = "wtv_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function isAdminCookieValue(value: string | undefined) {
  const password = getAdminPassword();
  if (!password || !value) {
    return false;
  }

  return value === password;
}

type CookieStoreLike = {
  get: (name: string) => { value: string } | undefined;
};

export function isAdminFromCookieStore(cookieStore: CookieStoreLike) {
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminCookieValue(token);
}
