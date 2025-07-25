import * as XLSX from 'xlsx';
import { ProductCost } from '../types/product';
import { Timestamp } from 'firebase/firestore';
import { calculateCosts } from './calculations';

export function exportHistoryToExcel(history: ProductCost[], filename?: string) {
  if (history.length === 0) {
    return;
  }

  // Calculate detailed breakdowns for each product
  const productsWithCalculations = history.map((item, index) => {
    const calculations = calculateCosts(item);
    const createdAt = item.createdAt 
      ? (item.createdAt instanceof Timestamp 
         ? item.createdAt.toDate() 
         : item.createdAt)
      : new Date();

    return {
      product: item,
      calculations,
      createdAt,
      index: index + 1
    };
  });

  // Create the vertical structure - each row is a field, each column is a product
  const rows = [
    // Header row with product names
    {
      Field: 'Product Name',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.productName;
        return acc;
      }, {} as Record<string, any>)
    },
    
    // Product Information Section
    { Field: '--- PRODUCT INFORMATION ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Filament Type',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.filamentType;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Quantity',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.quantity || 1;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Is Wholesale',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.isWholesale ? 'Yes' : 'No';
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Created Date',
      ...productsWithCalculations.reduce((acc, { createdAt, index }) => {
        acc[`Product ${index}`] = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
        return acc;
      }, {} as Record<string, any>)
    },

    // Material Costs Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- MATERIAL COSTS ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Material Cost (₹/kg)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.materialCostPerKg;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Weight Used (g)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.materialWeightUsed;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Calculated Material Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.materialCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Packaging Cost (₹)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.packagingCost;
        return acc;
      }, {} as Record<string, any>)
    },

    // Time & Machine Costs Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- TIME & MACHINE COSTS ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Print Time (min)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.printTimeMinutes;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Machine Rate (₹/hr)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.machineHourlyRate;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Electricity Cost (₹/hr)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.electricityCostPerHour;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Setup Time (min)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.setupTimeMinutes;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Calculated Machine Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.machineCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },

    // Labor Costs Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- LABOR COSTS ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Design Time (min)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.designTimeMinutes;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Post Processing Time (min)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.postProcessingTimeMinutes;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Labor Rate (₹/hr)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.hourlyLaborRate;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Calculated Labor Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.laborCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },

    // Accessories Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- ACCESSORIES ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Accessories Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.accessoriesCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },

    // Business Costs Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- BUSINESS COSTS ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Overhead Percentage (%)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.overheadPercentage;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Calculated Overhead Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.overheadCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Failure/Waste Rate (%)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.failureWasteRate;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Calculated Waste Allowance (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.wasteAllowance * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Desired Profit Margin (%)',
      ...productsWithCalculations.reduce((acc, { product, index }) => {
        acc[`Product ${index}`] = product.desiredProfitMargin;
        return acc;
      }, {} as Record<string, any>)
    },

    // Final Results Section
    { Field: '', ...getEmptyProductColumns(productsWithCalculations.length) },
    { Field: '--- FINAL CALCULATIONS ---', ...getEmptyProductColumns(productsWithCalculations.length) },
    {
      Field: 'Base Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.baseCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Total Cost (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.totalCost * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'SELLING PRICE (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.sellingPrice * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    },
    {
      Field: 'Profit Amount (₹)',
      ...productsWithCalculations.reduce((acc, { calculations, index }) => {
        acc[`Product ${index}`] = Math.round(calculations.profitAmount * 100) / 100;
        return acc;
      }, {} as Record<string, any>)
    }
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  const columnWidths = [
    { wch: 25 }, // Field column
    ...Array(productsWithCalculations.length).fill({ wch: 15 }) // Product columns
  ];
  worksheet['!cols'] = columnWidths;

  // Find the selling price row and make it bold
  const sellingPriceRowIndex = rows.findIndex(row => row.Field === 'SELLING PRICE (₹)');
  
  if (sellingPriceRowIndex !== -1) {
    // Style the selling price row
    const rowNum = sellingPriceRowIndex + 1; // XLSX uses 1-based indexing
    
    // Style the field name cell
    const fieldCell = `A${rowNum}`;
    if (!worksheet[fieldCell]) worksheet[fieldCell] = { v: 'SELLING PRICE (₹)' };
    worksheet[fieldCell].s = {
      font: { bold: true, sz: 12 },
      fill: { fgColor: { rgb: 'FFFFE0' } }
    };
    
    // Style each product's selling price cell
    for (let i = 0; i < productsWithCalculations.length; i++) {
      const cellAddr = `${String.fromCharCode(66 + i)}${rowNum}`; // B, C, D, etc.
      if (worksheet[cellAddr]) {
        worksheet[cellAddr].s = {
          font: { bold: true, sz: 12 },
          fill: { fgColor: { rgb: 'FFFFE0' } },
          numFmt: '#,##0.00'
        };
      }
    }
  }

  // Style section headers
  rows.forEach((row, index) => {
    if (row.Field.startsWith('---') && row.Field.endsWith('---')) {
      const rowNum = index + 1;
      const cellAddr = `A${rowNum}`;
      if (!worksheet[cellAddr]) worksheet[cellAddr] = { v: row.Field };
      worksheet[cellAddr].s = {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: 'E6E6E6' } }
      };
    }
  });

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Cost Breakdown');

  // Generate filename if not provided
  const defaultFilename = `product-cost-breakdown-${new Date().toISOString().split('T')[0]}.xlsx`;
  const finalFilename = filename || defaultFilename;

  // Write and download the file
  XLSX.writeFile(workbook, finalFilename);
}

function getEmptyProductColumns(numProducts: number): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 1; i <= numProducts; i++) {
    result[`Product ${i}`] = '';
  }
  return result;
} 