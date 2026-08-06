import React, { useState } from 'react';

interface Customer {
    name: string;
    email: string;
    checkouts: number;
    revenue: string;
    reports: number;
    status: 'Active' | 'Banned';
    joined: string;
}

const CUSTOMERS: Customer[] = [
    { name: 'Maria Santos', email: 'maria.santos@email.com', checkouts: 34, revenue: '₱42,150', reports: 0, status: 'Active', joined: '2023-10-15' },
    { name: 'Juan Dela Cruz', email: 'juan.delacruz@email.com', checkouts: 12, revenue: '₱15,300', reports: 3, status: 'Banned', joined: '2024-01-20' },
    { name: 'Aris Gonzales', email: 'aris.gonzales@email.com', checkouts: 58, revenue: '₱89,400', reports: 0, status: 'Active', joined: '2023-08-11' },
    { name: 'Elena Torralba', email: 'elena.t@email.com', checkouts: 8, revenue: '₱6,210', reports: 1, status: 'Active', joined: '2024-03-05' },
    { name: 'Mark Dizon', email: 'mark.dizon@email.com', checkouts: 2, revenue: '₱1,850', reports: 4, status: 'Banned', joined: '2024-05-18' },
    { name: 'Sophia Castro', email: 'sophia.castro@email.com', checkouts: 27, revenue: '₱31,900', reports: 0, status: 'Active', joined: '2023-12-01' },
    { name: 'Gabriel Ramos', email: 'gab.ramos@email.com', checkouts: 19, revenue: '₱22,450', reports: 0, status: 'Active', joined: '2024-02-14' },
    { name: 'Camilla Aquino', email: 'camilla.a@email.com', checkouts: 41, revenue: '₱56,800', reports: 0, status: 'Active', joined: '2023-11-09' },
];

const CUSTOMER_STATUS: Record<string, { color: string; bg: string }> = {
    Active: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
    Banned: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

export const CustomerTab: React.FC = () => {
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerSort, setCustomerSort] = useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'name', dir: 'asc' });
    const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const handleToggleStatus = (name: string) => {
        setCustomers((prev) =>
            prev.map((c) => {
                if (c.name === name) {
                    const nextStatus = c.status === 'Active' ? 'Banned' : 'Active';
                    return { ...c, status: nextStatus };
                }
                return c;
            })
        );

        setSelectedCustomer((prev) => {
            if (prev && prev.name === name) {
                const nextStatus = prev.status === 'Active' ? 'Banned' : 'Active';
                return { ...prev, status: nextStatus };
            }
            return prev;
        });
    };

    const filteredCustomers = customers
        .filter(
            (c) =>
                c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                c.email.toLowerCase().includes(customerSearch.toLowerCase())
        )
        .sort((a, b) => {
            const mul = customerSort.dir === 'asc' ? 1 : -1;
            const key = customerSort.col as keyof Customer;
            const av = a[key];
            const bv = b[key];

            if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul;
            return String(av).localeCompare(String(bv)) * mul;
        });

    const handleCustomerSort = (col: string) => {
        setCustomerSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }));
    };

    return (
        <main>
            <div className="flex flex-col" style={{ flex: 1 }}>
                {/* Summary row */}
                <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                        { label: 'Total Customers', value: customers.length },
                        { label: 'Banned Accounts', value: customers.filter((c) => c.status === 'Banned').length, warn: true },
                        { label: 'Active Customers', value: customers.filter((c) => c.status === 'Active').length },
                    ].map((c) => (
                        <div
                            key={c.label}
                            className="rounded-xl p-5 border"
                            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                        >
                            <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                                {c.label}
                            </p>
                            <p
                                className="mt-2 text-3xl font-bold"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: c.warn ? 'var(--color-danger)' : 'var(--color-text)',
                                }}
                            >
                                {c.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div
                    className="rounded-xl border flex flex-col overflow-hidden"
                    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', flex: 1 }}
                >
                    <div
                        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                            All Customers
                        </h2>
                        <input
                            type="text"
                            placeholder="Search name or email…"
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none w-52"
                            style={{
                                background: 'var(--color-surface-2)',
                                color: 'var(--color-text)',
                                border: '1px solid var(--color-border)',
                                fontFamily: 'var(--font-body)',
                            }}
                        />
                    </div>
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                {[
                                    { key: 'name', label: 'Name' },
                                    { key: 'checkouts', label: 'No. of Checkouts' },
                                    { key: 'revenue', label: 'Revenue Earned' },
                                    { key: 'reports', label: 'No. of Reports' },
                                    { key: 'status', label: 'Status' },
                                ].map(({ key, label }) => (
                                    <th
                                        key={key}
                                        onClick={() => handleCustomerSort(key)}
                                        className="text-left px-5 py-3 font-medium cursor-pointer select-none uppercase"
                                        style={{
                                            color: 'var(--color-muted)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            letterSpacing: '0.06em',
                                        }}
                                    >
                                        {label}
                                        {customerSort.col === key ? (customerSort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCustomers.map((c, i) => {
                                const st = CUSTOMER_STATUS[c.status];
                                return (
                                    <tr
                                        key={c.email}
                                        onClick={() => setSelectedCustomer(c)}
                                        style={{
                                            borderBottom: i < filteredCustomers.length - 1 ? '1px solid var(--color-border)' : undefined,
                                            background: 'transparent',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                                                {c.name}
                                            </p>
                                            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                                                {c.email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                            {c.checkouts}
                                        </td>
                                        <td className="px-5 py-3.5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                                            {c.revenue}
                                        </td>
                                        <td className="px-5 py-3.5">
                                                <span
                                                    className="font-medium px-1.5 py-0.5 rounded"
                                                    style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        color:
                                                            c.reports > 2
                                                                ? 'var(--color-danger)'
                                                                : c.reports > 0
                                                                    ? 'var(--color-warning)'
                                                                    : 'var(--color-muted)',
                                                        background:
                                                            c.reports > 2
                                                                ? 'rgba(248,113,113,0.12)'
                                                                : c.reports > 0
                                                                    ? 'rgba(251,191,36,0.12)'
                                                                    : 'transparent',
                                                    }}
                                                >
                                                    {c.reports}
                                                </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                                <span
                                                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                    style={{ color: st.color, background: st.bg }}
                                                >
                                                    {c.status}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                {/* Customer detail modal */}
                {selectedCustomer && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSelectedCustomer(null)}
                    >
                        <div
                            className="rounded-2xl border flex flex-col"
                            style={{
                                background: 'var(--color-surface)',
                                borderColor: 'var(--color-border)',
                                width: 480,
                                maxHeight: '85vh',
                                overflow: 'hidden',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                    Customer Details
                                </h2>
                                <button
                                    onClick={() => setSelectedCustomer(null)}
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
                                        {selectedCustomer.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                                            {selectedCustomer.name}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                                            {selectedCustomer.email}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        {(() => {
                                            const st = CUSTOMER_STATUS[selectedCustomer.status];
                                            return (
                                                <span
                                                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                                                    style={{ color: st.color, background: st.bg }}
                                                >
                                                    {selectedCustomer.status}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: 'Checkouts', val: selectedCustomer.checkouts },
                                        { label: 'Revenue', val: selectedCustomer.revenue },
                                        { label: 'Reports', val: selectedCustomer.reports },
                                        { label: 'Joined', val: selectedCustomer.joined },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
                                            <p className="text-xs font-semibold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
                                                {item.val}
                                            </p>
                                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                                                {item.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal footer — single dynamic toggle button */}
                            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                                <button
                                    onClick={() => handleToggleStatus(selectedCustomer.name)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                    style={{
                                        background:
                                            selectedCustomer.status === 'Active'
                                                ? 'rgba(248,113,113,0.12)'
                                                : 'rgba(52,211,153,0.12)',
                                        color:
                                            selectedCustomer.status === 'Active'
                                                ? 'var(--color-danger)'
                                                : '#34d399',
                                        fontFamily: 'var(--font-display)',
                                        border:
                                            selectedCustomer.status === 'Active'
                                                ? '1px solid rgba(248,113,113,0.2)'
                                                : '1px solid rgba(52,211,153,0.2)',
                                    }}
                                >
                                    {selectedCustomer.status === 'Active' ? 'Ban' : 'Restore'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};