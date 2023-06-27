export type RegisterStudentReq = {
  teacher: string;
  students: string[];
};

export type StudentStatus = 'Active' | 'Suspended';
