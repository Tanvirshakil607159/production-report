export type LossCategory =
    | "Operator Absenteeism"
    | "Machinery/Mechanic Problems"
    | "Monitoring Lapses"
    | "Raw Materials";

export interface CategoryMetrics {
    timeLostMinutes: number;
    quantityLost: number;
    costLostUSD: number;
}

export type MetricsData = Record<LossCategory, CategoryMetrics>;

export interface ProductionReport {
    id?: string;
    date: string;
    lineNumber: string;
    workingHours: number;
    dailyProductionTarget: number;
    dailyProductionAchieved: number;
    unitPriceUSD: number;
    writtenReport: string;
    metrics: MetricsData;
    totalTimeLost: number;
    totalQuantityLost: number;
    totalCostLost: number;
}
