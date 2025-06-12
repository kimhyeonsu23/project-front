import React, {useEffect , useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography, Button, Stack, Card, Grid } from '@mui/material'
import { Divider } from '@mui/material'


export default function MyInfo() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [badge, setBadge] = useState([]);
    const [badge1, setBadge1] = useState(""); // 절약초보 뱃지 : 받은 날짜를 ""으로 초기화
    const [badge2, setBadge2] = useState(""); // 절약고수 뱃지
    const [badge3, setBadge3] = useState(""); // 절약왕 뱃지

    useEffect(() => {

        const token = localStorage.getItem('accessToken');
        console.log("token : ", token);
        const storedEmail = localStorage.getItem('email')
        const userId = localStorage.getItem('userId');

        fetchGetBadge();

    }, [navigate])


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
       
        const data = await response.json();
        
        console.log("데이터 : ", data);
        setBadge(data)
        // 뱃지 수 세기
        data.forEach((bad) => {
          
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
      <Box display="flex" gap={6}> 
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
    <Box sx={{ px: 3, py: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        내 정보

      </Typography>
      <Divider sx={{ width: '100%', maxWidth: { xs: '100%', sm: 360, md: 600 }, mx: 'auto', mb: 2 }} />



      <Typography variant="subtitle1" color="primary" textAlign="center" gutterBottom>
          ⚡️ 뱃지 창고 ⚡️

        </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // 가로 가운데 정렬
          flexWrap: 'wrap',         // 여러 줄로 넘어갈 수 있게
          gap: 2,                   // 뱃지 사이 간격
          mt: 2,                    // 위 여백
        }}
      >
        {drawBadges()}
      </Box>
    </Box>
  )


    
}