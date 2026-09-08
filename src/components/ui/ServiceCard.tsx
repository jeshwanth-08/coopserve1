import React from 'react';
import Link from 'next/link';
import { Service } from '@/data/services';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group border border-slate-200 dark:border-gray-700 rounded-2xl p-4 hover:shadow-xl hover:border-brand-500/40 transition-all bg-white dark:bg-gray-800 flex flex-col justify-between">
      <div>
        {service.imageUrl && (
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-100">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span>{service.rating}</span>
            </div>
          </div>
        )}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-3 pt-2 border-t border-slate-100 dark:border-gray-700">
          <div>
            <span className="text-xs text-slate-400 block">Starting from</span>
            <span className="text-lg font-black text-brand-600">₹{service.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">{service.duration}</span>
            <span className="text-[11px] text-slate-400">({service.bookings.toLocaleString()} bookings)</span>
          </div>
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="block text-center w-full py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition font-bold text-xs"
        >
          Book now
        </Link>
      </div>
    </div>
  );
};
