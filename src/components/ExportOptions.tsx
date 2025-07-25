"use client";

import React from "react";

interface ExportOptionsProps {
  productName: string;
  calculations: {
    materialCost: number;
    machineCost: number;
    laborCost: number;
    baseCost: number;
    overheadCost: number;
    wasteAllowance: number;
    totalCost: number;
    sellingPrice: number;
    profitAmount: number;
  };
  formData: any;
}

export default function ExportOptions({
  productName,
  calculations,
  formData,
}: ExportOptionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handlePrint = () => {
    const printContent = generatePrintContent();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportJSON = () => {
    const data = {
      productName,
      calculations,
      formData,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_cost_calculation.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>3D Print Cost Calculation - ${productName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .section h3 {
              background-color: #f5f5f5;
              padding: 10px;
              margin: 0 0 15px 0;
              border-left: 4px solid #007bff;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            .grid-item {
              display: flex;
              justify-content: space-between;
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            .total-section {
              background-color: #f8f9fa;
              padding: 20px;
              border: 2px solid #007bff;
              border-radius: 5px;
            }
            .total-item {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 16px;
            }
            .final-total {
              font-size: 18px;
              font-weight: bold;
              border-top: 2px solid #333;
              padding-top: 10px;
              margin-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>3D Printing Cost Calculation</h1>
            <h2>${productName}</h2>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
          </div>

          <div class="section">
            <h3>Material Information</h3>
            <div class="grid">
              <div class="grid-item"><span>Filament Type:</span><span>${
                formData.filamentType
              }</span></div>
              <div class="grid-item"><span>Cost per KG:</span><span>${formatCurrency(
                formData.materialCostPerKg
              )}</span></div>
              <div class="grid-item"><span>Material Weight:</span><span>${
                formData.materialWeightUsed
              }g</span></div>
              <div class="grid-item"><span>Support Weight:</span><span>${
                formData.supportMaterialWeight
              }g</span></div>
              <div class="grid-item"><span>Packaging Cost:</span><span>${formatCurrency(
                formData.packagingCost
              )}</span></div>
            </div>
          </div>

          <div class="section">
            <h3>Time & Machine Details</h3>
            <div class="grid">
              <div class="grid-item"><span>Print Time:</span><span>${
                formData.printTimeHours
              }h ${formData.printTimeMinutes}m</span></div>
              <div class="grid-item"><span>Machine Rate:</span><span>${formatCurrency(
                formData.machineHourlyRate
              )}/hour</span></div>
              <div class="grid-item"><span>Electricity Rate:</span><span>${formatCurrency(
                formData.electricityCostPerHour
              )}/hour</span></div>
              <div class="grid-item"><span>Setup Time:</span><span>${
                formData.setupTimeMinutes
              } minutes</span></div>
            </div>
          </div>

          <div class="section">
            <h3>Labor Information</h3>
            <div class="grid">
              <div class="grid-item"><span>Design Time:</span><span>${
                formData.designTimeHours
              } hours</span></div>
              <div class="grid-item"><span>Post-processing:</span><span>${
                formData.postProcessingTimeMinutes
              } minutes</span></div>
              <div class="grid-item"><span>Labor Rate:</span><span>${formatCurrency(
                formData.hourlyLaborRate
              )}/hour</span></div>
            </div>
          </div>

          <div class="section">
            <h3>Business Parameters</h3>
            <div class="grid">
              <div class="grid-item"><span>Overhead:</span><span>${
                formData.overheadPercentage
              }%</span></div>
              <div class="grid-item"><span>Waste Rate:</span><span>${
                formData.failureWasteRate
              }%</span></div>
              <div class="grid-item"><span>Profit Margin:</span><span>${
                formData.desiredProfitMargin
              }%</span></div>
            </div>
          </div>

          <div class="total-section">
            <h3 style="margin: 0 0 15px 0; background: none; padding: 0; border: none;">Cost Breakdown</h3>
            <div class="total-item"><span>Material Cost:</span><span>${formatCurrency(
              calculations.materialCost
            )}</span></div>
            <div class="total-item"><span>Machine & Electricity:</span><span>${formatCurrency(
              calculations.machineCost
            )}</span></div>
            <div class="total-item"><span>Labor Cost:</span><span>${formatCurrency(
              calculations.laborCost
            )}</span></div>
            <div class="total-item"><span>Overhead Cost:</span><span>${formatCurrency(
              calculations.overheadCost
            )}</span></div>
            <div class="total-item"><span>Waste Allowance:</span><span>${formatCurrency(
              calculations.wasteAllowance
            )}</span></div>
            <div class="total-item final-total"><span>Total Cost:</span><span>${formatCurrency(
              calculations.totalCost
            )}</span></div>
            <div class="total-item final-total" style="color: #28a745;"><span>Selling Price:</span><span>${formatCurrency(
              calculations.sellingPrice
            )}</span></div>
            <div class="total-item final-total" style="color: #28a745;"><span>Profit:</span><span>${formatCurrency(
              calculations.profitAmount
            )}</span></div>
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            Generated by 3D Print Cost Calculator
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
        Export Options
      </h3>
      <div className="space-y-2">
        <button
          onClick={handlePrint}
          className="btn-secondary w-full px-4 py-2 text-sm"
        >
          🖨️ Print Report
        </button>
        <button
          onClick={handleExportJSON}
          className="btn-secondary w-full px-4 py-2 text-sm"
        >
          📁 Export as JSON
        </button>
      </div>
    </div>
  );
}
