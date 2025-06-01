import { z } from 'zod';

export const recordSchema = z.object({
  name: z.string().min(2, 'Имя слишком короткое').max(22, 'Имя слишком длинное'),
  nickname: z.string(),
  age: z
    .number()
    .min(18, 'Минимальный возраст – 18 лет')
    .max(24, 'Максимальный возраст – 24 года'),
  role: z.enum(['design', 'aep', 'media', 'admin', 'creator', 'smm', 'ceo'])
});

export type RecordFormData = z.infer<typeof recordSchema>;
