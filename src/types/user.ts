export interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role?: "user" | "operator" | "admin";
  phone?: string;
  gender?: "male" | "female";
  dob?: string;
}