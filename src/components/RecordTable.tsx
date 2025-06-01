import { observer } from 'mobx-react-lite';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Record } from '../types/Record';
import { recordStore } from '../store/RecordStore';

export const RecordTable = observer(({ records }: { records: Record[] }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {recordStore.columns
                .map((col, idx) => (
                  <TableCell
                    key={col.key}
                    sx={{ fontWeight: 'bold', position: 'relative' }}
                  >
                    {col.label}
                    {col.key !== 'id' &&
                      recordStore.columns.length > recordStore.minColumns && (
                        <IconButton
                          size="small"
                          onClick={() => recordStore.deleteColumn(idx)}
                          sx={{ ml: 1 }}
                          aria-label="Удалить колонку"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((rec, index) => (
              <TableRow
                key={rec.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                {recordStore.columns.map((col) => (
                  <TableCell key={col.key}>
                    {rec[col.key as keyof Record] ?? ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});