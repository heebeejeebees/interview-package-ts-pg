export enum StudentStatus {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
}

export type RegisterStudentReq = {
  teacher: string;
  students: string[];
};

export type RetrieveStudentReq = string | string[];
export type RetrieveStudentRes = {
  students: string[];
};

export type SuspendStudentReq = {
  student: string;
};

export type RetrieveForNotifsStudentReq = {
  teacher: string;
  notification: string;
};

export type RetrieveForNotifsStudentRes = {
  recipients: string[];
};
