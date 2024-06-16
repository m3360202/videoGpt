import React, { useState } from 'react'

import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { useActions } from '../store/uiActions'
import { useItem } from '../store/settings'

import SrtList from './SrtList';

export default function EditVideo() {

  const { currentItem } = useItem((store) => store)
   //测试字幕数组
  const srtList = [
    { text: 'aaaaaaaaaaaaaaaaaaa', from: '00:00:00,000', to: '00:00:05,000' },
    { text: 'b', from: '00:00:05,000', to: '00:00:10,000' },
  ]
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const handleClose = () => {
    useActions.setState({ showVideoPopup: false })
  }

  const saveVideo = () => {
    //执行保存
    handleClose()
  }

  return (
    <Box>
      <Box sx={{
        width: '90%',
        borderRadius: '10px',
        margin: '0 auto',
        marginTop: '40px',
        background: 'linear-gradient(139deg,#cbfff1 0%,#d7beff 100%)',
        height: 'auto',
        padding: '30px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '40px', width: '50%', borderRadius: '10px' }}>
          <TabContext value={value || ''}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="对白字幕" value="1" />
                <Tab label="场景字幕" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <SrtList srtList={srtList} />
            </TabPanel>
            <TabPanel value="2">
              <SrtList srtList={srtList} />
            </TabPanel>
          </TabContext>
        </Box>

        <Box style={{ textAlign: 'left', marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'left', background: 'rgba(255,255,255)', padding: '40px', width: '35%', borderRadius: '10px' }}>
          <Typography sx={{ marginBottom: '10px' }}>效果预览</Typography>
          <Box style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
          >
            <video
              style={{ width: '100%', height: 'auto', display: 'block' }}
              controls
              poster="preview.jpg"
            >
              <source src="a.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </Box>

      </Box>
      <Box style={{ display: 'flex', alignItems: 'center', width: '20%', margin: '0 auto' }}>
        <LoadingButton loading={loading} variant="contained" style={{ cursor: 'pointer', margin: '0 auto', marginTop: '30px' }} onClick={saveVideo} >保存视频</LoadingButton>
        <Button variant="contained" style={{ cursor: 'pointer', margin: '0 auto', marginTop: '30px' }} onClick={handleClose} >关闭窗口</Button>
      </Box>

    </Box>

  )
}