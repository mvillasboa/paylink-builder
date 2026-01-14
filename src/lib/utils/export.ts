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

/**
 * Creates an Excel-compatible XML Spreadsheet (SpreadsheetML) file.
 * This is a pure JS implementation that doesn't rely on vulnerable xlsx library.
 * The generated file opens correctly in Excel, LibreOffice, and Google Sheets.
 */
export const exportToExcel = (
  data: any[],
  columns: ExportColumn[],
  filename: string
) => {
  // Escape XML special characters
  const escapeXml = (str: string): string => {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Build XML Spreadsheet
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<?mso-application progid="Excel.Sheet"?>\n';
  
  const workbookStart = `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    <Styles>
      <Style ss:ID="Header">
        <Font ss:Bold="1"/>
        <Interior ss:Color="#3B82F6" ss:Pattern="Solid"/>
        <Font ss:Color="#FFFFFF"/>
      </Style>
    </Styles>
    <Worksheet ss:Name="Datos">
      <Table>`;
  
  // Header row
  const headerRow = '<Row ss:StyleID="Header">' + 
    columns.map(col => `<Cell><Data ss:Type="String">${escapeXml(col.label)}</Data></Cell>`).join('') + 
    '</Row>';
  
  // Data rows
  const dataRows = data.map(item => {
    const cells = columns.map(col => {
      const value = item[col.key];
      const formatted = col.formatter ? col.formatter(value) : value;
      const cellValue = escapeXml(String(formatted ?? ''));
      // Detect if value is numeric
      const isNumber = !isNaN(Number(value)) && value !== null && value !== '' && typeof value !== 'boolean';
      const dataType = isNumber ? 'Number' : 'String';
      const displayValue = isNumber ? String(value) : cellValue;
      return `<Cell><Data ss:Type="${dataType}">${displayValue}</Data></Cell>`;
    }).join('');
    return `<Row>${cells}</Row>`;
  }).join('\n');
  
  const workbookEnd = `</Table></Worksheet></Workbook>`;
  
  const xmlContent = xmlHeader + workbookStart + headerRow + dataRows + workbookEnd;
  
  // Create and download file with .xls extension (XML Spreadsheet format)
  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
