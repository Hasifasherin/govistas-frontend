"use client";

import Header from "./components/header/Header";
import HomeSlider from "./components/slider/HomeSlider";
import WhyBookWithUs from "./components/homepage/WhyBookWithUs";
import LoginCTA from "./components/homepage/LoginCTA";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Header />
      <HomeSlider />
      <WhyBookWithUs />
      {!user && <LoginCTA />} 
    </>
  );
}
