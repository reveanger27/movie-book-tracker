const inputClassName = "w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-stone-200 mb-4 focus:outline-none focus:border-amber-500";

function FormField ({ label, children }) {
    return (
        <>
            <label className="block text-sm text-stone-400 mb-1">{label}</label>
            {children}
        </>
    );
}

export { inputClassName };
export default FormField;