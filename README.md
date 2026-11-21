# My Store: โปรเจกต์เริ่มต้น

โปรเจกต์เริ่มต้นของ Workshop "สร้างเว็บ E-commerce ด้วย Cursor Agent"

ในนี้ยังไม่มีหน้าเว็บหรือ component ใด ๆ คุณกับ agent จะสร้างทั้งหมดเองจาก brief ของลูกค้า

## เริ่มใช้งาน

ต้องมี Node.js 22.12 ขึ้นไป

```
npm install
npm run dev
```

เปิด `http://localhost:5173` ต้องเห็นข้อความ "My Store"

## คำสั่งตรวจงาน

| คำสั่ง | ตรวจอะไร |
| --- | --- |
| `npm run typecheck` | ชนิดข้อมูลของ TypeScript |
| `npm run lint` | รูปแบบโค้ดที่มักเป็นบั๊ก |
| `npm run test` | test ทั้งหมด |
| `npm run build` | สร้างไฟล์สำหรับนำขึ้นเว็บได้จริง |
| `npm run check` | รันทั้งสี่อย่างข้างบนต่อกัน |

งานทุก ticket ต้องผ่าน `npm run check` ก่อน commit

## ของที่อยู่ในโปรเจกต์

| ที่อยู่ | คืออะไร |
| --- | --- |
| `docs/brief/client-brief.md` | สิ่งที่ลูกค้าต้องการ เริ่มอ่านจากไฟล์นี้ |
| `docs/brief/design-notes.md` | สี ตัวอักษร โครงหน้า และข้อความบนเว็บ |
| `docs/brief/screenshots/` | ภาพหน้าจอจากทีมออกแบบ |
| `public/images/` | รูปแบนเนอร์และภาพโปรโมชัน |
| `AGENTS.md` | สิ่งที่ agent ต้องรู้ทุกครั้งที่เริ่มแชตใหม่ |
| `.agents/skills/` | skill ที่ใช้ใน Workshop: `/grill-me`, `/to-spec`, `/to-tickets`, `/implement` |
| `docs/agents/` | บอก skill ว่า spec และ ticket เก็บไว้ที่ไหน |
| `.env` | ที่อยู่ของ API |
| `src/` | โค้ดของแอป ตอนนี้มีแค่หน้าเปล่า |

spec และ ticket ที่คุณสร้างจะอยู่ในโฟลเดอร์ `.scratch/` ซึ่งจะเกิดขึ้นเองเมื่อรัน `/to-spec`

## ที่มาของ skill

skill ใน `.agents/skills/` มาจาก [mattpocock/skills](https://github.com/mattpocock/skills) รุ่น v1.3.2 ไม่ได้แก้ไข ใช้ตามสัญญาอนุญาต MIT ดูรายละเอียดใน `.agents/NOTICE.md`

## Deploy ขึ้น Vercel

1. Push repo ขึ้น GitHub แล้ว Import project ใน Vercel (Framework: Vite)
2. ตั้ง Environment Variable: `VITE_API_BASE_URL` (ตัวอย่าง: `https://dummyjson.com` ดู `.env.example`)
3. Deploy: Vercel รัน `npm run build` และเสิร์ฟโฟลเดอร์ `dist`; `vercel.json` มี rewrite ให้ทุก URL เปิดตรงหรือรีเฟรชได้

สำหรับรันในเครื่อง ให้คัดลอก `.env.example` เป็น `.env`
