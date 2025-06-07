import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function DailyLedger() {
  const { date } = useParams()          
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])

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
  if (!window.confirm('정말 삭제할까요?')) return;

  try {
    const res = await fetch(
      `/receipt/${encodeURIComponent(receiptId)}`,
      { method: 'DELETE' }
    );

    if (!res.ok) {
      throw new Error(`삭제 실패: ${res.status}`);
    }

    setEntries(prev => prev.filter(e => e.id !== receiptId));
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

  const color = {
    '외식':'bg-red-100 text-red-800', '교통':'bg-blue-100 text-blue-800',
    '생활비':'bg-yellow-100 text-yellow-800','쇼핑':'bg-purple-100 text-purple-800',
    '건강':'bg-green-100 text-green-800','교육':'bg-indigo-100 text-indigo-800',
    '저축/투자':'bg-gray-100 text-gray-800','수입':'bg-green-100 text-green-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{date} 상세 내역</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:underline"
          >
            ← 돌아가기
          </button>
        </div>

        <ul className="space-y-4">
          {entries.map(e => (
            <li
              key={e.id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${color[e.category] || 'bg-gray-100 text-gray-800'}`}>
                  {e.category}
                </span>
                <span className="text-sm text-gray-700">{e.description}</span>
              </div>

              <div className="flex items-center space-x-3">
                {e.imagePath && (
                  <a
                     href={`/receipt/image/${encodeURIComponent(e.imagePath)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-xs text-blue-600 hover:underline"
                   >
                      영수증 보기
                   </a>
                )}

                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
                
                <span
                  className={`text-sm font-medium ${
                    e.isIncome ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {e.isIncome ? '+' : '-'}₩{Math.abs(e.amount).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
