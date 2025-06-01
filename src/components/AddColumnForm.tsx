import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (label: string) => void;
}

export function AddColumnForm({ open, onClose, onAdd }: Props) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!open) setLabel('');
  }, [open]);

  const handleAdd = () => {
    if (label.trim().length > 0) {
      onAdd(label.trim());
      setLabel('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            fontWeight: 500,
            width: '100%',
            textAlign: 'center',
            pb: 1,
          }}
        >
          Добавить колонку
        </DialogTitle>
        <DialogContent sx={{ width: '90%', p: 0, mb: 2 }}>
          <TextField
            autoFocus
            required
            label="Название колонки"
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions
          sx={{ width: '90%', justifyContent: 'center', pb: 3, pt: 0 }}
        >
          <Button
            onClick={handleAdd}
            disabled={!label.trim()}
            variant="contained"
            sx={{ minWidth: 120 }}
          >
            Добавить
          </Button>
          <Button onClick={onClose} sx={{ minWidth: 120 }}>
            Отмена
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
