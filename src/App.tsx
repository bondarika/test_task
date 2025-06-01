import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { RecordForm } from './components/RecordForm';
import { RecordTable } from './components/RecordTable';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { type Record } from './types/Record';

const PAGE_SIZE = 5;

export default function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRecords([]);
    setPage(1);
    setHasMore(true);
    loadMoreRecords(1, true);
  }, []);

  const loadMoreRecords = async (nextPage = page, isFirst = false) => {
    setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 700));
    const res = await axios.get<Record[]>(
      `http://localhost:3001/records?_page=${nextPage}&_limit=${PAGE_SIZE}`
    );
    setRecords((prev) => (isFirst ? res.data : [...prev, ...res.data]));
    setPage(nextPage + 1);
    if (res.data.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
      <Typography
        variant="h2"
        gutterBottom
        sx={{ textAlign: 'center', fontWeight: '500' }}
      >
        Состав ORG.COM
      </Typography>
      <RecordForm
        onSuccess={(newRecord) => {
          setRecords((prev) => [newRecord, ...prev]);
        }}
      />
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
    </Container>
  );
}
