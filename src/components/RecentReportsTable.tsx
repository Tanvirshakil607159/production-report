import { ProductionReport } from "@/lib/types";
import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableBody
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentReportsTableProps {
    reports: ProductionReport[];
    onDelete: (id: string) => void;
}

export function RecentReportsTable({ reports, onDelete }: RecentReportsTableProps) {
    // Sort reports by date descending
    const sortedReports = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card className="mt-6 border-slate-200 shadow-sm bg-white/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    Recent Reports
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reports.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No reports submitted yet.</div>
                ) : (
                    <div className="rounded-md border border-slate-200 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="w-[120px]">Date</TableHead>
                                    <TableHead>Line</TableHead>
                                    <TableHead className="text-right">Daily Target</TableHead>
                                    <TableHead className="text-right">Achieved</TableHead>
                                    <TableHead className="text-right">Mins Lost</TableHead>
                                    <TableHead className="text-right">Qty Lost</TableHead>
                                    <TableHead className="text-right">Cost Lost</TableHead>
                                    <TableHead className="text-right">Reason</TableHead>
                                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedReports.map((report) => (
                                    <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-medium text-slate-900">
                                            {format(new Date(report.date), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700">
                                                Line {report.lineNumber}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-600">{report.dailyProductionTarget.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-emerald-600 font-medium">{report.dailyProductionAchieved.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-slate-600">{report.totalTimeLost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-slate-600">{report.totalQuantityLost.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-medium text-rose-600">
                                            ${report.totalCostLost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-500 max-w-[150px] truncate" title={report.writtenReport || ""}>
                                            {report.writtenReport || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(report.id)}
                                                className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
