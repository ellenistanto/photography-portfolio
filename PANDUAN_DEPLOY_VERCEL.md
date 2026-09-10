# 🌐 Panduan Lengkap Deploy Portfolio & Admin ke Vercel (100% Gratis & Tanpa Kartu Kredit)

Panduan langkah demi langkah untuk membuat website portfolio dan dashboard admin kamu online langsung di **Vercel** dalam **satu proyek tunggal (Fullstack)**.

> ⭐ **Kenapa Cara Ini Paling Praktis?**
> - **100% Gratis & Tanpa Kartu Kredit**: Vercel sama sekali tidak meminta kartu kredit untuk akun gratis.
> - **Satu Tempat**: Frontend dan Backend Express berjalan bersamaan di Vercel (*Serverless Functions*).
> - **Bebas Masalah CORS**: Karena berjalan di domain yang sama (`https://nama-web.vercel.app`), tidak ada kendala koneksi antara frontend dan backend.

---

## 🏗️ Cara Kerja Sistem di Vercel

Semua berjalan di dalam **1 Proyek Vercel**:
- **Halaman Web & Dashboard**: Disajikan oleh Vite + React.
- **API Backend (`/api/*`)**: Dijalankan oleh Express via Vercel Serverless Function (`api/index.js`).
- **Database**: Terhubung langsung ke **MongoDB Atlas** (Cloud Database yang sudah aktif).

---

## 📋 Langkah-Langkah Deployment

1. [Langkah 1: Push Proyek ke GitHub](#-langkah-1-push-proyek-ke-github)
2. [Langkah 2: Deploy ke Vercel](#-langkah-2-deploy-ke-vercel)
3. [Langkah 3: Uji Coba & Cara Akses](#-langkah-3-uji-coba--cara-akses)
4. [Tips Tambahan: Penyimpanan Foto Online (ImgBB / Cloud)](#-tips-tambahan-penyimpanan-foto-online)

---

## 🚀 Langkah 1: Push Proyek ke GitHub

Vercel akan mengambil kode website langsung dari akun GitHub kamu.

### 1.1 Buat Repositori Baru di GitHub
1. Buka **[github.com/new](https://github.com/new)** (login ke GitHub).
2. Beri nama repository, misalnya: `photography-portfolio`.
3. Pilih **Private** (disarankan agar kode dashboard admin tetap privat) atau **Public**.
4. Biarkan opsi lain kosong (jangan centang README, .gitignore, atau lisensi).
5. Klik tombol hijau **Create repository**.

### 1.2 Upload Kode dari Komputer via Terminal
Buka terminal PowerShell di folder proyek (`d:\Learn Coding\Vibe Coding\photography-portfolio`) dan jalankan perintah ini secara berurutan:

```powershell
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua file (file .env aman tidak akan ter-upload karena sudah diproteksi .gitignore)
git add .

# 3. Buat commit
git commit -m "feat: fullstack portfolio and admin dashboard for vercel"

# 4. Ganti branch utama menjadi main
git branch -M main

# 5. Hubungkan ke GitHub kamu (GANTI 'USERNAME' dengan username GitHub kamu!)
git remote add origin https://github.com/USERNAME/photography-portfolio.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## ⚡ Langkah 2: Deploy ke Vercel

1. Buka **[vercel.com](https://vercel.com)** dan klik **Sign Up / Log In** menggunakan akun **GitHub** kamu.
2. Di dashboard Vercel, klik tombol **Add New...** di kanan atas, lalu pilih **Project**.
3. Di daftar repository yang muncul, cari repository `photography-portfolio` lalu klik tombol **Import**.
4. Konfigurasi Project:
   - **Project Name**: `ellen-istanto-portfolio` (bisa kamu ubah sesuai selera).
   - **Framework Preset**: **Vite** *(otomatis terdeteksi)*.
   - **Root Directory**: `./` *(biarkan default)*.

5. Buka bagian **Environment Variables** (klik tanda panah dropdown) dan tambahkan 3 variabel penting berikut:

| Key (Nama Variabel) | Value (Nilai) | Keterangan |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://ellengifaistanto_db_user:S7CFJehSkJqoOMGA@cluster0.3qxqbiv.mongodb.net/portfolio-db?retryWrites=true&w=majority` | Connection string MongoDB Atlas kamu |
| `JWT_SECRET` | `t6Fj4icKwQj1vmidWrauQ071eRjiYg30rk5TSvOSx5V` | Kunci rahasia token login admin |
| `ADMIN_PASSWORD` | `Ellen6969` | Password untuk login ke dashboard admin |

*(Cara menambahkannya: ketik Key dan Value, lalu klik tombol **Add** untuk setiap baris).*

6. Klik tombol biru **Deploy**!
7. Tunggu sekitar 1 menit hingga proses build selesai dan muncul animasi perayaan 🎉.
8. Klik tombol **Continue to Dashboard** atau langsung klik URL website yang diberikan (contoh: `https://ellen-istanto-portfolio.vercel.app`).

---

## 🎉 Langkah 3: Uji Coba & Cara Akses

### 1. Website Publik (Portfolio Kamu)
Buka URL Vercel kamu:  
👉 **`https://nama-project-kamu.vercel.app`**
- Halaman portfolio langsung memuat foto, bio, statistik, dan logo klien dari database MongoDB Atlas.
- Link ini yang bisa kamu bagikan ke klien atau pasang di media sosial!

### 2. Dashboard Admin Pribadi
Buka URL admin di browser:  
👉 **`https://nama-project-kamu.vercel.app/admin`**
1. Masukkan password admin kamu: `Ellen6969`.
2. Klik **Masuk ke Dashboard**.
3. Dari dashboard ini kamu bisa:
   - **Tambah Foto Baru**: Tarik & lepas foto (*Drag & drop*) atau masukkan link gambar.
   - **Atur Urutan Galeri**: Tarik kartu foto atau gunakan tombol panah `⬆ / ⬇` untuk mengatur posisi foto di galeri.
   - **Ubah Bio & Profil**: Edit teks bio, lokasi, dan kontak kapan saja.
   - **Edit Statistik & Klien**: Perbarui jumlah project, festival musik, dan brand partner.

> 💡 **Instan**: Setiap kali kamu menekan tombol *Save* di dashboard, perubahan langsung otomatis tampil di halaman utama portfolio secara *real-time*!

---

## 📸 Tips Tambahan: Penyimpanan Foto Online

Ketika kamu mengunggah foto baru lewat menu Drag & Drop di Vercel:

1. **Secara Default (Tanpa Setting Tambahan)**:
   - Foto otomatis dikonversi dan disimpan langsung ke dalam **MongoDB Atlas** sebagai data gambar.
   - Database MongoDB Atlas gratis kamu memiliki kapasitas **512 MB**, sangat cukup untuk ratusan foto web.

2. **Opsi Tambahan (CDN Eksternal Gratis via ImgBB)**:
   - Jika ingin foto disimpan di server CDN gambar berkecepatan tinggi secara permanen:
     1. Buka **[api.imgbb.com](https://api.imgbb.com)** (100% gratis, tanpa kartu kredit).
     2. Klik **Get API Key** dan copy API key yang muncul.
     3. Di dashboard Vercel kamu, buka **Settings** -> **Environment Variables** -> Tambahkan:
        - Key: `IMGBB_API_KEY`
        - Value: *(API Key dari ImgBB)*
     4. Klik **Save**. Foto yang kamu drag & drop akan otomatis di-upload ke CDN ImgBB!

---

## ❓ FAQ & Troubleshooting

### Q: Apakah halaman `/admin` bisa di-refresh tanpa error 404?
**Bisa!** Proyek ini sudah dikonfigurasi dengan file `vercel.json` yang secara otomatis mengarahkan semua rute halaman React ke `index.html` dan rute API ke `api/index.js`.

### Q: Apakah saya bisa menggunakan domain sendiri (misal `ellenistanto.com`)?
**Bisa banget!** Di dashboard Vercel, buka menu **Settings** -> **Domains**, lalu ketik nama domain yang kamu miliki. Vercel akan memandu kamu mengatur DNS records secara gratis dengan sertifikat SSL (HTTPS) otomatis.
