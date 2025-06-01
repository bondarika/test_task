import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { type Record } from '../types/Record';

export function RecordTable({ records }: { records: Record[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Имя</TableCell>
          <TableCell>Никнейм</TableCell>
          <TableCell>Возраст</TableCell>
          <TableCell>Роль</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((rec) => (
          <TableRow key={rec.id}>
            <TableCell>{rec.name}</TableCell>
            <TableCell>{rec.nickname}</TableCell>
            <TableCell>{rec.age}</TableCell>
            <TableCell>{rec.role}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
