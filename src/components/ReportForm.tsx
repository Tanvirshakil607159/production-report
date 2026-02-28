"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportFormSchema, ReportFormValues } from "@/lib/schema";
import { LossCategory, ProductionReport } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Box, DollarSign, Send, Factory, Target, TextIcon } from "lucide-react";

interface ReportFormProps {
    onSubmitSuccess: (data: ProductionReport) => void;
}

const CATEGORIES: LossCategory[] = [
    "Operator Absenteeism",
    "Machinery/Mechanic Problems",
    "Monitoring Lapses",
    "Raw Materials",
];

const LINES = ["1", "2", "3", "5", "6", "7", "8", "9", "10", "11", "12", "13"];

export function ReportForm({ onSubmitSuccess }: ReportFormProps) {
    const form = useForm<ReportFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(reportFormSchema) as any,
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            lineNumber: "12",
            dailyProductionTarget: undefined as unknown as number, // Let user type initially
            dailyProductionAchieved: undefined as unknown as number,
            workingHours: 10,
            unitPriceUSD: undefined as unknown as number,
            writtenReport: "",
            metrics: {
                "Operator Absenteeism": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Machinery/Mechanic Problems": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Monitoring Lapses": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Raw Materials": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
            },
        },
    });

    const { control, handleSubmit, reset, setValue, getValues } = form;

    const metrics = useWatch({ control, name: "metrics" });
    const dailyTarget = useWatch({ control, name: "dailyProductionTarget" }) || 0;
    const workingHours = useWatch({ control, name: "workingHours" }) || 10;
    const unitPrice = useWatch({ control, name: "unitPriceUSD" }) || 0;

    const handleTimeChange = (category: LossCategory, timeLost: number) => {
        setValue(`metrics.${category}.timeLostMinutes`, timeLost, { shouldValidate: true });

        const wh = workingHours > 0 ? workingHours : 1;
        const qtyLost = (dailyTarget / wh) * (timeLost / 60);
        const costLost = qtyLost * unitPrice;

        setValue(`metrics.${category}.quantityLost`, Number(qtyLost.toFixed(2)), { shouldValidate: true });
        setValue(`metrics.${category}.costLostUSD`, Number(costLost.toFixed(2)), { shouldValidate: true });
    };

    let totalTime = 0;
    let totalQty = 0;
    let totalCost = 0;

    if (metrics) {
        Object.values(metrics).forEach((cat) => {
            totalTime += Number(cat?.timeLostMinutes || 0);
            totalQty += Number(cat?.quantityLost || 0);
            totalCost += Number(cat?.costLostUSD || 0);
        });
    }

    const onSubmit = (data: ReportFormValues) => {
        // Structure final report
        const newReport: ProductionReport = {
            id: crypto.randomUUID(),
            ...data,
            writtenReport: data.writtenReport || "",
            totalTimeLost: totalTime,
            totalQuantityLost: totalQty,
            totalCostLost: totalCost,
        };
        onSubmitSuccess(newReport);
        reset({
            date: new Date().toISOString().split("T")[0],
            lineNumber: data.lineNumber, // Keep same line for mass entry maybe?
            dailyProductionTarget: data.dailyProductionTarget,
            dailyProductionAchieved: data.dailyProductionAchieved,
            workingHours: data.workingHours,
            unitPriceUSD: data.unitPriceUSD,
            writtenReport: "",
            metrics: {
                "Operator Absenteeism": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Machinery/Mechanic Problems": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Monitoring Lapses": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
                "Raw Materials": { timeLostMinutes: 0, quantityLost: 0, costLostUSD: 0 },
            },
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* General Info Card */}
                <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <Factory className="w-5 h-5 text-indigo-600" />
                            General Information
                        </CardTitle>
                        <CardDescription>Enter the date, line, and production targets.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                        <FormField
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="focus-visible:ring-indigo-500 border-slate-200 bg-slate-50/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="lineNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold">Line Number</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="focus:ring-indigo-500 border-slate-200 bg-slate-50/50">
                                                <SelectValue placeholder="Select a line" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {LINES.map((l) => (
                                                <SelectItem key={l} value={l}>Line {l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="dailyProductionTarget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-indigo-500" /> Daily Target (Qty)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Eg. 1000"
                                            type="number"
                                            min="0"
                                            className="focus-visible:ring-indigo-500 border-slate-200 bg-slate-50/50"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={e => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(isNaN(val) ? undefined : val);

                                                // Recalculate metrics
                                                const newTarget = isNaN(val) ? 0 : val;
                                                const currentPrice = getValues("unitPriceUSD") || 0;
                                                const currentWH = getValues("workingHours") || 10;
                                                const wh = currentWH > 0 ? currentWH : 1;
                                                CATEGORIES.forEach(cat => {
                                                    const t = getValues(`metrics.${cat}.timeLostMinutes`) || 0;
                                                    const q = (newTarget / wh) * (t / 60);
                                                    setValue(`metrics.${cat}.quantityLost`, Number(q.toFixed(2)));
                                                    setValue(`metrics.${cat}.costLostUSD`, Number((q * currentPrice).toFixed(2)));
                                                });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="dailyProductionAchieved"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-emerald-500" /> Achieved (Qty)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Eg. 950"
                                            type="number"
                                            min="0"
                                            className="focus-visible:ring-indigo-500 border-slate-200 bg-slate-50/50"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={e => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(isNaN(val) ? undefined : val);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="workingHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-500" /> Working Hrs</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Eg. 10"
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            className="focus-visible:ring-indigo-500 border-slate-200 bg-slate-50/50"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={e => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(isNaN(val) ? undefined : val);

                                                // Recalculate metrics
                                                const newWH = isNaN(val) ? 10 : val;
                                                const wh = newWH > 0 ? newWH : 1;
                                                const currentTarget = getValues("dailyProductionTarget") || 0;
                                                const currentPrice = getValues("unitPriceUSD") || 0;
                                                CATEGORIES.forEach(cat => {
                                                    const t = getValues(`metrics.${cat}.timeLostMinutes`) || 0;
                                                    const q = (currentTarget / wh) * (t / 60);
                                                    setValue(`metrics.${cat}.quantityLost`, Number(q.toFixed(2)));
                                                    setValue(`metrics.${cat}.costLostUSD`, Number((q * currentPrice).toFixed(2)));
                                                });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="unitPriceUSD"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Unit Price ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Eg. 2.50"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="focus-visible:ring-indigo-500 border-slate-200 bg-slate-50/50"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={e => {
                                                const val = e.target.valueAsNumber;
                                                field.onChange(isNaN(val) ? undefined : val);

                                                // Recalculate metrics
                                                const currentTarget = getValues("dailyProductionTarget") || 0;
                                                const newPrice = isNaN(val) ? 0 : val;
                                                const currentWH = getValues("workingHours") || 10;
                                                const wh = currentWH > 0 ? currentWH : 1;
                                                CATEGORIES.forEach(cat => {
                                                    const t = getValues(`metrics.${cat}.timeLostMinutes`) || 0;
                                                    const q = (currentTarget / wh) * (t / 60);
                                                    setValue(`metrics.${cat}.costLostUSD`, Number((q * newPrice).toFixed(2)));
                                                });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Loss Categories */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Separator className="flex-1 bg-slate-200" />
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Loss Categories (Auto Calculated)</h3>
                        <Separator className="flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {CATEGORIES.map((category) => {
                            // Calculate category subtotal
                            const catMetrics = metrics?.[category];
                            const catCost = Number(catMetrics?.costLostUSD || 0);

                            return (
                                <Card key={category} className="border-slate-200 shadow-sm transition-all hover:shadow-md bg-white">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base text-slate-800 flex justify-between items-center">
                                            {category}
                                            <span className="text-sm font-medium text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                                                ${catCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <FormField
                                            control={control}
                                            name={`metrics.${category}.timeLostMinutes`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-600 flex items-center gap-1.5 text-xs font-semibold">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Time (Mins)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="1"
                                                            min="0"
                                                            placeholder="Eg. 30"
                                                            className="focus-visible:ring-indigo-500 h-9"
                                                            {...field}
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                const val = e.target.valueAsNumber;
                                                                const timeLost = isNaN(val) ? 0 : val;
                                                                handleTimeChange(category, timeLost);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`metrics.${category}.quantityLost`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-600 flex items-center gap-1.5 text-xs font-semibold">
                                                        <Box className="w-3.5 h-3.5 text-slate-400" /> Quantity Pcs
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled
                                                            type="number"
                                                            min="0"
                                                            className="bg-slate-50 cursor-not-allowed h-9"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={control}
                                            name={`metrics.${category}.costLostUSD`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-600 flex items-center gap-1.5 text-xs font-semibold">
                                                        <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Cost (USD)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            disabled
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            className="bg-slate-50 cursor-not-allowed h-9"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Additional Written Report */}
                <Card className="border-slate-200 shadow-sm bg-white/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                            <TextIcon className="w-4 h-4 text-indigo-600" />
                            Written Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={control}
                            name="writtenReport"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write the detailed reason behind the production losses here..."
                                            className="resize-none h-24 focus-visible:ring-indigo-500 bg-slate-50/50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Totals Summary */}
                <Card className="bg-slate-900 border-none text-white shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-emerald-600/20 pointer-events-none" />
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex gap-8 items-center flex-1 w-full justify-between md:justify-start">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Total Hours
                                </p>
                                <p className="text-2xl font-bold text-white">{totalTime.toFixed(1)} <span className="text-sm font-normal text-slate-400">hrs</span></p>
                            </div>
                            <Separator orientation="vertical" className="h-10 bg-slate-700 hidden md:block" />
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-1">
                                    <Box className="w-4 h-4" /> Total Qty
                                </p>
                                <p className="text-2xl font-bold text-white">{totalQty.toFixed(1)}</p>
                            </div>
                            <Separator orientation="vertical" className="h-10 bg-slate-700 hidden md:block" />
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" /> Total Cost
                                </p>
                                <p className="text-2xl font-bold text-emerald-400">
                                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all rounded-full px-8">
                            Submit Report <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

            </form>
        </Form>
    );
}
