import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Divider, Stack, Link as MuiLink } from '@mui/material';
import icon from '../assets/icon.png';
import { KAKAO_AUTH_URL, GOOGLE_AUTH_URL } from '../config';

export default function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // 서버에 보낼 형식이 json이라고 알려주는 http 헤더
        body: JSON.stringify({ email, password }), // json 문자열로 변환해서 전송
      });

      if (!res.ok) throw new Error();

      const { userId, token } = await res.json();

      localStorage.setItem('accessToken', token);
      localStorage.setItem('email',       email);
      localStorage.setItem('userId',      userId);

      console.log("로그인 토큰 : " + token);
      console.log("로그인한 유저 아이디 : " + userId);

      navigate('/home');
    } catch {
      setError('로그인에 실패했습니다.');
    }
  };

  return (
    <Box
      component="main"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={2}
    >
      <Typography variant="h3" gutterBottom color="primary">
        가계로그
      </Typography>

      <Box component="img" src={icon} alt="아이콘" width={120} mb={4} />

      {error && (
        <Typography variant="body2" color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 360, md: 600, lg: 800 },
          mx: 'auto',
        }}
      >
        <Stack spacing={2}>
          {/* 이메일 입력 */}
          <TextField
            label="이메일"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* 비밀번호 입력 */}
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 로그인 버튼 */}
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            로그인
          </Button>

          <Divider>또는</Divider>

          {/* 카카오 로그인 */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => (window.location.href = KAKAO_AUTH_URL)}
            sx={{ bgcolor: '#FEE500', color: '#3C1E1E', '&:hover': { bgcolor: '#fada00' } }}
          >
            카카오로 로그인
          </Button>

          {/* 구글 로그인 */}
          <Button variant="outlined" fullWidth onClick={() => (window.location.href = GOOGLE_AUTH_URL)}>
            구글로 로그인
          </Button>

          {/* 아이디/비밀번호 찾기 링크 */}
          <Box display="flex" justifyContent="space-between" mt={1}>
            <MuiLink component={Link} to="/find-id" underline="hover" variant="body2">
              아이디 찾기
            </MuiLink>
            <MuiLink component={Link} to="/find-password" underline="hover" variant="body2">
              비밀번호 찾기
            </MuiLink>
          </Box>

          {/* 회원가입 링크 */}
          <Typography variant="body2" align="center">
            계정이 없으신가요?{' '}
            <MuiLink
                component={Link}
                to="/signup"
                underline='hover'
                sx={{ color: 'secondary.main' }}
            >
              회원가입
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
