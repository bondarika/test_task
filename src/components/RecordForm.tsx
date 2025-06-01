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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      name: '',
      nickname: '',
      age: 18,
      role: 'design',
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await axios.post<Record>('http://localhost:3001/records', data);
    if (onSuccess) onSuccess(res.data);
    reset();
  };

  const onCancel = () => {
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
    >
      <TextField
        label="Имя"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Никнейм"
        {...register('nickname')}
        error={!!errors.nickname}
        helperText={errors.nickname?.message}
      />
      <TextField
        type="number"
        label="Возраст"
        {...register('age', { valueAsNumber: true })}
        error={!!errors.age}
        helperText={errors.age?.message}
      />
      <TextField select label="Роль" {...register('role')}>
        {(
          ['design', 'aep', 'media', 'admin', 'creator', 'smm', 'ceo'] as Role[]
        ).map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">
          Сохранить
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Отмена
        </Button>
      </Box>
    </Box>
  );
}
