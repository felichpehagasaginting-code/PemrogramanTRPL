export interface ExplainedError {
  title: string;
  explanation: string;
  suggestion: string;
  icon: string;
}

export function explainPythonError(rawError: string): ExplainedError {
  const errStr = rawError.trim();

  if (/IndentationError/i.test(errStr)) {
    return {
      title: "Peringatan Indentasi (IndentationError)",
      explanation:
        "Python menggunakan spasi di awal baris (indentasi) untuk menentukan blok kode. Baris ini sejajar atau terlalu maju dibanding baris sebelumnya.",
      suggestion:
        "Pastikan kode di dalam blok `if`, `for`, `while`, atau `def` berada 4 spasi ke dalam (tekan Tab 1x).",
      icon: "📐",
    };
  }

  if (/SyntaxError/i.test(errStr)) {
    let specific = "Ada kesalahan penulisan tata bahasa Python (syntax).";
    if (errStr.includes("expected ':'") || errStr.includes("invalid syntax")) {
      specific = "Kemungkinan kamu lupa menambahkan titik dua `:` di akhir baris `if`, `else`, `for`, atau `def`.";
    } else if (errStr.includes("unterminated string literal")) {
      specific = "Kamu lupa menutup tanda petik `\"` atau `'` pada kalimat string.";
    }

    return {
      title: "Kesalahan Penulisan (SyntaxError)",
      explanation: specific,
      suggestion:
        "Periksa kembali tanda kurung `()`, titik dua `:`, dan tanda petik `\"\"` di baris yang ditunjuk.",
      icon: "✏️",
    };
  }

  if (/NameError/i.test(errStr)) {
    const varMatch = errStr.match(/name '(\w+)' is not defined/);
    const varName = varMatch ? varMatch[1] : "variabel";

    return {
      title: `Variabel '${varName}' Belum Dibuat (NameError)`,
      explanation: `Kamu mencoba menggunakan ${varName}, tetapi Python belum mengenalinya karena belum dideklarasikan sebelumnya.`,
      suggestion: `Pastikan kamu sudah membuat variabel '${varName} = ...' sebelum memanggilnya, dan periksa ejaan huruf besar/kecil (case-sensitive).`,
      icon: "❓",
    };
  }

  if (/TypeError/i.test(errStr)) {
    return {
      title: "Ketidakcocokan Tipe Data (TypeError)",
      explanation:
        "Kamu mencoba menggabungkan atau mengoperasikan dua tipe data yang berbeda yang tidak kompatibel (misalnya menambah String dengan Integer tanpa konversi).",
      suggestion:
        "Gunakan fungsi `str()` untuk mengubah angka ke teks atau `int()` untuk mengubah teks ke angka sebelum dioperasikan.",
      icon: "⚡",
    };
  }

  if (/ZeroDivisionError/i.test(errStr)) {
    return {
      title: "Pembagian dengan Nol (ZeroDivisionError)",
      explanation: "Dalam matematika dan pemrograman, angka tidak bisa dibagi dengan 0.",
      suggestion: "Pastikan penyebut atau variabel pembagi nilainya bukan nol sebelum melakukan pembagian `/`.",
      icon: "🚫",
    };
  }

  if (/IndexError/i.test(errStr)) {
    return {
      title: "Posisi Indeks Di Luar Jangkauan (IndexError)",
      explanation: "Kamu mencoba mengambil elemen List di nomor indeks yang tidak ada.",
      suggestion: "Ingat bahwa indeks Python dimulai dari 0. Jika list memiliki 5 elemen, indeks terakhirnya adalah 4.",
      icon: "🔢",
    };
  }

  return {
    title: "Terjadi Error Eksekusi",
    explanation: "Kode kamu terhenti karena menemukan instruksi yang tidak valid.",
    suggestion: "Baca kembali baris pesan error dan periksa logika variabel serta tipe datanya.",
    icon: "💡",
  };
}

export function generateHint(code: string, taskDescription: string): string {
  const trimmed = code.trim();

  if (trimmed.length < 10) {
    return "💡 Petunjuk 1: Mulailah dengan membuat variabel atau menulis fungsi sesuai petunjuk soal.";
  }

  if (!trimmed.includes("print")) {
    return "💡 Petunjuk 2: Jangan lupa gunakan perintah `print(...)` untuk mencetak output ke layar.";
  }

  if (taskDescription.toLowerCase().includes("loop") || taskDescription.toLowerCase().includes("perulangan")) {
    if (!trimmed.includes("for") && !trimmed.includes("while")) {
      return "💡 Petunjuk 3: Soal ini meminta perulangan. Gunakan sintaks `for i in range(...)` atau `while`.";
    }
  }

  if (taskDescription.toLowerCase().includes("if") || taskDescription.toLowerCase().includes("percabangan")) {
    if (!trimmed.includes("if")) {
      return "💡 Petunjuk 3: Gunakan struktur `if kondisi:` untuk memeriksa nilai variabel.";
    }
  }

  return "💡 Petunjuk: Kode kamu sudah hampir benar! Periksa kembali output cetakan dan pastikan tidak ada kesalahan spasi atau huruf kapital.";
}
