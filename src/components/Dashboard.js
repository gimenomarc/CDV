import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockActas } from '../data/mockActas';
import { mockNotifications } from '../data/mockNotifications';
import CuentaBancaria from './CuentaBancaria';
import UploadActa from './UploadActa';
import Notifications from './Notifications';
import ForoAyudas from './ForoAyudas';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showForo, setShowForo] = useState(false);
  const [actas, setActas] = useState(mockActas);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUploadActa = (nuevaActa) => {
    setActas([nuevaActa, ...actas]);
  };

  const handleMarkNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, leida: true } : n
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.leida).length;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <span className="dashboard-logo-icon">🏢</span>
            <span className="dashboard-logo-text">Comunidad de Vecinos</span>
          </div>
          <nav className="dashboard-nav">
            <button
              onClick={() => navigate('/dashboard')}
              className="dashboard-nav-link"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="dashboard-nav-link"
            >
              Inicio
            </button>
            <button
              onClick={() => setShowForo(true)}
              className="dashboard-nav-link"
            >
              💡 Ayudas
            </button>
          </nav>
          <div className="dashboard-actions">
            <button
              onClick={() => setShowNotifications(true)}
              className="notification-button"
              title="Notificaciones"
            >
              🔔
              {unreadNotifications > 0 && (
                <span className="notification-count">{unreadNotifications}</span>
              )}
            </button>
            <button onClick={handleLogout} className="btn btn-primary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Page Header */}
        <div className="dashboard-page-header">
          <div>
            <h1 className="dashboard-page-title">Dashboard</h1>
            <p className="dashboard-page-subtitle">Gestiona tu comunidad de vecinos</p>
          </div>
          <div className="dashboard-actions-header">
            <button
              onClick={() => setShowUpload(true)}
              className="btn btn-primary"
            >
              📤 Subir Nueva Acta
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{actas.length}</div>
              <div className="stat-label">Actas Totales</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <div className="stat-value">{unreadNotifications}</div>
              <div className="stat-label">Notificaciones</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-value">{actas.filter(a => a.estado === 'Pendiente').length}</div>
              <div className="stat-label">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Cuenta Bancaria Section */}
        <div className="dashboard-section">
          <CuentaBancaria />
        </div>

        {/* Actas Section */}
        <div className="dashboard-section">
          <div className="actas-header">
            <div>
              <h2 className="actas-title">📋 Nuevas Actas</h2>
              <p className="actas-subtitle">Consulta las últimas actas de tu comunidad</p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="btn btn-secondary"
            >
              + Subir Acta
            </button>
          </div>

          <div className="actas-grid">
            {actas.map((acta) => (
              <div key={acta.id} className="acta-card">
                <div className="acta-header">
                  <span className="acta-date">{acta.fecha}</span>
                  <span className={`acta-status ${acta.estado.toLowerCase()}`}>
                    {acta.estado}
                  </span>
                </div>
                <h3 className="acta-title">{acta.titulo}</h3>
                <p className="acta-description">{acta.descripcion}</p>
                <div className="acta-footer">
                  <span>📄 {acta.tipo}</span>
                  <span>👥 {acta.participantes || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showUpload && (
        <UploadActa
          onClose={() => setShowUpload(false)}
          onUpload={handleUploadActa}
        />
      )}
      {showNotifications && (
        <Notifications
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkNotificationAsRead}
        />
      )}
      {showForo && (
        <ForoAyudas onClose={() => setShowForo(false)} />
      )}
    </div>
  );
};

export default Dashboard;
