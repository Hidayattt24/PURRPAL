<div align="center">
<img src="https://raw.githubusercontent.com/hidayattt24/purrpal/main/frontend/public/auth/login/logo.svg" alt="Logo PurrPal" width="150">
<br>
<h1><span style="font-size: 2em;">😻</span> PurrPal: Health Innovation for Your Feline Friend <span style="font-size: 2em;">🐾</span></h1>
<p>PurrPal adalah aplikasi inovatif yang dirancang untuk menjadi asisten kesehatan pribadi bagi kucing Anda. Kami memahami bahwa akses terbatas ke dokter hewan, terutama di daerah terpencil, dapat menjadi beban emosional dan praktis bagi pemilik kucing. Terinspirasi dari pengalaman nyata, PurrPal hadir untuk menjembatani kesenjangan ini dengan menyediakan solusi digital yang andal dan mudah diakses.</p>
</div>


## ✨ Fitur Utama

  - **🩺 Pengecek Gejala AI:** Dapatkan analisis gejala awal penyakit pada kucing Anda menggunakan model Machine Learning kami untuk panduan dan penanganan pertama.
  - **⛑️ Pemindai Kesehatan AI:** Unggah foto kucing Anda untuk mendapatkan prediksi awal kondisi kesehatan menggunakan model Computer Vision.
  - **💬 Chatbot Interaktif:** Ajukan pertanyaan seputar kesehatan dan perawatan kucing kepada chatbot cerdas berbasis AI Generatif yang siap membantu 24/7.
  - **🗺️ Peta Veteriner:** Temukan lokasi dokter hewan dan klinik terdekat dengan mudah melalui fitur peta interaktif kami.
  - **📚 Modul Edukasi:** Tingkatkan pengetahuan Anda tentang perawatan kucing melalui modul pembelajaran yang lengkap dan mudah dipahami.
  - **❤️ Kisah Komunitas:** Bagikan dan baca kisah-kisah inspiratif dari sesama pemilik kucing untuk saling menguatkan.

## 👥 Tim Kami (CC25-CF007)

Proyek ini merupakan bagian dari **Coding Camp 2025** dengan tema **Inovasi Kesehatan**.

| Peran | ID | Nama | Universitas |
| :--- | :--- | :--- | :--- |
| **Machine Learning** | `MC322D5Y1068` | Agil Mughni | Universitas Syiah Kuala |
| **Machine Learning** | `MC322D5Y2203` | Muhammad Khalid Al Ghifari | Universitas Syiah Kuala |
| **Machine Learning** | `MC322D5Y2301` | Ganang Setyo Hadi | Universitas Syiah Kuala |
| **Front End Back End** | `FC322D5Y1088` | Hidayat Nur Hakim | Universitas Syiah Kuala |
| **Front end Back end** | `FC322D5Y1122` | Muhammad Ridho | Universitas Syiah Kuala |

## 🛠️ Tumpukan Teknologi (Technology Stack)

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js (React), Tailwind CSS, Shadcn UI, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | Supabase (PostgreSQL) |
| **ML (Symptom Checker)** | Python, Flask, Scikit-learn, Pandas |
| **ML (Vision Service)** | Python, Flask, TensorFlow, Keras |
| **Chatbot** | Node.js, Express.js, Google Gemini API |
| **Deployment** | Vercel (Frontend), Google Cloud Run (Backend & ML Services) |

## 🚀 Penyiapan dan Instalasi Proyek

Untuk menjalankan proyek ini secara lokal, Anda perlu menyiapkan lima komponen utama: **Frontend**, **Backend**, **Chatbot**, **Tabular Service (ML)**, dan **Vision Service (ML)**.

-----

### **1. Backend (`/backend`)**

Menangani logika bisnis, otentikasi, dan sebagai gateway ke layanan lain.

1.  **Masuk ke direktori:**
    ```bash
    cd backend
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```
3.  **Buat file `.env`** dan isi dengan konfigurasi Anda.
    ```bash
    # Buat file .env
    touch .env
    ```
    **Isi file `.env`:**
    ```env
    PORT=8080
    SUPABASE_URL="YOUR_SUPABASE_URL"
    SUPABASE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    TABULAR_SERVICE_URL="http://127.0.0.1:5000"
    VISION_SERVICE_URL="http://127.0.0.1:5001"
    CHATBOT_SERVICE_URL="http://127.0.0.1:8081"
    ```
4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:8080`.

-----

### **2. Frontend (`/frontend`)**

Antarmuka pengguna yang dilihat oleh pengguna akhir.

1.  **Masuk ke direktori:**
    ```bash
    cd frontend
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```
3.  **Buat file `.env.local`** berdasarkan file `.env.local` yang ada (jika ini adalah clone baru).
    ```bash
    # Buat file .env.local
    touch .env.local
    ```
    **Isi file `.env.local`:**
    ```env
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_API_BASE_URL="http://localhost:8080/api"
    ```
4.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi akan dapat diakses di `http://localhost:3000`.

-----

### **3. Chatbot Service (`/backend/chatbot`)**

Layanan khusus untuk fungsionalitas chatbot dengan AI Generatif.

1.  **Masuk ke direktori:**
    ```bash
    cd backend/chatbot
    ```
2.  **Instal dependensi:**
    ```bash
    npm install
    ```
3.  **Buat file `.env`:**
    ```bash
    touch .env
    ```
    **Isi file `.env`:**
    ```env
    PORT=8081
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    ```
4.  **Jalankan server:**
    ```bash
    npm start
    ```
    Server chatbot akan berjalan di `http://localhost:8081`.

-----

### **4. ML - Tabular Service (`/ml-services/tabular-services`)**

API untuk model prediksi penyakit berdasarkan gejala (data tabular).

1.  **Masuk ke direktori:**
    ```bash
    cd ml-services/tabular-services
    ```
2.  **(Disarankan)** Buat dan aktifkan *virtual environment* Python:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Pada Windows: venv\Scripts\activate
    ```
3.  **Instal dependensi Python:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Jalankan server Flask:**
    ```bash
    python3 app.py
    ```
    Layanan akan berjalan di `http://127.0.0.1:5000`.

-----

### **5. ML - Vision Service (`/ml-services/vision-service`)**

API untuk model klasifikasi penyakit berdasarkan gambar mata kucing.

1.  **Masuk ke direktori:**
    ```bash
    cd ml-services/vision-service
    ```
2.  **(Disarankan)** Buat dan aktifkan *virtual environment* Python:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Pada Windows: venv\Scripts\activate
    ```
3.  **Instal dependensi Python:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Jalankan server Flask:**
    ```bash
    python3 app.py
    ```
    Layanan akan berjalan di `http://127.0.0.1:5001`.

## 📂 Struktur Proyek

Struktur repositori diatur ke dalam beberapa komponen utama untuk memisahkan tanggung jawab.

```
purrpal/
├── backend/
│   ├── src/
│   │   ├── config/          # Konfigurasi (Supabase, dll.)
│   │   ├── routes/          # Definisi endpoint API (user, ai, map)
│   │   ├── seed/            # Script untuk mengisi data awal
│   │   └── server.js        # Entry point server Express utama
│   ├── chatbot/             # Layanan chatbot mandiri
│   │   ├── src/
│   │   │   ├── chatbot.js   # Entry point server chatbot
│   │   │   └── config.js
│   │   └── package.json
│   └── supabase-schema.sql  # Skema database Supabase
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Routing & halaman (Next.js App Router)
│   │   ├── components/      # Komponen UI (Shadcn, MagicUI)
│   │   ├── lib/             # Fungsi utilitas, hooks, & config
│   │   └── middleware.ts    # Middleware Next.js untuk proteksi route
│   └── package.json
│
├── ml-research/
│   ├── tabular-analytics-engine/ # Riset & notebook untuk model gejala
│   └── image-recognition-engine/ # Riset & notebook untuk model gambar
│
├── ml-services/
│   ├── tabular-services/    # API (Flask) untuk model gejala
│   │   ├── app.py
│   │   └── model_handler.py
│   └── vision-service/      # API (Flask) untuk model gambar
│       ├── app.py
│       └── model_handler.py
│
└── README.md                # Dokumentasi ini 📝
```

## 🌐 Ringkasan API Endpoints

  - **Backend Gateway** (`localhost:8080`)
      - `POST /api/users/register` - Registrasi pengguna baru.
      - `POST /api/users/login` - Login pengguna.
      - `GET /api/location` - Mendapatkan semua data veteriner.
      - `POST /api/ai/predict/tabular` - Meneruskan request ke Tabular Service.
      - `POST /api/ai/predict/vision` - Meneruskan request ke Vision Service.
      - `POST /api/chatbot/chat` - Meneruskan request ke Chatbot Service.
  - **Tabular Service** (`localhost:5000`)
      - `POST /predict` - Memprediksi penyakit dari data gejala.
  - **Vision Service** (`localhost:5001`)
      - `POST /predict` - Memprediksi penyakit dari gambar.
  - **Chatbot Service** (`localhost:8081`)
      - `POST /chat` - Mengirim pesan ke chatbot dan menerima balasan.

-----

Terima kasih telah menjadi bagian dari perjalanan PurrPal untuk memberikan kehidupan yang lebih baik bagi setiap kucing 💖.
