import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export const defaultColors = [
  '#4F46E5', // Indigo
  '#EF4444', // Rouge
  '#10B981', // Vert
  '#F59E0B', // Ambre
  '#8B5CF6', // Violet
  '#EC4899', // Rose
  '#06B6D4', // Cyan
  '#84CC16', // Citron vert
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const exportToExcel = (data: ChartDataItem[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(dataBlob, `${filename}.xlsx`);
};

export const exportToCSV = (data: ChartDataItem[], filename: string) => {
  const csvContent = [
    ['Nom', 'Valeur'],
    ...data.map(item => [item.name, item.value.toString()])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const generateAnnotation = (value: number, previousValue: number) => {
  const change = ((value - previousValue) / previousValue) * 100;
  return {
    text: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    color: change >= 0 ? '#10B981' : '#EF4444'
  };
};

export interface ComparisonData {
  current: ChartDataItem[];
  previous: ChartDataItem[];
} 