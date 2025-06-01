import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = {
  getRecords: () => axios.get(`${API_URL}/records`),
  updateRecord: (id: string | number, data: Record<string, unknown>) =>
    axios.put(`${API_URL}/records/${id}`, data),
};
