import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './pricing.css';

function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: '฿9,900 / เดือน',
      yearlyPrice: '฿108,900 / ปี',
      features: [
        'ได้ 30,000 โทเคนต่อเดือน',
        'เข้าถึง GPT-4o mini และเสียงขั้นสูง',
        'สร้างและแชร์โปรเจกต์ได้ 1 โปรเจกต์ในพื้นที่ทำงานของคุณ',
        'พื้นที่เก็บข้อมูลบนคลาวด์ปลอดภัยสูงสุด 3 GB',
        'สำหรับ 2 ผู้ใช้งาน ชำระเงินแบบรายปี',
      ],
    },
    {
      name: 'Premium',
      monthlyPrice: '฿19,900 / เดือน',
      yearlyPrice: '฿218,900 / ปี',
      features: [
        'ได้ 120,000 โทเคนต่อเดือน',
        'เข้าถึง GPT-4o mini, 3.5-Sonnet และเสียงขั้นสูง',
        'คอนโซลผู้ดูแลระบบสำหรับจัดการพื้นที่ทำงาน',
        'สร้างและแชร์โปรเจกต์ได้ 5 โปรเจกต์ในพื้นที่ทำงานของคุณ',
        'พื้นที่เก็บข้อมูลบนคลาวด์ปลอดภัยสูงสุด 5 GB',
        'สำหรับ 5 ผู้ใช้งานขึ้นไป ชำระเงินแบบรายปี',
      ],
    },
    {
      name: 'ScaleUp',
      monthlyPrice: '฿49,900 / เดือน',
      yearlyPrice: '฿548,900 / ปี',
      features: [
        'ได้ 500,000 โทเคนต่อเดือน',
        'เข้าถึง GPT-4o, 3.5-Sonnet, โมเดลขั้นสูงอื่นๆ และเสียงขั้นสูง',
        'คอนโซลผู้ดูแลระบบสำหรับจัดการพื้นที่ทำงาน',
        'สร้างและแชร์โปรเจกต์ได้ 15 โปรเจกต์ในพื้นที่ทำงานของคุณ',
        'พื้นที่เก็บข้อมูลบนคลาวด์ปลอดภัยสูงสุด 12 GB',
        'สำหรับ 5 ผู้ใช้งานขึ้นไป ชำระเงินแบบรายปี',
      ],
    },
    {
      name: 'Enterprise',
      monthlyPrice: 'ติดต่อทีมขาย',
      yearlyPrice: 'ติดต่อทีมขาย',
      features: [
        'จัดสรรโทเคนตามความต้องการ',
        'เลือกและปรับแต่งโมเดล AI ตามต้องการ',
        'ผู้จัดการบัญชีส่วนตัว',
        'รองรับการติดตามระบบแบบกำหนดเอง',
        'ซัพพอร์ต 24/7 แบบเร่งด่วน',
        'SLA และความปลอดภัยตามความต้องการ',
      ],
    },
  ];

  return (
    <div className="pricing-container">
      <h1>เลือก แพ็คเกจ</h1>
      <p>เลือกแพ็คเกจที่เหมาะกับทีมของคุณและปลดล็อกศักยภาพสูงสุดของ iReadCustomer</p>
      <div className="toggle-container">
        <button
          className={`toggle-button ${!isYearly ? 'active' : ''}`}
          onClick={() => setIsYearly(false)}
        >
          รายเดือน
        </button>
        <button
          className={`toggle-button ${isYearly ? 'active' : ''}`}
          onClick={() => setIsYearly(true)}
        >
          รายปี
        </button>
      </div>
      <div className="plans">
        {plans.map((plan, index) => (
          <div key={index} className="plan-card">
            <h2>{plan.name}</h2>
            <h3>{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</h3>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button
              className="action-button"
              onClick={() => {
                if (plan.name === 'Enterprise') {
                  window.location.href = 'https://www.linkedin.com/company/ireadcustomer/';
                } else {
                  navigate('/waitlist'); // Navigate to waitlist page
                }
              }}
            >
              {plan.name === 'Enterprise' ? 'ติดต่อทีมขาย' : 'ร่วมรายชื่อผู้สนใจ'}
            </button>
            <p className="guarantee">รับประกันคืนเงินใน 30 วัน</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
