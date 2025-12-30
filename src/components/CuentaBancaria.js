import React from 'react';
import { mockCuentaBancaria } from '../data/mockCuentaBancaria';
import './CuentaBancaria.css';

const CuentaBancaria = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="cuenta-container">
      <div className="cuenta-header">
        <h2 className="cuenta-title">💰 Cuenta Bancaria</h2>
        <span className="cuenta-status">Activa</span>
      </div>

      {/* Saldo Principal */}
      <div className="cuenta-saldo-card">
        <div style={{ marginBottom: '1rem' }}>
          <p className="cuenta-saldo-label">Saldo Actual</p>
          <p className="cuenta-saldo-value">{formatCurrency(mockCuentaBancaria.saldoActual)}</p>
        </div>
        <div className="cuenta-saldo-divider">
          <span className="cuenta-disponible-label">Disponible</span>
          <span className="cuenta-disponible-value">{formatCurrency(mockCuentaBancaria.saldoDisponible)}</span>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div className="cuenta-info-grid">
        <div className="cuenta-info-item">
          <p className="cuenta-info-label">Número de Cuenta</p>
          <p className="cuenta-info-value">{mockCuentaBancaria.numeroCuenta}</p>
        </div>
        <div className="cuenta-info-item">
          <p className="cuenta-info-label">Entidad Bancaria</p>
          <p className="cuenta-info-value" style={{ fontFamily: 'inherit' }}>{mockCuentaBancaria.entidad}</p>
        </div>
      </div>

      {/* Movimientos */}
      <div>
        <h3 className="cuenta-movimientos-title">Últimos Movimientos</h3>
        <div className="cuenta-movimientos-list">
          {mockCuentaBancaria.movimientos.map((movimiento) => (
            <div key={movimiento.id} className="cuenta-movimiento">
              <div className="cuenta-movimiento-info">
                <p className="cuenta-movimiento-concepto">{movimiento.concepto}</p>
                <p className="cuenta-movimiento-fecha">{formatDate(movimiento.fecha)}</p>
              </div>
              <div className="cuenta-movimiento-amount">
                <p className={`cuenta-movimiento-importe ${movimiento.tipo === 'ingreso' ? 'positive' : 'negative'}`}>
                  {movimiento.tipo === 'ingreso' ? '+' : ''}
                  {formatCurrency(movimiento.importe)}
                </p>
                <span className={`cuenta-movimiento-badge ${movimiento.tipo}`}>
                  {movimiento.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuentaBancaria;
