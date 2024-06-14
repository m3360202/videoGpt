import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { MenuItem, Select, Typography } from '@mui/material'

import { useActions } from '../store/uiActions'
import { useBasicSettings } from '../store/settings'

export default function CreateBasic() {
  const { fromLanguage, toLanguage, style } = useBasicSettings((store) => store)

  const [files, setFiles] = useState(null)

  return (
    <Box>
      <Box sx={{
        width: '100%',
        borderRadius: '10px',
        marginTop: '40px',
        background: 'linear-gradient(139deg,#cbfff1 0%,#d7beff 100%)',
        height: '290px',
        padding: '30px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', padding: '40px', width: '50%', borderRadius: '10px' }}>
          <Typography sx={{ color: '#939393', marginBottom: '10px' }}>原始视频上传</Typography>
          <Typography sx={{ color: '#939393' }}>视频大小小于 5m,时长2-5分钟最佳</Typography>
          <Box style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            alignItems: 'center',
            background: 'rgba(63,201,195,.08)',
            padding: '20px',
            width: '70%',
            borderRadius: '10px',
            border: '1px dashed #3fc9c3',
            cursor: 'pointer'
          }}>
            <Typography sx={{ color: '#3fc9c3', marginBottom: '10px' }}>点击选择视频文件</Typography>
            <Typography sx={{ color: '#3fc9c3' }}>支持mp4 mov格式</Typography>
            <input
              type="file"
              name="file"
              accept=".mp4,.mov"
              multiple
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                opacity: '0',
                cursor: 'pointer',
                zIndex: '10',
              }}
            />
          </Box>
        </Box>

        <Box style={{textAlign:'left', marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'left', background: 'rgba(255,255,255,0.6)', padding: '40px', width: '35%', borderRadius: '10px' }}>
          <Typography sx={{ marginBottom: '10px' }}>转译风格</Typography>
          <TextField onChange={(e)=>{ useBasicSettings.setState({ style: e.target.value }) }} value={style} sx={{background:'#fff', color:'#999'}} />
          <Box style={{
            marginTop:'10px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
          >
            <Typography sx={{ marginBottom: '10px', marginRight: '15px' }}>原片语言</Typography>
            <Select sx={{background:'#fff', color:'#999'}} value={fromLanguage} onChange={(e) => { useBasicSettings.setState({ fromLanguage: e.target.value }) }}>
              <MenuItem value='zh-CN'>中文 zh-CN</MenuItem>
              <MenuItem value='en-US'>美式英语 en-US</MenuItem>
              <MenuItem value='en-GB'>英式英语 en-GB</MenuItem>
              <MenuItem value='fr-FR'>法语 fr-FR</MenuItem>
              <MenuItem value='es-ES'>西班牙语 es-ES</MenuItem>
              <MenuItem value='de-DE'>德语 de-DE</MenuItem>
              <MenuItem value='it-IT'>意大利语 it-IT</MenuItem>
              <MenuItem value='ja-JP'>日语 ja-JP</MenuItem>
              <MenuItem value='ko-KR'>韩语 ko-KR</MenuItem>
              <MenuItem value='ru-RU'>俄语 ru-RU</MenuItem>
            </Select>
          </Box>

          <Box style={{
            marginTop:'10px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
          >
            <Typography sx={{ marginBottom: '10px', marginRight: '15px' }}>目标语言</Typography>
            <Select sx={{background:'#fff', color:'#999'}} value={toLanguage} onChange={(e) => { useBasicSettings.setState({ toLanguage: e.target.value }) }}>
              <MenuItem value='en-US'>美式英语 en-US</MenuItem>
              <MenuItem value='en-GB'>英式英语 en-GB</MenuItem>
              <MenuItem value='fr-FR'>法语 fr-FR</MenuItem>
              <MenuItem value='es-ES'>西班牙语 es-ES</MenuItem>
              <MenuItem value='de-DE'>德语 de-DE</MenuItem>
              <MenuItem value='it-IT'>意大利语 it-IT</MenuItem>
              <MenuItem value='ja-JP'>日语 ja-JP</MenuItem>
              <MenuItem value='ko-KR'>韩语 ko-KR</MenuItem>
              <MenuItem value='ru-RU'>俄语 ru-RU</MenuItem>
              <MenuItem value='zh-CN'>中文 zh-CN</MenuItem>
            </Select>
          </Box>
        </Box>

      </Box>

    </Box>

  )
}