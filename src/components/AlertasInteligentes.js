import React, { useState } from 'react';
import './AlertasInteligentes.css';

const AlertasInteligentes = () => {
  const [alertas] = useState([
    {
      id: 1,
      tipo: 'presupuesto',
      severidad: 'warning',
      titulo: 'Desviación presupuestaria detectada',
      descripcion: 'El gasto en mantenimiento ha superado el 75% del presupuesto anual asignado.',
      fecha: new Date('2024-04-10'),
      accion: 'Revisar presupuesto',
      icono: '💰'
    },
    {
      id: 2,
      tipo: 'recibo',
      severidad: 'error',
      titulo: 'Recibos devueltos',
      descripcion: '3 recibos han sido devueltos por falta de fondos. Requiere atención inmediata.',
      fecha: new Date('2024-04-08'),
      accion: 'Gestionar recibos',
      icono: '⚠️'
    },
    {
      id: 3,
      tipo: 'factura',
      severidad: 'info',
      titulo: 'Posible factura duplicada detectada',
      descripcion: 'La IA ha detectado una posible duplicación en la factura #2024-045 de mantenimiento.',
      fecha: new Date('2024-04-05'),
      accion: 'Verificar factura',
      icono: '🔍'
    },
    {
      id: 4,
      tipo: 'plazo',
      severidad: 'warning',
      titulo: 'Plazo legal próximo a vencer',
      descripcion: 'Faltan 5 días para el cierre del plazo de votos de ausentes en la Junta General.',
      fecha: new Date('2024-04-12'),
      accion: 'Ver plazos',
      icono: '⏰'
    }
  ]);

  const [mostrarTodas, setMostrarTodas] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getSeveridadClass = (severidad) => {
    switch (severidad) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const alertasVisibles = mostrarTodas ? alertas : alertas.slice(0, 3);
  const alertasCriticas = alertas.filter(a => a.severidad === 'error' || a.severidad === 'warning');

  return (
    <div className="alertas-inteligentes-container">
      <div className="alertas-header">
        <div>
          <h2 className="alertas-title">🚨 Panel de Alertas Inteligentes</h2>
          <p className="alertas-subtitle">Notificaciones de control y detección de anomalías</p>
        </div>
        {alertasCriticas.length > 0 && (
          <div className="alertas-criticas-badge">
            {alertasCriticas.length} {alertasCriticas.length === 1 ? 'alerta crítica' : 'alertas críticas'}
          </div>
        )}
      </div>

      {/* Banner de Alertas Críticas */}
      {alertasCriticas.length > 0 && (
        <div className="alertas-banner-critico">
          <div className="banner-content">
            <span className="banner-icon">⚠️</span>
            <div className="banner-text">
              <p className="banner-titulo">Atención Requerida</p>
              <p className="banner-descripcion">
                Tienes {alertasCriticas.length} {alertasCriticas.length === 1 ? 'alerta' : 'alertas'} que requiere{alertasCriticas.length === 1 ? '' : 'n'} atención inmediata
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Alertas */}
      <div className="alertas-list">
        {alertasVisibles.map((alerta) => (
          <div 
            key={alerta.id} 
            className={`alerta-card ${getSeveridadClass(alerta.severidad)}`}
          >
            <div className="alerta-icon">{alerta.icono}</div>
            <div className="alerta-content">
              <div className="alerta-header">
                <h3 className="alerta-titulo">{alerta.titulo}</h3>
                <span className="alerta-fecha">{formatDate(alerta.fecha)}</span>
              </div>
              <p className="alerta-descripcion">{alerta.descripcion}</p>
              <button className="alerta-accion-btn">
                {alerta.accion} →
              </button>
            </div>
            <div className={`alerta-severidad-indicator ${getSeveridadClass(alerta.severidad)}`}></div>
          </div>
        ))}
      </div>

      {/* Botón para mostrar todas */}
      {alertas.length > 3 && (
        <div className="alertas-footer">
          <button 
            className="alertas-ver-todas-btn"
            onClick={() => setMostrarTodas(!mostrarTodas)}
          >
            {mostrarTodas ? 'Mostrar menos' : `Ver todas las alertas (${alertas.length})`}
          </button>
        </div>
      )}

      {/* Resumen de Tipos de Alertas */}
      <div className="alertas-resumen">
        <div className="resumen-item">
          <span className="resumen-icon">💰</span>
          <span className="resumen-label">Presupuesto</span>
          <span className="resumen-count">
            {alertas.filter(a => a.tipo === 'presupuesto').length}
          </span>
        </div>
        <div className="resumen-item">
          <span className="resumen-icon">⚠️</span>
          <span className="resumen-label">Recibos</span>
          <span className="resumen-count">
            {alertas.filter(a => a.tipo === 'recibo').length}
          </span>
        </div>
        <div className="resumen-item">
          <span className="resumen-icon">🔍</span>
          <span className="resumen-label">Facturas</span>
          <span className="resumen-count">
            {alertas.filter(a => a.tipo === 'factura').length}
          </span>
        </div>
        <div className="resumen-item">
          <span className="resumen-icon">⏰</span>
          <span className="resumen-label">Plazos</span>
          <span className="resumen-count">
            {alertas.filter(a => a.tipo === 'plazo').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertasInteligentes;
