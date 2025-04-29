// src/components/UserForm.js
import React, { useState } from 'react';

function UserForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 입력된 유저 데이터를 객체로 만들기
        const user = {
            userName,
            password,
            email,
        };

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
        } else {
            console.error('Error creating user');
        }
    };

    return (
        <div>
            <h2>Create a new User</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userName">User Name:</label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default UserForm;
