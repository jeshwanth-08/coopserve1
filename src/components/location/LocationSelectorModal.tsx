"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Navigation,
  Check,
  Plus,
  Home,
  Briefcase,
  Building,
  Trash2,
  Edit2,
  X,
  Sparkles,
  MapPinOff,
  Loader2,
} from "lucide-react";
import { INDIAN_CITIES } from "@/lib/homeData";
import { INITIAL_ADDRESSES, SavedAddress } from "@/lib/supportAndPackageData";

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  selectedLocality: string;
  onSelectLocation: (city: string, locality: string) => void;
}

export default function LocationSelectorModal({
  isOpen,
  onClose,
  selectedCity,
  selectedLocality,
  onSelectLocation,
}: LocationSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<"cities" | "addresses">("cities");
  const [searchAreaQuery, setSearchAreaQuery] = useState("");
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);

  // Load saved addresses from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem("coopserve_saved_addresses");
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Modal for adding a new address
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"Home" | "Work" | "Other">("Home");
  const [newFlat, setNewFlat] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newLocality, setNewLocality] = useState(selectedLocality);
  const [newCity, setNewCity] = useState(selectedCity);
  const [newPincode, setNewPincode] = useState("560038");
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Edit address state
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsStatusMessage("Acquiring device GPS coordinates...");

    const resolveWithCoords = async (latitude?: number, longitude?: number) => {
      try {
        setGpsStatusMessage("Resolving locality via OpenStreetMap...");
        const res = await fetch("/api/location/reverse-geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        });
        const data = await res.json();

        if (data.success && data.city && data.locality) {
          setGpsStatusMessage(`✓ Located: ${data.locality}, ${data.city}`);
          onSelectLocation(data.city, data.locality);

          // Save to recent addresses as GPS Location
          try {
            const gpsAddr: SavedAddress = {
              id: "addr-gps-" + Date.now(),
              type: "Other",
              flatNo: "Current GPS Location",
              street: data.formattedAddress?.split(",").slice(0, 2).join(",") || "Doorstep Pinpoint",
              locality: data.locality,
              city: data.city,
              pincode: data.postcode || "560001",
              isDefault: false,
            };
            const updated = [gpsAddr, ...addresses.filter((a) => !a.id.startsWith("addr-gps-"))].slice(0, 8);
            setAddresses(updated);
            localStorage.setItem("coopserve_saved_addresses", JSON.stringify(updated));
          } catch (e) {
            console.warn("Could not save GPS address:", e);
          }

          setTimeout(() => {
            setIsDetectingGps(false);
            setGpsStatusMessage(null);
            onClose();
          }, 700);
          return;
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }

      // Safe fallback if API error
      onSelectLocation("Bengaluru", "Indiranagar (GPS Area)");
      setIsDetectingGps(false);
      setGpsStatusMessage(null);
      onClose();
    };

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolveWithCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Browser GPS unavailable or denied, falling back to IP geolocation:", error.message);
          setGpsStatusMessage("GPS access unavailable. Detecting via network IP...");
          resolveWithCoords();
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 30000,
        }
      );
    } else {
      setGpsStatusMessage("Detecting via network IP...");
      resolveWithCoords();
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlat || !newLocality) return;

    let updatedList: SavedAddress[];
    if (editingId) {
      updatedList = addresses.map((a) =>
        a.id === editingId
          ? {
              ...a,
              type: newType,
              flatNo: newFlat,
              street: newStreet,
              locality: newLocality,
              city: newCity,
              pincode: newPincode,
              isDefault: newIsDefault,
            }
          : newIsDefault
          ? { ...a, isDefault: false }
          : a
      );
    } else {
      const newAddr: SavedAddress = {
        id: "addr-" + Date.now(),
        type: newType,
        flatNo: newFlat,
        street: newStreet,
        locality: newLocality,
        city: newCity,
        pincode: newPincode,
        isDefault: newIsDefault || addresses.length === 0,
      };
      updatedList = newIsDefault
        ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...addresses, newAddr];
    }

    setAddresses(updatedList);
    localStorage.setItem("coopserve_saved_addresses", JSON.stringify(updatedList));
    setShowAddModal(false);
    setEditingId(null);
    setNewFlat("");
    setNewStreet("");
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("coopserve_saved_addresses", JSON.stringify(updated));
  };

  const handleSetDefault = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem("coopserve_saved_addresses", JSON.stringify(updated));
  };

  const handleStartEdit = (addr: SavedAddress, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(addr.id);
    setNewType(addr.type);
    setNewFlat(addr.flatNo);
    setNewStreet(addr.street);
    setNewLocality(addr.locality);
    setNewCity(addr.city);
    setNewPincode(addr.pincode);
    setNewIsDefault(addr.isDefault);
    setShowAddModal(true);
  };

  if (!isOpen) return null;

  const currentCityData = INDIAN_CITIES.find((c) => c.name === selectedCity) || INDIAN_CITIES[0];
  const filteredLocalities = currentCityData.localities.filter((loc) =>
    loc.toLowerCase().includes(searchAreaQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Select Service Location</h3>
            <p className="text-xs text-slate-500">Currently serving 6 Metro Cities across India</p>
          </div>
        </div>

        {/* Use Current GPS Location CTA */}
        <button
          onClick={handleDetectGps}
          disabled={isDetectingGps}
          type="button"
          className={`w-full p-3.5 mb-5 rounded-2xl border text-brand-700 flex items-center justify-between transition-all group ${
            isDetectingGps
              ? "bg-brand-100/70 border-brand-300 ring-2 ring-brand-400/30"
              : "bg-brand-50 hover:bg-brand-100/80 border-brand-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform ${
                isDetectingGps
                  ? "bg-brand-700 text-white animate-pulse"
                  : "bg-brand-600 text-white group-hover:scale-105"
              }`}
            >
              {isDetectingGps ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-brand-900">
                {isDetectingGps
                  ? gpsStatusMessage || "Detecting Precise GPS Location..."
                  : "Use Current GPS Location"}
              </p>
              <p className="text-[11px] text-brand-600">
                {isDetectingGps
                  ? "Accurate doorstep coordinates"
                  : "Auto-detect via device GPS & OpenStreetMap"}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              isDetectingGps ? "bg-brand-700 text-white animate-pulse" : "bg-brand-600 text-white"
            }`}
          >
            {isDetectingGps ? "Locating..." : "Instant"}
          </span>
        </button>

        {/* Tab switcher: Cities & Localities vs Saved Addresses */}
        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => setActiveTab("cities")}
            className={`pb-3 text-xs font-black transition-colors relative mr-6 ${
              activeTab === "cities" ? "text-brand-600" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Search City & Localities
            {activeTab === "cities" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-3 text-xs font-black transition-colors relative ${
              activeTab === "addresses" ? "text-brand-600" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Saved Addresses ({addresses.length})
            {activeTab === "addresses" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab 1: City & Localities Selection */}
        {activeTab === "cities" && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* 1. Metro Cities Pills */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1. Select City:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INDIAN_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => onSelectLocation(c.name, c.localities[0])}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                      selectedCity === c.name
                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Locality Search */}
            <div className="pt-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                2. Select Area in {selectedCity}:
              </label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAreaQuery}
                  onChange={(e) => setSearchAreaQuery(e.target.value)}
                  placeholder={`Search neighborhood in ${selectedCity}...`}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {filteredLocalities.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {filteredLocalities.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onSelectLocation(selectedCity, loc);
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                        selectedLocality === loc
                          ? "bg-brand-50 text-brand-700 border-brand-300"
                          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocality === loc && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MapPinOff className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-black text-slate-800">We’re not serving this area yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Try searching for another neighborhood or pick from our supported hubs.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchAreaQuery("")}
                    className="mt-3 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Change location
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Your registered residences</span>
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewFlat("");
                  setNewStreet("");
                  setShowAddModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectLocation(addr.city, addr.locality);
                    onClose();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-brand-300 bg-white hover:bg-slate-50/60 shadow-sm transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                      {addr.type === "Home" ? (
                        <Home className="w-4 h-4" />
                      ) : addr.type === "Work" ? (
                        <Briefcase className="w-4 h-4" />
                      ) : (
                        <Building className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900">{addr.type}</h4>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{addr.flatNo}, {addr.street}</p>
                      <p className="text-[11px] text-slate-400">{addr.locality}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={(e) => handleSetDefault(addr.id, e)}
                        className="text-[10px] text-slate-500 hover:text-brand-600 hover:underline px-1.5 py-1"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={(e) => handleStartEdit(addr, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteAddress(addr.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add/Edit Address Nested Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-black text-slate-900">
                  {editingId ? "Edit Saved Address" : "Add New Saved Address"}
                </h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Address Label</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Home", "Work", "Other"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewType(t)}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          newType === t
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">House / Flat / Office No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Sunshine Heights"
                    value={newFlat}
                    onChange={(e) => setNewFlat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Street / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12th Main Road"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Locality</label>
                    <input
                      type="text"
                      required
                      value={newLocality}
                      onChange={(e) => setNewLocality(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newIsDefault}
                    onChange={(e) => setNewIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="isDefault" className="font-bold text-slate-700">
                    Set as default address for service dispatch
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
