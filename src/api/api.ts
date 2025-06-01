import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = {
  getRecords: () => axios.get(`${API_URL}/records`),
  getRecordsPaged: (page: number, limit: number) =>
    axios.get(`${API_URL}/records?_page=${page}&_limit=${limit}`),
  updateRecord: (id: string | number, data: Record<string, unknown>) =>
    axios.put(`${API_URL}/records/${id}`, data),
};
