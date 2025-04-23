import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './review.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/reviews')
      .then(res => {
        console.log('Fetched reviews:', res.data); // ดีบักข้อมูล
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('ไม่สามารถโหลดข้อมูลรีวิวได้ กรุณาตรวจสอบเซิร์ฟเวอร์');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="review-management-empty">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="review-management-empty">{error}</div>;

  return (
    <div className="review-management-container">
      <h2 className="review-management-title">การจัดการข้อมูลการรีวิว</h2>
      {reviews.length === 0 ? (
        <div className="review-management-empty">ไม่มีข้อมูลรีวิว</div>
      ) : (
        <>
          <table className="review-management-table">
            <thead>
              <tr className="review-management-header">
                <th className="review-management-index">ลำดับ</th>
                <th className="review-management-provider">ชื่อ Provider</th>
                <th className="review-management-review">การรีวิว</th>
                <th className="review-management-rating">คะแนนการรีวิว</th>
                <th className="review-management-check">ตรวจสอบ</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review.id || index} className="review-management-row">
                  <td className="review-management-index">{index + 1}</td>
                  <td className="review-management-provider">{review.provider_name}</td>
                  <td className="review-management-review">{review.review_text}</td>
                  <td className="review-management-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </td>
                  <td className="review-management-check">
                    <button
                      onClick={() => {
                        console.log('Navigating with review ID:', review.id); // ดีบัก
                        if (!review.id || isNaN(review.id)) {
                          alert('ไม่สามารถไปยังหน้ารายละเอียดได้: ID ไม่ถูกต้อง');
                          return;
                        }
                        navigate(`/reviewdetail/${review.id}`);
                      }}
                      className="review-management-check-button"
                    >
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReviewManagement;