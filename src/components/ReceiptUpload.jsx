import React, { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'

import StorefrontIcon from '@mui/icons-material/Storefront'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

export default function ReceiptUpload() {
  const [image, setImage] = useState(null)
  const [ocrResult, setOcrResult] = useState(null)
  const [keywordId, setKeywordId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loadingOCR, setLoadingOCR] = useState(false)

  const categories = [
    { id: 1, name: '외식' },
    { id: 2, name: '교통' },
    { id: 3, name: '생활비' },
    { id: 4, name: '쇼핑' },
    { id: 5, name: '건강' },
    { id: 6, name: '교육' },
    { id: 7, name: '저축/투자' },
  ]

  const handleOCR = async () => {
    if (!image) {
      alert('이미지를 선택하세요!')
      return
    }
    setLoadingOCR(true)
    const formData = new FormData()
    formData.append('image', image)

    try {
      const res = await axios.post(
        'http://localhost:8080/receipt/ocr',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      )
      setOcrResult(res.data)
      setIsEditing(false)
    } catch (err) {
      alert('OCR 요청 실패: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoadingOCR(false)
    }
  }

  const handleCreateReceipt = async () => {
    if (!ocrResult || !keywordId) {
      alert('OCR 분석 후 카테고리를 선택하세요!')
      return
    }
    try {
      await axios.post(
        '/receipt/createReceipt',
        {
          shop: ocrResult.shopName,
          userId: 1,
          date: ocrResult.date,
          keywordId,
        },
        { withCredentials: true }
      )
      alert('영수증 등록 완료!')
    } catch (err) {
      alert('영수증 저장 실패: ' + err.message)
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'totalPrice') {
      const numeric = parseInt(value.replace(/[^\d]/g, ''), 10) || 0
      setOcrResult({ ...ocrResult, [field]: numeric })
    } else {
      setOcrResult({ ...ocrResult, [field]: value })
    }
  }

  return (
    <Box
      component="main"
      display="flex"               /* flex 컨테이너 */
      flexDirection="column"       /* 수직 정렬 */
      alignItems="center"          /* 가로 중앙 정렬 */
      justifyContent="flex-start"  /* 상단 배치 */
      sx={{
        minHeight: '100vh',        /* 화면 높이 채우기 */
        pt: 4,                     /* 상단 여백 */
        pb: 10,                    /* 하단 탭바 여유 확보 */
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      {/* 제목을 가운데 정렬 */}
      <Typography variant="h4" color="primary" gutterBottom sx={{ textAlign: 'center' }}>
        영수증 등록
      </Typography>

      {/* 폼 컨테이너: responsive width + 가운데 정렬 */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 360, md: 600, lg: 800 },
          mx: 'auto',
        }}
      >
        <Stack spacing={2}>
          <Button variant="outlined" component="label" fullWidth startIcon={<CameraAltIcon />}>
            영수증 촬영
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Button>

          <Button variant="outlined" component="label" fullWidth>
            이미지 선택
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOCR}
            disabled={loadingOCR}
            fullWidth
            startIcon={loadingOCR ? <CircularProgress size={20} /> : null}
          >
            {loadingOCR ? '분석 중...' : 'OCR 분석'}
          </Button>

          {ocrResult && (
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mt: 2 }}>
              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    label="상호명"
                    fullWidth
                    value={ocrResult.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    InputProps={{ startAdornment: <StorefrontIcon sx={{ mr: 1 }} /> }}
                  />
                  <TextField
                    label="날짜"
                    type="date"
                    fullWidth
                    value={ocrResult.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1 }} /> }}
                  />
                  <TextField
                    label="금액"
                    fullWidth
                    value={ocrResult.totalPrice.toLocaleString()}
                    onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                    InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} /> }}
                  />
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography>
                    <StorefrontIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    <strong>상호명:</strong> {ocrResult.shopName}
                  </Typography>
                  <Typography>
                    <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    <strong>날짜:</strong> {ocrResult.date}
                  </Typography>
                  <Typography>
                    <AttachMoneyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    <strong>금액:</strong> {Number(ocrResult.totalPrice).toLocaleString()}원
                  </Typography>
                </Stack>
              )}

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>카테고리</InputLabel>
                <Select
                  value={keywordId}
                  label="카테고리"
                  onChange={(e) => setKeywordId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" fullWidth onClick={handleCreateReceipt}>
                  영수증 저장
                </Button>
                <Button variant="outlined" fullWidth onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? '수정 완료' : '영수증 수정'}
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
