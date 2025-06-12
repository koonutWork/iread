import React from 'react';
import './Partners.css'; // Add a CSS file for styling

function Partners() {
  return (
    <div className="partners-container">
      <header className="partners-header">
        <h1>เข้าร่วม โปรแกรมพันธมิตร</h1>
        <p>
          ร่วมเป็นพันธมิตรกับเราและรับค่าคอมมิชชั่นที่น่าดึงดูดจากการแนะนำ iReadCustomer ให้กับเครือข่ายของคุณ
        </p>
      </header>
      <div className="partners-benefits">
        <div className="benefit-card">
          <div className="benefit-icon">🤝</div>
          <h3>เป็นพันธมิตรได้ง่าย</h3>
          <p>
            กระบวนการสมัครที่ง่ายและมีทีมสนับสนุนที่ช่วยให้คุณประสบความสำเร็จ
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">💰</div>
          <h3>ค่าคอมมิชชั่นสูง</h3>
          <p>
            รับค่าคอมมิชชั่นสูงสุด 30% สำหรับทุกการแนะนำที่สำเร็จ
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">📊</div>
          <h3>การวิเคราะห์แบบเรียลไทม์</h3>
          <p>
            ติดตามผลลัพธ์และรายได้ของคุณผ่านแดชบอร์ดที่ครอบคลุม
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">📈</div>
          <h3>โอกาสในการเติบโต</h3>
          <p>
            เพิ่มรายได้ของคุณด้วยโครงสร้างค่าคอมมิชชั่นแบบขั้นบันได
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">📣</div>
          <h3>ทรัพยากรพิเศษ</h3>
          <p>
            เข้าถึงสื่อการตลาดและการฝึกอบรมเพื่อเพิ่มโอกาสความสำเร็จ
          </p>
        </div>
        <div className="benefit-card">
          <div className="benefit-icon">🎧</div>
          <h3>ทีมสนับสนุนเฉพาะ</h3>
          <p>
            ซัพพอร์ต 24/7 เพื่อช่วยให้คุณประสบความสำเร็จสูงสุด
          </p>
        </div>
      </div>
    </div>
  );
}

export default Partners;