"use client";

import { useState } from "react";
import { ProductionReport } from "@/lib/types";
import { ReportForm } from "@/components/ReportForm";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { DashboardCharts } from "@/components/DashboardCharts";
import { RecentReportsTable } from "@/components/RecentReportsTable";
import { LayoutDashboard, FilePlus2 } from "lucide-react";

export default function Home() {
  const [reports, setReports] = useState<ProductionReport[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "new-report">("new-report");

  const handleCreateReport = (report: ProductionReport) => {
    setReports((prev) => [report, ...prev]);
    setActiveTab("dashboard");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Flow<span className="text-indigo-600">Sync</span>
            </h1>
          </div>

          <nav className="flex gap-1 md:gap-2">
            <button
              onClick={() => setActiveTab("new-report")}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${activeTab === "new-report"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <FilePlus2 className="w-4 h-4" />
              <span className="hidden sm:inline">New Report</span>
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${activeTab === "dashboard"
                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {activeTab === "new-report" ? "Daily Production Loss" : "Analytics Overview"}
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            {activeTab === "new-report"
              ? "Track disruptions and quantify losses systematically."
              : "Visualize cumulative losses and identify core inefficiencies."}
          </p>
        </div>

        <div className="relative">
          {/* Dashboard View */}
          <div className={`transition-all duration-500 ease-in-out ${activeTab === "dashboard" ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none z-0"
            }`}>
            <DashboardMetrics reports={reports} />
            <DashboardCharts reports={reports} />
            <RecentReportsTable reports={reports} />
          </div>

          {/* Form View */}
          <div className={`transition-all duration-500 ease-in-out ${activeTab === "new-report" ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none z-0"
            }`}>
            <div className="max-w-4xl mx-auto">
              <ReportForm onSubmitSuccess={handleCreateReport} />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
