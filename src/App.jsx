import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import SignupForm from './components/SignupForm';  
import Home from './components/Home'; 
import KakaoCallback from './components/KakaoCallback'; 
import GoogleCallback from './components/GoogleCallback'; 
import ConsentPage from './components/ConsentPage'; // ✅ 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} /> 
        <Route path="/oauth/google/callback" element={<GoogleCallback />} />
        <Route path="/consent" element={<ConsentPage />} /> {/* ✅ 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
