import { SecureStore } from "expo";

const tokenKey = "fb_token";

export const saveToken = async (token: string) => {
  return await SecureStore.setItemAsync(tokenKey, token);
};

export const fetchToken = async () => {
  const token = await SecureStore.getItemAsync(tokenKey);
  // TODO check expiration and scopes
  return token;
};
