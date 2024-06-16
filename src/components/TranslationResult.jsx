import React from 'react'

import Box from '@mui/material/Box'

import { Typography } from '@mui/material'

import { useItem, useTask } from '../store/settings'
import { useActions } from '../store/uiActions'

import EditIcon from '../assets/img/edit.png'

export default function TranslationResult({ status = '' }) {
  const { videos } = useTask((store) => store)

  const openVideo = (item) => {
    useItem.setState({ currentItem: item })
    useActions.setState({ showVideoPopup: true })
  }

  return (
    <Box sx={{ width: '100%', height: '450px', margin: '40px', overflowY:'scroll', textAlign:'center' }}>
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
        }}  onClick={()=>{
          openVideo(item)
        }} >
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
          <img src={EditIcon} width='19' height='19' style={{marginRight:'20px'}} />
        </Box>
      ))}
    </Box>
  )
}