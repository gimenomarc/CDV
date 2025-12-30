import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { plansService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await plansService.getPlans();
      if (data) {
        // Mapear los planes de la BD al formato esperado
        const mappedPlans = data.map(plan => ({
          id: plan.id,
          nombre_db: plan.nombre,
          nombre: plan.nombre === 'individual' ? 'Plan Individual' 
                 : plan.nombre === 'comunidad' ? 'Plan Comunidad'
                 : 'Plan Premium + IA',
          precio: parseFloat(plan.precio).toFixed(2),
          periodo: plan.periodo,
          descripcion: plan.descripcion,
          caracteristicas: Array.isArray(plan.caracteristicas) 
            ? plan.caracteristicas 
            : [],
          popular: plan.nombre === 'comunidad',
          icono: plan.nombre === 'individual' ? '👤' 
                : plan.nombre === 'comunidad' ? '🏢'
                : '🤖',
          color: plan.nombre === 'individual' ? 'blue'
                 : plan.nombre === 'comunidad' ? 'purple'
                 : 'gradient'
        }));
        setPlanes(mappedPlans);
      }
    } catch (error) {
      console.error('Error cargando planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId, planNombre) => {
    if (!user) {
      // Redirigir al login si no está autenticado
      navigate('/');
      return;
    }

    setSubscribing(planId);
    try {
      // Buscar el plan por nombre en la BD
      const plan = planes.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      const { error } = await plansService.createSubscription(user.id, planId);
      if (error) {
        throw error;
      }

      alert(`¡Te has suscrito al ${planNombre}!`);
      // Recargar planes para actualizar estado
      await loadPlans();
    } catch (error) {
      console.error('Error suscribiéndose:', error);
      alert('Error al suscribirse. Intenta nuevamente.');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <section className="pricing-section">
      <div className="section-content">
        <div className="section-header">
          <h2 className="section-title">Planes y Precios</h2>
          <p className="section-subtitle">
            Elige el plan que mejor se adapte a las necesidades de tu comunidad
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Cargando planes...</p>
          </div>
        ) : (
          <div className="pricing-grid">
            {planes.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.color}`}
              >
                {plan.popular && (
                  <div className="pricing-badge">Más Popular</div>
                )}
                <div className="pricing-header">
                  <div className="pricing-icon">{plan.icono}</div>
                  <h3 className="pricing-name">{plan.nombre}</h3>
                  <p className="pricing-description">{plan.descripcion}</p>
                </div>
                <div className="pricing-price">
                  <span className="pricing-amount">{plan.precio}€</span>
                  <span className="pricing-period">{plan.periodo}</span>
                </div>
                <ul className="pricing-features">
                  {plan.caracteristicas.map((feature, index) => (
                    <li key={index} className="pricing-feature">
                      <span className="pricing-check">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`pricing-button ${plan.popular ? 'primary' : 'secondary'}`}
                  onClick={() => handleSubscribe(plan.id, plan.nombre)}
                  disabled={subscribing === plan.id}
                >
                  {subscribing === plan.id ? 'Suscribiendo...' : 'Comenzar Ahora'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pricing-note">
          <p>
            💡 Todos los planes incluyen prueba gratuita de 14 días. Sin tarjeta de crédito requerida.
            Cancela cuando quieras sin compromiso.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

