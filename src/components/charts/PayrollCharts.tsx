import { useState, useCallback, useRef } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Sector, ReferenceArea, Brush, Label, ReferenceLine } from 'recharts';
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

interface ChartProps {
  title: string;
  data: ChartData[];
  previousPeriodData?: ChartData[];
  showComparison?: boolean;
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  onExportExcel: () => void;
  onExportCSV: () => void;
}

const ChartContainer = ({ title, children, onExportExcel, onExportCSV }: ChartContainerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

// Composant pour le secteur actif du PieChart
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${payload.name}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

const COLORS = ['#4F46E5', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

export const PayrollPieChart: React.FC<ChartProps> = ({ data, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hiddenSectors, setHiddenSectors] = useState<string[]>([]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const toggleSector = (name: string) => {
    setHiddenSectors(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const filteredData = data.filter(item => !hiddenSectors.includes(item.name));

  return (
    <ChartContainer
      title={title}
      onExportExcel={() => exportToExcel(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
      onExportCSV={() => exportToCSV(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((entry) => (
          <Button
            key={entry.name}
            variant={hiddenSectors.includes(entry.name) ? "outline" : "default"}
            size="sm"
            onClick={() => toggleSector(entry.name)}
            style={{ 
              backgroundColor: hiddenSectors.includes(entry.name) ? 'transparent' : entry.color,
              borderColor: entry.color,
              color: hiddenSectors.includes(entry.name) ? entry.color : 'white'
            }}
          >
            {entry.name}
          </Button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const PayrollBarChart: React.FC<ChartProps> = ({ data, title }) => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [hiddenBars, setHiddenBars] = useState<string[]>([]);

  const toggleBar = (name: string) => {
    setHiddenBars(prev => 
      prev.includes(name) 
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const filteredData = data.filter(item => !hiddenBars.includes(item.name));

  return (
    <ChartContainer
      title={title}
      onExportExcel={() => exportToExcel(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
      onExportCSV={() => exportToCSV(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((entry) => (
          <Button
            key={entry.name}
            variant={hiddenBars.includes(entry.name) ? "outline" : "default"}
            size="sm"
            onClick={() => toggleBar(entry.name)}
            style={{ 
              backgroundColor: hiddenBars.includes(entry.name) ? 'transparent' : entry.color,
              borderColor: entry.color,
              color: hiddenBars.includes(entry.name) ? entry.color : 'white'
            }}
          >
            {entry.name}
          </Button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5">
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export const PayrollLineChart: React.FC<ChartProps> = ({ data, title }) => {
  const [period, setPeriod] = useState('ALL');
  const [zoomState, setZoomState] = useState({
    refAreaLeft: '',
    refAreaRight: '',
    data: data,
    left: 'dataMin',
    right: 'dataMax',
    top: 'dataMax+1000000',
    bottom: 'dataMin-1000000',
  });

  const getAxisYDomain = useCallback((from: number, to: number, ref: string, offset: number) => {
    const refData = data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });
    return [(bottom | 0) - offset, (top | 0) + offset];
  }, [data]);

  const zoom = () => {
    let { refAreaLeft, refAreaRight } = zoomState;
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setZoomState({
        ...zoomState,
        refAreaLeft: '',
        refAreaRight: '',
      });
      return;
    }

    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    const [bottom, top] = getAxisYDomain(
      data.findIndex(item => item.name === refAreaLeft) + 1,
      data.findIndex(item => item.name === refAreaRight) + 1,
      'value',
      50000
    );

    setZoomState({
      ...zoomState,
      refAreaLeft: '',
      refAreaRight: '',
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
    });
  };

  const zoomOut = () => {
    setZoomState({
      ...zoomState,
      data: data.slice(),
      left: 'dataMin',
      right: 'dataMax',
      refAreaLeft: '',
      refAreaRight: '',
      top: 'dataMax+1000000',
      bottom: 'dataMin-1000000',
    });
  };

  const onMouseDown = (e: any) => {
    if (!e) return;
    setZoomState({ ...zoomState, refAreaLeft: e.activeLabel });
  };

  const onMouseMove = (e: any) => {
    if (!e) return;
    if (zoomState.refAreaLeft)
      setZoomState({ ...zoomState, refAreaRight: e.activeLabel });
  };

  const onMouseUp = () => {
    if (zoomState.refAreaLeft && zoomState.refAreaRight)
      zoom();
  };

  const filteredData = (() => {
    if (period === 'ALL') return data;
    const months = parseInt(period);
    return data.slice(-months);
  })();

  return (
    <ChartContainer
      title={title}
      onExportExcel={() => exportToExcel(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
      onExportCSV={() => exportToCSV(data, `${title.toLowerCase().replace(/\s+/g, '_')}`)}
    >
      <div className="flex justify-between items-center mb-4">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {[
              { label: '1 mois', value: '1' },
              { label: '3 mois', value: '3' },
              { label: '6 mois', value: '6' },
              { label: '1 an', value: '12' },
              { label: 'Tout', value: 'ALL' }
            ].map(p => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          disabled={zoomState.left === 'dataMin'}
        >
          Réinitialiser le zoom
        </Button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ fill: '#4F46E5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}; 