# Dokumentasi API Campus Care

Dokumen ini berisi spesifikasi formal API untuk aplikasi Campus Care. API ini dibangun menggunakan framework Laravel dan mengembalikan respons dalam format JSON.

## Base URL
Secara default, semua endpoint untuk API diakses melalui path `/api`.
Contoh: `http://localhost:8000/api`

## Autentikasi
Beberapa endpoint memerlukan autentikasi. Anda dapat menyertakan token yang didapat setelah berhasil login menggunakan salah satu dari cara berikut:

| Metode | Format |
|---|---|
| Header Authorization | `Authorization: Bearer <token>` |
| Header Custom | `X-Auth-Token: <token>` |
| Query Parameter | `?token=<token>` |

---

## 1. Auth & Profil

### 1.1 Health Check
Mengecek status API dan memastikan layanan berjalan.
- **Endpoint**: `GET /health`
- **Response Sukses** (200 OK):
  ```json
  {
      "ok": true,
      "service": "Campus Care API",
      "time": "2026-06-10 10:20:00"
  }
  ```

### 1.2 Login
Autentikasi pengguna ke dalam sistem dan mendapatkan token.
- **Endpoint**: `POST /login`

**Body Request** (`application/json` atau `multipart/form-data`)
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `email` | string | Ya | Email terdaftar pengguna. |
| `password` | string | Ya | Kata sandi pengguna. |
| `role` | string | Tidak | Role pengguna (pilihan: `student`, `technician`, `admin`). |

- **Response Sukses** (200 OK):
  ```json
  {
      "message": "Login berhasil.",
      "user": {
          "id": 1,
          "name": "Budi",
          "email": "budi@example.com",
          "role": "student"
      },
      "token": "base64_encoded_token_string"
  }
  ```
- **Response Gagal** (422 Unprocessable Entity):
  - Jika kredensial salah: `{"message": "Email atau kata sandi salah."}`
  - Jika role tidak cocok: `{"message": "Role tidak cocok dengan akun."}`

### 1.3 Register
Mendaftarkan akun pengguna baru.
- **Endpoint**: `POST /register`

**Body Request**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `name` | string | Ya | Nama lengkap (maksimal 255 karakter). |
| `email` | string | Ya | Alamat email (unik, maksimal 255 karakter). |
| `password` | string | Ya | Kata sandi (minimal 4 karakter). |
| `role` | string | Ya | Peran pengguna (`student`, `technician`, `admin`). |

- **Response Sukses** (201 Created):
  ```json
  {
      "message": "Registrasi berhasil.",
      "user": {
          "id": 2,
          "name": "Siti",
          "email": "siti@example.com",
          "role": "technician"
      },
      "token": "base64_encoded_token_string"
  }
  ```

### 1.4 Get Profile (Me)
Mendapatkan data profil dari pengguna yang sedang login.
- **Endpoint**: `GET /me`
- **Headers**: Token Autentikasi (wajib)

- **Response Sukses** (200 OK):
  ```json
  {
      "user": {
          "id": 1,
          "name": "Budi",
          "email": "budi@example.com",
          "role": "student"
      }
  }
  ```
- **Response Gagal** (401 Unauthorized):
  `{"message": "Belum login."}`

### 1.5 Logout
Mengakhiri sesi pengguna.
- **Endpoint**: `POST /logout`

- **Response Sukses** (200 OK):
  ```json
  {
      "message": "Logout berhasil."
  }
  ```

---

## 2. Laporan & Dashboard

### 2.1 Dashboard
Mendapatkan ringkasan statistik, daftar laporan terbaru, dan notifikasi untuk ditampilkan di dashboard.
- **Endpoint**: `GET /dashboard/{role}`

**Path Parameters**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `role` | string | Ya | Peran pengguna saat ini (mempengaruhi data yang ditampilkan). |

- **Response Sukses** (200 OK):
  ```json
  {
      "role": "student",
      "stats": {
          "pending": 5,
          "verified": 2,
          "assigned": 3,
          "repairing": 1,
          "completed": 10,
          "total": 21
      },
      "recent_reports": [ /* Array object laporan terbaru (maksimal 5) */ ],
      "notifications": [ /* Array object notifikasi */ ]
  }
  ```

### 2.2 Daftar Laporan
Mendapatkan daftar seluruh laporan, mendukung pencarian dan pemfilteran.
- **Endpoint**: `GET /reports`

**Query Parameters**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `q` | string | Tidak | Kata kunci pencarian (judul, lokasi, kategori). |
| `status` | string | Tidak | Filter laporan berdasarkan status spesifik. |

- **Response Sukses** (200 OK):
  ```json
  {
      "data": [ /* Array object laporan */ ]
  }
  ```

### 2.3 Buat Laporan Baru
Mengirimkan laporan kerusakan atau masalah fasilitas baru.
- **Endpoint**: `POST /reports`

**Body Request**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | Ya | Judul laporan (maksimal 255 karakter). |
| `description` | string | Ya | Deskripsi detail dari masalah. |
| `location` | string | Ya | Lokasi atau gedung (maksimal 255 karakter). |
| `category` | string | Ya | Kategori masalah (maksimal 255 karakter). |
| `image_url` | string | Tidak | URL gambar pendukung laporan. |
| `reporter_name` | string | Tidak | Nama pelapor (jika kosong tercatat "Anonim"). |
| `reporter_email`| string | Tidak | Email kontak pelapor. |

- **Response Sukses** (201 Created):
  ```json
  {
      "message": "Laporan berhasil dibuat.",
      "data": { /* Object laporan yang baru dibuat beserta data timeline */ }
  }
  ```

### 2.4 Detail Laporan
Mendapatkan informasi spesifik dan detail dari satu laporan berdasarkan kode unik.
- **Endpoint**: `GET /reports/{code}`

**Path Parameters**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `code` | string | Ya | Kode laporan (contoh: `REP-001`). |

- **Response Sukses** (200 OK):
  ```json
  {
      "data": { 
          /* Detail laporan */
          "timeline": [ /* Riwayat status laporan */ ],
          "comments": [ /* Daftar komentar laporan */ ]
      }
  }
  ```
- **Response Gagal** (404 Not Found):
  `{"message": "Laporan tidak ditemukan."}`

### 2.5 Update Laporan
Memperbarui informasi atau status pada laporan yang sudah ada.
- **Endpoint**: `PATCH /reports/{code}` atau `PUT /reports/{code}`

**Path Parameters**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `code` | string | Ya | Kode laporan. |

**Body Request**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `title` | string | Tidak | Judul laporan. |
| `description` | string | Tidak | Deskripsi laporan. |
| `location` | string | Tidak | Lokasi laporan. |
| `category` | string | Tidak | Kategori laporan. |
| `status` | string | Tidak | Status (`Pending`, `Verified`, `Assigned`, `Repairing`, `Completed`, `Cancelled`). |
| `technician_name`| string | Tidak | Nama teknisi yang ditugaskan. |
| `facility_name` | string | Tidak | Nama fasilitas. |
| `image_url` | string | Tidak | URL gambar. |

- **Response Sukses** (200 OK):
  ```json
  {
      "data": { /* Object laporan yang telah diperbarui */ }
  }
  ```

---

## 3. Data Referensi & Analitik

### 3.1 Daftar Teknisi
Menyajikan daftar teknisi beserta informasi spesialisasi dan statusnya.
- **Endpoint**: `GET /technicians`

- **Response Sukses** (200 OK):
  ```json
  {
      "data": [
          {
              "id": 1,
              "name": "Ahmad Subarjo",
              "specialty": "Kelistrikan",
              "status": "Active",
              "rating": 4.8,
              "tasks": 5
          }
      ]
  }
  ```

### 3.2 Daftar Fasilitas
Menyajikan daftar fasilitas kampus beserta kondisi terkininya.
- **Endpoint**: `GET /facilities`

- **Response Sukses** (200 OK):
  ```json
  {
      "data": [
          {
              "id": 1,
              "name": "Gedung A (Rektorat)",
              "type": "Administrasi",
              "rooms": 45,
              "status": "Good",
              "maintenance": "12 Mei 2026"
          }
      ]
  }
  ```

### 3.3 Notifikasi
Mengambil notifikasi terkini bagi pengguna berdasarkan perannya.
- **Endpoint**: `GET /notifications`

**Query Parameters**
| Parameter | Tipe Data | Wajib | Keterangan |
|---|---|---|---|
| `role` | string | Tidak | Peran pengguna. Default `student`. |

- **Response Sukses** (200 OK):
  ```json
  {
      "data": [ /* Array object notifikasi */ ]
  }
  ```

### 3.4 Analitik
Mendapatkan ringkasan komprehensif data laporan untuk kebutuhan analitik (cocok untuk peran admin/manajemen).
- **Endpoint**: `GET /analytics`

- **Response Sukses** (200 OK):
  ```json
  {
      "overview": {
          "total_reports": 100,
          "completion_rate": 85.5,
          "active_technicians": 5,
          "facilities_needing_attention": 2
      },
      "by_status": {
          "Pending": 10,
          "Verified": 5,
          "Assigned": 5,
          "Repairing": 5,
          "Completed": 75
      },
      "by_category": [ /* Array agregat kategori */ ],
      "recent_trend": [ /* Array tren laporan terbaru */ ]
  }
  ```

### 3.5 Pengaturan (Settings)
Mendapatkan konfigurasi umum sistem.
- **Endpoint**: `GET /settings`

- **Response Sukses** (200 OK):
  ```json
  {
      "data": {
          "app_name": "Campus Care",
          "notification_email": "support@campus-care.test",
          "auto_assign": true,
          "maintenance_mode": false
      }
  }
  ```
