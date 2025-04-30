// src/components/UserForm.js
import React, { useState } from 'react';

function UserForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!userName || !password || !email) {
            setError('모든 항목을 입력해주세요.');
            setSuccess('');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true); // 로딩 시작

        // 입력된 유저 데이터를 객체로 만들기
        const user = {
            userName,
            password,
            email,
        };

        try {
            // 백엔드 API에 POST 요청 보내기
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user), // 유저 정보를 JSON 형태로 전송
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User created:', data);
                setSuccess('회원가입이 완료되었습니다!');
                setUserName('');
                setPassword('');
                setEmail('');
            } else {
                setError('서버 오류로 회원가입에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">Create a new User</h2>

            {/* 오류 메시지 */}
            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md p-3">
                    {error}
                </div>
            )}

            {/* 성공 메시지 */}
            {success && (
                <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md p-3">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="userName" className="mb-1 text-sm text-gray-600">
                        User Name:
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                            error && !userName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 text-sm text-gray-600">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                            error && !password ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 text-sm text-gray-600">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                            error && !email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full font-semibold py-2 px-4 rounded-md transition ${
                        isLoading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? '로딩 중...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default UserForm;
