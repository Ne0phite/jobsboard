import { ref } from 'vue';
import { defineStore } from 'pinia';
import config from '@/config/config';

type ApiStoreState = {
  apiToken?: string;
}

export const useApiTokenStore = defineStore('apiToken', () => {
  const state = ref<ApiStoreState>({
    apiToken: undefined,
  });

  function setApiToken(newToken: string) {
    state.value.apiToken = newToken;
    sessionStorage.setItem(config.sessionStorageApiTokenKeyName, newToken);
  }

  function clearApiToken() {
    state.value.apiToken = undefined;
    sessionStorage.removeItem(config.sessionStorageApiTokenKeyName);
  }

  function getApiToken() {
    const stateToken = state.value.apiToken;
    if (stateToken === undefined || stateToken === null) {
      const sessionStorageToken =
        sessionStorage.getItem(config.sessionStorageApiTokenKeyName);

      if (sessionStorageToken === null || sessionStorageToken === undefined) {
        return undefined;
      }
      return sessionStorageToken;
    }
    return stateToken;
  }

  return { setApiToken, clearApiToken, getApiToken };
});