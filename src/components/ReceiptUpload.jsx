import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';

import StorefrontIcon from '@mui/icons-material/Storefront';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function ReceiptUpload() {
  // 모든 useState에서 타입 파라미터 제거
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [keywordId, setKeywordId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // 로그인한 유저 ID 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('userId');
    if (savedId) setCurrentUserId(Number(savedId));
  }, []);

  // 카테고리 목록
  const categories = [
    { id: 1, name: '외식' },
    { id: 2, name: '교통' },
    { id: 3, name: '생활비' },
    { id: 4, name: '쇼핑' },
    { id: 5, name: '건강' },
    { id: 6, name: '교육' },
    { id: 7, name: '저축/투자' },
    { id: 8, name: '수입' },
  ];

  // OCR 실행 핸들러
  const handleOCR = async () => {
    console.log('선택된 image:', image);
    if (!image) {
      alert('이미지를 선택하세요!');
      return;
    }
    setLoadingOCR(true);

    try {
      //  이미지 업로드
      const uploadForm = new FormData();
      uploadForm.append('image', image);
      for (let [key, value] of uploadForm.entries()) {
       console.log('FormData 파트:', key, value);
     }
      const uploadRes = await axios.post(
        '/receipt/image/upload',
        uploadForm,
        {
          withCredentials: true,
        }
      );
      const relativePath = uploadRes.data; 

      //  OCR 호출 (path 파라미터에 상대경로 전달)
      const ocrRes = await axios.post(
        `/receipt/ocr?path=${encodeURIComponent(relativePath)}`,
        {},
        { withCredentials: true }
      );

      setOcrResult(ocrRes.data);
      setIsEditing(false);
    } catch (err) {
      // catch에서 타입 제거
      alert('OCR 요청 실패: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingOCR(false);
    }
  };

  // 영수증 저장 핸들러
  const handleCreateReceipt = async () => {
    if (!ocrResult || !keywordId) {
      alert('OCR 분석 후 카테고리를 선택하세요!');
      return;
    }
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await axios.post(
        '/receipt/createReceipt',
        {
          shop: ocrResult.shopName,
          userId: currentUserId,
          date: ocrResult.date,
          keywordId,
          totalPrice: ocrResult.totalPrice,
          imagePath: ocrResult.imagePath,
        },
        { withCredentials: true }
      );
      alert('영수증 등록 완료!');
    } catch (err) {
      alert('영수증 저장 실패: ' + err.message);
    }
  };

  // OCR 결과 필드 수정 핸들러 (타입 주석 제거)
  const handleInputChange = (field, value) => {
    if (!ocrResult) return;
    if (field === 'totalPrice') {
      const numeric = parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
      setOcrResult({ ...ocrResult, [field]: numeric });
    } else {
      setOcrResult({ ...ocrResult, [field]: value });
    }
  };

  return (
    <Box component="main" display="flex" flexDirection="column" alignItems="center" sx={{ pt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>영수증 등록</Typography>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
        {/* 사진 촬영 및 파일 선택 */}
        <Button variant="outlined" component="label" fullWidth startIcon={<CameraAltIcon />}>
          영수증 촬영
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={e => setImage(e.target.files?.[0] || null)}
          />
        </Button>
        <Button variant="outlined" component="label" fullWidth>
          이미지 선택
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => setImage(e.target.files?.[0] || null)}
          />
        </Button>

        {/* OCR 실행 버튼 */}
        <Button
          variant="contained"
          onClick={handleOCR}
          disabled={loadingOCR}
          fullWidth
          startIcon={loadingOCR ? <CircularProgress size={20} /> : null}
        >
          {loadingOCR ? '분석 중...' : 'OCR 분석'}
        </Button>

        {/* OCR 결과 표시 */}
        {ocrResult && (
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            {isEditing ? (
              <Stack spacing={2}>
                <TextField
                  label="상호명"
                  fullWidth
                  value={ocrResult.shopName}
                  onChange={e => handleInputChange('shopName', e.target.value)}
                  InputProps={{ startAdornment: <StorefrontIcon sx={{ mr: 1 }} /> }}
                />
                <TextField
                  label="날짜"
                  type="date"
                  fullWidth
                  value={ocrResult.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1 }} /> }}
                />
                <TextField
                  label="금액"
                  fullWidth
                  value={ocrResult.totalPrice.toLocaleString()}
                  onChange={e => handleInputChange('totalPrice', e.target.value)}
                  InputProps={{ startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} /> }}
                />
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography>
                  <StorefrontIcon sx={{ mr: 1 }} />
                  <strong>상호명:</strong> {ocrResult.shopName}
                </Typography>
                <Typography>
                  <CalendarTodayIcon sx={{ mr: 1 }} />
                  <strong>날짜:</strong> {ocrResult.date}
                </Typography>
                <Typography>
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  <strong>금액:</strong> {ocrResult.totalPrice.toLocaleString()}원
                </Typography>
              </Stack>
            )}

            {/* 이미지 미리보기 */}
            {ocrResult.imagePath && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={`/receipt/image/${ocrResult.imagePath}`}
                  alt="업로드된 영수증"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              </Box>
            )}

            {/* 카테고리 선택 */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={keywordId}
                label="카테고리"
                onChange={e => setKeywordId(e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 저장/수정 버튼 */}
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
  );
}
