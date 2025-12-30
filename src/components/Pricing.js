import React from 'react';
import './Pricing.css';

const Pricing = () => {
  const planes = [
    {
      id: 'individual',
      nombre: 'Plan Individual',
      precio: '1,99',
      periodo: 'por cliente/mes',
      descripcion: 'Perfecto para vecinos que quieren acceso individual',
      caracteristicas: [
        'Acceso completo al dashboard',
        'Consulta de actas',
        'Visualización de finanzas',
        'Sistema de notificaciones',
        'Participación en votaciones',
        'Subida de documentos',
        'Soporte por email'
      ],
      popular: false,
      icono: '👤',
      color: 'blue'
    },
    {
      id: 'comunidad',
      nombre: 'Plan Comunidad',
      precio: '50',
      periodo: 'por comunidad/mes',
      descripcion: 'Ideal para comunidades completas',
      caracteristicas: [
        'Todo lo del Plan Individual',
        'Acceso para todos los vecinos',
        'Panel de administración',
        'Gestión centralizada',
        'Estadísticas y reportes',
        'Prioridad en soporte',
        'Actualizaciones automáticas',
        'Backup de datos'
      ],
      popular: true,
      icono: '🏢',
      color: 'purple'
    },
    {
      id: 'premium',
      nombre: 'Plan Premium + IA',
      precio: '99',
      periodo: 'por comunidad/mes',
      descripcion: 'Con inteligencia artificial avanzada',
      caracteristicas: [
        'Todo lo del Plan Comunidad',
        'Asistente IA para gestión',
        'Análisis predictivo de finanzas',
        'Generación automática de actas',
        'Recomendaciones inteligentes',
        'Chatbot de soporte 24/7',
        'Integración con otros sistemas',
        'API personalizada',
        'Soporte prioritario premium'
      ],
      popular: false,
      icono: '🤖',
      color: 'gradient'
    }
  ];

  return (
    <section className="pricing-section">
      <div className="section-content">
        <div className="section-header">
          <h2 className="section-title">Planes y Precios</h2>
          <p className="section-subtitle">
            Elige el plan que mejor se adapte a las necesidades de tu comunidad
          </p>
        </div>

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
                <span className="pricing-period">/{plan.periodo}</span>
              </div>
              <ul className="pricing-features">
                {plan.caracteristicas.map((feature, index) => (
                  <li key={index} className="pricing-feature">
                    <span className="pricing-check">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`pricing-button ${plan.popular ? 'primary' : 'secondary'}`}>
                Comenzar Ahora
              </button>
            </div>
          ))}
        </div>

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

