import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import { type Record } from '../types/Record';

export function RecordTable({ records }: { records: Record[] }) {
  return (
    <TableContainer sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Имя</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Никнейм</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Возраст</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Роль</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Знак зодиака</TableCell>
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
              <TableCell>{rec.name}</TableCell>
              <TableCell>{rec.nickname}</TableCell>
              <TableCell>{rec.age}</TableCell>
              <TableCell>{rec.role}</TableCell>
              <TableCell>{rec.zodiacSign}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
