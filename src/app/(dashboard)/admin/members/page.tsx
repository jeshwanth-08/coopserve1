"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, MapPin, Phone, Mail, Calendar, ClipboardList } from "lucide-react";
import { LOCALITIES } from "@/lib/constants";

export default function AdminMembersDirectoryPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localityFilter, setLocalityFilter] = useState("ALL");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (localityFilter !== "ALL") params.append("locality", localityFilter);

      const res = await fetch(`/api/members?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [localityFilter]);

  const filtered = members.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.locality.toLowerCase().includes(q) ||
      (m.address && m.address.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Member Directory & Households</h1>
          <p className="text-xs text-slate-500">
            Registered cooperative households across societies and local communities
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-800 rounded-full shrink-0">
          {members.length} Enrolled Households
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, email, or society address..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={localityFilter}
          onChange={(e) => setLocalityFilter(e.target.value)}
          className="w-full sm:w-56 p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">All Communities</option>
          {LOCALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading member directory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No cooperative members found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Locality & Residence</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Total Requests</th>
                  <th className="py-3 px-4">Community Co-Signs</th>
                  <th className="py-3 px-4">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {m.name.charAt(0)}
                        </div>
                        <span>{m.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{m.locality}</span>
                      <span className="text-[11px] text-slate-400">{m.address || "Address on file"}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-800 block">{m.phone || "+1 555-0100"}</span>
                      <span className="text-[11px] text-slate-400">{m.email}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {m._count?.memberRequests || 0} requests
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {m._count?.coSigns || 0} co-signed
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
