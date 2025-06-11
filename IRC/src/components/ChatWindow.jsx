import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import ScopeSummaryModal from './ScopeSummaryModal';
import './ChatWindow.css';
import { jsPDF } from 'jspdf';
import { sendScopeSummary } from '../utils/api'; // Use the imported function

const questions = [
  { key: 'COMPANY_PROFILE', label: 'ชื่อบริษัทคุณ?', minLength: 2, followup: 'กรุณาระบุชื่อบริษัทให้ชัดเจนค่ะ' },
  { key: 'BUSINESS_PROBLEM', label: 'บริษัทเจอปัญหาอะไร?', minLength: 5, followup: 'ช่วยอธิบายปัญหาของบริษัทเพิ่มเติมหน่อยค่ะ' },
  { key: 'PROPOSE_OF_PROJECTS', label: 'จุดประสงค์ของโครงการ?', minLength: 5, followup: 'กรุณาอธิบายเกี่ยวกับบริษัทเพิ่มเติมค่ะ' },
  { key: 'BUDGET', label: 'งบประมาณที่ตั้งไว้?', minLength: 2, followup: 'กรุณาระบุงบประมาณที่ตั้งไว้ค่ะ' },
];

function isValidAnswer(answer, minLength) {
  if (!answer || answer.trim().length < minLength) return false;
  if (["-", "ไม่รู้", "ไม่แน่ใจ", "none", "no idea"].includes(answer.trim().toLowerCase())) return false;
  return true;
}

async function askAI(messages) {
  try {
    const res = await fetch('http://localhost:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to get AI response');
    }

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw error;
  }
}

function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'คุณคือ AI ที่ช่วยสัมภาษณ์เพื่อเก็บ Scope งาน' },
    { role: 'assistant', content: 'สวัสดีค่ะ! กรุณาบอกชื่อบริษัทของคุณ' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const [purpose, setPurpose] = useState('');
  const [showPurposeSelect, setShowPurposeSelect] = useState(false);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setTyping(true);
    setError(null);

    try {
      if (currentQuestion < questions.length) {
        const currentQ = questions[currentQuestion];
        if (isValidAnswer(userMessage, currentQ.minLength)) {
          setAnswers(prev => ({ ...prev, [currentQ.key]: userMessage }));
          setCurrentQuestion(prev => prev + 1);
          
           // Check if the current question is "จุดประสงค์ของโครงการ"
        if (currentQ.key === 'PROPOSE_OF_PROJECTS') {
          let category = '';
          if (userMessage.includes('ขาย')) {
            category = 'MARKETING';
          } else if (userMessage.includes('พัฒนา')) {
            category = 'PRODUCT_DEV';
          } else if (userMessage.includes('วิจัย')) {
            category = 'MARKET_RESEARCH';
          }

          // Add a chat bubble indicating the category
          setMessages(prevMessages => [
            ...prevMessages,
            { role: 'assistant', content: `หมวดหมู่ที่เหมาะสมคือ: ${category}` }
          ]);

          // Save the category in the state
          setAnswers(prev => ({ ...prev, category }));
        }

          
          if (currentQuestion + 1 < questions.length) {
            const nextQuestion = questions[currentQuestion + 1].label;
            setMessages([...newMessages, { role: 'assistant', content: nextQuestion }]);
          } else {
            const completionMessage = 'ขอบคุณสำหรับข้อมูลค่ะ! คุณสามารถดูสรุป Scope ได้โดยคลิกที่ปุ่ม "ดู Scope Summary"';
            setMessages([...newMessages, { role: 'assistant', content: completionMessage }]);
            // Ensure answers is fully updated before sending
            const finalAnswers = { ...answers, [currentQ.key]: userMessage }; // Make sure the last answer is included
            setAnswers(finalAnswers); // Update state
            await sendScopeSummary(finalAnswers); // Send the complete object
          }
        } else {
          setMessages([...newMessages, { role: 'assistant', content: currentQ.followup }]);
        }
      } else {
        const aiReply = await askAI(newMessages);
        setMessages([...newMessages, { role: 'assistant', content: aiReply }]);
      }
    } catch (error) {
      setError(error.message);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง' 
      }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="chat-window">
      <button
        onClick={async () => {
          const res = await sendScopeSummary({ company: "My Company", problem: "Pain point" });
          console.log(res);
        }}
      >
        ทดสอบส่ง Scope Summary
      </button>
      <div className="chat-header">AI Interview Room</div>
      <div className="chat-body">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} sender={msg.role === 'user' ? 'user' : 'bot'} message={msg.content} />
        ))}
        {typing && <TypingIndicator />}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            currentQuestion < questions.length
              ? questions[currentQuestion].label
              : 'พิมพ์ข้อความของคุณ...'
          }
          disabled={typing}
        />
        <button type="submit" className="chat-send-btn" disabled={typing}>ส่ง</button>
        <button 
          type="button" 
          className="chat-summary-btn" 
          onClick={() => {
            setModalOpen(true);
            // Add a chat bubble indicating the summary is being prepared
            setMessages(prevMessages => [
            ...prevMessages,
            { role: 'assistant', content: 'กำลังเตรียม Scope Summary...' }
            ]);


            // Generate JSON file
            const jsonData = JSON.stringify(answers, null, 2);
            const jsonBlob = new Blob([jsonData], { type: 'application/json' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.download = 'scope_summary.json';
            document.body.appendChild(jsonLink);
            jsonLink.click();
            document.body.removeChild(jsonLink);
            URL.revokeObjectURL(jsonUrl);

            // Generate PDF file
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Scope Summary', 14, 18);
            doc.setFontSize(12);
            let y = 30;
            Object.entries(answers).forEach(([key, value]) => {
              doc.text(`${key}: ${value || '-'}`, 14, y);
              y += 10;
            });
            doc.save('scope_summary.pdf');
          }}
          disabled={Object.keys(answers).length === 0}
        >
          ดู Scope Summary
        </button>
      </form>
      <ScopeSummaryModal open={modalOpen} onClose={() => setModalOpen(false)} summary={answers} />
    </div>
  );
}

export default ChatWindow;