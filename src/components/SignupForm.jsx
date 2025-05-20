import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../assets/icon.png';

function SignupForm() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleSendCode = async () => {
    if (!email) return setError('이메일을 입력해주세요.');

    try {
      const response = await fetch('http://localhost:8080/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert('이메일 인증코드 전송');
        setError('');
        setTimeLeft(300); // 5분
        setTimerActive(true);
      } else {
        setError(result.message || '이메일 전송 실패');
      }
    } catch {
      setError('서버 오류 발생');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('http://localhost:8080/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: authCode }),
      });

      const result = await response.json();
      if (result.verified) {
        setIsEmailVerified(true);
        alert('이메일 인증 성공');
        setError('');
        setTimerActive(false);
      } else {
        setError(result.message || '인증코드가 일치하지 않습니다.');
      }
    } catch {
      setError('네트워크 오류 발생');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('회원가입 완료');
        navigate('/login');
      } else {
        setError(result.message || '회원가입 실패');
      }
    } catch {
      setError('네트워크 오류 발생');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center pt-12 px-4 font-pretendard">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#5C4033] mb-4">회원가입</h1>
      <img src={icon} alt="아이콘" className="w-40 sm:w-48 md:w-52 h-auto mb-6" />

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md p-3 w-full max-w-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        {/* 이름 */}
        <input
          type="text"
          placeholder="이름"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7]"
        />

        {/* 이메일 입력 & 인증 */}
        <div className="space-y-1">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7]"
            disabled={isEmailVerified}
          />
          {!isEmailVerified && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={timerActive}
                className={`flex-1 bg-[#A3E4DB] text-[#5C4033] py-2 rounded-lg text-sm font-semibold 
                ${timerActive ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8FD6CB]'}`}
              >
                인증코드 발송
              </button>
            </div>
          )}
          {!isEmailVerified && timerActive && (
            <p className="text-xs text-[#A89F97]">
              남은 시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
            </p>
          )}
        </div>

        {/* 인증코드 입력 */}
        {!isEmailVerified && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="인증코드 입력"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className="flex-1 bg-white p-3 border rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className="bg-[#A3E4DB] text-[#5C4033] px-4 rounded-lg text-sm font-semibold hover:bg-[#8FD6CB]"
            >
              확인
            </button>
          </div>
        )}

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7]"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-[#F9F3E9] text-[#5C4033] placeholder-[#A89F97] p-3 rounded-xl border border-[#DDD1C7]"
        />

        <button
          type="submit"
          className="w-full bg-[#A3E4DB] hover:bg-[#8FD6CB] text-[#5C4033] font-semibold py-3 rounded-xl shadow text-base transition"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
