export interface IEducationItem {
  degree: string;
  institution: string;
  passingYear: string;
  result?: string;
}

export interface IUserProfile {
  _id?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    studentId?: string;
  };
  bio?: string;
  dateOfBirth?: string;
  address?: string;
  linkedinUrl?: string;
  currentJob?: string;
  company?: string;
  industry?: string;
  experience?: string;
  education?: IEducationItem[];
  wpnumber?: string;
}
