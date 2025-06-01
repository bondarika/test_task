import type { Role } from "./Role";
import type { ZodiacSign } from "./ZodiacSign";

export interface Record {
  id: number;
  name: string;
  nickname: string;
  age: number;
  role: Role;
  zodiacSign: ZodiacSign;
}
