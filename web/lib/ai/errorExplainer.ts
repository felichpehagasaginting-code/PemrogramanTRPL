export interface ExplainedError {
  title: string;
  explanation: string;
  suggestion: string;
  mentorNote: string;
  icon: string;
}

export function explainPythonError(rawError: string): ExplainedError {
  const errStr = rawError.trim();

  if (/IndentationError/i.test(errStr)) {
    return {
      title: "📐 Masalah Indentasi: Posisi Baris Kurang Rapi (IndentationError)",
      explanation:
        "Santai, ini 'makanan sehari-hari' anak IT! Di Python, spasi di awal baris itu ibarat paragraf baru: menentukan siapa milik siapa. Baris ini agak melenceng atau terlalu maju dibanding bos bloknya.",
      suggestion:
        "Pastikan kode di dalam blok `if`, `for`, `while`, atau `def` menjorok 4 spasi ke dalam (cukup tekan tombol Tab 1x di keyboard).",
      mentorNote: "💡 Analogi: Seperti menyusun buku di rak, yang satu bab harus masuk ke dalam laci yang sama.",
      icon: "📐",
    };
  }

  if (/SyntaxError/i.test(errStr)) {
    let specific = "Ada sedikit kekeliruan tata bahasa Python (syntax).";
    let mentorNote = "💡 Analogi: Mirip kamu nulis kalimat Bahasa Indonesia tapi kelupaan tanda titik di ujung kalimat.";
    
    if (errStr.includes("expected ':'") || errStr.includes("invalid syntax")) {
      specific = "Kemungkinan besar kamu kelupaan menaruh tanda titik dua `:` di ujung baris `if`, `else`, `for`, `while`, atau `def`.";
      mentorNote = "💡 Tips Mentor: Setiap kali kamu buka blok baru (`if`, `for`, `def`), jangan lupa akhiri baris itu dengan tanda titik dua `:` ya!";
    } else if (errStr.includes("unterminated string literal")) {
      specific = "Kamu lupa menutup tanda petik `\"` atau `'` pada kalimat teks (string).";
      mentorNote = "💡 Tips Mentor: Kalau kamu buka kutip `\"Halo`, pastikan ditutup lagi jadi `\"Halo\"`.";
    }

    return {
      title: "✏️ Tata Bahasa Belum Pas (SyntaxError)",
      explanation: specific,
      suggestion:
        "Yuk cek baris yang ditunjuk, periksa kelengkapan tanda kurung `()`, titik dua `:`, dan tanda petik `\"\"`.",
      mentorNote,
      icon: "✏️",
    };
  }

  if (/NameError/i.test(errStr)) {
    const varMatch = errStr.match(/name '(\w+)' is not defined/);
    const varName = varMatch ? varMatch[1] : "variabel";

    return {
      title: `❓ Komputer Bingung: Variabel '${varName}' Belum Dikenal (NameError)`,
      explanation: `Kamu memanggil '${varName}', tapi komputernya belum tahu siapa itu karena belum pernah dibuat atau dideklarasikan sebelumnya.`,
      suggestion: `Pastikan kamu sudah membuat variabel '${varName} = ...' di baris atas sebelum memanggilnya, dan cek ejaan huruf besar/kecilnya ya (Python sangat peka huruf kapital).`,
      mentorNote: `💡 Analogi: Mirip manggil nama teman di kelas, tapi orangnya belum masuk absensi kelas.`,
      icon: "❓",
    };
  }

  if (/TypeError/i.test(errStr)) {
    return {
      title: "⚡ Tipe Data Kurang Cocok (TypeError)",
      explanation:
        "Kamu lagi coba mengoperasikan dua tipe data yang beda dunia (misalnya teks '10' ditambah angka 5 secara langsung tanpa diubah dulu).",
      suggestion:
        "Gunakan fungsi konversi: `int(...)` untuk ubah teks jadi angka bulat, atau `str(...)` untuk ubah angka jadi teks sebelum digabungkan.",
      mentorNote: "💡 Analogi: Gak bisa langsung mencampur minyak dan air tanpa emulsifier. Kamu butuh konversi tipe data dulu!",
      icon: "⚡",
    };
  }

  if (/ZeroDivisionError/i.test(errStr)) {
    return {
      title: "🚫 Pembagian dengan Angka Nol (ZeroDivisionError)",
      explanation: "Di dunia matematika maupun komputer, angka berapapun gak bisa dibagi dengan 0.",
      suggestion: "Coba pasang perlindungan `if pembagi != 0:` sebelum melakukan rumus pembagian `/`.",
      mentorNote: "💡 Analogi: Membagi 10 kue ke 0 orang, kuenya gak tahu harus dikasih ke siapa!",
      icon: "🚫",
    };
  }

  if (/IndexError/i.test(errStr)) {
    return {
      title: "🔢 Urutan Nomor Melewati Batas (IndexError)",
      explanation: "Kamu mencoba mengambil elemen List di nomor indeks yang melebihi jumlah data yang ada.",
      suggestion: "Ingat prinsip programmer: nomor urut (indeks) di Python selalu dimulai dari angka 0, bukan 1. Kalau isi list ada 3 barang, nomornya: 0, 1, 2.",
      mentorNote: "💡 Analogi: Ada 3 laci (0, 1, 2), tapi kodinganmu minta membuka laci nomor 3 atau lebih!",
      icon: "🔢",
    };
  }

  if (/KeyError/i.test(errStr)) {
    const keyMatch = errStr.match(/KeyError:\s*(['"]?)(.*?)\1/);
    const keyName = keyMatch ? keyMatch[2] : "kunci";
    return {
      title: `🔑 Kunci Dictionary Tidak Ditemukan (KeyError: '${keyName}')`,
      explanation: `Kamu memanggil kunci '${keyName}' dari Dictionary, padahal kunci tersebut belum pernah didaftarkan.`,
      suggestion: `Gunakan metode '.get("${keyName}")' yang lebih aman, atau periksa ejaan huruf besar/kecil kunci data kamu.`,
      mentorNote: "💡 Analogi: Seperti mencari kontak teman di buku telepon, tapi nomor dan namanya memang belum pernah dicatat.",
      icon: "🔑",
    };
  }

  if (/ValueError/i.test(errStr)) {
    return {
      title: "⚠️ Nilai Data Tidak Sesuai Format (ValueError)",
      explanation: "Fungsi menerima nilai yang tipe datanya benar, tapi isi nilainya tidak masuk akal untuk diproses (misal: int('halo') atau konversi teks bukan angka).",
      suggestion: "Pastikan input teks hanya berisi karakter angka jika ingin diubah ke integer dengan int().",
      mentorNote: "💡 Analogi: Toples toplesnya muat, tapi kamu maksa masukin batu ke toples garam!",
      icon: "⚠️",
    };
  }

  if (/AttributeError/i.test(errStr)) {
    return {
      title: "🧩 Perintah Tidak Dikenal pada Objek (AttributeError)",
      explanation: "Kamu memanggil metode atau fungsi bawaan yang tidak dimiliki oleh tipe data tersebut (contoh: string dipanggil .append() atau integer dipanggil .lower()).",
      suggestion: "Cek kembali tipe data variabelmu: .append() hanya untuk List, sedangkan .lower() hanya untuk String.",
      mentorNote: "💡 Analogi: Menekan tombol 'klakson' di sepeda ontel — fiturnya memang tidak tersedia!",
      icon: "🧩",
    };
  }

  if (/RecursionError|maximum recursion depth exceeded/i.test(errStr)) {
    return {
      title: "🌀 Fungsi Memanggil Dirinya Tanpa Henti (RecursionError)",
      explanation: "Fungsi memanggil dirinya sendiri terus-menerus tanpa ada kondisi henti (*base case*), sehingga memori tumpukan Python penuh.",
      suggestion: "Tambahkan kondisi `if kondisi_berhenti: return hasil` di baris paling awal fungsi.",
      mentorNote: "💡 Analogi: Dua cermin ditaruh berhadapan, pantulannya jadi tak terhingga!",
      icon: "🌀",
    };
  }

  if (/Timeout|ExecutionTimeout/i.test(errStr)) {
    return {
      title: "⏱️ Program Terlalu Asyik Berputar (Loop Timeout)",
      explanation: "Program kamu berjalan terlalu lama karena ada perulangan yang gak ada ujungnya (`infinite loop`).",
      suggestion: "Cek blok `while` kamu: pastikan kondisi `while` bisa berubah jadi `False`, atau tambahkan `break` di kondisi tertentu.",
      mentorNote: "💡 Tips Mentor: Jangan lupa tambahkan penambahan counter (misal `i += 1`) di dalam while loop!",
      icon: "⏱️",
    };
  }

  return {
    title: "💡 Ada Sedikit Tantangan Logika Nih!",
    explanation: "Tenang, jangan panik! Error itu tanda kamu lagi belajar hal baru. Kode kamu terhenti karena instruksinya belum sesuai harapan Python.",
    suggestion: "Baca pelan-pelan pesan di konsol terminal di atas, lalu telusuri baris kodinganmu dari atas ke bawah.",
    mentorNote: "💡 Senior Quote: 'Error bukan berarti kamu gagal, tapi kesempatan buat bikin kodinganmu lebih tangguh!'",
    icon: "💡",
  };
}

export function generateHint(code: string, taskDescription: string): string {
  const trimmed = code.trim();

  if (trimmed.length < 10) {
    return "💡 Halo! Mulailah dengan membuat variabel atau menulis baris kode pertama sesuai instruksi soal di sebelah kiri ya.";
  }

  if (!trimmed.includes("print")) {
    return "💡 Jangan lupa gunakan fungsi `print(...)` ya, biar hasil hitungan atau teks kodinganmu muncul di layar terminal!";
  }

  if (taskDescription.toLowerCase().includes("loop") || taskDescription.toLowerCase().includes("perulangan")) {
    if (!trimmed.includes("for") && !trimmed.includes("while")) {
      return "💡 Modul ini melatih perulangan! Coba manfaatkan sintaks `for i in range(...)` atau `while` agar komputermu mengulang otomatis.";
    }
  }

  if (taskDescription.toLowerCase().includes("if") || taskDescription.toLowerCase().includes("percabangan")) {
    if (!trimmed.includes("if")) {
      return "💡 Yuk gunakan struktur logika `if kondisi:` untuk menentukan keputusan pada program kamu.";
    }
  }

  return "💡 Kodinganmu sudah di jalur yang benar! Coba teliti format output cetakan, spasi, atau huruf besarnya ya!";
}

