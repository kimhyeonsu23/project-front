import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import SignupForm from './components/SignupForm';  // ✅ SignupForm import
import Home from './components/Home'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} /> {/* ✅ UserForm → SignupForm 변경 */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
