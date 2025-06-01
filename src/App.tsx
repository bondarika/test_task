import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { RecordForm } from './components/RecordForm';
import { RecordTable } from './components/RecordTable/RecordTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { type Record } from './types/Record';
import CloseIcon from '@mui/icons-material/Close';

const PAGE_SIZE = 5;

export default function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setRecords([]);
    setPage(1);
    setHasMore(true);
    loadMoreRecords(1, true);
    // eslint-disable-next-line
  }, []);

  const loadMoreRecords = async (nextPage = page, isFirst = false) => {
    setLoading(true);
    const res = await axios.get<Record[]>(
      `http://localhost:3001/records?_page=${nextPage}&_limit=${PAGE_SIZE}`
    );
    setRecords((prev) => (isFirst ? res.data : [...prev, ...res.data]));
    setPage(nextPage + 1);
    if (res.data.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <Typography variant="h2" gutterBottom sx={{ fontWeight: '500' }}>
        Состав ORG.COM
      </Typography>
      <Box
        id="scrollable-table-box"
        sx={{
          height: 300,
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: 2,
          mt: 2,
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
          <RecordTable records={records} />
        </InfiniteScroll>
      </Box>

      <Button variant="contained" onClick={handleOpen} sx={{ mt: 5 }}>
        Добавить запись
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle
            sx={{ fontWeight: 500, width: '100%', textAlign: 'center' }}
          >
            Добавить запись
          </DialogTitle>
          <DialogContent sx={{ width: '90%' }}>
            <RecordForm
              onSuccess={(newRecord) => {
                setRecords((prev) => [newRecord, ...prev]);
                handleClose();
              }}
            />
          </DialogContent>
        </Box>
      </Dialog>
    </Container>
  );
}
