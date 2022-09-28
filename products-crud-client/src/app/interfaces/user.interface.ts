export interface User {
  id: number;
  name: string;
  email: string;
  role: Roles;
}

enum Roles {
  Admin,
  User,
}
