import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './ConfirmModal.scss';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    open,
    title,
    children,
    confirmLabel = 'Так',
    cancelLabel = 'Скасувати',
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="confirm-modal">
            <div className="confirm-modal__backdrop" onClick={onCancel} />
            <div className="confirm-modal__dialog" role="dialog" aria-modal="true">
                <h3 className="confirm-modal__title">{title}</h3>
                <div className="confirm-modal__body">{children}</div>
                <div className="confirm-modal__actions">
                    <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className="confirm-modal__btn confirm-modal__btn--confirm" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};
