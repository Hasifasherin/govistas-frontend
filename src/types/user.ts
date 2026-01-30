export interface User {
  _id?: string;              // for admin or backend _id
  id?: string;               // optional fallback if backend returns id
  firstName?: string;        // for operator/user
  lastName?: string;         // for operator/user
  name?: string;             // full name for admin
  email: string;
  role?: "user" | "operator" | "admin";
}
