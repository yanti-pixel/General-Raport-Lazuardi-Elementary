import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/generate-comment", async (req, res) => {
    const { studentName, subject, lglo, score, anecdote, month } = req.body;

    try {
      const prompt = `
        Anda adalah seorang guru di sekolah Lazuardi. 
        Tuliskan komentar rapor bulanan untuk siswa bernama ${studentName} pada mata pelajaran ${subject}.
        
        Detail pembelajaran:
        - Learning Goal/Objective: ${lglo}
        - Nilai/Pencapaian: ${score} (Skala 1-4, di mana 4 adalah Sangat Baik, 3 Baik, 2 Cukup, 1 Perlu Bantuan)
        - Catatan Khusus/Anekdot: ${anecdote || "Tidak ada catatan khusus"}
        - Bulan: ${month}

        Instruksi:
        1. Gunakan bahasa Indonesia yang formal namun hangat dan pedagogis.
        2. Hubungkan nilai dengan Learning Objective.
        3. Sebutkan progres spesifik jika ada anekdot.
        4. Berikan saran pengembangan yang konstruktif.
        5. Jangan terlalu panjang (maksimal 3-4 kalimat).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ comment: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Gagal membuat komentar." });
    }
  });

  app.post("/api/generate-summary", async (req, res) => {
    const { studentName, reports } = req.body;

    try {
      const prompt = `
        Anda adalah seorang guru di Lazuardi.
        Tuliskan rangkuman "Learning Journey" satu semester untuk siswa bernama ${studentName}.
        
        Berikut adalah kumpulan laporan bulanan selama satu semester:
        ${JSON.stringify(reports, null, 2)}

        Instruksi:
        1. Buat narasi yang menggambarkan perkembangan siswa dari awal hingga akhir semester.
        2. Soroti pencapaian utama di berbagai mata pelajaran (Mengaji, Bahasa Indonesia, Matematika, Bahasa Inggris).
        3. Sebutkan aspek karakter atau sikap belajar jika terlihat dari anekdot.
        4. Gunakan bahasa yang inspiratif dan profesional.
        5. Format dalam 2-3 paragraf.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Gagal membuat rangkuman semester." });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
