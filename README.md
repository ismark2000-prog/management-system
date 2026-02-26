# 質當物品與客戶管理系統 (Internal Pawnshop Management System)

這是一個為典當行設計的內部管理系統，具備客戶建檔、物品登錄、利息計算與滿當警示功能。

## 核心功能
1.  **客戶管理**：紀錄姓名、電話、身分證字號。
2.  **物品登錄**：紀錄名稱、描述、上傳照片、核貸金額、收當與滿當日期。
3.  **自動計算**：系統自動依據「月息 2%」計算每月應繳利息。
4.  **智能警示**：首頁儀表板自動標示滿當期剩下不到 5 天的筆紀錄（紅色警示）。

## 技術棧
- **後端**：Node.js, Express, SQLite3, Multer, Day.js
- **前端**：React, Vite, Tailwind CSS, Axios, Lucide-React

## 運行說明

### 1. 安裝依賴
在根目錄下，分別進入 `backend` 與 `frontend` 資料夾執行安裝：
```bash
# 後端安裝
cd backend
npm install

# 前端安裝
cd ../frontend
npm install
```

### 2. 編譯前端
為了讓後端能直接服務前端，請先編譯前端程式碼：
```bash
cd frontend
npm run build
```

### 3. 啟動服務
返回後端資料夾並啟動伺服器：
```bash
cd ../backend
node server.js
```
伺服器將在 `http://localhost:5000` 運行。

## 資料庫結構
- **customers**: `id`, `name`, `phone`, `id_number`
- **items**: `id`, `customer_id`, `name`, `description`, `photo_path`, `loan_amount`, `loan_date`, `expiry_date`
