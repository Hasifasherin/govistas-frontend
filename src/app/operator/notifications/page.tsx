// app/operator/notifications/page.tsx
"use client";

import { useState } from "react";
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiCalendar, FiDollarSign, FiMap } from "react-icons/fi";

interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'system' | 'tour';
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'booking', title: 'New Booking Request', message: 'John Doe booked your "Mountain Adventure" tour for 4 people', time: '10 min ago', read: false, action: 'View Booking' },
    { id: 2, type: 'tour', title: 'Tour Approved', message: 'Your "Beach Paradise" tour has been approved by admin and is now live', time: '1 hour ago', read: false, action: 'View Tour' },
    { id: 3, type: 'payment', title: 'Payment Received', message: 'Payment of $450 received for "Desert Safari" booking #BKG-2345', time: '3 hours ago', read: true, action: 'View Receipt' },
    { id: 4, type: 'system', title: 'System Update', message: 'New features added to your operator dashboard. Check out the updates', time: '1 day ago', read: true },
    { id: 5, type: 'booking', title: 'Booking Cancelled', message: 'Sarah Smith cancelled booking for "Wine Tasting" tour', time: '2 days ago', read: true, action: 'Review Cancellation' },
    { id: 6, type: 'tour', title: 'Low Availability Alert', message: 'Only 2 spots left for "City Tour" this weekend. Consider adding more slots', time: '3 days ago', read: true, action: 'Manage Slots' },
    { id: 7, type: 'payment', title: 'Payment Pending', message: 'Payment for "Mountain Trek" booking is pending. Follow up with customer', time: '4 days ago', read: true, action: 'Send Reminder' },
    { id: 8, type: 'system', title: 'Maintenance Notice', message: 'Scheduled maintenance this Sunday from 2-4 AM. System may be unavailable', time: '1 week ago', read: true },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'payment'>('all');

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <FiCalendar className="text-blue-500" size={20} />;
      case 'payment': return <FiDollarSign className="text-green-500" size={20} />;
      case 'tour': return <FiMap className="text-purple-500" size={20} />;
      case 'system': return <FiInfo className="text-gray-500" size={20} />;
      default: return <FiBell className="text-gray-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-blue-50 border-blue-100';
      case 'payment': return 'bg-green-50 border-green-100';
      case 'tour': return 'bg-purple-50 border-purple-100';
      case 'system': return 'bg-gray-50 border-gray-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'booking': return 'Booking';
      case 'payment': return 'Payment';
      case 'tour': return 'Tour';
      case 'system': return 'System';
      default: return type;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600">Stay updated with your business activities</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* FILTER BUTTONS */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['all', 'unread', 'booking', 'payment'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  filter === f ? "bg-white text-gray-800 shadow" : "text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
            </div>
            <FiBell className="text-gray-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">{notifications.filter(n => !n.read).length}</p>
            </div>
            <FiAlertCircle className="text-yellow-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-2xl font-bold text-blue-600">{notifications.filter(n => n.type === 'booking').length}</p>
            </div>
            <FiCalendar className="text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payments</p>
              <p className="text-2xl font-bold text-green-600">{notifications.filter(n => n.type === 'payment').length}</p>
            </div>
            <FiDollarSign className="text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBell className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! New notifications will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border ${getTypeColor(notification.type)} p-5 ${
                !notification.read ? 'border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    notification.type === 'booking' ? 'bg-blue-100' :
                    notification.type === 'payment' ? 'bg-green-100' :
                    notification.type === 'tour' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{notification.title}</h4>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                        notification.type === 'booking' ? 'bg-blue-100 text-blue-800' :
                        notification.type === 'payment' ? 'bg-green-100 text-green-800' :
                        notification.type === 'tour' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTypeBadge(notification.type)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{notification.time}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                        >
                          <FiCheckCircle size={14} /> Mark as read
                        </button>
                      )}
                      
                      {notification.action && (
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          {notification.action} →
                        </button>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove notification"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>

                {/* UNREAD INDICATOR */}
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      {notifications.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
          <button
            onClick={clearAll}
            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
}