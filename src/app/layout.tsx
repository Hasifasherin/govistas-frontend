"use client";

import { usePathname } from "next/navigation";
import Header from "./components/header/Header";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where header is hidden
  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/register",
    "/admin/login"
  ];

  // Hide header on admin and operator pages
  const isAdminOrOperatorRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/operator");

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname) && !isAdminOrOperatorRoute;

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AuthProvider>
            {shouldShowHeader && <Header />}
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
