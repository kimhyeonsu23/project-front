import { useNavigate } from 'react-router-dom';

function ConsentPage() {
  const navigate = useNavigate();
  const email = localStorage.getItem('pendingEmail');
  const userName = localStorage.getItem('pendingUserName');
  const loginType = localStorage.getItem('pendingLoginType'); 

  const handleAgree = async () => {
    try {
      const res = await fetch('http://localhost:8080/user/confirm-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, loginType }), 
      });

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('email', data.email);
      localStorage.setItem('userName', data.userName);

      // clear pending
      localStorage.removeItem('pendingEmail');
      localStorage.removeItem('pendingUserName');
      localStorage.removeItem('pendingLoginType');

      navigate('/home');
    } catch (err) {
      alert('전환에 실패했습니다.');
    }
  };

  return (
    <div className="text-center mt-20">
      <p><strong>{email}</strong>은 이미 가입된 이메일입니다.</p>
      <p>카카오/구글 계정으로 전환하시겠습니까?</p>
      <button onClick={handleAgree} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded">
        네, 전환하겠습니다
      </button>
    </div>
  );
}

export default ConsentPage;
