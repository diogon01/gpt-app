import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
    state: () => ({
        isLoading: false,
        toast: '' as string | null,
        model: 'gpt-4o' as 'gpt-4o' | 'gpt-3.5' | 'geoai',
    }),

    actions: {
        showToast(msg: string, ms = 4000) {
            this.toast = msg;
            setTimeout(() => (this.toast = null), ms);
        }
    }
});
