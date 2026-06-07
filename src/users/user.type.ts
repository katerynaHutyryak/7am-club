export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}
