import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTasksStore = create(
  persist((set) => ({
    ocrRegion: 66,
    temporary_videos: [],
    tasks: [],
    setOcrRegion: (ocrRegion) => set((state) => ({ ocrRegion })),
    addTemporaryVideo: (video) => set((state) => {
      if (state.temporary_videos.length >= 20) {
        alert('每个队列最多只能添加20个视频');
        return state.temporary_video;
      }

      return state.temporary_videos.filter(v => v.id === video.id).length === 0 
        ? ({ temporary_videos: [...state.temporary_videos, video]})
        : state.temporary_videos;
    }),
    removeTemporaryVideo: (video) => set((state) => ({ temporary_videos: state.temporary_videos.filter((v) => v.id !== video.id) })),
    resetTemporaryVideos: () => set((state) => ({ temporary_videos: [] })),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
    updateTask: (id, task) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? task : t)) })),
    updateTaskVTT: (task_id, id, type, vtt) => set((state) => {
      state.tasks.map(task => {
        if (task.id === task_id) {
          task.videos.map(video => {
            if (video.id === id) {
              video.data[type] = vtt;
            }
          });
        }
      });
      return {
        tasks: state.tasks
      };
    }),
    setVideoVisible: (id, visible) => set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, video_visible: visible } : t)) })),
    updateProgress: (id, introduceProgresses, subtitleProgresses) => set((state) => {
      introduceProgresses.map(progress => {
        state.tasks.map(task => {
          if (task.id === id) {
            task.videos.map(video => {
              if (video.video.trim() === progress.url.trim()) {
                video.introduce_progress = progress.processProgress;
                if (video.introduce_progress == 100) {
                  video.data.ocr_introduce_url = progress.tgtSrtUrl;
                }
              }
            });
          }
        });
      });

      subtitleProgresses.map(progress => {
        state.tasks.map(task => {
          if (task.id === id) {
            task.videos.map(video => {
              if (video.video.trim() === progress.url.trim()) {
                video.subtitle_progress = progress.processProgress;
                if (video.subtitle_progress == 100) {
                  video.data.ocr_subtitle_url = progress.tgtSrtUrl;
                }
              }
            });
          }
        });
      });

      state.tasks.map(task => {
        if (task.id === id) {
          task.progress = task.videos.reduce((acc, cur) => acc + cur.subtitle_progress + cur.introduce_progress, 0) / task.videos.length / 2;
        }
      });
      console.log('state.tasks', state.tasks);
        
      return {
        tasks: state.tasks
      };
    }),
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

