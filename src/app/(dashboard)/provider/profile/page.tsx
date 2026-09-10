"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Save,
  Plus,
  X,
  Upload,
  FileText,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Editable fields
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [serviceArea, setServiceArea] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/providers/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);

        // Parse JSON strings
        try {
          setSkills(JSON.parse(data.profile.skills || "[]"));
        } catch {
          setSkills([data.profile.skills || "General Handyman"]);
        }

        try {
          setCategories(JSON.parse(data.profile.serviceCategories || "[]"));
        } catch {
          setCategories(["Electrician"]);
        }

        try {
          setCertifications(JSON.parse(data.profile.certifications || "[]"));
        } catch {
          setCertifications([]);
        }

        setServiceArea(data.profile.serviceArea || "");
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleCategoryToggle = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleUploadCert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingCert(true);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCertifications([...certifications, data.url || file.name]);
      } else {
        setCertifications([...certifications, file.name]);
      }
    } catch {
      setCertifications([...certifications, file.name]);
    } finally {
      setUploadingCert(false);
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCertifications(certifications.filter((c) => c !== certToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) {
      alert("Please select at least one service category before saving.");
      return;
    }
    try {
      setSaving(true);
      setSavedSuccess(false);
      const res = await fetch("/api/providers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          serviceCategories: categories,
          serviceArea,
          certifications,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert("Failed to save changes.");
      }
    } catch {
      alert("Network error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading professional profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Professional Profile & Credentials</h1>
          <p className="text-xs text-slate-500">
            Keep your skills, verified certifications, and service area up to date
          </p>
        </div>

        {profile?.isVerified ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cooperative Verified Specialist</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Awaiting Coordinator Verification</span>
          </div>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Identity & Service Reach
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">Provider Name</span>
              <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Email Address</span>
              <p className="font-semibold text-slate-900 text-sm">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Service Area & Radius
            </label>
            <input
              type="text"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Greenwood Heights, Riverside Society & surroundings"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Categories Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Active Service Categories
          </h2>
          <p className="text-xs text-slate-500">
            Select the household and community disciplines for which you accept assignments:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  categories.includes(cat)
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {categories.includes(cat) ? "✓ " : "+ "}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Tag Input */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Specialized Skills
          </h2>
          <p className="text-xs text-slate-500">
            Add detailed capabilities (e.g. "Main Distribution Panels", "Submersible Pumps")
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type a new skill..."
              className="flex-1 p-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Certifications & Licensures
              </h2>
              <p className="text-xs text-slate-500">
                Uploaded credentials verified by the cooperative admin
              </p>
            </div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadingCert ? "Uploading..." : "Upload Certificate"}</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleUploadCert}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            {certifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                No formal certificates uploaded yet. Click above to attach trade licenses or safety credentials.
              </p>
            ) : (
              certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{cert}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
