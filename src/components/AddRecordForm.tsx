import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Button,
  MenuItem,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Record } from '../types/Record';
import { type Role } from '../types/Role';
import axios from 'axios';
import { recordSchema, type RecordFormData } from '../validation/recordSchema';
import { observer } from 'mobx-react-lite';
import { recordStore } from '../store/RecordStore';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { AddColumnForm } from './AddColumnForm';

type FormData = RecordFormData;

interface AddRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newRecord: Record) => void;
}

export const AddRecordForm = observer(
  ({ open, onClose, onSuccess }: AddRecordFormProps) => {
    const [addColumnOpen, setAddColumnOpen] = useState(false);

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isValid },
    } = useForm<FormData>({
      resolver: zodResolver(recordSchema),
      mode: 'onChange',
    });

    useEffect(() => {
      if (!open) reset();
    }, [open, reset]);

    const onSubmit = async (data: FormData) => {
      const res = await axios.post<Record>(
        'http://localhost:3001/records',
        data
      );
      onSuccess(res.data);
      onClose();
      reset();
    };

    const handleAddColumn = async (label: string) => {
      await recordStore.addColumn(label);
      setAddColumnOpen(false);
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{ fontWeight: 500, textAlign: 'center', pt: 4, pb: 1 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Добавить запись</Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              edge="end"
              size="small"
              sx={{ color: (theme) => theme.palette.grey[500] }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            pt: 2,
            pb: 1,
          }}
        >
          <DialogContent sx={{ width: '90%', p: 0, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recordStore.columns
                .filter((col) => col.key !== 'id')
                .map((col) => {
                  if (col.key === 'role') {
                    return (
                      <TextField
                        select
                        label="Роль"
                        {...register('role')}
                        required
                        key={col.key}
                      >
                        {(
                          [
                            'design',
                            'aep',
                            'media',
                            'admin',
                            'creator',
                            'smm',
                            'ceo',
                          ] as Role[]
                        ).map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </TextField>
                    );
                  }
                  if (col.key === 'zodiacSign') {
                    return (
                      <TextField
                        select
                        label="Знак зодиака"
                        {...register('zodiacSign')}
                        required
                        key={col.key}
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
                    );
                  }
                  return (
                    <TextField
                      key={col.key}
                      label={col.label}
                      {...register(
                        col.key,
                        col.key === 'age' ? { valueAsNumber: true } : {}
                      )}
                      required
                      error={!!errors[col.key]}
                      helperText={errors[col.key]?.message as string}
                      type="text"
                      sx={{ mt: 1 }}
                    />
                  );
                })}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddColumnOpen(true)}
                sx={{ mt: 2 }}
                disabled={recordStore.columns.length >= recordStore.maxColumns}
              >
                Добавить поле
              </Button>
            </Box>
          </DialogContent>
          <Box
            sx={{
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
              mb: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid}
              sx={{ minWidth: 140 }}
            >
              Добавить
            </Button>
          </Box>
        </Box>
        <AddColumnForm
          open={addColumnOpen}
          onClose={() => setAddColumnOpen(false)}
          onAdd={handleAddColumn}
        />
      </Dialog>
    );
  }
);
