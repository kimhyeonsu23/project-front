import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, Stack, TextField,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function ReceiptUpload() {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [keywordId, setKeywordId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId) setCurrentUserId(Number(savedId));
  }, []);

  const categories = [
    { id: 1, name: '외식' }, { id: 2, name: '교통' }, { id: 3, name: '생활비' },
    { id: 4, name: '쇼핑' }, { id: 5, name: '건강' }, { id: 6, name: '교육' },
    { id: 7, name: '저축/투자' }, { id: 8, name: '수입' }
  ];

  const handleOCR = async () => {
    if (!image) return alert('이미지를 선택하세요!');
    setLoadingOCR(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append('image', image);

      const uploadRes = await axios.post('/receipt/image/upload', uploadForm, { withCredentials: true });
      const relativePath = uploadRes.data;

      const ocrRes = await axios.post(`/receipt/ocr?path=${encodeURIComponent(relativePath)}`, {}, { withCredentials: true });

      setOcrResult({ ...ocrRes.data, imagePath: relativePath });
      setIsEditing(false);
    } catch (err) {
      alert('OCR 요청 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingOCR(false);
    }
  };

  const handleCreateReceipt = async () => {
    if (!ocrResult || !keywordId) return alert('OCR 분석 후 카테고리를 선택하세요!');
    if (!currentUserId) return alert('로그인이 필요합니다.');

    try {
      await axios.post('/receipt/ocr/save/v2', {
        path: ocrResult.imagePath,
        userId: currentUserId,
        keywordId,
        shopName: ocrResult.shopName,
        date: ocrResult.date,
        totalPrice: ocrResult.totalPrice,
        items: ocrResult.items ?? []
      }, { withCredentials: true });

      alert('영수증 등록 완료!');
      setImage(null);
      setOcrResult(null);
      setKeywordId('');
    } catch (err) {
      alert('영수증 저장 실패: ' + err.message);
    }
  };

  const handleInputChange = (field, value) => {
    if (!ocrResult) return;
    const updated = { ...ocrResult };
    updated[field] = field === 'totalPrice' ? parseInt(value.replace(/\D/g, ''), 10) || 0 : value;
    setOcrResult(updated);
  };

  return (
    <Box component="main" display="flex" flexDirection="column" alignItems="center" sx={{ pt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>영수증 등록</Typography>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 600 }}>

        <Button variant="outlined" component="label" fullWidth startIcon={<CameraAltIcon />}>
          영수증 촬영
          <input type="file" accept="image/*" capture="environment" hidden onChange={e => setImage(e.target.files?.[0] || null)} />
        </Button>

        <Button variant="outlined" component="label" fullWidth>
          이미지 선택
          <input type="file" accept="image/*" hidden onChange={e => setImage(e.target.files?.[0] || null)} />
        </Button>

        {image && <Typography color="primary">선택된 이미지: {image.name}</Typography>}

        <Button variant="contained" onClick={handleOCR} disabled={loadingOCR} fullWidth startIcon={loadingOCR ? <CircularProgress size={20} /> : null}>
          {loadingOCR ? '분석 중...' : 'OCR 분석'}
        </Button>

        {ocrResult && (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            {isEditing ? (
              <Stack spacing={2}>
                <TextField label="상호명" fullWidth value={ocrResult.shopName} onChange={e => handleInputChange('shopName', e.target.value)} InputProps={{ startAdornment: <StorefrontIcon sx={{ mr: 1 }} /> }} />
                <TextField
                  label="날짜"
                  type="date"
                  fullWidth
                  value={ocrResult.date ? new Date(ocrResult.date).toISOString().split('T')[0] : ''}
                  onChange={e => handleInputChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1 }} /> }}
                />
                <TextField label="금액" fullWidth value={ocrResult.totalPrice.toLocaleString()} onChange={e => handleInputChange('totalPrice', e.target.value)} InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} /> }} />
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography><StorefrontIcon sx={{ mr: 1 }} /><strong>상호명:</strong> {ocrResult.shopName}</Typography>
                <Typography><CalendarTodayIcon sx={{ mr: 1 }} /><strong>날짜:</strong> {ocrResult.date}</Typography>
                <Typography><AttachMoneyIcon sx={{ mr: 1 }} /><strong>금액:</strong> {ocrResult.totalPrice.toLocaleString()}원</Typography>
              </Stack>
            )}

            {ocrResult.imagePath && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={`/receipt/image/${ocrResult.imagePath}`} alt="업로드된 영수증" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">인식된 항목</Typography>
              {ocrResult.items?.length > 0 ? (
                <Stack spacing={1}>
                  {ocrResult.items.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {isEditing ? (
                        <>
                          <TextField
                            label="이름"
                            size="small"
                            value={item.itemName}
                            onChange={e => {
                              const updated = [...ocrResult.items];
                              updated[idx].itemName = e.target.value;
                              setOcrResult({ ...ocrResult, items: updated });
                            }}
                          />
                          <TextField
                            label="수량"
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={e => {
                              const updated = [...ocrResult.items];
                              updated[idx].quantity = parseInt(e.target.value) || 0;
                              updated[idx].totalPrice = updated[idx].quantity * updated[idx].unitPrice;
                              setOcrResult({ ...ocrResult, items: updated });
                            }}
                          />
                          <TextField
                            label="단가"
                            size="small"
                            type="number"
                            value={item.unitPrice}
                            onChange={e => {
                              const updated = [...ocrResult.items];
                              updated[idx].unitPrice = parseInt(e.target.value) || 0;
                              updated[idx].totalPrice = updated[idx].quantity * updated[idx].unitPrice;
                              setOcrResult({ ...ocrResult, items: updated });
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 80 }}>
                            = {(item.unitPrice * item.quantity).toLocaleString()}원
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">
                          {item.itemName} - {item.quantity}개 × {item.unitPrice.toLocaleString()}원 = {item.totalPrice.toLocaleString()}원
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">인식된 항목이 없습니다.</Typography>
              )}
            </Box>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>카테고리</InputLabel>
              <Select value={keywordId} label="카테고리" onChange={e => setKeywordId(e.target.value)}>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" fullWidth onClick={handleCreateReceipt}>영수증 저장</Button>
              <Button variant="outlined" fullWidth onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? '수정 완료' : '영수증 수정'}
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
