import './globals.css';
import { Providers } from './providers';
import { ReactNode } from 'react';

export const metadata = {
    title: 'Smart PDF Analyzer - Agentic AI',
    description: 'Multi-agent document intelligence platform',
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
