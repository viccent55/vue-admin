import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => {
    return {
      lang: 'en',
      ip: '',
      configuration: <EmptyObjectType>{},
      localVersion: 1,
      user: {} as EmptyObjectType,
    }
  },
  actions: {
    updateLocale(lang: string) {
      this.lang = lang
    },
  },
  persist: true,
})
