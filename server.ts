import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: Database.Database = new Database("tutor_platform.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS tutors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    gender TEXT,
    age INTEGER,
    contact_number TEXT,
    email TEXT,
    country TEXT,
    city TEXT,
    qualification TEXT,
    experience TEXT,
    tuition_type TEXT,
    subject TEXT,
    documents TEXT,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS student_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    gender TEXT,
    contact_number TEXT,
    email TEXT,
    country TEXT,
    city TEXT,
    tuition_type TEXT,
    grade TEXT,
    subject TEXT,
    status TEXT DEFAULT 'Open',
    extra_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS curriculums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    subjects TEXT,
    grades TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Approved
    suggested_by TEXT, -- Tutor Name
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    user_email TEXT,
    status TEXT DEFAULT 'Active', -- Active, Closed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    sender TEXT, -- 'User', 'Admin', 'Bot'
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES chat_sessions(id)
  );
`);

// Check if status column exists in tutors (for existing databases)
try {
  db.prepare("SELECT status FROM tutors LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE tutors ADD COLUMN status TEXT DEFAULT 'Pending'");
}

// Seed initial curriculums if empty
const existingCurriculums = db.prepare("SELECT count(*) as count FROM curriculums").get() as { count: number };
if (existingCurriculums.count === 0) {
  const initialCurriculums = [
    {
      name: "British Curriculum",
      description: "IGCSE, O-Levels, and A-Levels (Edexcel, Cambridge, AQA).",
      subjects: JSON.stringify(["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "English Literature"]),
      grades: "Year 1 - Year 13",
      status: "Approved"
    },
    {
      name: "American Curriculum",
      description: "Common Core State Standards, AP Courses, SAT/ACT Preparation.",
      subjects: JSON.stringify(["Algebra", "Calculus", "World History", "American Literature", "Psychology", "Environmental Science"]),
      grades: "Grade 1 - Grade 12",
      status: "Approved"
    }
  ];

  const insertCurr = db.prepare("INSERT INTO curriculums (name, description, subjects, grades, status) VALUES (?, ?, ?, ?, ?)");
  initialCurriculums.forEach(c => insertCurr.run(c.name, c.description, c.subjects, c.grades, c.status));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // API Routes
  
  // Tutor Registration
  app.post("/api/tutors", upload.array("documents"), (req: Request, res: Response) => {
    try {
      const {
        full_name,
        gender,
        age,
        contact_number,
        email,
        country,
        city,
        qualification,
        experience,
        tuition_type,
        subject,
      } = req.body;

      const reqFiles = req.files as Express.Multer.File[];
      const documents = JSON.stringify(reqFiles ? reqFiles.map((f: any) => f.path) : []);

      const stmt = db.prepare(`
        INSERT INTO tutors (full_name, gender, age, contact_number, email, country, city, qualification, experience, tuition_type, subject, documents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        full_name,
        gender,
        age,
        contact_number,
        email,
        country,
        city,
        qualification,
        experience,
        tuition_type,
        subject,
        documents
      );

      res.json({ success: true, message: "Tutor registration submitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to submit tutor registration." });
    }
  });

  // Student Request
  app.post("/api/student-requests", (req: Request, res: Response) => {
    try {
      const {
        full_name,
        gender,
        contact_number,
        email,
        country,
        city,
        tuition_type,
        grade,
        subject,
        extra_notes,
      } = req.body;

      const stmt = db.prepare(`
        INSERT INTO student_requests (full_name, gender, contact_number, email, country, city, tuition_type, grade, subject, extra_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        full_name,
        gender || null,
        contact_number,
        email || null,
        country || null,
        city,
        tuition_type,
        grade,
        subject,
        extra_notes || null
      );

      res.json({ success: true, message: "Thank you! Your tuition requirement has been submitted." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to submit tuition requirement." });
    }
  });

  // Admin Login
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      res.json({ success: true, token: "mock-admin-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Admin Routes
  app.get("/api/admin/tutors", (req: Request, res: Response) => {
    const tutors = db.prepare("SELECT * FROM tutors ORDER BY created_at DESC").all();
    res.json(tutors);
  });

  app.patch("/api/admin/tutors/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE tutors SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  app.put("/api/admin/tutors/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { full_name, gender, age, contact_number, email, country, city, qualification, experience, tuition_type, subject } = req.body;
    db.prepare(`
      UPDATE tutors 
      SET full_name = ?, gender = ?, age = ?, contact_number = ?, email = ?, country = ?, city = ?, qualification = ?, experience = ?, tuition_type = ?, subject = ?
      WHERE id = ?
    `).run(full_name, gender, age, contact_number, email, country, city, qualification, experience, tuition_type, subject, id);
    res.json({ success: true });
  });

  app.get("/api/admin/student-requests", (req: Request, res: Response) => {
    const requests = db.prepare("SELECT * FROM student_requests ORDER BY created_at DESC").all();
    res.json(requests);
  });

  app.patch("/api/admin/student-requests/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE student_requests SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  app.delete("/api/admin/tutors/:id", (req: Request, res: Response) => {
    db.prepare("DELETE FROM tutors WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/student-requests/:id", (req: Request, res: Response) => {
    db.prepare("DELETE FROM student_requests WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Curriculum APIs
  app.get("/api/curriculums", (req: Request, res: Response) => {
    const status = req.query.status || "Approved";
    const currs = db.prepare("SELECT * FROM curriculums WHERE status = ? ORDER BY created_at DESC").all(status);
    res.json(currs);
  });

  app.post("/api/curriculums", (req: Request, res: Response) => {
    const { name, description, subjects, grades, suggested_by, status } = req.body;
    const stmt = db.prepare(`
      INSERT INTO curriculums (name, description, subjects, grades, suggested_by, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(name, description, JSON.stringify(subjects), grades, suggested_by || "Admin", status || "Pending");
    res.json({ success: true });
  });

  app.put("/api/admin/curriculums/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, subjects, grades, status } = req.body;
    db.prepare(`
      UPDATE curriculums 
      SET name = ?, description = ?, subjects = ?, grades = ?, status = ?
      WHERE id = ?
    `).run(name, description, JSON.stringify(subjects), grades, status, id);
    res.json({ success: true });
  });

  app.get("/api/admin/curriculums", (req: Request, res: Response) => {
    const currs = db.prepare("SELECT * FROM curriculums ORDER BY created_at DESC").all();
    res.json(currs);
  });

  app.patch("/api/admin/curriculums/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE curriculums SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  app.delete("/api/admin/curriculums/:id", (req: Request, res: Response) => {
    db.prepare("DELETE FROM curriculums WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Chat APIs
  app.post("/api/chat/session", (req: Request, res: Response) => {
    const { name, email } = req.body;
    const stmt = db.prepare("INSERT INTO chat_sessions (user_name, user_email) VALUES (?, ?)");
    const result = stmt.run(name, email);
    res.json({ success: true, sessionId: result.lastInsertRowid });
  });

  app.get("/api/chat/session/:id/messages", (req: Request, res: Response) => {
    const { id } = req.params;
    const messages = db.prepare("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC").all(id);
    res.json(messages);
  });

  app.post("/api/chat/message", (req: Request, res: Response) => {
    const { sessionId, sender, message } = req.body;
    db.prepare("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, ?, ?)").run(sessionId, sender, message);
    
    // If it's an admin reply, we would send an email here
    if (sender === 'Admin') {
      const session = db.prepare("SELECT * FROM chat_sessions WHERE id = ?").get(sessionId) as any;
      if (session && session.user_email) {
        console.log(`[MOCK EMAIL] Sending notification to ${session.user_email}: Admin has replied to your chat. View it here: ${process.env.APP_URL || 'http://localhost:3000'}/chat/${sessionId}`);
        // In a real app, use nodemailer or similar here
      }
    }
    
    res.json({ success: true });
  });

  // Admin Chat APIs
  app.get("/api/admin/chat-sessions", (req: Request, res: Response) => {
    const sessions = db.prepare(`
      SELECT s.*, 
      (SELECT message FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM chat_messages WHERE session_id = s.id ORDER BY created_at DESC LIMIT 1) as last_message_at
      FROM chat_sessions s
      ORDER BY last_message_at DESC
    `).all();
    res.json(sessions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
