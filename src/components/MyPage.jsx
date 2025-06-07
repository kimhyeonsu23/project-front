import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Stack,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import HistoryIcon from '@mui/icons-material/History'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EditIcon from '@mui/icons-material/Edit'
import LogoutIcon from '@mui/icons-material/Logout'

export default function MyPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('email') || ''
  const userName = localStorage.getItem('userName') || ''

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <Box
      component="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        minHeight: '100vh',
        pt: 4,
        pb: 10,            
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      
      <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
          {userName.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="h6">{userName || '이름 없음'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {email}
        </Typography>
      </Stack>

      <Divider sx={{ width: '100%', maxWidth: { xs: '100%', sm: 360, md: 600 }, mx: 'auto', mb: 2 }} />

    
      <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 360, md: 600 }, mx: 'auto' }}>
        <List component="nav">
          
          <ListItemButton onClick={() => navigate('/mypage/info')}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="내 정보 보기" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/mypage/history')}>
            <ListItemIcon>
              <HistoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="내 소비 내역" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/mypage/challenges')}>
            <ListItemIcon>
              <EmojiEventsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="챌린지 기록" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate('/mypage/edit')}>
            <ListItemIcon>
              <EditIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="프로필 수정" />
          </ListItemButton>

          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  )
}
