import { create } from 'zustand';

const useProfileStore = create((set) => ({
    // Form Data
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: '',
    relationshipGoals: '',
    lifestyle: [], // Array of strings

    // Actions
    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
    resetProfile: () => set({
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        gender: '',
        relationshipGoals: '',
        lifestyle: []
    }),
}));

export default useProfileStore;
