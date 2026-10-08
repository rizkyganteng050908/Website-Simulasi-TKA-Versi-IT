// Bank Soal TKA - Bidang IT / PPLG
const soal = [
    {
        teks: "1. Apa kepanjangan dari PPLG?",
        pilihan: ["Pengembangan Perangkat Lunak dan Gim", "Pemrograman Perangkat Lunak dan Gim", "Pengembangan Program Logika dan Gim", "Pemrograman Logika dan Gim"],
        benar: 0
    },
    {
        teks: "2. Manakah yang termasuk bahasa pemrograman?",
        pilihan: ["HTML", "CSS", "Python", "JSON"],
        benar: 2
    },
    {
        teks: "3. Simbol apa yang digunakan untuk menutup blok kode pada bahasa pemrograman berbasis C/PHP?",
        pilihan: ["()", "[]", "{}", "<>"],
        benar: 2
    },
    {
        teks: "4. Perintah SQL untuk mengambil data dari tabel adalah...",
        pilihan: ["GET", "OPEN", "SELECT", "FETCH"],
        benar: 2
    },
    {
        teks: "5. Struktur perulangan yang akan menjalankan kode minimal satu kali adalah...",
        pilihan: ["for", "while", "do...while", "if"],
        benar: 2
    },
    {
        teks: "6. HTTP adalah singkatan dari...",
        pilihan: ["Hyper Text Transfer Protocol", "High Tech Transfer Protocol", "Hyper Text Transit Protocol", "Home Tool Transfer Protocol"],
        benar: 0
    },
    {
        teks: "7. Manakah yang berfungsi menyimpan data sementara di sisi klien pada web?",
        pilihan: ["Database", "Cookie", "Session", "Server"],
        benar: 1
    },
    {
        teks: "8. Tipe data yang digunakan untuk menyimpan nilai benar/salah disebut...",
        pilihan: ["String", "Integer", "Boolean", "Float"],
        benar: 2
    },
    {
        teks: "9. Metode pengiriman data formulir yang terlihat di URL adalah...",
        pilihan: ["POST", "GET", "SEND", "PUT"],
        benar: 1
    },
    {
        teks: "10. Fungsi utama dari CSS adalah...",
        pilihan: ["Logika pemrograman", "Struktur halaman", "Tampilan & tata letak", "Koneksi database"],
        benar: 2
    }
];

// Variabel Global
let nomorSekarang = 0;
let jawabanUser = Array(soal.length).fill(null);
let sisaWaktu = 60 * 60;
let timerInterval;

// Elemen DOM
const layarMulai = document.getElementById('start-screen');
const layarKuis = document.getElementById('quiz-screen');
const layarHasil = document.getElementById('hasil-screen');
const teksSoal = document.getElementById('teks-soal');
const daftarJawaban = document.getElementById('daftar-jawaban');
const nomorSoalEl = document.getElementById('nomor-soal');
const progressFill = document.getElementById('progress-fill');
const timerEl = document.getElementById('timer');

// Tombol
document.getElementById('btn-mulai').addEventListener('click', mulaiUjian);
document.getElementById('btn-sebelumnya').addEventListener('click', soalSebelumnya);
document.getElementById('btn-berikutnya').addEventListener('click', soalBerikutnya);
document.getElementById('btn-selesai').addEventListener('click', selesaikanUjian);
document.getElementById('btn-ulang').addEventListener('click', ulangiUjian);

function mulaiUjian() {
    nomorSekarang = 0;
    jawabanUser = Array(soal.length).fill(null);
    sisaWaktu = 60 * 60;
    
    gantiLayar(layarKuis);
    tampilkanSoal();
    mulaiTimer();
}

function gantiLayar(layarAktif) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    layarAktif.classList.add('active');
}

function tampilkanSoal() {
    const data = soal[nomorSekarang];
    nomorSoalEl.textContent = nomorSekarang + 1;
    teksSoal.textContent = data.teks;
    progressFill.style.width = `${((nomorSekarang + 1) / soal.length) * 100}%`;

    daftarJawaban.innerHTML = '';
    data.pilihan.forEach((pilihan, indeks) => {
        const div = document.createElement('label');
        div.className = 'jawaban-pilihan';
        if (jawabanUser[nomorSekarang] === indeks) {
            div.classList.add('terpilih');
        }
        div.innerHTML = `
            <input type="radio" name="jawaban" value="${indeks}" style="display:none">
            ${String.fromCharCode(65 + indeks)}. ${pilihan}
        `;
        div.addEventListener('click', () => pilihJawaban(indeks));
        daftarJawaban.appendChild(div);
    });

    document.getElementById('btn-sebelumnya').style.display = nomorSekarang === 0 ? 'none' : 'inline-block';
    document.getElementById('btn-berikutnya').style.display = nomorSekarang === soal.length - 1 ? 'none' : 'inline-block';
    document.getElementById('btn-selesai').style.display = nomorSekarang === soal.length - 1 ? 'inline-block' : 'none';
}

function pilihJawaban(indeks) {
    jawabanUser[nomorSekarang] = indeks;
    document.querySelectorAll('.jawaban-pilihan').forEach((el, i) => {
        el.classList.toggle('terpilih', i === indeks);
    });
}

function soalBerikutnya() {
    if (nomorSekarang < soal.length - 1) {
        nomorSekarang++;
        tampilkanSoal();
    }
}

function soalSebelumnya() {
    if (nomorSekarang > 0) {
        nomorSekarang--;
        tampilkanSoal();
    }
}

function mulaiTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        sisaWaktu--;
        const menit = Math.floor(sisaWaktu / 60);
        const detik = sisaWaktu % 60;
        timerEl.textContent = `${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`;
        
        if (sisaWaktu <= 0) {
            clearInterval(timerInterval);
            alert('Waktu habis!');
            selesaikanUjian();
        }
    }, 1000);
}

function selesaikanUjian() {
    clearInterval(timerInterval);
    
    let benar = 0, salah = 0, kosong = 0;
    jawabanUser.forEach((jawab, i) => {
        if (jawab === null) kosong++;
        else if (jawab === soal[i].benar) benar++;
        else salah++;
    });

    const nilai = Math.round((benar / soal.length) * 100);
    const lulus = nilai >= 70;

    document.getElementById('nilai-akhir').textContent = nilai;
    document.getElementById('jml-benar').textContent = benar;
    document.getElementById('jml-salah').textContent = salah;
    document.getElementById('jml-kosong').textContent = kosong;
    document.getElementById('status-lulus').textContent = lulus ? '✅ Selamat! Kamu Lulus!' : '❌ Belum Lulus, coba lagi ya!';
    document.getElementById('status-lulus').style.color = lulus ? '#27ae60' : '#e74c3c';

    gantiLayar(layarHasil);
}

function ulangiUjian() {
    gantiLayar(layarMulai);
}
