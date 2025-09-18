# RSP Visualizer (Petrol & Diesel Prices in Metro Cities)

This project is a **Frontend Data Analysis Task** built using **TypeScript, Vite, Mantine, and Apache ECharts**.  
It visualizes the **Retail Selling Price (RSP)** of Petrol and Diesel across metro cities in India.  

---

## Features

- Load CSV dataset of Petrol & Diesel prices.
- Select **Metro City**, **Fuel Type**, and **Year** from dropdowns.
- Displays **Monthly Average RSP** in a bar chart using **Apache ECharts**.
- Responsive layout with Mantine UI components.
- Handles missing values by treating them as `0`.
- Modular and clean TypeScript code.

---

## Tech Stack

- **TypeScript**
- **Vite**
- **React (with Hooks)**
- **Mantine (UI components)**
- **Apache ECharts (visualization)**

---

## Folder Structure
rsp-visualizer/
│── public/
│ └── data.csv # CSV dataset (place your data here)
│
│── src/
│ ├── components/
│ │ └── RspChart.tsx # ECharts bar chart component
│ │
│ ├── utils/
│ │ ├── parser.ts # CSV parsing logic
│ │ └── aggregations.ts # Aggregation & monthly average functions
│ │
│ ├── types.ts # Type definitions (RawRow etc.)
│ ├── App.tsx # Main UI logic
│ └── main.tsx # React entry point
│
│── package.json
│── vite.config.ts
│── tsconfig.json
│── README.md


---

## Setup & Installation

### 1. Clone the repository
```sh
cd rsp-visualizer

2. Install dependencies
yarn install

3. Add dataset
Place your CSV file as:
public/data.csv

📌 The CSV must contain at least these columns:
city
fuel or fuel_type
date (YYYY-MM-DD or YYYY/MM/DD)
rsp (price value)

4. Start development server
yarn dev

5. Build for production
yarn build

6. Preview production build
yarn preview