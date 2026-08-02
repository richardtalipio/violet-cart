import React from 'react';
import {
    X,
    ShieldAlert,
    User,
    Calendar,
    FileText,
    CheckCircle,
    UserX,
    Clock
} from 'lucide-react';

export default function ReportDetailsModal({ report, onClose, onBanTrigger, onDismissTrigger }) {
    if (!report) return null;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN':
                return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">Open</span>;
            case 'RESOLVED_BANNED':
                return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">User Banned</span>;
            case 'RESOLVED_DISMISSED':
                return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">Dismissed</span>;
            default:
                return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden border border-gray-100">

                {/* Modal Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-gray-900">Report #{report.id}</h2>
                        {getStatusBadge(report.status)}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                    {/* Target & Type Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Reported Target</span>
              </span>
                            <p className="font-semibold text-gray-900">{report.reportedUser?.email || 'N/A'}</p>
                            <p className="text-xs text-gray-500">User ID: {report.reportedUser?.id}</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Reporter</span>
              </span>
                            <p className="font-semibold text-gray-900">{report.reporter?.email || 'N/A'}</p>
                            <p className="text-xs text-gray-500">User ID: {report.reporter?.id}</p>
                        </div>
                    </div>

                    {/* Reason & Date Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase">Reason Category</span>
                            <p className="text-sm font-medium text-gray-800 mt-1">{report.reason}</p>
                        </div>
                        <div>
              <span className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Submitted On</span>
              </span>
                            <p className="text-sm font-medium text-gray-800 mt-1">
                                {new Date(report.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* User Provided Description */}
                    <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Report Description</span>
            </span>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {report.description || 'No additional details provided by the reporter.'}
                        </div>
                    </div>

                    {/* Admin Audit Notes (If Resolved) */}
                    {report.adminNotes && (
                        <div className="space-y-1 pt-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-amber-700 uppercase flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Resolution Audit Trail</span>
              </span>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                                {report.adminNotes}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Close
                    </button>

                    {report.status === 'OPEN' && (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => onDismissTrigger(report.id)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg text-sm font-medium transition inline-flex items-center space-x-1"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Dismiss Report</span>
                            </button>
                            <button
                                onClick={() => onBanTrigger(report.reportedUser)}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition inline-flex items-center space-x-1"
                            >
                                <UserX className="w-4 h-4" />
                                <span>Ban User & Resolve</span>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}