import React from 'react';
import { useGetLoyaltyHistoryQuery } from '@/api/loyaltyApi';
import { format } from 'date-fns';
import { Diamond, ArrowUpCircle, ArrowDownCircle, RefreshCcw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';

const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'EARN':
            return <ArrowUpCircle className="w-5 h-5 text-green-500" />;
        case 'SPEND':
            return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
        case 'REFUND':
            return <RefreshCcw className="w-5 h-5 text-blue-500" />;
        case 'EXPIRE':
            return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        default:
            return <Diamond className="w-5 h-5 text-gray-400" />;
    }
};

export const LoyaltyHistory = () => {
    const { data: history, isLoading } = useGetLoyaltyHistoryQuery();
    const { profile } = useProfile();

    if (isLoading) {
        return <div className="animate-pulse flex flex-col space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl" />)}
        </div>;
    }

    if (!history || history.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-500">
                No transaction history found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter text-black">Ledger History</h2>
                <div className="flex items-center gap-2 bg-violet-600 px-4 py-2 rounded-full shadow-sm shadow-violet-200">
                    <Diamond className="w-4 h-4 text-white fill-white" />
                    <span className="text-sm font-black text-white">{profile?.loyaltyPoints || 0} PTS</span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-bottom border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.map((entry) => (
                                <tr key={entry._id} className="hover:bg-gray-50/50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <TypeIcon type={entry.type} />
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-0.5 rounded",
                                                entry.type === 'EARN' ? "bg-green-50 text-green-600" :
                                                    entry.type === 'SPEND' ? "bg-red-50 text-red-600" :
                                                        entry.type === 'REFUND' ? "bg-blue-50 text-blue-600" :
                                                            "bg-orange-50 text-orange-600"
                                            )}>
                                                {entry.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-sm font-black",
                                            (entry.type === 'EARN' || entry.type === 'REFUND') ? "text-green-600" : "text-red-600"
                                        )}>
                                            {(entry.type === 'EARN' || entry.type === 'REFUND') ? '+' : '-'}{entry.points}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-600 font-medium">{entry.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
