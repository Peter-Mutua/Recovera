import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './Users.css';

interface User {
    id: string;
    email: string;
    subscriptionStatus: string;
    subscriptionPlan: string;
    isBlocked: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadUsers();
    }, [page]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getUsers(page, 20);
            setUsers(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: string, isBlocked: boolean) => {
        try {
            await adminApi.blockUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Failed to block user', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>User Management</h1>
                <p className="subtitle">Total users: {users.length}</p>
            </div>

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`plan-badge ${user.subscriptionPlan}`}>
                                        {user.subscriptionPlan || 'None'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.subscriptionStatus}`}>
                                        {user.subscriptionStatus}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className={user.isBlocked ? 'btn-success' : 'btn-danger'}
                                        onClick={() => handleBlockUser(user.id, !user.isBlocked)}
                                    >
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
