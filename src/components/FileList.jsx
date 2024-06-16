import React, { useState } from 'react'

import Box from '@mui/material/Box'
import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'

import { useActions } from '../store/uiActions'
import { useBasicSettings, useTask } from '../store/settings'

import DeleteIcon from '../assets/img/delete.png'

export default function FileList() {
  const { videos } = useTask((store) => store)
  const [loading, setLoading] = useState(false)

  const removeVideo = (item) => {
    console.log('item',item)
    const newVideos = videos.filter(video => video.name !== item.name)
    useTask.setState({ videos: newVideos })
  }

  const startTask = () =>{
    console.log('start task')
    setLoading(true)
    //接口逻辑
    //接口完成
    // setLoading(false)
    useActions.setState({ showResult: true }) 
  }

  return (
    <Box sx={{ width: '500px', height: '450px', margin: '40px', overflowY:'scroll', textAlign:'center' }}>
      {videos.map((item, index) => (
        <Box key={index} style={{
          position: 'relative',
          display: 'flex',
          marginTop: '20px',
          alignItems: 'center',
          background: 'rgba(63,201,195,.08)',
          padding: '10px 30px',
          width: '80%',
          borderRadius: '10px',
          border: '1px dashed #3fc9c3',
          cursor: 'pointer',
          justifyContent: 'space-between',
          textAlign:'left'
        }}>
          <Box style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '10px',
            alignItems: 'left',
            padding: '10px',
            width: '70%',
            justifyContent: 'space-between'
          }}>
            <Typography sx={{ color: '#3fc9c3', marginBottom: '10px' }}>{item.name}</Typography>
            <Typography sx={{ color: '#3fc9c3' }}>视频大小:{item.size}</Typography>
          </Box>
          <img src={DeleteIcon} width='19' height='19' style={{marginRight:'20px'}} onClick={()=>{
            removeVideo(item)
          }} />
        </Box>
      ))}
      <LoadingButton loading={loading} variant="contained" style={{ cursor: 'pointer', margin:'0 auto',marginTop:'30px' }} onClick={startTask} >开始工作流</LoadingButton>
    </Box>
  )
}