# Cost Calculator

A comprehensive web application for calculating product pricing and manufacturing costs. Built for makers, artisans, and small businesses to accurately price their products by tracking materials, labor, overhead, and accessories.

## Features

- **Comprehensive Cost Tracking**

  - Material costs with quantity calculations
  - Labor and time tracking
  - Machine/tool costs
  - Business overhead expenses
  - Accessories and add-ons
  - Wholesale pricing options

- **User Management**

  - Secure Firebase authentication
  - Personal calculation history
  - Data persistence across sessions

- **Analysis & Export**

  - Detailed cost breakdowns
  - Historical calculation tracking
  - Export functionality for pricing data
  - Visual cost analysis

- **Modern UI/UX**
  - Dark/light mode toggle
  - Responsive design
  - Interactive tooltips and helpers
  - Clean, professional interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Firebase/Firestore
- **Authentication**: Firebase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Firebase project setup

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cost-calc
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

3. Set up Firebase configuration:

   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase config to `firebase.ts`

4. Run the development server:

```bash
yarn dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign In**: Create an account or sign in with your credentials
2. **Product Setup**: Enter basic product information
3. **Cost Entry**: Add costs for materials, labor, overhead, and accessories
4. **Calculate**: View detailed pricing breakdown and profit margins
5. **Save & Export**: Save calculations to history and export pricing data

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── forms/          # Cost input forms
│   ├── layout/         # Layout components
│   ├── results/        # Results display components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── services/           # External service integrations
└── types/              # TypeScript type definitions
```

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server

## Contributing

This is a personal project, but feel free to fork and adapt for your own use cases.
