// store/calculatorStore.js - COMPLETE FILE
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { calculateRealPerformance, validateSetupComplete } from '../lib/calculateRealPerformance';
import { toast } from '../components/Toast';

const initialSetup = {
  wheel: '',
  tire: '',
  crankset: null,
  cassette: null
};

const useCalculatorStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        bikeType: '',
        currentSetup: initialSetup,
        proposedSetup: initialSetup,
        results: null,
        loading: false,
        speedUnit: 'mph',
        compatibilityResults: null,
        savedConfigs: [],

        // Actions
        setBikeType: (bikeType) => set({ bikeType }),
        
        updateCurrentSetup: (updates) => set((state) => ({
          currentSetup: { ...state.currentSetup, ...updates }
        })),
        
        updateProposedSetup: (updates) => set((state) => ({
          proposedSetup: { ...state.proposedSetup, ...updates }
        })),
        
        setResults: (results) => set({ results }),
        
        setSpeedUnit: (speedUnit) => {
          set({ speedUnit });
          localStorage.setItem('cranksmith_speed_unit', speedUnit);
        },
        
        setCompatibilityResults: (compatibilityResults) => set({ compatibilityResults }),
        
        resetCalculator: () => set({
          bikeType: '',
          currentSetup: initialSetup,
          proposedSetup: initialSetup,
          results: null,
          compatibilityResults: null
        }),

        // Computed values
        get validation() {
          const state = get();
          const currentValidation = validateSetupComplete(state.currentSetup);
          const proposedValidation = validateSetupComplete(state.proposedSetup);
          
          const totalCompletion = (currentValidation.completion + proposedValidation.completion) / 2;
          
          return {
            current: currentValidation,
            proposed: proposedValidation,
            canAnalyze: currentValidation.isComplete && proposedValidation.isComplete,
            totalCompletion: isNaN(totalCompletion) ? 0 : totalCompletion
          };
        },

        // Async actions with race condition prevention
        calculateResults: async () => {
          const state = get();
          const validation = state.validation;
          
          if (!validation.canAnalyze) {
            toast.warning('Please complete both setups before analyzing');
            return null;
          }

          // Prevent concurrent calculations
          if (state.loading) {
            return null;
          }

          set({ loading: true });
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const realResults = calculateRealPerformance(
              state.currentSetup, 
              state.proposedSetup, 
              state.speedUnit
            );
            
            set({ results: realResults });
            toast.success('Analysis complete! Check your results below.');
            return realResults;
          } catch (error) {
            console.error('Error calculating results:', error);
            toast.error('Error calculating results. Please check your component selections and try again.');
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        // Saved configurations
        loadSavedConfigs: () => {
          try {
            const saved = localStorage.getItem('cranksmith_configs');
            if (saved) {
              set({ savedConfigs: JSON.parse(saved) });
            }
          } catch (error) {
            console.error('Error loading saved configs:', error);
          }
        },

        saveConfiguration: (config) => {
          const state = get();
          const newConfig = {
            ...config,
            id: Date.now().toString(),
            created_at: new Date().toISOString()
          };
          
          const updatedConfigs = [...state.savedConfigs, newConfig];
          set({ savedConfigs: updatedConfigs });
          
          try {
            localStorage.setItem('cranksmith_configs', JSON.stringify(updatedConfigs));
            return { success: true };
          } catch (error) {
            console.error('Error saving config:', error);
            return { success: false, error: error.message };
          }
        },

        deleteConfiguration: (id) => {
          const state = get();
          const updatedConfigs = state.savedConfigs.filter(config => config.id !== id);
          set({ savedConfigs: updatedConfigs });
          
          try {
            localStorage.setItem('cranksmith_configs', JSON.stringify(updatedConfigs));
            return { success: true };
          } catch (error) {
            console.error('Error deleting config:', error);
            return { success: false, error: error.message };
          }
        },

        loadConfiguration: (config) => {
          set({
            bikeType: config.bikeType,
            currentSetup: config.currentSetup,
            proposedSetup: config.proposedSetup,
            results: config.results,
            compatibilityResults: config.compatibilityResults
          });
        }
      }),
      {
        name: 'cranksmith-calculator',
        partialize: (state) => ({
          speedUnit: state.speedUnit,
          savedConfigs: state.savedConfigs
        })
      }
    )
  )
);

export default useCalculatorStore;
