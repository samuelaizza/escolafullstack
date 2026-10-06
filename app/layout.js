import "./globals.css";

export const metadata = {
    title: "Sistema Escolar - SESI",
    description: "Sistema Escolar SESI Mirandópolis",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                {children}
            </body>
        </html>
    );
}