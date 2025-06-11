import React, { useState } from 'react';
import './waitlist.css';
import jsPDF from 'jspdf';

function Waitlist() {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    countryCode: '+66',
    phone: '',
    position: '',
    company: '',
    website: '',
    industry: '',
    priceRange: '',
    details: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. Create JSON
    const jsonData = JSON.stringify(form, null, 2);
    const jsonBlob = new Blob([jsonData], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = 'sample_summary.json';
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);

    // 2. Create PDF (SoW)
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Statement of Work (SoW)', 14, 18);
    doc.setFontSize(12);
    let y = 30;
    const addLine = (label, value) => {
      doc.text(`${label}: ${value || '-'}`, 14, y);
      y += 10;
    };
    addLine('Email', form.email);
    addLine('First Name', form.firstName);
    addLine('Last Name', form.lastName);
    addLine('Country Code', form.countryCode);
    addLine('Phone', form.phone);
    addLine('Position', form.position);
    addLine('Company', form.company);
    addLine('Website', form.website);
    addLine('Industry', form.industry);
    addLine('Price Range', form.priceRange);
    doc.text('Details:', 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(form.details || '-', 18, y, { maxWidth: 170 });
    doc.save('statement-of-work.pdf');
  };

  return (
    <div className="waitlist-container">
      <h1>ลงทะเบียนรอใช้งาน</h1>
      <p>ด้วย AI ของเรา</p>
      <form className="waitlist-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">📧</span>
            <input type="email" name="email" placeholder="อีเมล" required value={form.email} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">👤</span>
            <input type="text" name="firstName" placeholder="ชื่อ" required value={form.firstName} onChange={handleChange} />
          </div>
          <div className="input-with-icon">
            <span className="input-icon">👤</span>
            <input type="text" name="lastName" placeholder="นามสกุล" required value={form.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <select className="country-select" name="countryCode" value={form.countryCode} onChange={handleChange}>
            <option value="+66">+66 (Thailand)</option>
            {/* Add more country codes as needed */}
          </select>
          <div className="input-with-icon">
            <span className="input-icon">📞</span>
            <input type="tel" name="phone" placeholder="เบอร์โทรศัพท์" required value={form.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <select name="position" value={form.position} onChange={handleChange}>
            <option value="">เลือกตำแหน่งของคุณ</option>
            {/* Add more options */}
          </select>
        </div>
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">🏢</span>
            <input type="text" name="company" placeholder="ชื่อบริษัท" value={form.company} onChange={handleChange} />
          </div>
          <div className="input-with-icon">
            <span className="input-icon">🌐</span>
            <input type="url" name="website" placeholder="เว็บไซต์บริษัท (ไม่บังคับ)" value={form.website} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <select name="industry" value={form.industry} onChange={handleChange}>
            <option value="">เลือกอุตสาหกรรมของคุณ</option>
            {/* Add more options */}
          </select>
        </div>
        <div className="form-group">
          <select name="priceRange" value={form.priceRange} onChange={handleChange}>
            <option value="">ช่วงราคาที่คาดหวัง</option>
            {/* Add more options */}
          </select>
        </div>
        <div className="form-group">
          <textarea
            name="details"
            placeholder="บอกเราเกี่ยวกับความต้องการและความคาดหวังของคุณ (ไม่บังคับ)"
            value={form.details}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="submit-button">ลงทะเบียน</button>
      </form>
      <p className="disclaimer">
        การลงทะเบียนนี้ถือว่าคุณยอมรับที่จะรับข่าวสารและอีเมลการตลาดจากเรา คุณสามารถยกเลิกการรับข่าวสารได้ตลอดเวลา
      </p>
    </div>
  );
}

export default Waitlist;
