import React, { useState } from "react";
import type { Seller } from "@/components/common/types.ts";
import { useSellers } from "@/hooks/useSellers.ts";

const SELLER_STATUS: Record<string, { color: string; bg: string }> = {
    ACTIVE: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    REJECTED: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    BANNED: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    PENDING: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
};

export const SellerTab: React.FC = () => {
    const { sellers, updateSellerStatus, loading, error } = useSellers();
    const [sellerSearch, setSellerSearch] = useState('');
    const [sellerSort, setSellerSort] = useState<{ col: keyof Seller; dir: 'asc' | 'desc' }>({
        col: 'fullName',
        dir: 'asc'
    });
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

    const handleApprove = async (email: string) => {
        try {
            await updateSellerStatus(email, 'ACTIVE');
            setSelectedSeller(null);
        } catch (err) {
            console.error('Approval failed:', err);
        }
    };

    const handleReject = async (email: string) => {
        try {
            await updateSellerStatus(email, 'REJECTED');
            setSelectedSeller(null);
        } catch (err) {
            console.error('Rejection failed:', err);
        }
    };

    const handleBan = async (email: string) => {
        try {
            await updateSellerStatus(email, 'BANNED');
            setSelectedSeller(null);
        } catch (err) {
            console.error('Ban failed:', err);
        }
    };

    const handleRestore = async (email: string) => {
        try {
            await updateSellerStatus(email, 'ACTIVE');
            setSelectedSeller(null);
        } catch (err) {
            console.error('Restore failed:', err);
        }
    };

    const filteredSellers: Seller[] = (Array.isArray(sellers) ? sellers : [])
        .filter((s) =>
            s.fullName?.toLowerCase().includes(sellerSearch.toLowerCase()) ||
            s.storeName?.toLowerCase().includes(sellerSearch.toLowerCase())
        )
        .sort((a, b) => {
            const mul = sellerSort.dir === 'asc' ? 1 : -1;
            const av = a[sellerSort.col];
            const bv = b[sellerSort.col];

            if (typeof av === 'number' && typeof bv === 'number') {
                return (av - bv) * mul;
            }

            return String(av ?? '').localeCompare(String(bv ?? '')) * mul;
        });

    const handleSellerSort = (col: keyof Seller) => {
        setSellerSort((prev) => ({
            col,
            dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
        }));
    };

    const TABLE_COLUMNS: { key: keyof Seller; label: string }[] = [
        { key: 'fullName', label: 'Name' },
        { key: 'productCount', label: 'No. of Products' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'noOfreports', label: 'No. of Reports' },
        { key: 'userStatus', label: 'Status' },
    ];

    if (loading) return <div className="p-5 text-xs text-center">Loading sellers...</div>;
    if (error) return <div className="p-5 text-xs text-red-500">{error}</div>;

    return (
        <main>
            <div className="flex flex-col" style={{ flex: 1 }}>
                {/* Summary row */}
                <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                        { label: 'Total Sellers', value: sellers.length },
                        { label: 'Banned Sellers', value: sellers.filter(s => s.userStatus === 'BANNED').length, warn: true },
                        { label: 'Pending Approval', value: sellers.filter(s => s.userStatus === 'PENDING').length },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl p-5 border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
                            <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{s.label}</p>
                            <p className="mt-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: s.warn ? 'var(--color-danger)' : 'var(--color-text)' }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-xl border flex flex-col overflow-hidden" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', flex: 1 }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
                        <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>All Sellers</h2>
                        <input
                            type="text"
                            placeholder="Search name or shop…"
                            value={sellerSearch}
                            onChange={(e) => setSellerSearch(e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none w-52"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)' }}
                        />
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {TABLE_COLUMNS.map(({ key, label }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSellerSort(key)}
                                        className="text-left px-5 py-3 font-medium cursor-pointer select-none uppercase"
                                        style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.06em' }}
                                    >
                                        {label}{sellerSort.col === key ? (sellerSort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSellers.map((s, i) => {
                                const st = SELLER_STATUS[s.userStatus] ?? SELLER_STATUS['ACTIVE'];
                                return (
                                    <tr
                                        key={s.email || s.fullName}
                                        onClick={() => setSelectedSeller(s)}
                                        style={{ borderBottom: i < filteredSellers.length - 1 ? '1px solid var(--color-border)' : undefined, background: 'transparent', cursor: 'pointer' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>{s.fullName}</p>
                                            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{s.storeName}</p>
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{s.productCount}</td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>₱{s.revenue?.toLocaleString() ?? 0}</td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className="font-medium px-1.5 py-0.5 rounded"
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    color: s.noOfreports > 2 ? 'var(--color-danger)' : s.noOfreports > 0 ? 'var(--color-warning)' : 'var(--color-muted)',
                                                    background: s.noOfreports > 2 ? 'rgba(248,113,113,0.12)' : s.noOfreports > 0 ? 'rgba(251,191,36,0.12)' : 'transparent',
                                                }}
                                            >
                                                {s.noOfreports}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                style={{ color: st.color, background: st.bg }}
                                            >
                                                {s.userStatus}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Seller detail modal */}
            {selectedSeller && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setSelectedSeller(null)}
                >
                    <div
                        className="rounded-2xl border flex flex-col"
                        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', width: 480, maxHeight: '85vh', overflow: 'hidden' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                            <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Seller Details</h2>
                            <button
                                onClick={() => setSelectedSeller(null)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-lg leading-none"
                                style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                            {/* Avatar + name */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                                    style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                >
                                    {selectedSeller.fullName ? selectedSeller.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'S'}
                                </div>
                                <div>
                                    <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>{selectedSeller.fullName}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{selectedSeller.storeName}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>{selectedSeller.email}</p>
                                </div>
                                <div className="ml-auto">
                                    {(() => {
                                        const st = SELLER_STATUS[selectedSeller.userStatus] ?? SELLER_STATUS['ACTIVE'];
                                        return (
                                            <span
                                                className="text-xs font-medium px-2.5 py-1 rounded-full"
                                                style={{ color: st.color, background: st.bg }}
                                            >
                                                {selectedSeller.userStatus}
                                            </span>
                                        )
                                    })()}
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Products', val: selectedSeller.productCount },
                                    { label: 'Revenue', val: `₱${selectedSeller.revenue?.toLocaleString() ?? 0}` },
                                    { label: 'Reports', val: selectedSeller.noOfreports },
                                    { label: 'Joined', val: selectedSeller.dateJoined ? new Date(selectedSeller.dateJoined).toLocaleDateString() : 'N/A' },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
                                        <p className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>{item.val}</p>
                                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Store description */}
                            <div>
                                <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Store Description</p>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>{selectedSeller.storeDescription || 'No store description available.'}</p>
                            </div>
                        </div>

                        {/* Modal footer (Conditional Action Buttons) */}
                        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                            {selectedSeller.userStatus === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleReject(selectedSeller.email)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                        style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)', fontFamily: 'var(--font-display)', border: '1px solid rgba(248,113,113,0.2)' }}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedSeller.email)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                        style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                    >
                                        Approve
                                    </button>
                                </>
                            )}

                            {selectedSeller.userStatus === 'ACTIVE' && (
                                <button
                                    onClick={() => handleBan(selectedSeller.email)}
                                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{ background: 'rgba(248,113,113,0.12)', color: 'var(--color-danger)', fontFamily: 'var(--font-display)', border: '1px solid rgba(248,113,113,0.2)' }}
                                >
                                    Ban Seller
                                </button>
                            )}

                            {(selectedSeller.userStatus === 'BANNED' || selectedSeller.userStatus === 'REJECTED') && (
                                <button
                                    onClick={() => handleRestore(selectedSeller.email)}
                                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{ background: 'var(--color-accent)', color: 'white', fontFamily: 'var(--font-display)' }}
                                >
                                    Restore Seller
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};