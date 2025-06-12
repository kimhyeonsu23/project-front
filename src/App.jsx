import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Box, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PersonIcon from '@mui/icons-material/Person'
import BookIcon from '@mui/icons-material/Book'

import ManualEntry from './components/ManualEntry'
import Ledger from './components/Ledger'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import Home from './components/Home'
import KakaoCallback from './components/KakaoCallback'
import GoogleCallback from './components/GoogleCallback'
import MyPage from './components/MyPage'
import FindId from './components/FindId'
import FindPassword from './components/FindPassword'
import ReceiptUpload from './components/ReceiptUpload'
import ProtectedRoute from './components/ProtectedRoute'
import VerifyResetCode from './components/VerifyResetCode'
import ResetPasswordByCode from './components/ResetPasswordByCode'
import ConsentPage from './components/ConsentPage'
import DailyLedger from './components/DailyLedger'
import MyInfo from './components/MyInfo'

function App() {
  return (
    <BrowserRouter>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box flex="1" sx={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/find-id" element={<FindId />} />
            <Route path="/find-password" element={<FindPassword />} />
            <Route path="/verify-reset-code" element={<VerifyResetCode />} />
            <Route path="/reset-password-by-code" element={<ResetPasswordByCode />} />

            <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
            <Route path="/oauth/google/callback" element={<GoogleCallback />} />

            <Route path="/consent" element={<ConsentPage />} />

            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage/info"
              element={
                <ProtectedRoute>
                  <MyInfo/>
                </ProtectedRoute>
              }
              />
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
            <Route
              path="/ledger"
              element={
                <ProtectedRoute>
                  <Ledger />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ledger/:date"
              element={
                 <ProtectedRoute>
                    <DailyLedger />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ledger/manual"
              element={
                 <ProtectedRoute>
                    <ManualEntry />
                </ProtectedRoute>
              }
            />

            
          </Routes>
        </Box>

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
      <BottomNavigationAction label="영수증" value="/home/receipt" icon={<ReceiptIcon />} />
      <BottomNavigationAction label="가계부" value="/ledger" icon={<BookIcon />} />
      <BottomNavigationAction label="내 정보" value="/mypage" icon={<PersonIcon />} />
    </BottomNavigation>
  )
}

export default App
