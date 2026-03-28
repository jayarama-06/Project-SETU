import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { useState } from 'react';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartFullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartTitle: string;
  chartType: 'donut' | 'line' | 'bar';
  data: ChartData[];
  onDrillDown?: (item: ChartData) => void;
}

export function ChartFullScreenModal({
  isOpen,
  onClose,
  chartTitle,
  chartType,
  data,
  onDrillDown,
}: ChartFullScreenModalProps) {
  const [dateRange, setDateRange] = useState('last_7_days');

  const renderChart = () => {
    switch (chartType) {
      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
                onClick={(entry) => onDrillDown?.(entry)}
                style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-fullscreen-donut-${index}-${entry.name}`} fill={entry.color || '#F0A500'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                }}
              />
              <Legend
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle"
                wrapperStyle={{
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                  paddingLeft: '40px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0D1B2A"
                strokeWidth={3}
                dot={{ fill: '#0D1B2A', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 40, left: 120, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" style={{ fontFamily: 'Noto Sans', fontSize: '12px' }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6B7280"
                style={{ fontFamily: 'Noto Sans', fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontFamily: 'Noto Sans',
                  fontSize: '14px',
                }}
              />
              <Bar dataKey="value" fill="#F0A500" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-50"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-8 py-6 border-b border-[#E5E7EB]"
              style={{ height: '80px' }}
            >
              <div className="flex items-center gap-6">
                <h2
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0D1B2A',
                  }}
                  data-i18n="modal_chart_fullscreen"
                >
                  {chartTitle}
                </h2>

                {/* Date Range Selector */}
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F0A500] cursor-pointer"
                    style={{
                      fontFamily: 'Noto Sans',
                      fontSize: '14px',
                      color: '#0D1B2A',
                      minWidth: '160px',
                    }}
                  >
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown
                    size={16}
                    color="#6B7280"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  />
                </div>
              </div>

              <button
                onClick={onClose}
                className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-lg hover:bg-[#F8F9FA] transition-colors"
              >
                <X size={28} color="#6B7280" />
              </button>
            </div>

            {/* Chart Area */}
            <div className="p-8" style={{ height: 'calc(100vh - 80px)' }}>
              <div className="w-full h-full">
                {renderChart()}
              </div>
            </div>

            {/* Helper Text for Drill-Down */}
            {onDrillDown && (
              <div
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full"
                style={{
                  backgroundColor: 'rgba(13, 27, 42, 0.9)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Noto Sans',
                    fontSize: '13px',
                    color: 'white',
                  }}
                >
                  Click on chart segments to drill down into detailed data
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
