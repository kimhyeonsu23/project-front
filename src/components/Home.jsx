import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedEmail = localStorage.getItem('email');
    const storedName = localStorage.getItem('userName'); // 추가

    if (!token || !storedEmail) {
      navigate('/');
    } else {
      setEmail(storedEmail);
      setUserName(storedName || ''); // userName이 없으면 빈 문자열
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-pretendard bg-[#FFFDF7] px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#5C4033] leading-relaxed">
        환영합니다 !!!!!!!! <br />
        {userName || email}님!
      </h2>
      <button
        onClick={() => navigate('receipt')}
        className="mt-4 px-6 py-2 bg-[#FFF1F0] text-[#5C4033] font-medium rounded-lg shadow"
      >
        영수증 등록
      </button>

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-3 bg-[#FFDAD6] text-[#5C4033] font-semibold rounded-xl shadow text-sm sm:text-base"
      >
        로그아웃
      </button>
    </div>
  );
}

export default Home;
