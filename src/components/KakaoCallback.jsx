import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function KakaoCallback() {
  const navigate = useNavigate();
  const isCalled = useRef(false);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code && !isCalled.current) {
      isCalled.current = true;

      axios
        .get("http://localhost:8080/user/oauth/kakao", { params: { code } })
        .then((res) => {
          const { accessToken, email, userName, requiresConsent } = res.data;

          if (requiresConsent) {
            localStorage.setItem("pendingEmail", email);
            localStorage.setItem("pendingUserName", userName);
            localStorage.setItem("pendingLoginType", "KAKAO"); 
            navigate("/consent");
            return;
          }

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("email", email);
          localStorage.setItem("userName", userName);

          window.history.replaceState({}, "", window.location.pathname);
          navigate("/home");
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err);
          alert("카카오 로그인 실패");
          navigate("/");
        });
    }
  }, [navigate]);

  return (
    <div className="text-center mt-10 text-lg text-gray-700">
      카카오 로그인 처리 중...
    </div>
  );
}

export default KakaoCallback;
