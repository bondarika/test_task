import { makeAutoObservable } from 'mobx';
import { api } from '../api/api';

const MIN_COLUMNS = 5;
const MAX_COLUMNS = 15;
const LABELS_KEY = 'record_labels_map';

const DEFAULT_COLUMNS = [
  { key: 'name', label: 'Имя' },
  { key: 'nickname', label: 'Никнейм' },
  { key: 'age', label: 'Возраст' },
  { key: 'role', label: 'Роль' },
  { key: 'zodiacSign', label: 'Знак зодиака' },
];

export class RecordStore {
  columns = DEFAULT_COLUMNS.slice();
  labelsMap: Record<string, string> = {};

  constructor() {
    makeAutoObservable(this);
    const saved = localStorage.getItem(LABELS_KEY);
    if (saved) {
      try {
        this.labelsMap = JSON.parse(saved);
      } catch {
        this.labelsMap = {};
      }
    }
    DEFAULT_COLUMNS.forEach((col) => {
      if (!this.labelsMap[col.key]) {
        this.labelsMap[col.key] = col.label;
      }
    });
  }

  get minColumns() {
    return MIN_COLUMNS;
  }
  get maxColumns() {
    return MAX_COLUMNS;
  }

  saveLabelsMap() {
    localStorage.setItem(LABELS_KEY, JSON.stringify(this.labelsMap));
  }

  async addColumn(label: string) {
    if (this.columns.length < MAX_COLUMNS) {
      const newKey = `custom${Date.now()}`;
      this.columns.push({ key: newKey, label });
      this.labelsMap[newKey] = label;
      this.saveLabelsMap();

      try {
        const res = await api.getRecords();
        const records = res.data;
        for (const record of records) {
          if (!(newKey in record)) {
            const updated = { ...record, [newKey]: '' };
            await api.updateRecord(record.id, updated);
          }
        }
      } catch (e) {
        console.error('Failed to add column to records:', e);
      }
    }
  }

  async deleteColumn(idx: number) {
    const col = this.columns[idx];
    if (this.columns.length > MIN_COLUMNS && col.key !== 'id') {
      this.columns.splice(idx, 1);
      delete this.labelsMap[col.key];
      this.saveLabelsMap();

      try {
        const res = await api.getRecords();
        const records = res.data;
        for (const record of records) {
          if (Object.prototype.hasOwnProperty.call(record, col.key)) {
            const updated = { ...record };
            delete updated[col.key];
            await api.updateRecord(record.id, updated);
          }
        }
      } catch (e) {
        console.error('Failed to delete column from records:', e);
      }
    }
  }

  syncColumnsWithRecords(records: Record<string, unknown>[]) {
    if (!records.length) return;
    const keys = Object.keys(records[0]);
    let newColumns = keys.map((key) => {
      return { key, label: this.labelsMap[key] || key };
    });
    if (newColumns.length < this.minColumns) {
      DEFAULT_COLUMNS.forEach((col) => {
        if (
          !newColumns.find((c) => c.key === col.key) &&
          newColumns.length < this.minColumns
        ) {
          newColumns.push(col);
        }
      });
    }
    if (newColumns.length > this.maxColumns) {
      newColumns = newColumns.slice(0, this.maxColumns);
    }
    this.columns = newColumns;
  }
}

export const recordStore = new RecordStore();
