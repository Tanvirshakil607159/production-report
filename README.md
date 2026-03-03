# Production Report System

A modern, responsive web application built with Next.js for tracking and analyzing garment production losses.

## Key Features

- **Production Tracking**: Record daily targets, achievements, and working hours for multiple lines.
- **Detailed Loss Categorization**: Track losses across specific categories:
    - Operator Absenteeism
    - Machinery/Mechanic Problems
    - Monitoring Lapses
    - Raw Materials
    - Needle Issue
- **Precision Calculations**: Quantity and cost losses are automatically calculated using a refined formula considering downtime, machine-off counts, and total line capacity.
- **Interactive Dashboard**: Real-time visualization of time and cost losses using dynamic charts (Recharts).
- **Fast Data Entry**: Keyboard-optimized form with "Enter-to-next-input" functionality.
- **Responsive Design**: Beautiful, glassmorphic UI built with Tailwind CSS and Radix UI components.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **Components**: Shadcn UI
