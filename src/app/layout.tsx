"use client";

import { usePathname } from "next/navigation";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/register",
    "/admin/login",
    "/user/chat"
  ];

  const isAdminOrOperatorRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/operator");

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname) && !isAdminOrOperatorRoute;

  return (
    <html lang="en">
      <body className="font-sans">
        <Provider store={store}>
          <AuthProvider>
            {shouldShowHeader && <Header />}

            {/* Add padding-top to prevent overlapping */}
            <div className={shouldShowHeader ? "pt-[80px]" : ""}>
              {children}
            </div>

            {/* Only show footer if header is visible */}
            {shouldShowHeader && <Footer />}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}