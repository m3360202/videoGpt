import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTasksStore = create(
  persist((set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
    updateTask: (id, task) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? task : t)) })),
    updateTaskVTT: (id, type, vtt) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, data: { ...t.data, [type]: vtt } } : t)) })),
  }),
  { name: 'tasks' }
));

export const useBasicSettings = create(
  persist((set) => ({
    fromLanguage: 'zh-CN',
    toLanguage: 'en-US',
    style: '你是一个专业的影视字幕翻译员，正在从事字幕翻译和校验工作，你的翻译风格是情感剧类',
    updateSetting: (key, value) => set((state) => ({ [key]: value })),
  }),
  { name: 'basicSettings' })
);

