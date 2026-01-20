import { Sidebar } from "@/components/shared/Sidebar";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex w-full h-screen bg-[#252836] text-white overflow-hidden">
                <Sidebar />
                <main className="flex-1 ml-0 lg:ml-[104px] p-4 lg:p-10 h-full overflow-y-auto custom-scrollbar pb-24 lg:pb-10">
                    <div className="h-full max-w-[1920px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
