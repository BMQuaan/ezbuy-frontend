# 🛒 EZBuy Frontend – Website thương mại điện tử hiện đại

## 📘 Giới thiệu
**EZBuy** là hệ thống **website thương mại điện tử** cho phép người dùng mua sắm điện thoại và thiết bị điện tử trực tuyến.  
Dự án được tích hợp **mô-đun chatbot thông minh** hỗ trợ **tìm kiếm sản phẩm bằng hình ảnh**, giúp nâng cao trải nghiệm người dùng và tối ưu hóa quá trình mua sắm.

### 🔧 Công nghệ sử dụng
- **Next.js 14** (TypeScript, React Server Components, Tailwind CSS 4)
- **Redux Toolkit** – quản lý trạng thái người dùng & giỏ hàng  
- **Axios** – giao tiếp với backend Spring Boot REST API  
- **Chatbot AI** – gợi ý sản phẩm dựa trên hình ảnh (CNN Classifier)

---

## 🚀 Cài đặt và chạy dự án Frontend

### 1️⃣ Clone repository
```bash
git clone https://github.com/liambui11/ezbuy_frontend.git
cd ezbuy_frontend
```

### 2. Cài đặt phụ thuộc
```bash
npm install
```

### 3. Cấu hình các biến môi trường
Tạo file `.env` tại thư mục gốc và thêm nội dung:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8081
```
⚠️ Thay đổi URL tùy theo địa chỉ backend của bạn.

### 4. Khởi chạy dự án
```bash
npm run dev
```

## 👥 Nhóm Thực Hiện
- Nguyễn Ngọc Long - N22DCCN149
- Bùi Kinh Luân - N22DCCN151
- Bùi Minh Quân - N22DCCN163

## 📄 License
Dự án được thực hiện với mục đích học tập
