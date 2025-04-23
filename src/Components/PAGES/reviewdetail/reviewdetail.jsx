import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './reviewdetail.css';

const CheckReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Received ID:', id); // ดีบักค่า id
    if (!id || isNaN(id)) {
      setError('ID ไม่ถูกต้อง กรุณาเลือกข้อมูลรีวิวที่ต้องการตรวจสอบ');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:3000/api/reviews/${id}`)
      .then(res => {
        setReview(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('ไม่สามารถโหลดข้อมูลรีวิวได้');
        setLoading(false);
      });
  }, [id]);

  const handleCheck = () => {
    axios.put(`http://localhost:3000/api/reviews/${id}/check`)
      .then(() => {
        alert('ตรวจสอบเรียบร้อยแล้ว');
        navigate('/reviewmanagement');
      })
      .catch(err => {
        console.error(err);
        setError('ไม่สามารถอัปเดตสถานะรีวิวได้');
      });
  };

  if (loading) return <div className="check-review-loading">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="check-review-error">{error}</div>;
  if (!review) return <div className="check-review-not-found">ไม่พบข้อมูลรีวิว</div>;

  return (
    <div className="check-review-container">
      <button
        className="check-review-back-button"
        onClick={() => navigate('/reviewmanagement')}
      >
        ย้อนกลับ
      </button>

      <h2 className="check-review-title">รายละเอียดการรีวิว</h2>

      <div className="check-review-details">
        <div className="check-review-item">
          <span className="check-review-label">ชื่อ Provider: </span>
          <span>{review.provider_name}</span>
        </div>
        <div className="check-review-item">
          <span className="check-review-label">ข้อความรีวิว: </span>
          <span>{review.review_text}</span>
        </div>
        <div className="check-review-item">
          <span className="check-review-label">คะแนนการรีวิว: </span>
          <span className="check-review-rating">
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </span>
        </div>
        <div className="check-review-item">
          <span className="check-review-label">สถานะ: </span>
          {review.is_checked ? (
            <span className="check-review-checked">ตรวจสอบแล้ว</span>
          ) : (
            <span className="check-review-not-checked">ยังไม่ตรวจสอบ</span>
          )}
        </div>

        {!review.is_checked && (
          <button
            className="check-review-button"
            onClick={handleCheck}
          >
            ตรวจสอบแล้ว
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckReview;