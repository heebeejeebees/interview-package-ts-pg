export type RegisterStudentReq = {
  teacher: string;
  students: string[];
};

export type RetrieveStudentReq = string | string[];

export type RetrieveStudentRes = {
  students: string[];
};
export type StudentStatus = 'Active' | 'Suspended';
