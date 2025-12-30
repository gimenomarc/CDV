import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actasService, notificationsService } from '../services/supabaseService';
import CuentasClaras from './CuentasClaras';
import GobernanzaDigital from './GobernanzaDigital';
import MuroEvidencias from './MuroEvidencias';
import AlertasInteligentes from './AlertasInteligentes';
import CuentaBancaria from './CuentaBancaria';
import UploadActa from './UploadActa';
import Notifications from './Notifications';
import ForoAyudas from './ForoAyudas';
import './Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showForo, setShowForo] = useState(false);
  const [actas, setActas] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Cargar actas
      const { data: actasData } = await actasService.getActas(user.id);
      if (actasData) {
        setActas(actasData);
      }

      // Cargar notificaciones
      const { data: notificationsData } = await notificationsService.getNotifications(user.id);
      if (notificationsData) {
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUploadActa = async () => {
    // Recargar actas después de subir una nueva
    await loadData();
  };

  const handleMarkNotificationAsRead = async (id) => {
    if (!user) return;
    
    await notificationsService.markAsRead(id, user.id);
    // Actualizar estado local
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
            <h1 className="dashboard-page-title">Dashboard de Gestión</h1>
            <p className="dashboard-page-subtitle">Transparencia bancaria en tiempo real, juntas sin impugnaciones y control total desde el móvil</p>
          </div>
        </div>

        {/* Panel de Alertas Inteligentes - Siempre visible arriba */}
        <div className="dashboard-section">
          <AlertasInteligentes />
        </div>

        {/* Cuentas Claras - Dashboard Fintech */}
        <div className="dashboard-section">
          <CuentasClaras />
        </div>

        {/* Gobernanza Digital */}
        <div className="dashboard-section">
          <GobernanzaDigital />
        </div>

        {/* Muro de Evidencias */}
        <div className="dashboard-section">
          <MuroEvidencias />
        </div>

        {/* Actas Section - Mantener compatibilidad */}
        {!loading && actas.length > 0 && (
          <div className="dashboard-section">
            <div className="actas-header">
              <div>
                <h2 className="actas-title">📋 Actas de la Comunidad</h2>
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
                    <span className="acta-date">{new Date(acta.fecha).toLocaleDateString('es-ES')}</span>
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
                  {acta.archivo_url && (
                    <a 
                      href={acta.archivo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}
                    >
                      📄 Ver Archivo
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
