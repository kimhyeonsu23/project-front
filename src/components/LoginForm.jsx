import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import icon from '../assets/icon.png';
import { KAKAO_AUTH_URL,GOOGLE_AUTH_URL } from '../config';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
        const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('accessToken', result.token);
        localStorage.setItem('email', email);
        navigate('/home');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  

  const handleGoogleLogin = () => {
  window.location.href = GOOGLE_AUTH_URL;
  };


  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center pt-12 px-4 font-pretendard">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#5C4033] mb-4">가계로그</h1>
      <img src={icon} alt="곰돌이 저금통" className="w-40 sm:w-48 md:w-52 h-auto mb-6" />

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md p-3 w-full max-w-sm">
          {error}
        </div>
      )}

      {/* 이메일 로그인 폼 */}
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7] focus:ring-2 focus:ring-[#A3E4DB] text-base sm:text-lg"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7] focus:ring-2 focus:ring-[#A3E4DB] text-base sm:text-lg"
        />
        <button
          type="submit"
          className="w-full bg-[#A3E4DB] hover:bg-[#8FD6CB] text-[#5C4033] font-semibold py-3 rounded-xl shadow text-base sm:text-lg transition"
        >
          로그인
        </button>
      </form>

      {/* 구분선 */}
      <div className="flex items-center my-6 w-full max-w-sm">
        <hr className="flex-grow border-[#DDD1C7]" />
        <span className="px-3 text-[#A89F97] text-sm">또는</span>
        <hr className="flex-grow border-[#DDD1C7]" />
      </div>

      <div className="w-full max-w-sm space-y-3">
        {/* 카카오 로그인 */}
        <button
          onClick={handleKakaoLogin}
          className="w-full bg-[#FEE500] hover:bg-[#fada00] text-[#3C1E1E] font-semibold py-3 rounded-full shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.94 2 10.5c0 2.57 1.56 4.86 4 6.31-.2.73-.74 2.62-.85 3.05 0 0-.01.09.04.12s.12 0 .12 0c.16-.02 2.62-1.81 3.66-2.56.59.09 1.2.14 1.82.14 5.52 0 10-3.94 10-8.5S17.52 2 12 2z"/>
          </svg>
          카카오로 로그인
        </button>

        {/* 구글 로그인 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white hover:bg-gray-100 text-[#5C4033] font-semibold py-3 rounded-full shadow-md border border-gray-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M21.6 12.23c0-.74-.07-1.45-.18-2.14H12v4.06h5.36c-.23 1.2-.91 2.2-1.92 2.88v2.4h3.12c1.83-1.68 2.88-4.15 2.88-6.8z" fill="#4285F4"/>
            <path d="M12 22c2.4 0 4.41-.8 5.88-2.17l-3.12-2.4c-.87.6-1.98.94-3.12.94-2.4 0-4.43-1.62-5.15-3.8H3.24v2.38A10.003 10.003 0 0012 22z" fill="#34A853"/>
            <path d="M6.85 13.57A5.995 5.995 0 016 12c0-.55.08-1.09.22-1.57V8.05H3.24A10.005 10.005 0 002 12c0 1.62.39 3.15 1.07 4.5l3.78-2.93z" fill="#FBBC05"/>
            <path d="M12 6.02c1.3 0 2.47.45 3.39 1.32l2.52-2.52C16.41 3.2 14.4 2 12 2a10.003 10.003 0 00-8.76 5.05l3.78 2.93c.72-2.18 2.75-3.96 5.14-3.96z" fill="#EA4335"/>
          </svg>
          구글로 로그인
        </button>
      </div>

      {/* 회원가입 */}
      <p className="text-sm sm:text-base text-[#5C4033] pt-6">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="underline font-semibold text-[#37977A]">
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
