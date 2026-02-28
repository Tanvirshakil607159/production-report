"use client";

import { ProductionReport, LossCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface DashboardChartsProps {
    reports: ProductionReport[];
}

const CATEGORIES: LossCategory[] = [
    "Operator Absenteeism",
    "Machinery/Mechanic Problems",
    "Monitoring Lapses",
    "Raw Materials",
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e"]; // Indigo, Emerald, Amber, Rose

export function DashboardCharts({ reports }: DashboardChartsProps) {
    // Aggregate data for Cost Lost across categories
    const costData = CATEGORIES.map((category) => {
        const totalCost = reports.reduce(
            (acc, report) => acc + (report.metrics[category]?.costLostUSD || 0),
            0
        );
        return { name: category, cost: totalCost };
    });

    // Aggregate data for Time Lost across categories
    const timeData = CATEGORIES.map((category) => {
        const totalTime = reports.reduce(
            (acc, report) => acc + (report.metrics[category]?.timeLostMinutes || 0),
            0
        );
        return { name: category, value: totalTime };
    }).filter((d) => d.value > 0); // Don't show empty slices

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderCustomizedLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        if (percent === 0) return null;

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* Bar Chart: Cost Lost */}
            <Card className="border-slate-200 shadow-sm flex flex-col bg-white/50 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Cost Lost by Category
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                    {reports.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No data available</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                    angle={-25}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(val) => `$${val}`}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value: number | string | undefined) => [`$${Number(value || 0).toFixed(2)}`, "Cost Lost"]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                                />
                                <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                                    {costData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Donut Chart: Time Lost */}
            <Card className="border-slate-200 shadow-sm flex flex-col bg-white/50 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Time Lost Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
                    {reports.length === 0 || timeData.length === 0 ? (
                        <div className="text-slate-400">No time lost recorded</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={timeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {timeData.map((entry, index) => {
                                        const colorIndex = CATEGORIES.indexOf(entry.name);
                                        return <Cell key={`cell-${index}`} fill={COLORS[colorIndex >= 0 ? colorIndex : 0]} />;
                                    })}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number | string | undefined) => [`${Number(value || 0).toLocaleString()} mins`, "Time Lost"]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
