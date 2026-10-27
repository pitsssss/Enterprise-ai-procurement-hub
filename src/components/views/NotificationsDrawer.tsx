import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  X,
  Bell,
  AlertTriangle,
  Award,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'action' | 'bid' | 'flag' | 'system';
  title: string;
  desc: string;
  timestamp: string;
  read: boolean;
  rfqRef?: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'action' | 'flag'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      type: 'flag',
      title: 'SOX Section 404 Hold on PO-2025-0720',
      desc: 'Single-source award to Apex Data ($340,000) exceeds $250k threshold. Form CS-8 Sole-Source waiver is required.',
      timestamp: '14 mins ago',
      read: false,
      rfqRef: 'PO-2025-0720',
    },
    {
      id: 'n-2',
      type: 'bid',
      title: 'Competitive Bid Received: Global Micro Fab',
      desc: 'New quote submitted for RFQ-2025-0891 ($385,000, 5-week lead time, 96 ESG).',
      timestamp: '42 mins ago',
      read: false,
      rfqRef: 'RFQ-2025-0891',
    },
    {
      id: 'n-3',
      type: 'action',
      title: 'Treasury Dual-Signoff Pending on PO-2025-0718',
      desc: 'Awaiting secondary sign-off from Group Treasury Officer Marcus Vance ($388,500).',
      timestamp: '2 hours ago',
      read: true,
      rfqRef: 'PO-2025-0718',
    },
    {
      id: 'n-4',
      type: 'system',
      title: 'SAP S/4HANA OData Sync Completed',
      desc: 'All cleared purchase orders and master vendor ledger mappings synced successfully.',
      timestamp: '4 hours ago',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'action') return n.type === 'action' || n.type === 'flag';
    if (filter === 'flag') return n.type === 'flag';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-[#11211E] border-l border-[#DDE3E1] dark:border-[#24423D] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#DDE3E1] dark:border-[#24423D] px-5 shrink-0 bg-[#FAF9F6] dark:bg-[#162B27]">
          <div className="flex items-center gap-2.5">
            <Bell className="h-4 w-4 text-[#173E38] dark:text-[#4EA89A]" />
            <h2 className="text-sm font-semibold text-[#17272A] dark:text-[#EBF1F0]">
              Procurement Alerts
            </h2>
            {unreadCount > 0 && (
              <Badge variant="accent" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#173E38] dark:text-[#4EA89A] hover:underline font-medium"
              >
                Mark Read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#647A7B] dark:text-[#8BA39F] hover:text-[#17272A] dark:hover:text-[#EBF1F0] p-1 rounded-md"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E] text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F]'
                : 'text-[#647A7B] dark:text-[#8BA39F] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter('action')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'action'
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F]'
                : 'text-[#647A7B] dark:text-[#8BA39F] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]'
            }`}
          >
            Action Required
          </button>
          <button
            onClick={() => setFilter('flag')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'flag'
                ? 'bg-[#173E38] text-white dark:bg-[#2E7A6F]'
                : 'text-[#647A7B] dark:text-[#8BA39F] hover:bg-[#FAF9F6] dark:hover:bg-[#162B27]'
            }`}
          >
            SOX Holds
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto touch-scroll p-4 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                !item.read
                  ? 'border-[#C17C43]/40 bg-[#FAF9F6] dark:bg-[#162B27] shadow-2xs'
                  : 'border-[#DDE3E1] dark:border-[#24423D] bg-white dark:bg-[#11211E]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {item.type === 'flag' ? (
                    <Badge variant="danger" size="sm" dot>SOX Alert</Badge>
                  ) : item.type === 'bid' ? (
                    <Badge variant="accent" size="sm">New Quote</Badge>
                  ) : item.type === 'action' ? (
                    <Badge variant="warning" size="sm">Dual Signoff</Badge>
                  ) : (
                    <Badge variant="default" size="sm">System</Badge>
                  )}
                  <span className="text-[10px] text-[#647A7B] dark:text-[#8BA39F]">
                    {item.timestamp}
                  </span>
                </div>
                {!item.read && (
                  <span className="h-2 w-2 rounded-full bg-[#C17C43] dark:bg-[#D48D55]" />
                )}
              </div>

              <h3 className="mt-2 text-xs font-semibold text-[#17272A] dark:text-[#EBF1F0] leading-snug">
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] text-[#34484B] dark:text-[#C2D3CF] leading-relaxed">
                {item.desc}
              </p>

              {item.type === 'flag' && (
                <button
                  onClick={() => {
                    onNavigateTab('pos');
                    onClose();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#C17C43] dark:text-[#D48D55] hover:underline"
                >
                  <span>Resolve in PO Exceptions</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}

              {item.type === 'bid' && (
                <button
                  onClick={() => {
                    onNavigateTab('bids');
                    onClose();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#173E38] dark:text-[#4EA89A] hover:underline"
                >
                  <span>Inspect in Bid Matrix</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
