import React, { useState, useEffect } from 'react';

interface DateFilterProps {
  onFilter: (appeals: any[]) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = async (from: string, to?: string) => {
    const params = new URLSearchParams();

    if (from && to) {
      const toPlusDay = new Date(to)
      toPlusDay.setDate(toPlusDay.getDate() + 1)

      params.append('from', from);
      params.append('to', toPlusDay.toString());
    } else if (from && !to) {
      params.append('date', from);
    }

    try {
      const res = await fetch(`http://localhost:3001/appeals?${params.toString()}`);
      if (!res.ok) {
        console.error('Ошибка запроса:', res.statusText);
        return;
      }
      const data = await res.json();
      onFilter(data);
    } catch (err) {
      console.error('Ошибка фильтрации:', err);
    }
  };

  useEffect(() => {
    if (startDate && !endDate) {
      handleFilter(startDate); // Только одна дата
    } else if (startDate && endDate) {
      handleFilter(startDate, endDate); // Диапазон
    }
  }, [startDate, endDate]);

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span>от </span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{width: '120px', height: '24px', borderRadius: '8px', border: '1px solid #50C991', padding: '4px 4px 4px 8px'}}
      />
      <span>до </span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{width: '120px', height: '24px', borderRadius: '8px', border: '1px solid #50C991', padding: '4px 4px 4px 8px'}}
      />
    </div>
  );
};