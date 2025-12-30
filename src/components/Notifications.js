import React, { useState, useEffect } from 'react';
import './Notifications.css';

const Notifications = ({ notifications, onClose, onMarkAsRead }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications || []);

  useEffect(() => {
    setLocalNotifications(notifications || []);
  }, [notifications]);

  const handleMarkAsRead = (id) => {
    const updated = localNotifications.map(n => 
      n.id === id ? { ...n, leida: true } : n
    );
    setLocalNotifications(updated);
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const unreadCount = localNotifications.filter(n => !n.leida).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notifications-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            🔔 Notificaciones
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <div className="notifications-list">
          {localNotifications.length === 0 ? (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔕</div>
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            localNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.leida ? 'unread' : ''}`}
                onClick={() => !notification.leida && handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon">{notification.icono}</div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.titulo}</h3>
                  <p className="notification-message">{notification.mensaje}</p>
                  <span className="notification-time">{notification.fecha}</span>
                </div>
                {!notification.leida && (
                  <div className="notification-dot"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

