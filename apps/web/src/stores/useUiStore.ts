import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
    state: () => ({
        isLoading: false,
        toast: '' as string | null
    }),

    actions: {
        showToast(msg: string, ms = 4000) {
            this.toast = msg;
            setTimeout(() => (this.toast = null), ms);
        }
    }
});
