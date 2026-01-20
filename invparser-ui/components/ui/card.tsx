import React from 'react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;