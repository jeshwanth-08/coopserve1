"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { POPULAR_SERVICES, ServiceItem, ProProfile, CategoryDetail, findMatchingServiceForCategory, getMatchingServiceForPro } from "@/lib/homeData";

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<ServiceItem | null>(
    POPULAR_SERVICES[0]
  );
  const [selectedProForBooking, setSelectedProForBooking] = useState<ProProfile | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            if (data.user.locality) {
              setSelectedLocality(data.user.locality);
            }
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };
    fetchMe();
  }, []);

  const handleSelectLocation = (city: string, locality: string) => {
    setSelectedCity(city);
    setSelectedLocality(locality);
  };

  const handleOpenBookingWithService = (service?: ServiceItem, pro?: ProProfile) => {
    // If not signed in, redirect to login and preserve the choice of interest
    if (!currentUser) {
      const targetService = service || (pro ? getMatchingServiceForPro(pro) : POPULAR_SERVICES[0]);
      const proParam = pro ? `?pro=${encodeURIComponent(pro.name)}` : "";
      const targetUrl = `/book/${targetService.id}${proParam}`;
      router.push(`/login?returnUrl=${encodeURIComponent(targetUrl)}`);
      return;
    }

    if (pro) {
      setSelectedProForBooking(pro);
      const matched = service || getMatchingServiceForPro(pro);
      setActiveServiceForBooking(matched);
    } else if (service) {
      setSelectedProForBooking(null);
      setActiveServiceForBooking(service);
    } else {
      setSelectedProForBooking(null);
      setActiveServiceForBooking(POPULAR_SERVICES[0]);
    }
    setIsBookingOpen(true);
  };

  const handleSelectCategory = (category: CategoryDetail, service?: ServiceItem) => {
    const matched =
      service ||
      findMatchingServiceForCategory(category.slug) ||
      POPULAR_SERVICES.find(
        (s) =>
          s.categorySlug === category.slug ||
          s.slug === category.slug ||
          category.aliases.includes(s.slug) ||
          category.aliases.includes(s.categorySlug)
      ) ||
      POPULAR_SERVICES[0];

    // If not signed in, redirect to login and preserve the choice of interest
    if (!currentUser) {
      router.push(`/login?returnUrl=${encodeURIComponent(`/book/${matched.id}`)}`);
      return;
    }

    setActiveServiceForBooking(matched);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-brand-500 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* 1. Navbar */}
      <Navbar
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={handleSelectLocation}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBooking={() => handleOpenBookingWithService()}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Role-Specific Experience Banner (Admin, Provider, or Member; hidden for guest) */}
        <PersonalizedHomeBanner
          user={currentUser}
          onOpenBookingWithService={handleOpenBookingWithService}
        />

        {/* 2. Hero/search */}
        <HeroSearch
          selectedCity={selectedCity}
          selectedLocality={selectedLocality}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBooking={handleOpenBookingWithService}
          onSelectCategory={(slug) => {
            const found =
              findMatchingServiceForCategory(slug) ||
              POPULAR_SERVICES.find((s) => s.categorySlug === slug || s.slug === slug);
            handleOpenBookingWithService(found);
          }}
        />

        {/* 3. Popular services */}
        <PopularServices onOpenBooking={handleOpenBookingWithService} />

        {/* 4. Categories ("Everything your home needs") */}
        <CategoriesGrid
          onSelectCategory={handleSelectCategory}
          onOpenBooking={(service) => handleOpenBookingWithService(service)}
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
        <BestRatedPros onOpenBooking={handleOpenBookingWithService} />

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
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedProForBooking(null);
        }}
        initialService={activeServiceForBooking}
        initialPro={selectedProForBooking}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
      />
    </div>
  );
}
