import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'

import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Home from './components/Home'
import KakaoCallback from './components/KakaoCallback'
import GoogleCallback from './components/GoogleCallback'
import ConsentPage from './components/ConsentPage'
import ReceiptUpload from './components/ReceiptUpload'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      {/* 전체 화면용 박스 */}
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* ─── 상단 콘텐츠 영역: Container 제거, 폭 100% 유지 ─── */}
        <Box flex="1" sx={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />

            {/* 콜백, 동의 페이지 */}
            <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
            <Route path="/oauth/google/callback" element={<GoogleCallback />} />
            <Route
              path="/consent"
              element={
                <ProtectedRoute>
                  <ConsentPage />
                </ProtectedRoute>
              }
            />

            {/* 보호된 홈 & 영수증 업로드 */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/receipt"
              element={
                <ProtectedRoute>
                  <ReceiptUpload />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>

        {/* 하단 탭바 */}
        <Paper elevation={3}>
          <BottomNav />
        </Paper>
      </Box>
    </BrowserRouter>
  )
}

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [value, setValue] = useState(location.pathname)

  useEffect(() => {
    setValue(location.pathname)
  }, [location.pathname])

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue)
        navigate(newValue)
      }}
      showLabels
    >
      <BottomNavigationAction label="홈" value="/home" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="영수증"
        value="/home/receipt"
        icon={<ReceiptIcon />}
      />
      <BottomNavigationAction
        label="내 정보"
        value="/consent"
        icon={<PersonIcon />}
      />
    </BottomNavigation>
  )
}

export default App
