import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { type Record } from '../types/Record';
import { type Role } from '../types/Role';
import axios from 'axios';
import { recordSchema, type RecordFormData } from '../validation/recordSchema';

type FormData = RecordFormData;

interface RecordFormProps {
  onSuccess?: (record: Record) => void;
}

export function RecordForm({ onSuccess }: RecordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(recordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    const res = await axios.post<Record>('http://localhost:3001/records', data);
    if (onSuccess) onSuccess(res.data);
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: 2,
      }}
    >
      <TextField
        label="Имя"
        {...register('name')}
        required
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Никнейм"
        required
        {...register('nickname')}
        error={!!errors.nickname}
        helperText={errors.nickname?.message}
      />
      <TextField
        type="text"
        label="Возраст"
        required
        {...register('age', { valueAsNumber: true })}
        error={!!errors.age}
        helperText={errors.age?.message}
      />
      <TextField select label="Роль" {...register('role')} required>
        {(
          ['design', 'aep', 'media', 'admin', 'creator', 'smm', 'ceo'] as Role[]
        ).map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Знак зодиака"
        {...register('zodiacSign')}
        required
      >
        {(
          [
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
          ] as const
        ).map((sign) => (
          <MenuItem key={sign} value={sign}>
            {sign}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="submit" variant="contained" disabled={!isValid}>
          Сохранить
        </Button>
      </Box>
    </Box>
  );
}
