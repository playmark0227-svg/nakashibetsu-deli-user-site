'use client';

import { Clock, Zap, Calendar, AlertCircle } from 'lucide-react';

interface WorkStatusBadgeProps {
  status?: 'working' | 'scheduled' | 'off' | 'unknown';
  instantAvailable?: boolean;
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
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
  // サイズ設定
  const sizeClasses = {
    sm: {
      badge: 'text-xs px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      badge: 'text-sm px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      badge: 'text-base px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  // ステータス別のスタイル設定
  const getStatusConfig = () => {
    switch (status) {
      case 'working':
        return {
          label: '出勤中',
          icon: <div className={`${currentSize.icon} rounded-full bg-green-500 animate-pulse`}></div>,
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        };
      case 'scheduled':
        return {
          label: '出勤予定',
          icon: <Calendar className={`${currentSize.icon} text-blue-500`} />,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      case 'off':
        return {
          label: '本日休み',
          icon: <AlertCircle className={`${currentSize.icon} text-gray-500`} />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          label: '未定',
          icon: <AlertCircle className={`${currentSize.icon} text-gray-400`} />,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="space-y-2">
      {/* メインバッジ */}
      <div className="flex flex-wrap items-center gap-2">
        {/* ステータスバッジ */}
        <div
          className={`inline-flex items-center space-x-1.5 ${currentSize.badge} ${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full font-semibold`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>

        {/* ソク姫バッジ */}
        {status === 'working' && instantAvailable && (
          <div
            className={`inline-flex items-center space-x-1 ${currentSize.badge} bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold shadow-md animate-pulse`}
          >
            <Zap className={currentSize.icon} />
            <span>ソク姫OK</span>
          </div>
        )}
      </div>

      {/* 詳細情報 */}
      {showDetails && status !== 'off' && status !== 'unknown' && (
        <div className={`space-y-1 ${currentSize.text} text-gray-600`}>
          {/* 時間情報 */}
          {(startTime || endTime) && (
            <div className="flex items-center space-x-2">
              <Clock className={`${currentSize.icon} text-rose-400`} />
              <span>
                {startTime?.substring(0, 5) || '??:??'} 〜 {endTime?.substring(0, 5) || '??:??'}
              </span>
            </div>
          )}

          {/* 備考 */}
          {notes && (
            <div className="text-gray-700 font-medium">
              {notes}
            </div>
          )}

          {/* ソク姫メッセージ */}
          {status === 'working' && instantAvailable && (
            <div className="text-rose-600 font-semibold">
              📞 今すぐお電話ください！
            </div>
          )}
        </div>
      )}
    </div>
  );
}
