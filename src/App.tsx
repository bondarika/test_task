import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { RecordTable } from './components/RecordTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import { type Record } from './types/Record';
import AddIcon from '@mui/icons-material/Add';
import { AddColumnForm } from './components/AddColumnForm';
import { recordStore } from './store/RecordStore';
import { AddRecordForm } from './components/AddRecordForm';
import { observer } from 'mobx-react-lite';
import { api } from './api/api';

const PAGE_SIZE = 5;

export const App = observer(() => {
  const [records, setRecords] = useState<Record[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setRecords([]);
    setPage(1);
    setHasMore(true);
    loadMoreRecords(1, true);
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await recordStore.deleteRecord(id);
      setRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (e) {
      console.error('Failed to delete record:', e);
    }
  };

  const loadMoreRecords = async (nextPage = page, isFirst = false) => {
    setLoading(true);
    const res = await api.getRecordsPaged(nextPage, PAGE_SIZE);
    if (isFirst && res.data.length > 0) {
      recordStore.syncColumnsWithRecords(res.data);
    }
    setRecords((prev) => (isFirst ? res.data : [...prev, ...res.data]));
    setPage(nextPage + 1);
    if (res.data.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columnCount = recordStore.columns.filter(
    (col) => col.key !== 'id'
  ).length;

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: '500', mb: 4 }}>
        Состав ORG.COM
      </Typography>
      <Box
        id="scrollable-table-box"
        sx={{
          height: 300,
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: 2,
        }}
      >
        <InfiniteScroll
          dataLength={records.length}
          next={() => loadMoreRecords(page)}
          hasMore={hasMore}
          loader={
            loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress />
              </Box>
            ) : null
          }
          scrollableTarget="scrollable-table-box"
        >
          <RecordTable
            records={records}
            onDelete={handleDelete}
            // onUpdate={handleUpdate}
          />
        </InfiniteScroll>
      </Box>
      <Typography
        sx={{ mt: 1, fontSize: 16, color: 'gray', textAlign: 'center' }}
      >
        {columnCount + 1} / {recordStore.maxColumns} колонок
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Добавить запись
        </Button>
        <AddRecordForm
          open={open}
          onClose={handleClose}
          onSuccess={(newRecord) => setRecords((prev) => [...prev, newRecord])}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={columnCount + 1 >= recordStore.maxColumns}
        >
          Добавить колонку
        </Button>
        <AddColumnForm
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={(label) => {
            recordStore.addColumn(label);
            setDialogOpen(false);
          }}
        />
      </Box>
    </Container>
  );
});

export default App;
