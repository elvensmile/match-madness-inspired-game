import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import {LinksFunction} from "@remix-run/node";

import styles from "./tailwind.css?url";
import Navigation from "~/components/navigation";


export const links: LinksFunction = () => [
    {rel: "stylesheet", href: styles},
];

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        <div className="min-h-screen flex bg-gray-100">
            {children}
        </div>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function App() {
    return (<div><Layout>
            <main className="flex-1 w-screen">
                <Navigation/>
                <div className="p-6"><Outlet /></div>
            </main>
    </Layout></div>);
}
