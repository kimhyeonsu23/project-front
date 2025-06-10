import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Stack, Card, Grid } from '@mui/material'

export default function ConsentPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('pendingEmail')
  const loginType = localStorage.getItem('pendingLoginType')

  const [isLoading, setIsLoading] = useState(true);
  const [badge, setBadge] = useState([]);
  const [badge1, setBadge1] = useState(""); // 절약초보 뱃지 : 받은 날짜를 ""으로 초기화
  const [badge2, setBadge2] = useState(""); // 절약고수 뱃지
  const [badge3, setBadge3] = useState(""); // 절약왕 뱃지

   useEffect(() => {
    fetchGetBadge();
  }, [])

  const handleAgree = async () => {
    try {
      const res = await fetch('/user/confirm-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, loginType }),
      })
      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('email', data.email)
      localStorage.setItem('userName', data.userName)

      // 더 이상 필요 없는 pending 키 삭제
      localStorage.removeItem('pendingEmail')
      localStorage.removeItem('pendingLoginType')

      navigate('/home')
    } catch (err) {
      console.error(err)
      alert('전환에 실패했습니다.')
    }
  }

  const fetchGetBadge = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      console.log("token : ", token);
      const response = await fetch('http://localhost:8080/history/getGrantedDate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        //const data = response => response.json() // 응답을 JSON으로 파싱.
        const data = await response.json();
        {/* fetch()는 기볹거으로 비동기 함수인데 await fetch()를 통해서 응답이 올때까지 기다림.
                    response.json() : 비동기 (promise) 객체를 반환함.
                    상태코드는 실제로 http 응답 헤더에 포함되어 있고 response.json()은 그 본문 body만 가져오는 것
                    response.status : http 상태코드 / response.json() : body(json만) / ResponseEntity : 상태코드 + 바디 + 헤더를 주는 스프링 클래스
                    response.json()도 비동기 함수임. 그래서 await으로 받아야 실제 객체가 나옴. */}
        console.log("데이터 : ", data);
        setBadge(data)
        // 뱃지 수 세기
        data.forEach((bad) => {
          {/* 자바 스크립트에서는 배열을 반복할때 forEach나 map을 사용 */ }
          if (bad.badgeId === 1) {
            setBadge1(bad.grantedDate)
          }
          if (bad.badgeId === 2) {
            setBadge2(bad.grantedDate)
          }
          if (bad.badgeId === 3) {
            setBadge3(bad.grantedDate);
          }
        });

      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  function drawBadges() {
    return (
      <Box display="flex" gap={6}> {/* badge1 존재할때만 jsx를 렌더링 + 간격 2
      justifyContent="center" : 플렉스박스 레이아웃을 활성화함. 기본적으로 수평 방향 정렬이 가능하도록 함
      이 판위에서 justifyContent = "center" 로 아이템들을 수평 가운데로 정렬함. */}
        {badge1 && (
          <Grid container spacing={3}>
            <Card sx={{ p: 2, backgroundColor: '#FFF8F0', boxShadow: 3, fontStyle:'italic'}}>
          <Box>

            <Box
              component="img"
              src="/badge1.png"
              alt="절약초보 뱃지"
              sx={{ width: 130, height: 130 }}

            />
            <Typography>발급일 : {badge1}</Typography>
          </Box>
          </Card>
          </Grid>
        )}
        {badge2 && (
          <Grid container spacing={3}>
          <Card sx={{ p: 2, backgroundColor: '#FFF8F0', boxShadow: 3, fontStyle:'italic'}}>
          <Box>

            <Box
              component="img"
              src="/badge2.png"
              alt="절약고수 뱃지"
              sx={{ width: 130, height: 130 }}
            />
            <Typography>발급일 : {badge2}</Typography>
          </Box>
          </Card>
          </Grid>
        )}
        {badge3 && (
          <Grid container spacing = {3}>
            <Card sx={{ p: 2, backgroundColor: '#FFF8F0', boxShadow: 3, fontStyle:'italic'}}>
          <Box>

            <Box
              component="img"
              src="/badge3.png"
              alt="절약왕 뱃지"
              sx={{ width: 130, height: 130 }}
            />
            <Typography>발급일 : {badge3}</Typography>
          </Box>
          </Card>
          </Grid>
        )}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      px={2}
    >
      <Typography> 뱃지창고 </Typography>

      {drawBadges()}

      <Stack spacing={2} textAlign="center">
        <Typography variant="h6">
          <strong>{email}</strong> 은 이미 가입된 이메일입니다.
        </Typography>
        <Typography>
          {loginType === 'KAKAO' ? '카카오' : '구글'} 계정으로 전환하시겠습니까?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAgree}
        >
          네, 전환하겠습니다
        </Button>
      </Stack>
    </Box>
  )
}
