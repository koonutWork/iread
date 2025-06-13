# iRead Customer AI Chat (IRC)

iRead Customer AI Chat (IRC) เป็นระบบที่ช่วยให้ผู้ใช้งานสามารถเก็บ Requirement ของโปรเจกต์ผ่านการสนทนากับ AI ได้อย่างสะดวกและรวดเร็ว พร้อมทั้งสามารถจัดการข้อมูล Requirement และประเมิน Manday ได้ในที่เดียว

---

## คุณสมบัติหลัก

1. **สมัครสมาชิกและเข้าสู่ระบบ**  
   - ผู้ใช้งานสามารถสมัครสมาชิกและเข้าสู่ระบบเพื่อเริ่มต้นใช้งานระบบได้อย่างปลอดภัย
   - ระบบตรวจสอบความถูกต้องของข้อมูล เช่น อีเมล และรหัสผ่าน

2. **เริ่มต้นสนทนา AI เพื่อเก็บ Requirement**  
   - ระบบ AI จะช่วยถามคำถามเพื่อเก็บข้อมูลสำคัญของโปรเจกต์ เช่น ชื่อบริษัท ปัญหาทางธุรกิจ จุดประสงค์ของโปรเจกต์ และงบประมาณ
   - ข้อมูลที่ได้จะถูกจัดเก็บในฐานข้อมูลเพื่อใช้งานในอนาคต

3. **เลือก Purpose ของโปรเจกต์**  
   - ผู้ใช้งานสามารถเลือกหมวดหมู่ของโปรเจกต์ เช่น `PRODUCT_DEV`, `MARKETING`, หรือ `MARKET_RESEARCH` เพื่อช่วยให้การวิเคราะห์ Requirement มีความแม่นยำมากขึ้น

4. **ดู/ดาวน์โหลด Scope Summary**  
   - ผู้ใช้งานสามารถดู Scope Summary ที่สรุปข้อมูล Requirement ทั้งหมดในรูปแบบ JSON หรือ PDF
   - ระบบรองรับการดาวน์โหลดไฟล์ JSON และ PDF เพื่อการใช้งานภายนอก

5. **ประเมิน Manday ด้วย Manday Matrix**  
   - ระบบมีฟีเจอร์ Manday Matrix ที่ช่วยให้ผู้ใช้งานสามารถประเมินจำนวน Manday ที่ต้องใช้ในโปรเจกต์
   - ผู้ใช้งานสามารถแก้ไขข้อมูลใน Manday Matrix ได้ตามความเหมาะสม

---
## การใช้งาน

1. สมัครสมาชิกและเข้าสู่ระบบ
2. เริ่มต้นสนทนา AI เพื่อเก็บ Requirement
3. เลือก Purpose ของโปรเจกต์
4. ดู/ดาวน์โหลด Scope Summary (JSON, PDF)
5. ประเมิน Manday ด้วย Manday Matrix (แก้ไขได้ในหน้า Manday Matrix)

## โครงสร้างโปรเจกต์



IRC/
├── src/
│ ├── components/
│ │ ├── ChatWindow.jsx
│ │ ├── MandayMatrix.jsx
│ │ ├── RegisterForm.jsx
│ │ └── ...
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Interview_Room.jsx
│ │ └── ...
│ └── App.jsx
├── main.py
└── README.md


---

## การติดตั้งและการใช้งาน
### 1. Extract node_modules.zip จาก .zip file ใน node_modules folder
### 2. ติดตั้ง Dependencies
รันคำสั่งต่อไปนี้ใน Terminal:
```bash
npm install
pip install -r [requirements.txt](http://_vscodecontentref_/2)
```
### 3. เริ่มต้น Backend
รันคำสั่งเพื่อเริ่มต้นเซิร์ฟเวอร์ FastAPI:
```bash
fastapi dev .\main.py     
```

### 4. เริ่มต้น Frontend
รันคำสั่งเพื่อเริ่มต้น React Development Server:
```bash
npm run dev  
```
### 5. เปิดใช้งานระบบ
เปิดเบราว์เซอร์และเข้าไปที่:
http://localhost:8000



API Endpoints
1. POST /auth/register
ใช้สำหรับสมัครสมาชิก
ข้อมูลที่ต้องส่ง: { "email": "example@email.com", "password": "securepassword" }
2. POST /auth/login
ใช้สำหรับเข้าสู่ระบบ
ข้อมูลที่ต้องส่ง: { "email": "example@email.com", "password": "securepassword" }
3. POST /ask
ใช้สำหรับส่งข้อความสนทนาไปยัง AI
ข้อมูลที่ต้องส่ง: { "messages": [{ "role": "user", "content": "ข้อความ" }] }


การพัฒนาเพิ่มเติม
1.เพิ่มการเข้ารหัสรหัสผ่าน
-ใช้ bcrypt เพื่อเข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล

2.เพิ่ม JWT Authentication
-ใช้ JWT เพื่อจัดการการเข้าสู่ระบบและการยืนยันตัวตน

3.เพิ่มการวิเคราะห์ Manday อัตโนมัติ
-ใช้ AI เพื่อช่วยวิเคราะห์ Manday จากข้อมูล Requirement



IDEที่ใช้
1.VSCode
2.Cusor
