import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'

import { useTask } from '../store/settings'

import DeleteIcon from '../assets/img/delete.png'

export default function SrtList({ srtList = [] }) {

  const removeItem = (item) => {

  }

  const editText = (item) => {

  }

  const editFrom = (item) => {

  }

  const editTo = (item) => {

  }

  return (
    <Box>
      {srtList.map((item, index) => (
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
            <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
              <Typography sx={{ color: '#666', marginRight:'10px', width:'55px' }}>字幕:</Typography>
              <TextField value={item.text} />
            </Box>
            <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center', marginTop:'20PX'}}>
              <Typography sx={{ color: '#666', marginRight:'10px', width:'100px' }}>时间轴:</Typography>
              <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <TextField value={item.from} />
                <Typography sx={{ color: '#3fc9c3', marginRight:'10px', marginLeft:'10px' }}> - </Typography>
                <TextField value={item.to} />
              </Box>
            </Box>
          </Box>
          <img src={DeleteIcon} width='19' height='19' style={{marginRight:'20px'}} onClick={()=>{
            removeVideo(item)
          }} />
        </Box>
      ))}
    </Box>
  )
}