import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography, Button, Stack, Card, Grid } from '@mui/material'
import html2canvas from 'html2canvas';
import { Divider } from '@mui/material'

export default function Home() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')

  const [currentWeek, setCurrentWeek] = useState(0);
  const [foodExpense, setFoodExpense] = useState(0);
  const [livingExpense, setLivingExpense] = useState(0);
  const [fashionExpense, setFashionExpense] = useState(0);
  const [healthExpense, setHealthExpense] = useState(0);
  const [investmentExpense, setInvestmentExpense] = useState(0);
  const [transportationExpense, setTransportationExpense] = useState(0);
  const [educationExpense, setEducationExpense] = useState(0);

  const data = [
    { name: '외식', value: foodExpense , img:'🍔'},
    { name: '생활비', value: livingExpense , img:'🛒'},
    { name: '쇼핑', value: fashionExpense , img:'👕'},
    { name: '건강', value: healthExpense , img:'🏥'},
    { name: '저축/투자', value: investmentExpense , img:'💴'},
    { name: '교육', value: educationExpense , img:'✏️'},
    { name: '교통', value: transportationExpense , img:'🚍'},
  ];

  const filteredData = data.filter(d => d.value > 0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#ed87d2', '#FA8042', '#F13342', '#b86bd6'];
  const RADIAN = Math.PI / 180;


  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const storedEmail = localStorage.getItem('email')
    const userId = localStorage.getItem('userId'); //** 


    if (!token || !storedEmail) {
      navigate('/')
    } else {
      setEmail(storedEmail)
      setUserName(localStorage.getItem('userName') || '')
      fetchCurrentWeek(); //** */
      fetchKeywordTotalPrice();//** */
    }
  }, [navigate])


  


const fetchCurrentWeek = async () => {
    try {
      console.log("fetchCurrentWeek 실행");
      const token = localStorage.getItem('accessToken')
      
      console.log(" fetchCurrentWeek토큰 : " + token);

      const response = await fetch('http://localhost:8080/statis/getReceipt/calCurrentWeek', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      
      });



      if (response.ok) {
        const value = await response.text(); // 숫자 하나만 오는 경우
        setCurrentWeek(Number(value));
        console.log('currentWeek: ', value);
      } else {
        console.error('프론트 : response 에러');
      }
    } catch (error) {
      console.log('프론트 : error in currentWeek!', error);
    }
  };

  const fetchKeywordTotalPrice = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      
      const res = await fetch('http://localhost:8080/statis/getReceipt/calKeywordTotalPrice', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.ok) {
        const totalPrice = await res.json();
        setFoodExpense(totalPrice.food || 0);
        setLivingExpense(totalPrice.living || 0);
        setFashionExpense(totalPrice.fashion || 0);
        setHealthExpense(totalPrice.health || 0);
        setInvestmentExpense(totalPrice.investment || 0);
        setTransportationExpense(totalPrice.transportation || 0);
        setEducationExpense(totalPrice.education||0);
      } else {
        console.error("프론트 : keyword별 합계 응답 실패.");
      }
    } catch (error) {
      console.error("프론트 : keyword별 합계 fetch 에러", error);
    }
  };



  const downloadChart = () => {
  const chartElement = document.getElementById('myPieChart');
  html2canvas(chartElement).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'week_pie_chart.png';
    link.click();
  });
};




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
        <Divider sx={{ width: '100%', maxWidth: { xs: '100%', sm: 360, md: 600 }, mx: 'auto', mb: 2 }} />

       
</Box>
 <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      px={2}
    >
        <Box>
          <div className="mt-8 text-[#5C4033]">

      <Grid container spacing={2} justifyContent="center" > 
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 4, backgroundColor: '#FFF8F0', boxShadow: 2 , font: 'primary'}}>
            <Typography variant="h6" font-semibold>💸이번주 소비 금액</Typography>
            <Typography variant="h6">{currentWeek.toLocaleString()} 원</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: 4, backgroundColor: '#FFF8F0', boxShadow: 2, fontStyle:'italic'}}>
            <Typography variant="h6" font-semibold>카테고리 소비 금액</Typography>
            <Typography variant="body2">🍔외식: {foodExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">🛒생활: {livingExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">👕패션/미용: {fashionExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">🏥건강: {healthExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">💴저축/투자: {investmentExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">🚍교통: {transportationExpense.toLocaleString()} 원</Typography>
            <Typography variant="body2">✏️교육: {educationExpense.toLocaleString()} 원</Typography>
          </Card>
        </Grid>
      </Grid>
      </div>
      <Box
  width="100%"
  display="flex"
  justifyContent="center"
  mt={6}
>
  <Card
    sx={{
      width: 500,
      height: 450,
      p: 4,
      backgroundColor: '#FFF1F0',
      boxShadow: 2,
      fontStyle: 'primary.main',
      position: 'relative',
    }}
  >
    <Typography variant="h6" gutterBottom color="primary">
      📊 카테고리별 소비 분포
    </Typography>

    <div id="myPieChart">
    <Box display="flex" justifyContent="center">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ img, percent }) => `${img}${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Box>
    </div>
    <button
    onClick={downloadChart} download
    style={{
      padding: '5px 5px',  
      backgroundColor: '#FFDAD6',
      color: 'black',
      fontSize: '14px',
      borderRadius: '8px' 
    }}> 차트 저장
    </button>

    <Card
      sx={{
        position: 'absolute',
        bottom: 7,
        right: 7,
        p: 1,
        backgroundColor: '#FFF8F0',
        boxShadow: 2,
        fontStyle: 'italic',
      }}
    >
      <Typography variant="body2">🍔: {foodExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">🛒: {livingExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">👕: {fashionExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">🏥: {healthExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">💴: {investmentExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">🚍: {transportationExpense.toLocaleString()} 원</Typography>
      <Typography variant="body2">✏️: {educationExpense.toLocaleString()} 원</Typography>
    </Card>
  </Card>
</Box>


        </Box>



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
            onClick={() => navigate('/ledger/manual')}
            sx={{
              bgcolor: '#E8F5E9',
              color: 'primary.main',
              '&:hover': { bgcolor: '#C8E6C9' },
            }}
          >
            수동 가계부 입력
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
