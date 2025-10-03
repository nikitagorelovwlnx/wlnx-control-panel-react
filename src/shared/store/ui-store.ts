import { create } from 'zustand';

interface UIState {
  // Panel states
  isSessionsPanelOpen: boolean;
  isDetailsPanelOpen: boolean;
  selectedUserEmail: string | null;
  selectedSessionId: string | null;

  // Actions
  openSessionsPanel: (email: string) => void;
  closeSessionsPanel: () => void;
  openDetailsPanel: (sessionId: string) => void;
  closeDetailsPanel: () => void;
  closeAllPanels: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSessionsPanelOpen: false,
  isDetailsPanelOpen: false,
  selectedUserEmail: null,
  selectedSessionId: null,

  openSessionsPanel: (email) =>
    set({
      isSessionsPanelOpen: true,
      selectedUserEmail: email,
      isDetailsPanelOpen: false,
      selectedSessionId: null,
    }),

  closeSessionsPanel: () =>
    set({
      isSessionsPanelOpen: false,
      selectedUserEmail: null,
    }),

  openDetailsPanel: (sessionId) =>
    set({
      isDetailsPanelOpen: true,
      selectedSessionId: sessionId,
    }),

  closeDetailsPanel: () =>
    set({
      isDetailsPanelOpen: false,
      selectedSessionId: null,
    }),

  closeAllPanels: () =>
    set({
      isSessionsPanelOpen: false,
      isDetailsPanelOpen: false,
      selectedUserEmail: null,
      selectedSessionId: null,
    }),
}));
