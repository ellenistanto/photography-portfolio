# Panduan Kustomisasi Portofolio Fotografi (React.js + Vite)

Portofolio fotografi ini dibangun menggunakan **React.js & Vite** dengan styling **Modern Vanilla CSS** yang sangat cepat, responsif, dan ringan baik di ponsel (HP) maupun komputer desktop.

---

## 1. Cara Menjalankan Project

Buka terminal di folder project ini (`d:\Learn Coding\Vibe Coding\photography-portfolio`), lalu jalankan:

```bash
# 1. Install dependencies (hanya perlu sekali di awal)
npm install

# 2. Jalankan server lokal
npm run dev
```

Setelah itu buka link lokal yang muncul di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`) di browser Anda.

---

## 2. Cara Mengganti Foto Dummy dengan Foto Karya Anda

Semua data foto, teks, kategori, dan informasi kontak terpusat di satu file:
👉 **`src/data/portfolioData.js`**

### A. Menggunakan File Foto dari Komputer Anda:
1. Simpan foto-foto Anda di folder `public/images/` (buat foldernya jika belum ada). Contoh: `public/images/konser-1.jpg`.
2. Buka file `src/data/portfolioData.js`, cari array `photos: [...]`, lalu ubah:

```javascript
{
  id: "c1",
  title: "Frenzy in Red Light",
  category: "concerts",          // Kategori: 'concerts' | 'portraits' | 'people-places' | 'brands'
  categoryLabel: "Music & Concert",
  year: "2024",
  client: "Hindia Live Tour",
  aspect: "portrait",            // 'portrait' | 'landscape'
  image: "/images/konser-1.jpg", // <-- Path relatif dari folder public
  thumb: "/images/konser-1.jpg",
  description: "Energi panggung dalam cahaya merah membara."
},
```

### B. Menggunakan Link Foto Online (Unsplash, Cloudinary, Imgur, Google Drive):
Cukup tempelkan URL langsung gambar tersebut pada nilai `image` dan `thumb`.

---

## 3. Cara Mengubah Biodata & Nomor WhatsApp

Buka `src/data/portfolioData.js` pada bagian `profile`:

```javascript
profile: {
  name: "Nama Anda",
  tagline: "Concerts, Portraits, Travel, and Human moments in between.",
  shortBio: "Bio singkat Anda di sini...",
  aboutLong: [
    "Paragraf pertama tentang visi fotografi Anda...",
    "Paragraf kedua tentang pengalaman Anda..."
  ],
  location: "Jakarta, Indonesia",
  email: "emailanda@gmail.com",
  whatsapp: "6281234567890", // Awali dengan 62 (tanpa tanda +)
  instagram: "https://instagram.com/username_anda",
}
```

*Tombol WhatsApp di website sudah otomatis membuka chat langsung (`wa.me`) dengan nomor Anda!*

---

## 4. Cara Mengubah Klien, Statistik, & Garis Waktu Karir

Masih di `src/data/portfolioData.js`:
- **Klien / Partner Musik**: Edit daftar nama di array `clients: [...]`
- **Statistik Angka**: Ubah angka dan label di array `stats: [...]`
- **Garis Waktu Karir**: Ubah tahun dan cerita perjalanan di array `milestones: [...]`

---

## 5. Fitur Utama

- **Masonry Grid Responsif**: Tampilan 2-kolom editorial di desktop dan 1-kolom nyaman di HP.
- **Interactive Lightbox**: Klik gambar apapun untuk melihat layar penuh, navigasi panah keyboard (`<` dan `>`), tombol `Esc` untuk menutup, serta swipe sentuh di layar HP.
- **Filter Kategori Instan**: Navigasi mulus antar kategori (*All*, *Music & Concert*, *Portraits*, *People & Places*, *Brands & Products*).
- **Glassmorphism Header**: Efek transparan blur modern saat halaman di-scroll.
- **Mobile Menu Drawer**: Menu samping yang rapi dan responsif untuk pengguna smartphone.

---

## 6. Cara Build & Deploy ke Internet

Untuk membuat bundle siap hosting (HTML/CSS/JS statis yang sudah dioptimasi):

```bash
npm run build
```

Folder hasil build akan berada di folder `dist/`. Anda dapat langsung meng-upload folder `dist` tersebut ke **Vercel**, **Netlify**, **GitHub Pages**, atau cPanel Web Hosting secara gratis!
