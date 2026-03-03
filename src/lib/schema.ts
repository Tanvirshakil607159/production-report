import * as z from "zod";

const categoryMetricsSchema = z.object({
    timeLostMinutes: z.coerce.number().min(0, "Time lost cannot be negative"),
    machineOff: z.coerce.number().min(0, "Machine off cannot be negative"),
    quantityLost: z.coerce.number().min(0, "Quantity cannot be negative"),
    costLostUSD: z.coerce.number().min(0, "Cost cannot be negative"),
});

export const reportFormSchema = z.object({
    date: z.string().min(1, "Date is required"),
    lineNumber: z.enum(["1", "2", "3", "5", "6", "7", "8", "9", "10", "11", "12", "13"], {
        message: "Please select a valid line number.",
    }),
    totalMachines: z.coerce.number().min(1, "Total machines must be at least 1"),
    dailyProductionTarget: z.coerce.number().min(1, "Target must be at least 1"),
    dailyProductionAchieved: z.coerce.number().min(0, "Achieved cannot be negative"),
    workingHours: z.coerce.number().min(0.5, "Working hours must be at least 0.5"),
    unitPriceUSD: z.coerce.number().min(0.01, "Price must be at least 0.01"),
    writtenReport: z.string().optional(),
    metrics: z.object({
        "Operator Absenteeism": categoryMetricsSchema,
        "Machinery/Mechanic Problems": categoryMetricsSchema,
        "Monitoring Lapses": categoryMetricsSchema,
        "Raw Materials": categoryMetricsSchema,
        "Needle Issue": categoryMetricsSchema,
    }),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;
