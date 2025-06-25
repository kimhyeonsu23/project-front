import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import axios from 'axios'
import Tooltip from '@mui/material/Tooltip'

export default function Header() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('사용자')
  const [point, setPoint] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    axios.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUserName(res.data.userName)
        setPoint(res.data.point ?? 0) // point가 없을 경우 0으로 대체
      })
      .catch((err) => {
        console.error('유저 정보 조회 실패:', err)
      })
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <header className="bg-white border-b shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate('/home')}
          className="text-xl font-bold text-indigo-700 cursor-pointer"
        >
          BudgetMate
        </h1>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="hidden sm:inline font-medium">
            안녕하세요, <span className="text-indigo-600">{userName}</span> 님
          </span>

          <Tooltip title="챌린지 성공 시 포인트 지급됩니다!" arrow>
            <span className="text-green-600 cursor-help inline-block">💰 {point}P</span>
          </Tooltip>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 hover:underline"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </div>
    </header>
  )
}
