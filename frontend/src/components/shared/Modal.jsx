export const Modal = ({ dialogRef, title, children, onClose }) => {
    return (
        <dialog
            ref={dialogRef}
            className="backdrop:bg-aje-ebony/70 p-6 rounded-xl shadow-2xl border-none bg-white w-full max-w-md m-auto open:animate-fade-in"
        >
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h2 className="text-xl font-bold text-aje-ebony">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-aje-red font-bold text-2xl transition-colors cursor-pointer focus:outline-none focus:ring-0"
                >
                    &times;
                </button>
            </div>
            <div>{children}</div>
        </dialog>
    );
};