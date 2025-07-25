import * as XLSX from 'xlsx';
import { ProductCost } from '../types/product';
import { formatCurrency } from './formatters';
import { Timestamp } from 'firebase/firestore';

export function exportHistoryToExcel(history: ProductCost[], filename?: string) {
  // Prepare data for Excel export
  const excelData = history.map((item, index) => {
    const createdAt = item.createdAt 
      ? (item.createdAt instanceof Timestamp 
         ? item.createdAt.toDate() 
         : item.createdAt)
      : new Date();

    return {
      '#': index + 1,
      'Product Name': item.productName,
      'Filament Type': item.filamentType,
      'Material Cost (₹/kg)': item.materialCostPerKg,
      'Weight Used (g)': item.materialWeightUsed,
      'Packaging Cost (₹)': item.packagingCost,
      'Print Time (min)': item.printTimeMinutes,
      'Machine Rate (₹/hr)': item.machineHourlyRate,
      'Electricity Cost (₹/hr)': item.electricityCostPerHour,
      'Setup Time (min)': item.setupTimeMinutes,
      'Design Time (min)': item.designTimeMinutes,
      'Post Processing (min)': item.postProcessingTimeMinutes,
      'Labor Rate (₹/hr)': item.hourlyLaborRate,
      'Overhead %': item.overheadPercentage,
      'Waste Rate %': item.failureWasteRate,
      'Profit Margin %': item.desiredProfitMargin,
      'Quantity': item.quantity || 1,
      'Is Wholesale': item.isWholesale ? 'Yes' : 'No',
      'Total Cost (₹)': item.totalCost || 0,
      'Selling Price (₹)': item.sellingPrice || 0,
      'Profit Amount (₹)': item.profitAmount || 0,
      'Created Date': createdAt.toLocaleDateString(),
      'Created Time': createdAt.toLocaleTimeString(),
    };
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 5 },   // #
    { wch: 20 },  // Product Name
    { wch: 12 },  // Filament Type
    { wch: 15 },  // Material Cost
    { wch: 12 },  // Weight Used
    { wch: 15 },  // Packaging Cost
    { wch: 12 },  // Print Time
    { wch: 15 },  // Machine Rate
    { wch: 15 },  // Electricity Cost
    { wch: 12 },  // Setup Time
    { wch: 12 },  // Design Time
    { wch: 15 },  // Post Processing
    { wch: 12 },  // Labor Rate
    { wch: 10 },  // Overhead %
    { wch: 10 },  // Waste Rate %
    { wch: 12 },  // Profit Margin %
    { wch: 8 },   // Quantity
    { wch: 10 },  // Is Wholesale
    { wch: 12 },  // Total Cost
    { wch: 12 },  // Selling Price
    { wch: 12 },  // Profit Amount
    { wch: 12 },  // Created Date
    { wch: 12 },  // Created Time
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Calculation History');

  // Generate filename if not provided
  const defaultFilename = `cost-calculations-${new Date().toISOString().split('T')[0]}.xlsx`;
  const finalFilename = filename || defaultFilename;

  // Write and download the file
  XLSX.writeFile(workbook, finalFilename);
} 