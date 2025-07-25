Build a 3D Printing Cost Calculator web UI that helps calculate the total cost and selling price for 3D printed products. The application should be clean, professional, and mobile-friendly.

## Input Fields Required

- name of the product

### Material Costs

- **Filament/Resin Type** (dropdown): PLA, ABS, PETG, TPU
- **Material Cost per KG** (number input in ₹)
- **Material Weight Used** (number input in grams)
- **Support Material Weight** (number input in grams, optional)
- **Packaging Cost** (number input in ₹)

### Time & Machine Costs

- **Print Time** (time input in hours and minutes)
- **Machine Hourly Rate** (number input in ₹/hour)
- **Electricity Cost per Hour** (number input in ₹/hour)
- **Setup/Preparation Time** (time input in minutes)

### Labor Costs

- **Design Time** (time input in hours, optional)
- **Post-Processing Time** (time input in minutes)
- **Hourly Labor Rate** (number input in ₹/hour)

### Business Costs

- **Overhead Percentage** (number input, default 15%)
- **Failure/Waste Rate** (number input, default 8%)
- **Desired Profit Margin** (number input, default 40%)

## Calculations & Features

### Cost Breakdown Display

- Material cost calculation
- Machine time cost
- Labor cost calculation
- Overhead cost
- Waste allowance
- **Total Cost** (sum of all costs)
- **Selling Price** (cost + profit margin)
- **Profit Amount**

### Additional Features

- **Save/Load Presets** for common material types and settings
- **Batch Calculator** for multiple identical items
- **Cost per Unit** display for bulk orders
- **Export/Print** cost breakdown as PDF or print-friendly format
- **Currency Display** in Indian Rupees (₹)
- **Real-time Calculation** as user types

## UI/UX Requirements

### Design

- use tailwind css for styling
- Clean, modern interface with good spacing
- Mobile-responsive design
- Use cards/sections to organize input groups
- Clear visual hierarchy with proper typography
- Color-coded results (cost in blue, profit in green)

### User Experience

- Input validation with helpful error messages
- Tooltips for complex fields
- Auto-save form data in browser
- Reset/Clear form button

### Technical Specifications

- CSS3 with Flexbox for responsive layout
- Form validation with custom error messages
- Print-friendly CSS media queries
- No external dependencies required

### Firebase

- use firebase for authentication with email and password
- fetch all documents from firebase firestore `product-costs` collection to prefill history
- save all data as a new firebase document in the same collection (document name should be derived from the name of the product + a a few random characters)

### Code Organization

- Use clear, descriptive function names and comments
- Use CSS custom properties (variables) for easy theming for light and dark theme
- Implement proper error handling and input validation
- Follow modern JavaScript best practices

### Cursor-Specific Instructions

- Create a complete, production-ready project structure
- Add helpful code comments for future modifications
- Implement features incrementally with clear function separation

## Sample Calculation Logic

```
Material Cost = (Weight in grams ÷ 1000) × Cost per KG
Machine Cost = Print Time × Machine Hourly Rate
Labor Cost = (Setup + Design + Post-processing) × Labor Rate
Base Cost = Material + Machine + Labor + Packaging
Overhead = Base Cost × Overhead Percentage
Waste Allowance = Base Cost × Waste Rate
Total Cost = Base Cost + Overhead + Waste Allowance
Selling Price = Total Cost ÷ (1 - Profit Margin %)
```

The application should be immediately usable for a 3D printing business owner in Mumbai, India, with realistic default values and Indian Rupee formatting throughout.
