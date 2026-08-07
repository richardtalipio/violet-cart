import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              title,
                                                              message,
                                                              confirmText = 'Confirm',
                                                              isDanger = false,
                                                              onConfirm,
                                                              onCancel,
                                                          }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onCancel}
        >
            <div
                className="rounded-2xl border p-6 flex flex-col gap-4"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', width: 380 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    {title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {message}
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-xs font-medium border"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                        style={{
                            background: isDanger ? 'var(--color-danger)' : 'var(--color-accent)',
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};