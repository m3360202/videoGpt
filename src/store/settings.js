import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFontSettings = create((set) => ({
  mainTitle: {
    fontSize: '24px',
    fontWeight: 'blod',
    fontFamily: ''
  },
  subTitle: {
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: ''
  },
  title: {
    fontSize: '18px',
    fontWeight: 'blod',
    fontFamily: ''
  },
  summary: {
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: ''
  },
  summaryTranslate: {
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: ''
  },
  content: {
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: ''
  }
}))

export const useBasicSettings = create(
  persist((set) => ({
    fromLanguage: 'zh-CN',
    toLanguage: 'en-US',
    style: '你是一个专业的影视字幕翻译员，正在从事字幕翻译和校验工作，你的翻译风格是情感剧类',
  }),
    { name: 'basicSettings' })
)

export const useTask = create(
  persist((set) => ({
    videos: [
      {name:'demo1.mp4',url:'https://www.w3schools.com/html/mov_bbb.mp4',size:'5m'},
      {name:'demo2.mp4',url:'https://www.w3schools.com/html/mov_bbb.mp4',size:'4m'},
      {name:'demo3.mp4',url:'https://www.w3schools.com/html/mov_bbb.mp4',size:'5.2m'},
    ],
    index: 0,
    result:[],
  }),
    { name: 'task' })
)

export const useItem = create(
  persist((set) => ({
    currentItem: null,
  }),
    { name: 'item' })
)
