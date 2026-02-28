import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionReport } from "@/lib/types";
import { Clock, Box, DollarSign, TrendingDown, AlertTriangle } from "lucide-react";

interface DashboardMetricsProps {
    reports: ProductionReport[];
}

export function DashboardMetrics({ reports }: DashboardMetricsProps) {
    const totalTimeLost = reports.reduce((acc, curr) => acc + curr.totalTimeLost, 0);
    const totalQuantityLost = reports.reduce((acc, curr) => acc + curr.totalQuantityLost, 0);
    const totalCostLost = reports.reduce((acc, curr) => acc + curr.totalCostLost, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Minutes Lost</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{totalTimeLost.toLocaleString()} <span className="text-lg font-normal text-slate-400">mins</span></div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-emerald-500" /> Note: Cumulative across all lines
                    </p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-amber-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Quantity Lost</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <Box className="w-4 h-4 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{totalQuantityLost.toLocaleString()} <span className="text-lg font-normal text-slate-400">units</span></div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Affects daily quota
                    </p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-rose-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-slate-600">Total Cost Increase</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <DollarSign className="w-4 h-4 text-rose-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">
                        ${totalCostLost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-500" /> Direct financial impact
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
