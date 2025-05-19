import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const email = localStorage.getItem('email');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-pretendard bg-[#FFFDF7] px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#5C4033] leading-relaxed">
        환영합니다 👋 <br />
        {email}님!
      </h2>

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
