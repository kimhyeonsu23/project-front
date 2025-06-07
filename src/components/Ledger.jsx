import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Ledger() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])


  const groupedEntries = entries.reduce((acc, entry) => {
    const { date } = entry
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {})

  const parseDate = (str) => {
    const [y, m, d] = str.split('-').map(Number)
    return new Date(y, m - 1, d)
  }

  const getWeekBounds = () => {
    const today = new Date()
    const dow = today.getDay()
    const mondayOffset = dow === 0 ? -6 : 1 - dow
    const sundayOffset = dow === 0 ? 0 : 7 - dow

    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(today)
    sunday.setDate(today.getDate() + sundayOffset)
    sunday.setHours(23, 59, 59, 999)

    return { monday, sunday }
  }


  const weekBounds = getWeekBounds()
  const thisWeekTotal = entries
    .filter(e => {
      const d = parseDate(e.date)
      return !e.isIncome && d >= weekBounds.monday && d <= weekBounds.sunday
    })
    .reduce((sum, e) => sum + Math.abs(e.amount), 0)

  const today = new Date()
  const thisMonthTotal = entries
    .filter(e => {
      const [y, m] = e.date.split('-').map(Number)
      return !e.isIncome &&
        y === today.getFullYear() &&
        m === today.getMonth() + 1
    })
    .reduce((sum, e) => sum + Math.abs(e.amount), 0)

  useEffect(() => {
    async function fetchLedger() {
      try {
        const userId = localStorage.getItem('userId')
        const res = await fetch(`/receipt/ledger?userId=${userId}`)
        if (!res.ok) throw new Error('네트워크 오류')

        const map = {
          1: '외식', 2: '교통', 3: '생활비', 4: '쇼핑',
          5: '건강', 6: '교육', 7: '저축/투자', 8: '수입'
        }

        const data = await res.json()
        const transformed = data.map(i => ({
          id: i.receiptId,
          date: i.date,
          category: map[i.keywordId] || '기타',
          description: i.shop,
          amount: i.totalPrice,
          isIncome: i.keywordId === 8
        }))

        setEntries(transformed)
      } catch (err) {
        console.error('가계부 로딩 오류:', err)
        setEntries([])
      }
    }
    fetchLedger()
  }, [])


  const categoryColors = {
    '외식': 'bg-red-100 text-red-800',
    '교통': 'bg-blue-100 text-blue-800',
    '생활비': 'bg-yellow-100 text-yellow-800',
    '쇼핑': 'bg-purple-100 text-purple-800',
    '건강': 'bg-green-100 text-green-800',
    '교육': 'bg-indigo-100 text-indigo-800',
    '저축/투자': 'bg-gray-100 text-gray-800',
    '수입': 'bg-green-100 text-green-800',
  }


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 주·월 합계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard title="이번 주 지출" amount={thisWeekTotal} />
          <SummaryCard title="이번 달 지출" amount={thisMonthTotal} />
        </div>

        {/* 헤더 + 수동입력 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">가계부</h1>
          <button
            onClick={() => navigate('/ledger/manual')}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
            수동 입력
          </button>
        </div>

        {/* 날짜별 그룹 */}
        {Object.keys(groupedEntries)
          .sort((a, b) => b.localeCompare(a))
          .map(date => {
            const dateTotal = groupedEntries[date]
              .filter(e => !e.isIncome)
              .reduce((sum, e) => sum + Math.abs(e.amount), 0)

            return (
              <div key={date} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <Link
                    to={`/ledger/${encodeURIComponent(date)}`}
                    className="text-xl font-semibold text-gray-700 hover:underline"
                  >
                    {date}
                  </Link>
                  <span className="text-lg font-medium text-red-600">
                    ₩{dateTotal.toLocaleString()}
                  </span>
                </div>

                <ul className="space-y-3">
                  {groupedEntries[date].map(entry => (
                    <li key={entry.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          categoryColors[entry.category] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.category}
                        </span>
                        <span className="text-sm text-gray-700">
                          {entry.description}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        entry.isIncome ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.isIncome ? '+' : '-'}₩{Math.abs(entry.amount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function SummaryCard({ title, amount }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-red-600">
        ₩{amount.toLocaleString()}
      </p>
    </div>
  )
}
