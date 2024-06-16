import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Typography } from '@mui/material'

import CreateBasic from '../components/CreateBasic'
import EditVideo from '../components/EditVideo'
import FileList from '../components/FileList'
import Footer from '../components/Footer'
import TranslationResult from '../components/TranslationResult'

import { useActions } from '../store/uiActions'
import { useBasicSettings, useItem, useTask } from '../store/settings'

import '../assets/css/main.css'
import aipng from '../assets/img/ai.png'

export default function App() {
  const { showTaskPopup, showVideoPopup, showResult } = useActions((store) => store)

  const reSetAll = () => {
    useActions.setState({ showTaskPopup: false, showVideoPopup: false, showResult: false })
    useBasicSettings.setState({ fromLanguage: 'zh-CN', toLanguage: 'en-US', style: '' })
    useItem.setState({ currentItem: null })
    useTask.setState({
      videos: [
        { name: 'demo1.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', size: '5m' },
        { name: 'demo2.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', size: '4m' },
        { name: 'demo3.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', size: '5.2m' },
      ], index: 0, result: []
    })
  }

  const handleTaskOpen = () => {
    useActions.setState({ showTaskPopup: true })
  }

  const handleTaskClose = () => {
    useActions.setState({ showTaskPopup: false })
  }

  const handleVideoClose = () => {
    useActions.setState({ showVideoPopup: false })
  }

  return (
    <Box>
      <Box sx={{ borderBottom: '1px solid #e8e8e8', display: 'flex', flexDirection: 'row', padding: '20px', justifyContent: 'space-between', width: '90%', margin: '0 auto' }}>
        <Box style={{ fontSize: '24px', fontWeight: '600', color: '#000' }}>VideoGpt</Box>
        <Box>
          <Button variant="contained" style={{ cursor: 'pointer', marginRight: '20px' }} onClick={() => {
            window.open('https://hypergpt.aliensoft.com.cn')
          }}>HyperGpt</Button>
          <Button variant="contained" style={{ cursor: 'pointer' }} onClick={() => {
            reSetAll()
          }
          }>重置所有</Button>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center', margin: '0 auto', marginTop: '20px', width: '80%' }}>
        <Box sx={{ width: '100%', textAlign: 'left' }}>
          <Box style={{ fontSize: '24px', fontWeight: '600', color: '#000' }}>AI短视频智能二创</Box>
          <Box style={{ fontSize: '14px', fontWeight: '400', color: '#666', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box style={{ fontSize: '14px', fontWeight: '400', color: '#666', margin: '20px 0', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Typography>字幕翻译生成,字幕时间轴自动校验，OCR字幕提纯翻译，纯机器值守</Typography>
              <img src={aipng} style={{ width: '16px', height: '16px', marginLeft: '10px' }} />
            </Box>
            <Button variant="contained" style={{ cursor: 'pointer' }} onClick={handleTaskOpen}>新建转译任务</Button>
          </Box>
        </Box>
        <CreateBasic />
        <Dialog onClose={handleTaskClose} open={showTaskPopup}>
          <DialogTitle>新建转译任务</DialogTitle>
          <FileList />
        </Dialog>
        {showResult && (<TranslationResult />)}
        <Dialog maxWidth='xl' onClose={handleVideoClose} open={showVideoPopup}>
          <DialogTitle>编辑字幕</DialogTitle>
          <DialogContent>
            <EditVideo />
          </DialogContent>
        </Dialog>
      </Box>
      <Footer />
    </Box>
  )
}