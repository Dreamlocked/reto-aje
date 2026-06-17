export const Header = ({ isMockData }) => {
    return (
        <header className="bg-white border-b-4 border-aje-green p-4 shadow-sm">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <img src="/AJE.png" alt="AJE Delivery" className="h-12 object-contain" />
                    <h1 className="text-2xl font-bold text-aje-ebony">CRUD Clientes</h1>
                </div>

                {isMockData && (
                    <div className="bg-aje-orange/10 text-aje-orange px-4 py-2 rounded-lg border border-aje-orange/30 text-sm font-bold animate-pulse">
                        ⚠️ Modo Offline: Datos Mock
                    </div>
                )}
            </div>
        </header>
    );
};