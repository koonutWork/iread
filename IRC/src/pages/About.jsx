import React from 'react';
import './About.css'; // Add a CSS file for styling

function About() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Core Values</h1>
      </header>
      <div className="about-values">
        <div className="value-card">
          <div className="value-icon">📈</div>
          <h3>Data Democratization</h3>
          <p>
            ทุกธุรกิจควรสามารถใช้ข้อมูลได้โดยไม่ต้องพึ่งผู้เชี่ยวชาญ หรือมีต้นทุนสูง ทำให้ AI & Data Analytics เข้าถึงได้สำหรับทุกคน
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">💡</div>
          <h3>Radical Simplicity</h3>
          <p>
            ทำให้การใช้ข้อมูลง่ายที่สุด แม้แต่พนักงานที่ไม่มีพื้นฐานด้านเทคโนโลยี ใช้ Multi-Agentic AI เพื่อให้ทุกคนในองค์กร เข้าใจและใช้ข้อมูลได้ทันที
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">⚙️</div>
          <h3>Automation First</h3>
          <p>
            ลดการทำงานซ้ำซ้อน และเพิ่มประสิทธิภาพด้วย AI-driven automation ทำให้ข้อมูลทำงานแทนมนุษย์ แทนที่ต้องอาศัยการวิเคราะห์แบบดั้งเดิม
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">🔑</div>
          <h3>Actionable Insights, Not Just Data</h3>
          <p>
            ไม่ใช่แค่การเก็บข้อมูล แต่ต้องเปลี่ยนเป็นกลยุทธ์และการตัดสินใจที่ชัดเจน ทุกฟีเจอร์ของ iReadCustomer ถูกออกแบบให้ให้คำตอบที่ใช้ได้จริง
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">🔄</div>
          <h3>Scalability & Adaptability</h3>
          <p>
            รองรับธุรกิจทุกขนาด ตั้งแต่ SMEs ไปจนถึงองค์กรขนาดใหญ่ ระบบ AI สามารถปรับแต่งให้เหมาะกับอุตสาหกรรมและความต้องการเฉพาะของแต่ละองค์กร
          </p>
        </div>
        <div className="value-card">
          <div className="value-icon">👥</div>
          <h3>Customer-Centric AI</h3>
          <p>
            พัฒนา AI ที่เข้าใจบริบทของธุรกิจและลูกค้าแต่ละราย เน้น Personalized AI Analytics ที่สามารถให้คำตอบตามบริบทเฉพาะของแต่ละแบรนด์
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;