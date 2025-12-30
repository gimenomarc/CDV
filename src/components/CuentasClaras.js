import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bankService } from '../services/supabaseService';
import './CuentasClaras.css';

const CuentasClaras = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [movements, setMovements] = useState([]);
  const [budget, setBudget] = useState({ anual: 120000, gastado: 45000 });
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
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBudgetPercentage = () => {
    return Math.min((budget.gastado / budget.anual) * 100, 100);
  };

  const getBudgetStatus = () => {
    const percentage = getBudgetPercentage();
    if (percentage < 50) return 'healthy';
    if (percentage < 75) return 'warning';
    return 'critical';
  };

  if (loading) {
    return (
      <div className="cuentas-claras-container">
        <div className="cuentas-claras-loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos financieros...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="cuentas-claras-container">
        <div className="cuentas-claras-header">
          <h2 className="cuentas-claras-title">💳 Cuentas Claras</h2>
          <span className="cuentas-claras-badge">Open Banking</span>
        </div>
        <div className="cuentas-claras-empty">
          <p>No hay cuenta bancaria conectada.</p>
          <button className="btn btn-primary">Conectar Cuenta</button>
        </div>
      </div>
    );
  }

  const budgetStatus = getBudgetStatus();
  const budgetPercentage = getBudgetPercentage();

  return (
    <div className="cuentas-claras-container">
      <div className="cuentas-claras-header">
        <div>
          <h2 className="cuentas-claras-title">💳 Cuentas Claras</h2>
          <p className="cuentas-claras-subtitle">Transparencia bancaria en tiempo real</p>
        </div>
        <span className="cuentas-claras-badge">Open Banking</span>
      </div>

      {/* Saldo Principal - Estilo Fintech */}
      <div className="cuentas-claras-balance-card">
        <div className="balance-main">
          <p className="balance-label">Saldo Actual</p>
          <p className="balance-value">{formatCurrency(account.saldo_actual || 0)}</p>
          <p className="balance-update">Actualizado hace 2 minutos</p>
        </div>
        <div className="balance-details">
          <div className="balance-detail-item">
            <span className="balance-detail-label">Disponible</span>
            <span className="balance-detail-value positive">
              {formatCurrency(account.saldo_disponible || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico de Gastos vs Presupuesto */}
      <div className="cuentas-claras-budget-card">
        <div className="budget-header">
          <h3 className="budget-title">Gastos vs Presupuesto Anual</h3>
          <span className={`budget-status-badge ${budgetStatus}`}>
            {budgetStatus === 'healthy' ? '✅ Saludable' : 
             budgetStatus === 'warning' ? '⚠️ Atención' : '🔴 Crítico'}
          </span>
        </div>
        <div className="budget-progress">
          <div className="budget-progress-bar">
            <div 
              className={`budget-progress-fill ${budgetStatus}`}
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <div className="budget-stats">
            <div className="budget-stat">
              <span className="budget-stat-label">Gastado</span>
              <span className="budget-stat-value">{formatCurrency(budget.gastado)}</span>
            </div>
            <div className="budget-stat">
              <span className="budget-stat-label">Presupuesto</span>
              <span className="budget-stat-value">{formatCurrency(budget.anual)}</span>
            </div>
            <div className="budget-stat">
              <span className="budget-stat-label">Restante</span>
              <span className="budget-stat-value positive">
                {formatCurrency(budget.anual - budget.gastado)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Movimientos Bancarios con Trazabilidad */}
      <div className="cuentas-claras-movements">
        <h3 className="movements-title">Movimientos Recientes</h3>
        {movements.length === 0 ? (
          <div className="movements-empty">
            <p>No hay movimientos registrados.</p>
          </div>
        ) : (
          <div className="movements-list">
            {movements.map((movimiento) => (
              <div key={movimiento.id} className="movement-item">
                <div className="movement-icon">
                  {movimiento.tipo === 'ingreso' ? '💰' : '💸'}
                </div>
                <div className="movement-info">
                  <p className="movement-concepto">{movimiento.concepto}</p>
                  <p className="movement-fecha">{formatDate(movimiento.fecha)}</p>
                </div>
                <div className="movement-amount">
                  <p className={`movement-importe ${movimiento.tipo === 'ingreso' ? 'positive' : 'negative'}`}>
                    {movimiento.tipo === 'ingreso' ? '+' : '-'}
                    {formatCurrency(Math.abs(movimiento.importe))}
                  </p>
                </div>
                {movimiento.tipo === 'gasto' && (
                  <button 
                    className="movement-invoice-btn"
                    title="Ver factura"
                    aria-label="Ver factura del movimiento"
                  >
                    📄
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CuentasClaras;
