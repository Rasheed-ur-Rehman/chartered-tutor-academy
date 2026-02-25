import fs from 'fs';
import path from 'path';

// Database file path
const DATA_FILE = path.join(process.cwd(), 'data.json');

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

// Initial Mock Data
const initialData = {
  students: [] as Student[],
  tutors: [
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
  ] as Tutor[],
  curricula: [
    { id: '1', name: 'IGCSE' },
    { id: '2', name: 'A-Levels' },
    { id: '3', name: 'O-Levels' },
    { id: '4', name: 'Matric' },
    { id: '5', name: 'Intermediate' },
  ] as Curriculum[],
  chats: [] as ChatMessage[],
  admin: {
    passwordHash: 'Admin'
  } as AdminConfig
};

// Use a global variable to persist the database state across module re-evaluations in development
declare global {
  var __db_state: {
    students: Student[];
    tutors: Tutor[];
    curricula: Curriculum[];
    chats: ChatMessage[];
    admin: AdminConfig;
  } | undefined;
}

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (!content || content.trim() === '') return null;
      return JSON.parse(content);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }
  return null;
}

function saveData(data: any) {
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, DATA_FILE);
  } catch (e) {
    console.error('Error saving data:', e);
  }
}

const rawPersistedData = loadData();
const persistedData = {
  ...initialData,
  ...(rawPersistedData || {}),
  students: (rawPersistedData && rawPersistedData.students) || initialData.students,
  tutors: (rawPersistedData && rawPersistedData.tutors) || initialData.tutors,
  curricula: (rawPersistedData && rawPersistedData.curricula) || initialData.curricula,
  chats: (rawPersistedData && rawPersistedData.chats) || initialData.chats,
  admin: (rawPersistedData && rawPersistedData.admin) || initialData.admin,
};

if (!global.__db_state) {
  global.__db_state = {
    students: persistedData.students,
    tutors: persistedData.tutors,
    curricula: persistedData.curricula,
    chats: persistedData.chats,
    admin: persistedData.admin,
  };
}

function sync() {
  if (!global.__db_state) return;
  saveData(global.__db_state);
}

// Database API (Async to match existing API routes)
export const db = {
  students: {
    getAll: async () => global.__db_state!.students,
    add: async (student: Omit<Student, 'id' | 'status' | 'createdAt'>) => {
      const newStudent: Student = {
        ...student,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      global.__db_state!.students.push(newStudent);
      sync();
      return newStudent;
    },
    updateStatus: async (id: string, status: Status) => {
      const student = global.__db_state!.students.find(s => s.id === id);
      if (student) {
        student.status = status;
        sync();
      }
    },
    delete: async (id: string) => {
      global.__db_state!.students = global.__db_state!.students.filter(s => s.id !== id);
      sync();
    },
    update: async (id: string, data: Partial<Student>) => {
      const index = global.__db_state!.students.findIndex(s => s.id === id);
      if (index !== -1) {
        global.__db_state!.students[index] = { ...global.__db_state!.students[index], ...data };
        sync();
      }
    }
  },
  tutors: {
    getAll: async () => global.__db_state!.tutors,
    add: async (tutor: Omit<Tutor, 'id' | 'status' | 'createdAt' | 'availability'>) => {
      const newTutor: Tutor = {
        ...tutor,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        availability: 'Open',
        createdAt: new Date().toISOString(),
      };
      global.__db_state!.tutors.push(newTutor);
      sync();
      return newTutor;
    },
    updateStatus: async (id: string, status: Status) => {
      const tutor = global.__db_state!.tutors.find(t => t.id === id);
      if (tutor) {
        tutor.status = status;
        sync();
      }
    },
    delete: async (id: string) => {
      global.__db_state!.tutors = global.__db_state!.tutors.filter(t => t.id !== id);
      sync();
    },
    update: async (id: string, data: Partial<Tutor>) => {
      const index = global.__db_state!.tutors.findIndex(t => t.id === id);
      if (index !== -1) {
        global.__db_state!.tutors[index] = { ...global.__db_state!.tutors[index], ...data };
        sync();
      }
    }
  },
  curricula: {
    getAll: async () => global.__db_state!.curricula,
    add: async (name: string) => {
      const newCurriculum = { id: Math.random().toString(36).substr(2, 9), name };
      global.__db_state!.curricula.push(newCurriculum);
      sync();
      return newCurriculum;
    },
    delete: async (id: string) => {
      global.__db_state!.curricula = global.__db_state!.curricula.filter(c => c.id !== id);
      sync();
    }
  },
  chats: {
    getAll: async () => global.__db_state!.chats,
    add: async (chat: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newChat: ChatMessage = {
        ...chat,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      };
      global.__db_state!.chats.push(newChat);
      sync();
      return newChat;
    },
    reply: async (id: string, reply: string) => {
      const chat = global.__db_state!.chats.find(c => c.id === id);
      if (chat) {
        chat.adminReply = reply;
        sync();
      }
    },
    delete: async (id: string) => {
      global.__db_state!.chats = global.__db_state!.chats.filter(c => c.id !== id);
      sync();
    }
  },
  admin: {
    getConfig: async () => global.__db_state!.admin,
    updatePassword: async (newPasswordHash: string) => {
      global.__db_state!.admin.passwordHash = newPasswordHash;
      sync();
    }
  }
};
