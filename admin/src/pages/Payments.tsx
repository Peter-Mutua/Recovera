import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Payments.css';

interface Payment {
    id: string;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    plan: string;
    provider: string;
    createdAt: string;
    user: {
        email: string;
    };
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadPayments();
    }, [page]);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getPayments(page, 20);
            setPayments(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load payments', error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalRevenue = () => {
        return payments
            .filter((p) => p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
    };

    if (loading) {
        return <div className="loading">Loading payments...</div>;
    }

    return (
        <div className="payments-page">
            <div className="page-header">
                <h1>Payment Tracking</h1>
                <div className="revenue-card">
                    <p className="revenue-label">Total Revenue</p>
                    <p className="revenue-value">${getTotalRevenue().toFixed(2)}</p>
                </div>
            </div>

            <div className="payments-table">
                <table>
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>User</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Provider</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="mono">{payment.reference}</td>
                                <td>{payment.user?.email || 'N/A'}</td>
                                <td>
                                    <span className={`plan-badge ${payment.plan}`}>
                                        {payment.plan.toUpperCase()}
                                    </span>
                                </td>
                                <td className="amount">
                                    ${payment.amount.toFixed(2)} {payment.currency}
                                </td>
                                <td>{payment.provider}</td>
                                <td>
                                    <span className={`status-badge ${payment.status}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}
