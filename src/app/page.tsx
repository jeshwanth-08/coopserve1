"use client";

import React, { useState } from "react";
import Navbar from "@/components/home/Navbar";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import HeroSearch from "@/components/home/HeroSearch";
import PopularServices from "@/components/home/PopularServices";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import InteractiveServiceFinder from "@/components/home/InteractiveServiceFinder";
import HomeHealthCheck from "@/components/home/HomeHealthCheck";
import PopularNearYou from "@/components/home/PopularNearYou";
import BestRatedPros from "@/components/home/BestRatedPros";
import LimitedTimeOffers from "@/components/home/LimitedTimeOffers";
import ServicePackages from "@/components/home/ServicePackages";
import CoopServePlus from "@/components/home/CoopServePlus";
import CustomerReviews from "@/components/home/CustomerReviews";
import TrustAndSafety from "@/components/home/TrustAndSafety";
import DownloadAppBanner from "@/components/home/DownloadAppBanner";
import FAQAccordion from "@/components/home/FAQAccordion";
import Footer from "@/components/home/Footer";
import PersonalizedHomeBanner from "@/components/home/PersonalizedHomeBanner";
import SearchModal from "@/components/home/SearchModal";
import QuickBookingModal from "@/components/home/QuickBookingModal";
import { POPULAR_SERVICES, ServiceItem, CategoryDetail } from "@/lib/homeData";

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<ServiceItem | null>(
    POPULAR_SERVICES[0]
  );

  const handleSelectLocation = (city: string, locality: string) => {
    setSelectedCity(city);
    setSelectedLocality(locality);
  };

  const handleOpenBookingWithService = (service?: ServiceItem) => {
    if (service) {
      setActiveServiceForBooking(service);
    } else {
      setActiveServiceForBooking(POPULAR_SERVICES[0]);
    }
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (category: CategoryDetail) => {
    const matched = POPULAR_SERVICES.find((s) => s.categorySlug === category.slug);
    if (matched) {
      setActiveServiceForBooking(matched);
    } else {
      setActiveServiceForBooking(POPULAR_SERVICES[0]);
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={handleSelectLocation}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBooking={() => handleOpenBookingWithService()}
      />

      <main className="flex-1">
        {/* Personalized Member Experience Banner (Good morning 👋, Book AC Service again) */}
        <PersonalizedHomeBanner
          userName="Aarav"
          onOpenBookingWithService={handleOpenBookingWithService}
        />

        {/* 2. Hero/search */}
        <HeroSearch
          selectedCity={selectedCity}
          selectedLocality={selectedLocality}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBooking={handleOpenBookingWithService}
          onSelectCategory={(slug) => {
            const found = POPULAR_SERVICES.find((s) => s.categorySlug === slug);
            handleOpenBookingWithService(found);
          }}
        />

        {/* 3. Popular services */}
        <PopularServices onOpenBooking={handleOpenBookingWithService} />

        {/* 4. Categories ("Everything your home needs") */}
        <CategoriesGrid
          onSelectCategory={handleSelectCategory}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* 5. Interactive Service Finder ("Need help deciding?") */}
        <InteractiveServiceFinder onOpenBooking={handleOpenBookingWithService} />

        {/* 6. How it works */}
        <HowItWorks />

        {/* 7. Home Health Check ("How's your home doing?") */}
        <HomeHealthCheck onOpenBooking={handleOpenBookingWithService} />

        {/* 8. Popular near you */}
        <PopularNearYou
          selectedCity={selectedCity}
          selectedLocality={selectedLocality}
          onOpenBooking={handleOpenBookingWithService}
        />

        {/* 9. Best-rated professionals */}
        <BestRatedPros onOpenBooking={() => handleOpenBookingWithService()} />

        {/* 10. Limited-time offers */}
        <LimitedTimeOffers onOpenBooking={() => handleOpenBookingWithService()} />

        {/* 11. Service packages */}
        <ServicePackages onOpenBooking={() => handleOpenBookingWithService()} />

        {/* 12. Membership (CoopServe Plus) */}
        <CoopServePlus onOpenBooking={() => handleOpenBookingWithService()} />

        {/* 13. Customer reviews */}
        <CustomerReviews />

        {/* 14. Trust & safety */}
        <TrustAndSafety />

        {/* 15. Download app */}
        <DownloadAppBanner />

        {/* 16. FAQ */}
        <FAQAccordion />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav onOpenBooking={() => handleOpenBookingWithService()} />

      {/* Global Interactive Search Modal with Intent Parsing */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectService={(service) => {
          handleOpenBookingWithService(service);
        }}
      />

      {/* Global Frictionless Booking Modal */}
      <QuickBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={activeServiceForBooking}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
      />
    </div>
  );
}
