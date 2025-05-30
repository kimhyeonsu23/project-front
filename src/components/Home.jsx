import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Stack } from '@mui/material'

export default function Home() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const storedEmail = localStorage.getItem('email')
    if (!token || !storedEmail) {
      navigate('/')
    } else {
      setEmail(storedEmail)
      setUserName(localStorage.getItem('userName') || '')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <Box
      component="main"
      sx={{
        bgcolor: '#FFFDF7',
        pt: 6,
        pb: 10,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 360, md: 600, lg: 800 },
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          환영합니다!<br />
          {userName || email}님!
        </Typography>

        <Stack spacing={2} mt={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('receipt')}
            sx={{
              bgcolor: '#FFF1F0',
              color: 'primary.main',
              '&:hover': { bgcolor: '#ffeaea' },
            }}
          >
            영수증 등록
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            sx={{
              bgcolor: '#FFDAD6',
              color: 'primary.main',
              '&:hover': { bgcolor: '#ffcdc0' },
            }}
          >
            로그아웃
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
