﻿import { z } from 'zod';

export const recordSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Имя слишком короткое')
      .max(22, 'Имя слишком длинное')
      .regex(
        /^[А-Яа-яA-Za-z\s-]+$/,
        'Имя может содержать только буквы, пробелы и дефисы'
      ),
    nickname: z
      .string()
      .min(1, 'Никнейм обязателен')
      .max(22, 'Никнейм слишком длинный')
      .regex(
        /^[a-zA-Zа-яА-Я0-9 ?]+$/,
        'Ник может содержать только буквы (латиница и кириллица), цифры, пробелы и знак вопроса'
      ),
    age: z
      .number({ invalid_type_error: 'Возраст должен быть числом' })
      .int('Возраст должен быть целым числом')
      .min(18, 'Минимальный возраст – 18 лет')
      .max(24, 'Максимальный возраст – 24 года'),
    role: z.enum(['design', 'aep', 'media', 'admin', 'creator', 'smm', 'ceo']),
    zodiacSign: z.enum([
      'Овен',
      'Телец',
      'Близнецы',
      'Рак',
      'Лев',
      'Дева',
      'Весы',
      'Скорпион',
      'Стрелец',
      'Козерог',
      'Водолей',
      'Рыбы',
    ]),
  })
  .passthrough();

export type RecordFormData = z.infer<typeof recordSchema>;
