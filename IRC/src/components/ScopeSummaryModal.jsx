import React from 'react';
import './ScopeSummaryModal.css';

const questionLabels = {
  COMPANY_PROFILE: 'ชื่อบริษัท',
  BUSINESS_PROBLEM: 'ปัญหาที่พบ',
  PROPOSE_OF_PROJECTS: 'เกี่ยวกับบริษัท',
  BUDGET: 'งบประมาณ'
};

function ScopeSummaryModal({ open, onClose, summary }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>สรุป Scope งาน</h2>
        <div className="summary-content">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="summary-item">
              <h3>{questionLabels[key] || key}</h3>
              <p>{value}</p>
            </div>
          ))}
        </div>
        <button className="modal-close-btn" onClick={onClose}>ปิด</button>
      </div>
    </div>
  );
}

export default ScopeSummaryModal; 