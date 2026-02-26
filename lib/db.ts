import fs from 'fs';
import path from 'path';

// Database file paths
const TUTOR_FILE = path.join(process.cwd(), 'tutor.json');
const STUDENT_FILE = path.join(process.cwd(), 'student.json');
const CHAT_FILE = path.join(process.cwd(), 'chat.json');
const ADMIN_FILE = path.join(process.cwd(), 'admin.json');
const CURRICULUM_FILE = path.join(process.cwd(), 'curriculum.json');

export type Status = 'pending' | 'approved' | 'rejected';

export interface Student {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  contact: string;
  email: string;
  country: string;
  city: string;
  tuitionType: 'Online' | 'Face to Face';
  grade: string;
  subject: string;
  status: Status;
  createdAt: string;
}

export interface Tutor {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female';
  age: number;
  contact: string;
  email: string;
  country: string;
  city: string;
  qualification: string;
  experience: string;
  tuitionType: string[];
  subject: string;
  profilePicture?: string;
  idCardFile?: string;
  qualificationFile?: string;
  status: Status;
  availability: 'Open' | 'Closed';
  createdAt: string;
}

export interface Curriculum {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  userName: string;
  userEmail: string;
  userMessage: string;
  adminReply?: string;
  timestamp: string;
}

export interface AdminConfig {
  passwordHash: string;
}

// Initial Data
const initialTutors: Tutor[] = [
  {
    id: '1',
    fullName: 'Dr. Sarah Ahmed',
    gender: 'Female',
    age: 35,
    contact: '0300-1234567',
    email: 'sarah@example.com',
    country: 'Pakistan',
    city: 'Lahore',
    qualification: 'PhD in Mathematics',
    experience: '10+ years',
    tuitionType: ['Online', 'Face to Face'],
    subject: 'Mathematics',
    status: 'approved',
    availability: 'Open',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Prof. John Doe',
    gender: 'Male',
    age: 42,
    contact: '0311-7654321',
    email: 'john@example.com',
    country: 'Pakistan',
    city: 'Karachi',
    qualification: 'MSc Physics',
    experience: '15 years',
    tuitionType: ['Online'],
    subject: 'Physics',
    status: 'approved',
    availability: 'Open',
    createdAt: new Date().toISOString(),
  }
];

const initialCurricula: Curriculum[] = [
  { id: '1', name: 'IGCSE' },
  { id: '2', name: 'A-Levels' },
  { id: '3', name: 'O-Levels' },
  { id: '4', name: 'Matric' },
  { id: '5', name: 'Intermediate' },
];

const initialAdmin: AdminConfig = {
  passwordHash: 'Admin'
};

// Use a global variable to persist the database state across module re-evaluations in development
declare global {
  var __db_tutors: Tutor[] | undefined;
  var __db_students: Student[] | undefined;
  var __db_chats: ChatMessage[] | undefined;
  var __db_curricula: Curriculum[] | undefined;
  var __db_admin: AdminConfig | undefined;
}

function loadJson(filePath: string) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || content.trim() === '') return null;
      return JSON.parse(content);
    } catch (e) {
      console.error(`Error loading ${filePath}:`, e);
    }
  }
  return null;
}

function saveJson(filePath: string, data: any) {
  try {
    const tempFile = `${filePath}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, filePath);
  } catch (e) {
    console.error(`Error saving ${filePath}:`, e);
  }
}

// Initialize State
if (!global.__db_tutors) {
  global.__db_tutors = loadJson(TUTOR_FILE) || initialTutors;
}
if (!global.__db_students) {
  global.__db_students = loadJson(STUDENT_FILE) || [];
}
if (!global.__db_chats) {
  global.__db_chats = loadJson(CHAT_FILE) || [];
}
if (!global.__db_curricula) {
  global.__db_curricula = loadJson(CURRICULUM_FILE) || initialCurricula;
}
if (!global.__db_admin) {
  global.__db_admin = loadJson(ADMIN_FILE) || initialAdmin;
}

// Database API
export const db = {
  students: {
    getAll: async () => global.__db_students!,
    add: async (student: Omit<Student, 'id' | 'status' | 'createdAt'>) => {
      const newStudent: Student = {
        ...student,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      global.__db_students!.push(newStudent);
      saveJson(STUDENT_FILE, global.__db_students);
      return newStudent;
    },
    updateStatus: async (id: string, status: Status) => {
      const student = global.__db_students!.find(s => s.id === id);
      if (student) {
        student.status = status;
        saveJson(STUDENT_FILE, global.__db_students);
      }
    },
    delete: async (id: string) => {
      global.__db_students = global.__db_students!.filter(s => s.id !== id);
      saveJson(STUDENT_FILE, global.__db_students);
    },
    update: async (id: string, data: Partial<Student>) => {
      const index = global.__db_students!.findIndex(s => s.id === id);
      if (index !== -1) {
        global.__db_students![index] = { ...global.__db_students![index], ...data };
        saveJson(STUDENT_FILE, global.__db_students);
      }
    }
  },
  tutors: {
    getAll: async () => global.__db_tutors!,
    add: async (tutor: Omit<Tutor, 'id' | 'status' | 'createdAt' | 'availability'>) => {
      const newTutor: Tutor = {
        ...tutor,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        availability: 'Open',
        createdAt: new Date().toISOString(),
      };
      global.__db_tutors!.push(newTutor);
      saveJson(TUTOR_FILE, global.__db_tutors);
      return newTutor;
    },
    updateStatus: async (id: string, status: Status) => {
      const tutor = global.__db_tutors!.find(t => t.id === id);
      if (tutor) {
        tutor.status = status;
        saveJson(TUTOR_FILE, global.__db_tutors);
      }
    },
    delete: async (id: string) => {
      global.__db_tutors = global.__db_tutors!.filter(t => t.id !== id);
      saveJson(TUTOR_FILE, global.__db_tutors);
    },
    update: async (id: string, data: Partial<Tutor>) => {
      const index = global.__db_tutors!.findIndex(t => t.id === id);
      if (index !== -1) {
        global.__db_tutors![index] = { ...global.__db_tutors![index], ...data };
        saveJson(TUTOR_FILE, global.__db_tutors);
      }
    }
  },
  curricula: {
    getAll: async () => global.__db_curricula!,
    add: async (name: string) => {
      const newCurriculum = { id: Math.random().toString(36).substr(2, 9), name };
      global.__db_curricula!.push(newCurriculum);
      saveJson(CURRICULUM_FILE, global.__db_curricula);
      return newCurriculum;
    },
    delete: async (id: string) => {
      global.__db_curricula = global.__db_curricula!.filter(c => c.id !== id);
      saveJson(CURRICULUM_FILE, global.__db_curricula);
    }
  },
  chats: {
    getAll: async () => global.__db_chats!,
    add: async (data: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newChat: ChatMessage = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      global.__db_chats!.push(newChat);
      saveJson(CHAT_FILE, global.__db_chats);
      return newChat;
    },
    reply: async (id: string, adminReply: string) => {
      const chat = global.__db_chats!.find(c => c.id === id);
      if (chat) {
        chat.adminReply = adminReply;
        saveJson(CHAT_FILE, global.__db_chats);
      }
    },
    delete: async (id: string) => {
      global.__db_chats = global.__db_chats!.filter(c => c.id !== id);
      saveJson(CHAT_FILE, global.__db_chats);
    }
  },
  admin: {
    getConfig: async () => global.__db_admin!,
    updatePassword: async (newPasswordHash: string) => {
      global.__db_admin!.passwordHash = newPasswordHash;
      saveJson(ADMIN_FILE, global.__db_admin);
    }
  }
};
