import { create } from 'zustand';

export const useActions = create((set) => ({
  //tasks
  showTaskPopup: false,
  //translation video
  showVideoPopup: false,
}));