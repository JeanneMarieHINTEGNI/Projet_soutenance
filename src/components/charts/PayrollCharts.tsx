import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, Maximize2, Minimize2, FileSpreadsheet, FileText } from 'lucide-react';
import { ChartDataItem, defaultColors, formatCurrency, exportToExcel, exportToCSV, generateAnnotation, ComparisonData } from '@/utils/chartUtils';

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartData[];
  title: string;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  onExportExcel: () => void;
  onExportCSV: () => void;
}

const ChartContainer = ({ title, children, onExportExcel, onExportCSV }: ChartContainerProps) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  return (
    <>
      <div className="w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <FileText className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {children}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(false)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(80vh-100px)]">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const PayrollPieChart: React.FC<ChartProps> = ({ data, title }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const PayrollBarChart: React.FC<ChartProps> = ({ data, title }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PayrollLineChart: React.FC<ChartProps> = ({ data, title }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#2E7D32"
          strokeWidth={2}
          dot={{ r: 4, fill: "white", stroke: "#2E7D32", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}; 