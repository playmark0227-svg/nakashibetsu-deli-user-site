'use client';

import { Clock } from 'lucide-react';

interface WorkStatusBadgeProps {
  status?: 'working' | 'scheduled' | 'off' | 'unknown';
  instantAvailable?: boolean;
  startTime?: string;
  endTime?: string;
  notes?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export default function WorkStatusBadge({
  status = 'unknown',
  instantAvailable = false,
  startTime,
  endTime,
  notes,
  size = 'md',
  showDetails = false,
}: WorkStatusBadgeProps) {
  const sizeMap = {
    sm: 'text-[9px] px-2 py-1',
    md: 'text-[10px] px-2.5 py-1',
    lg: 'text-[11px] px-3 py-1.5',
  };

  const getLabel = () => {
    if (instantAvailable && status === 'working') return 'Available Now';
    switch (status) {
      case 'working': return 'Working';
      case 'scheduled': return 'Scheduled';
      case 'off': return 'Off Today';
      default: return '—';
    }
  };

  const isHighlight = instantAvailable && status === 'working';
  const isDimmed = status === 'off' || status === 'unknown';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-block tracking-[0.25em] uppercase font-semibold ${sizeMap[size]} ${
            isHighlight
              ? 'bg-[#c9a961] text-[#0b0a09]'
              : isDimmed
                ? 'bg-white/80 text-[#76705f]'
                : 'bg-[#0b0a09]/85 text-white'
          }`}
        >
          {getLabel()}
        </span>
      </div>

      {showDetails && status !== 'off' && status !== 'unknown' && (
        <div className="space-y-1 text-xs text-[#76705f]">
          {(startTime || endTime) && (
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-[#a8862f]" />
              <span className="font-serif text-base text-[#14110d]">
                {startTime?.substring(0, 5) || '--:--'} – {endTime?.substring(0, 5) || '--:--'}
              </span>
            </div>
          )}
          {notes && <div className="text-[#3a342c]">{notes}</div>}
        </div>
      )}
    </div>
  );
}
