import type { Role } from "./Role";

export interface Record {
  id: number;
  name: string;
  nickname: string;
  age: number;
  role: Role;
}
