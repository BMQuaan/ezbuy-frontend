// src/components/admin/AdminTable.tsx

import React from 'react';

interface AdminTableProps {
  headers: string[];
  data: React.ReactNode[][];
}

export const AdminTable: React.FC<AdminTableProps> = ({ headers, data }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-muted shadow-md">
        <table className="min-w-full divide-y divide-border bg-card">
          <thead className="bg-muted/70 backdrop-blur">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[--color-primary-200]/40 transition-all duration-200"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-6 text-center text-[--color-secondary] bg-[--color-card]">
            Not Found.
          </div>
        )}
      </div>
    );
  };
  