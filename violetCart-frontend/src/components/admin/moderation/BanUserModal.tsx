import React, { useState } from 'react';
import { UserX, AlertTriangle, X } from 'lucide-react';

export default function BanUserModal({ user, onClose, onSuccess }) {
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleBan = async (e) => {
        e.preventDefault();
        if (!adminNotes.trim()) {
            setError('Admin resolution notes are required.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/admin/moderation/users/${user.id}/ban`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ adminNotes }),
            });

            if (!response.ok) {
                throw new Error('Failed to ban user. Please try again.');
            }

            onSuccess(user.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-red-700 font-semibold">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Confirm Account Ban</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleBan} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        You are about to ban user <strong className="text-gray-900">{user.email}</strong> (ID: {user.id}). This will automatically resolve all open reports associated with this account.
                    </p>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-xs">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                            Admin Resolution Notes <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Provide reason for audit logging (e.g., Verified multi-account fraud)..."
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center space-x-1"
                        >
                            <UserX className="w-4 h-4" />
                            <span>{isSubmitting ? 'Banning...' : 'Confirm Ban'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}