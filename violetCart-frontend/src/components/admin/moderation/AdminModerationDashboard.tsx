import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    CheckCircle,
    UserX,
    Filter,
    Search,
    Eye,
    RefreshCw
} from 'lucide-react';
import ReportDetailsModal from './ReportDetailsModal';
import BanUserModal from './BanUserModal';

export default function AdminModerationDashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal states
    const [selectedReport, setSelectedReport] = useState(null);
    const [targetBanUser, setTargetBanUser] = useState(null);

    // Fetch initial data from backend API
    const fetchReports = async () => {
        setLoading(true);
        try {
            // Replace URL with your actual endpoint: /api/v1/admin/moderation/reports
            const response = await fetch('/api/v1/admin/moderation/reports');
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            } else {
                // Fallback mock data if API is not yet running
                setReports(getMockData());
            }
        } catch (err) {
            console.warn("Backend unavailable, using fallback mock data.");
            setReports(getMockData());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Filter and Search logic
    const filteredReports = reports.filter((report) => {
        const matchesStatus =
            filterStatus === 'ALL' || report.status === filterStatus;

        const query = searchQuery.toLowerCase();
        const matchesSearch =
            report.id.toString().includes(query) ||
            report.reportedUser?.email?.toLowerCase().includes(query) ||
            report.reporter?.email?.toLowerCase().includes(query) ||
            report.reason?.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    // Dynamic Metric Calculations
    const openCount = reports.filter((r) => r.status === 'OPEN').length;
    const bannedCount = reports.filter((r) => r.status === 'RESOLVED_BANNED').length;
    const dismissedCount = reports.filter((r) => r.status === 'RESOLVED_DISMISSED').length;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN':
                return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Open</span>;
            case 'RESOLVED_BANNED':
                return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">User Banned</span>;
            case 'RESOLVED_DISMISSED':
                return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Dismissed</span>;
            default:
                return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{status}</span>;
        }
    };

    const handleDismissReport = async (reportId) => {
        try {
            const response = await fetch(`/api/v1/admin/moderation/reports/${reportId}/dismiss`, {
                method: 'PATCH',
            });
            if (response.ok || true) { // Fallback optimistic update
                setReports((prev) =>
                    prev.map((r) => (r.id === reportId ? { ...r, status: 'RESOLVED_DISMISSED' } : r))
                );
            }
        } catch (err) {
            console.error("Failed to dismiss report:", err);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Moderation Queue</h1>
                    <p className="text-sm text-gray-500">Review flagged accounts and enforce platform safety rules.</p>
                </div>
                <button
                    onClick={fetchReports}
                    className="px-3.5 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition inline-flex items-center space-x-2 shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Reports</p>
                        <h3 className="text-2xl font-bold text-gray-900">{openCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <UserX className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Accounts Banned</p>
                        <h3 className="text-2xl font-bold text-gray-900">{bannedCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Dismissed Reports</p>
                        <h3 className="text-2xl font-bold text-gray-900">{dismissedCount}</h3>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by report ID, email, or reason..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="RESOLVED_BANNED">Resolved (Banned)</option>
                        <option value="RESOLVED_DISMISSED">Dismissed</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-3">Report ID</th>
                        <th className="px-6 py-3">Reported User</th>
                        <th className="px-6 py-3">Reason</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredReports.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                No reports found matching your criteria.
                            </td>
                        </tr>
                    ) : (
                        filteredReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">#{report.id}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{report.reportedUser?.email}</p>
                                        <p className="text-xs text-gray-400">ID: {report.reportedUser?.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-700">{report.reason}</span>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-xs transition inline-flex items-center space-x-1"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Inspect</span>
                                    </button>
                                    {report.status === 'OPEN' && (
                                        <button
                                            onClick={() => setTargetBanUser(report.reportedUser)}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-xs transition inline-flex items-center space-x-1"
                                        >
                                            <UserX className="w-3.5 h-3.5" />
                                            <span>Ban User</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Report Inspection Modal */}
            {selectedReport && (
                <ReportDetailsModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onBanTrigger={(userToBan) => {
                        setSelectedReport(null);
                        setTargetBanUser(userToBan);
                    }}
                    onDismissTrigger={(reportId) => {
                        handleDismissReport(reportId);
                        setSelectedReport(null);
                    }}
                />
            )}

            {/* User Ban Confirmation Modal */}
            {targetBanUser && (
                <BanUserModal
                    user={targetBanUser}
                    onClose={() => setTargetBanUser(null)}
                    onSuccess={(bannedUserId) => {
                        // Update table state: mark all reports for banned user as RESOLVED_BANNED
                        setReports((prev) =>
                            prev.map((r) =>
                                r.reportedUser?.id === bannedUserId
                                    ? { ...r, status: 'RESOLVED_BANNED' }
                                    : r
                            )
                        );
                        setTargetBanUser(null);
                    }}
                />
            )}
        </div>
    );
}

// Fallback Mock Data generator
function getMockData() {
    return [
        {
            id: 101,
            reportType: 'USER',
            reason: 'FRAUD',
            description: 'Listing non-existent items and taking payment upfront via third-party channels.',
            status: 'OPEN',
            createdAt: '2026-08-01T10:30:00',
            reporter: { id: 1, email: 'reporter1@example.com' },
            reportedUser: { id: 2, email: 'violator@example.com', status: 'ACTIVE' },
        },
        {
            id: 102,
            reportType: 'USER',
            reason: 'SPAM',
            description: 'Sending unsolicited affiliate links repeatedly across product comment sections.',
            status: 'OPEN',
            createdAt: '2026-08-02T08:15:00',
            reporter: { id: 3, email: 'user3@example.com' },
            reportedUser: { id: 2, email: 'violator@example.com', status: 'ACTIVE' },
        },
        {
            id: 103,
            reportType: 'USER',
            reason: 'HARASSMENT',
            description: 'Inappropriate language in seller communication.',
            status: 'RESOLVED_DISMISSED',
            createdAt: '2026-07-28T14:20:00',
            reporter: { id: 4, email: 'user4@example.com' },
            reportedUser: { id: 5, email: 'seller99@example.com', status: 'ACTIVE' },
        }
    ];
}