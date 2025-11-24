import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  label: string;
  key: string;
  formatter?: (value: any) => string;
}

export const exportToCSV = (
  data: any[],
  columns: ExportColumn[],
  filename: string
) => {
  // Create CSV content
  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      const formatted = col.formatter ? col.formatter(value) : value;
      // Escape commas and quotes in CSV
      const escaped = String(formatted || '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (
  data: any[],
  columns: ExportColumn[],
  filename: string
) => {
  // Transform data to worksheet format
  const wsData = [
    columns.map(col => col.label),
    ...data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        return col.formatter ? col.formatter(value) : value;
      })
    )
  ];
  
  // Create worksheet and workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  
  // Auto-size columns
  const maxWidth = 50;
  const colWidths = columns.map((_, colIndex) => {
    const columnData = wsData.map(row => String(row[colIndex] || ''));
    const maxLength = Math.max(...columnData.map(str => str.length));
    return { wch: Math.min(maxLength + 2, maxWidth) };
  });
  ws['!cols'] = colWidths;
  
  // Download file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (
  data: any[],
  columns: ExportColumn[],
  filename: string,
  title: string
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 14, 22);
  
  // Transform data for table
  const tableData = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      return col.formatter ? col.formatter(value) : String(value || '');
    })
  );
  
  // Generate table
  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: tableData,
    startY: 28,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // blue-500
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // gray-50
    },
    margin: { top: 28, left: 14, right: 14 },
  });
  
  // Download file
  doc.save(`${filename}.pdf`);
};
