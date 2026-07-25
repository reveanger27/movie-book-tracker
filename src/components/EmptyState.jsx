function EmptyState ({ title, description, children }) {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-2xl font-serif text-amber-100 mb-2">{title}</p>
            {description && <p className="text-stone-400 mb-6">{description}</p>}
            {children}
        </div>
    );
}

export default EmptyState;