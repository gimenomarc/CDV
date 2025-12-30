import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bankService } from '../services/supabaseService';
import './CuentaBancaria.css';

const CuentaBancaria = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBankData();
    }
  }, [user]);

  const loadBankData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: accountData } = await bankService.getBankAccount(user.id);
      setAccount(accountData);

      if (accountData) {
        const { data: movementsData } = await bankService.getMovements(user.id);
        setMovements(movementsData || []);
      }
    } catch (error) {
      console.error('Error cargando datos bancarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="cuenta-container">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos bancarios...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="cuenta-container">
        <div className="cuenta-header">
          <h2 className="cuenta-title">💰 Cuenta Bancaria</h2>
        </div>
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-gray)' }}>
          No hay cuenta bancaria registrada para tu comunidad.
        </p>
      </div>
    );
  }

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
          <p className="cuenta-saldo-value">{formatCurrency(account.saldo_actual)}</p>
        </div>
        <div className="cuenta-saldo-divider">
          <span className="cuenta-disponible-label">Disponible</span>
          <span className="cuenta-disponible-value">{formatCurrency(account.saldo_disponible)}</span>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div className="cuenta-info-grid">
        <div className="cuenta-info-item">
          <p className="cuenta-info-label">Número de Cuenta</p>
          <p className="cuenta-info-value">{account.numero_cuenta}</p>
        </div>
        <div className="cuenta-info-item">
          <p className="cuenta-info-label">Entidad Bancaria</p>
          <p className="cuenta-info-value" style={{ fontFamily: 'inherit' }}>{account.entidad || 'N/A'}</p>
        </div>
      </div>

      {/* Movimientos */}
      <div>
        <h3 className="cuenta-movimientos-title">Últimos Movimientos</h3>
        {movements.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-gray)' }}>
            No hay movimientos registrados.
          </p>
        ) : (
          <div className="cuenta-movimientos-list">
            {movements.map((movimiento) => (
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
        )}
      </div>
    </div>
  );
};

export default CuentaBancaria;
