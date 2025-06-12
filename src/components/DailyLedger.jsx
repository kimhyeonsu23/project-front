import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReceiptIcon, Trash2Icon, DownloadIcon } from 'lucide-react'

export default function DailyLedger() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])

  // 카테고리별 색상 정의
  const categoryColors = {
    '외식': 'bg-pink-100 text-pink-800',
    '교통': 'bg-blue-100 text-blue-800',
    '생활비': 'bg-yellow-100 text-yellow-800',
    '쇼핑': 'bg-purple-100 text-purple-800',
    '건강': 'bg-green-100 text-green-800',
    '교육': 'bg-indigo-100 text-indigo-800',
    '저축/투자': 'bg-gray-100 text-gray-800',
    '수입': 'bg-emerald-100 text-emerald-800',
    '기타': 'bg-slate-100 text-slate-800',
  }

  useEffect(() => {
    async function fetchDaily() {
      try {
        const userId = localStorage.getItem('userId')
        const res = await fetch(`/receipt/ledger?userId=${userId}`)
        if (!res.ok) throw new Error('네트워크 오류')

        const catMap = {
          1: '외식', 2: '교통', 3: '생활비', 4: '쇼핑',
          5: '건강', 6: '교육', 7: '저축/투자', 8: '수입'
        }

        const data = await res.json()
        const todays = data
          .filter(item => item.date === date)
          .map(item => ({
            id: item.receiptId,
            category: catMap[item.keywordId] || '기타',
            description: item.shop,
            amount: item.totalPrice,
            isIncome: item.keywordId === 8,
            imagePath: item.imagePath
          }))

        setEntries(todays)
      } catch (err) {
        console.error('상세 내역 로딩 오류:', err)
      }
    }
    fetchDaily()
  }, [date])

  const handleDelete = async (receiptId) => {
    if (!window.confirm('정말 삭제할까요?')) return
    try {
      const res = await fetch(`/receipt/${encodeURIComponent(receiptId)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`삭제 실패: ${res.status}`)
      setEntries(prev => prev.filter(e => e.id !== receiptId))
    } catch (err) {
      alert(err.message)
      console.error(err)
    }
  }

  const handleDownloadCSV = () => {
    const headers = ['카테고리', '상호명', '금액', '타입']
    const rows = entries.map(e => [
      e.category,
      e.description,
      e.amount,
      e.isIncome ? '수입' : '지출'
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${date}_ledger.csv`
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-[#444]">📒 {date} 가계부</h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded-full shadow hover:bg-yellow-200"
            >
              <DownloadIcon className="w-4 h-4 mr-1" /> CSV
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:underline"
            >
              ← 돌아가기
            </button>
          </div>
        </div>

        {/* 본문 내역 */}
        <div className="bg-white shadow rounded-xl divide-y border border-yellow-100">
          {entries.length === 0 ? (
            <div className="text-center text-gray-400 py-10">내역이 없습니다 🐣</div>
          ) : (
            entries.map(e => (
              <div
                key={e.id}
                className="flex justify-between items-center px-5 py-4 hover:bg-yellow-50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      categoryColors[e.category] || 'bg-slate-100 text-slate-800'
                    }`}>
                      {e.category}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {e.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {e.imagePath && (
                      <a
                        href={`/receipt/image/${encodeURIComponent(e.imagePath)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:underline"
                      >
                        <ReceiptIcon className="w-4 h-4 mr-1" /> 영수증 보기
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="flex items-center text-red-500 hover:underline"
                    >
                      <Trash2Icon className="w-4 h-4 mr-1" /> 삭제
                    </button>
                  </div>
                </div>
                <div className={`text-right text-base font-bold ${e.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {e.isIncome ? '+' : '-'}₩{Math.abs(e.amount).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
