import { useState } from "react";
import axios from "axios";

const ReceiptUpload = () => {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [keywordId, setKeywordId] = useState("");

  const categories = [
    { id: 1, name: "외식" },
    { id: 2, name: "교통" },
    { id: 3, name: "생활비" },
    { id: 4, name: "쇼핑" },
    { id: 5, name: "건강" },
    { id: 6, name: "교육" },
    { id: 7, name: "저축/투자" },
  ];

  const handleSubmit = async () => {
  if (!image) {
    alert("이미지를 선택하세요!");
    return;
  }

  console.log("보내는 이미지 파일:", image); 

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post("http://localhost:8080/receipt/ocr", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // ✅ 이 부분 추가됨
      },
      withCredentials: true,
    });
    console.log("OCR 결과:", response.data);
    setOcrResult(response.data);
  } catch (err) {
    console.error("OCR 오류:", err.response || err);
    alert("OCR 요청 실패: " + (err.response?.data?.message || err.message));
  }
};

  const handleCreateReceipt = async () => {
    if (!ocrResult || !keywordId) {
      alert("OCR 분석 후 카테고리를 선택하세요!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/receipt/createReceipt",
        {
          shop: ocrResult.shopName,
          userId: 1,
          date: ocrResult.date,
          keywordId: keywordId,
        },
        { withCredentials: true }
      );
      alert("영수증 등록 완료!");
    } catch (err) {
      console.error("등록 실패:", err);
      alert("영수증 저장 실패: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-start px-6 py-10 font-pretendard">
      <h2 className="text-2xl font-bold text-[#5C4033] mb-6">영수증 등록</h2>

      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />

        <button
          className="w-full bg-[#FF8A65] text-white font-semibold py-2 rounded hover:bg-[#ff7043]"
          onClick={handleSubmit}
        >
          OCR 분석
        </button>

        {ocrResult && (
          <div className="space-y-3">
            <p>📍 <strong>상호명:</strong> {ocrResult.shopName}</p>
            <p>📅 <strong>날짜:</strong> {ocrResult.date}</p>
            <p>💰 <strong>금액:</strong> {ocrResult.totalPrice.toLocaleString()}원</p>

            <select
              value={keywordId}
              onChange={(e) => setKeywordId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              className="w-full bg-[#4CAF50] text-white font-semibold py-2 rounded hover:bg-[#43a047]"
              onClick={handleCreateReceipt}
            >
              영수증 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;
