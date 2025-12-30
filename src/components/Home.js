import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Pricing from './Pricing';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="header-logo-icon">🏢</span>
            <span className="header-logo-text">Comunidad de Vecinos</span>
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="header-link"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary"
                >
                  Mi Cuenta
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRegister(true)}
                  className="header-link"
                >
                  Registrarse
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn btn-primary"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-text">✨ La forma más sencilla de gestionar tu comunidad</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-line">Tu comunidad,</span>
            <span className="hero-title-line hero-title-highlight">más conectada</span>
            <span className="hero-title-line">que nunca</span>
          </h1>
          <p className="hero-subtitle">
            Simplifica la gestión de tu comunidad de vecinos con una plataforma intuitiva y moderna. 
            Actas, finanzas, votaciones y comunicación en un solo lugar.
          </p>
          <div className="hero-cta-group">
            <button onClick={handleGetStarted} className="hero-cta hero-cta-primary">
              <span>Empezar gratis</span>
              <span className="hero-cta-arrow">→</span>
            </button>
            <button 
              onClick={() => setShowRegister(true)}
              className="hero-cta hero-cta-secondary"
            >
              <span>Saber más</span>
            </button>
          </div>
          <div className="hero-features">
            <div className="hero-feature-item">
              <span className="hero-feature-icon">✓</span>
              <span>14 días gratis</span>
            </div>
            <div className="hero-feature-item">
              <span className="hero-feature-icon">✓</span>
              <span>Sin tarjeta</span>
            </div>
            <div className="hero-feature-item">
              <span className="hero-feature-icon">✓</span>
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
        <div className="hero-blobs">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-white">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">¿Para qué sirve?</h2>
            <p className="section-subtitle">
              Simplifica la gestión de tu comunidad con herramientas digitales modernas diseñadas específicamente para comunidades de vecinos
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-card-gradient-1">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Gestión de Actas</h3>
              <p className="feature-description">
                Accede a todas las actas de reuniones de manera organizada y centralizada. Los vecinos pueden subir sus propias actas, 
                consultar decisiones, acuerdos y votaciones en tiempo real. Todo el historial disponible con un solo clic.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-header">
                    <span className="feature-preview-date">15 Mar 2024</span>
                    <span className="feature-preview-status">Aprobada</span>
                  </div>
                  <div className="feature-preview-title">Reunión Ordinaria</div>
                  <div className="feature-preview-desc">Aprobación de presupuesto anual...</div>
                </div>
              </div>
            </div>
            <div className="feature-card feature-card-gradient-2">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Control Financiero</h3>
              <p className="feature-description">
                Visualiza el estado de la cuenta bancaria de la comunidad, movimientos y saldos actualizados de forma transparente. 
                Consulta ingresos, gastos y presupuestos de manera clara y organizada.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-balance">
                    <span className="feature-preview-label">Saldo Actual</span>
                    <span className="feature-preview-value">45.230,75 €</span>
                  </div>
                  <div className="feature-preview-movements">
                    <div className="feature-preview-movement">
                      <span>Cuota Marzo</span>
                      <span className="positive">+1.250,00 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card feature-card-gradient-3">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Sistema de Notificaciones</h3>
              <p className="feature-description">
                Recibe notificaciones cuando hay nuevas votaciones, actas publicadas o recordatorios importantes. 
                Mantente siempre informado de lo que sucede en tu comunidad sin perder ningún detalle.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-notification">
                    <span className="feature-preview-notif-icon">🔔</span>
                    <div>
                      <div className="feature-preview-notif-title">Nueva votación disponible</div>
                      <div className="feature-preview-notif-time">Hace 2 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card feature-card-gradient-1">
              <div className="feature-icon">🗳️</div>
              <h3 className="feature-title">Votaciones Digitales</h3>
              <p className="feature-description">
                Participa en votaciones importantes directamente desde la plataforma. Vota sobre presupuestos, obras, 
                cambios en la comunidad y más. Recibe notificaciones cuando hay votaciones pendientes.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-vote">
                    <div className="feature-preview-vote-title">Aprobación de obras</div>
                    <div className="feature-preview-vote-progress">
                      <div className="feature-preview-progress-bar">
                        <div className="feature-preview-progress-fill" style={{ width: '65%' }}></div>
                      </div>
                      <span className="feature-preview-progress-text">65% votado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card feature-card-gradient-2">
              <div className="feature-icon">📤</div>
              <h3 className="feature-title">Subida de Documentos</h3>
              <p className="feature-description">
                Los vecinos pueden subir actas, documentos y archivos importantes directamente desde el dashboard. 
                Fácil, rápido y seguro. Todos los documentos quedan organizados y accesibles.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-upload">
                    <span className="feature-preview-upload-icon">📄</span>
                    <div>
                      <div className="feature-preview-upload-name">acta_reunion.pdf</div>
                      <div className="feature-preview-upload-size">245 KB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-card feature-card-gradient-3">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">Acceso Seguro</h3>
              <p className="feature-description">
                Sistema de autenticación seguro que garantiza que solo los vecinos autorizados puedan acceder a la información. 
                Tus datos están protegidos y solo visibles para miembros de tu comunidad.
              </p>
              <div className="feature-preview">
                <div className="feature-preview-card">
                  <div className="feature-preview-security">
                    <span className="feature-preview-security-icon">🔒</span>
                    <div>
                      <div className="feature-preview-security-title">Acceso Verificado</div>
                      <div className="feature-preview-security-desc">Sesión segura activa</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="section section-gradient">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Funcionalidades Principales</h2>
            <p className="section-subtitle">
              Descubre todas las herramientas que tenemos para ti
            </p>
          </div>
          
          <div className="main-features-grid">
            <div className="main-feature-card">
              <div className="main-feature-icon">📋</div>
              <h3 className="main-feature-title">Gestión Completa de Actas</h3>
              <p className="main-feature-description">
                Gestiona todas las actas de reuniones de forma eficiente. Sube nuevas actas con documentos PDF o Word, organiza por fecha y tipo, y busca rápidamente en el historial.
              </p>
              <ul className="main-feature-list">
                <li>Subida de actas con archivos adjuntos</li>
                <li>Organización por fecha y tipo</li>
                <li>Búsqueda rápida</li>
                <li>Estados: Aprobada, Pendiente, Rechazada</li>
              </ul>
              <div className="main-feature-preview">
                <div className="preview-card-small">
                  <div className="preview-header-small">
                    <span className="preview-date-small">15 Mar 2024</span>
                    <span className="preview-status-small">Aprobada</span>
                  </div>
                  <div className="preview-title-small">Reunión Ordinaria</div>
                </div>
              </div>
            </div>

            <div className="main-feature-card">
              <div className="main-feature-icon">🔔</div>
              <h3 className="main-feature-title">Sistema Inteligente de Notificaciones</h3>
              <p className="main-feature-description">
                Recibe avisos en tiempo real sobre votaciones pendientes, nuevas actas publicadas, recordatorios de pagos y eventos relevantes en tu comunidad.
              </p>
              <ul className="main-feature-list">
                <li>Notificaciones en tiempo real</li>
                <li>Avisos de votaciones pendientes</li>
                <li>Recordatorios de pagos y cuotas</li>
                <li>Alertas de nuevas actas</li>
              </ul>
              <div className="main-feature-preview">
                <div className="preview-card-small">
                  <div className="preview-notif-small">
                    <span>🔔</span>
                    <div>
                      <div className="preview-notif-title-small">Nueva votación disponible</div>
                      <div className="preview-notif-time-small">Hace 2 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-feature-card">
              <div className="main-feature-icon">🗳️</div>
              <h3 className="main-feature-title">Votaciones Digitales</h3>
              <p className="main-feature-description">
                Participa en las decisiones importantes de forma digital. Vota directamente desde la plataforma, ve resultados en tiempo real y consulta el historial completo.
              </p>
              <ul className="main-feature-list">
                <li>Votaciones en tiempo real</li>
                <li>Resultados instantáneos</li>
                <li>Historial completo</li>
                <li>Notificaciones automáticas</li>
              </ul>
              <div className="main-feature-preview">
                <div className="preview-card-small">
                  <div className="preview-vote-small">
                    <div className="preview-vote-title-small">Aprobación de obras</div>
                    <div className="preview-progress-small">
                      <div className="preview-progress-bar-small">
                        <div className="preview-progress-fill-small" style={{ width: '65%' }}></div>
                      </div>
                      <span className="preview-progress-text-small">65% votado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-feature-card">
              <div className="main-feature-icon">💰</div>
              <h3 className="main-feature-title">Transparencia Financiera Total</h3>
              <p className="main-feature-description">
                Control completo sobre las finanzas. Visualiza el saldo actual, consulta movimientos bancarios, ingresos y gastos actualizados en tiempo real.
              </p>
              <ul className="main-feature-list">
                <li>Saldo actualizado en tiempo real</li>
                <li>Historial completo de movimientos</li>
                <li>Clasificación de ingresos y gastos</li>
                <li>Información de cuenta bancaria</li>
              </ul>
              <div className="main-feature-preview">
                <div className="preview-card-small">
                  <div className="preview-balance-small">
                    <span className="preview-label-small">Saldo Actual</span>
                    <span className="preview-value-small">45.230,75 €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for Section */}
      <section className="section section-white">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">¿Para quién es?</h2>
            <p className="section-subtitle">
              Diseñado para todos los miembros de la comunidad
            </p>
          </div>
          <div className="features-grid">
            <div className="card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Vecinos</h3>
              <p className="feature-description" style={{ marginBottom: '1rem' }}>
                Mantente informado sobre todas las decisiones y acuerdos de tu comunidad desde cualquier dispositivo. 
                Consulta actas, participa en votaciones y recibe notificaciones importantes.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Consulta de actas en cualquier momento</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Estado financiero transparente</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Participación en votaciones</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Subida de actas y documentos</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Notificaciones personalizadas</li>
              </ul>
            </div>
            <div className="card">
              <div className="feature-icon">👔</div>
              <h3 className="feature-title">Administradores</h3>
              <p className="feature-description" style={{ marginBottom: '1rem' }}>
                Gestiona eficientemente toda la documentación y mantén a los vecinos informados de forma centralizada. 
                Controla las finanzas, publica actas y gestiona votaciones.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Gestión completa de documentos</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Control financiero detallado</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Creación de votaciones</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Comunicación centralizada</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Panel de administración</li>
              </ul>
            </div>
            <div className="card">
              <div className="feature-icon">👑</div>
              <h3 className="feature-title">Presidentes</h3>
              <p className="feature-description" style={{ marginBottom: '1rem' }}>
                Lidera tu comunidad con herramientas que facilitan la transparencia y la comunicación efectiva. 
                Toma decisiones informadas con toda la información a tu alcance.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Transparencia total en decisiones</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Gestión simplificada de reuniones</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Comunicación eficiente con vecinos</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Acceso a todas las funcionalidades</li>
                <li style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-gray)' }}>✓ Reportes y estadísticas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="section section-white">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-subtitle">
              Proceso simple y directo en 6 pasos
            </p>
          </div>
          <div className="steps-grid">
            {[
              { step: '1', title: 'Inicia Sesión', desc: 'Accede con tus credenciales únicas proporcionadas por la administración de tu comunidad', icon: '🔐' },
              { step: '2', title: 'Explora el Dashboard', desc: 'Visualiza todas las actas disponibles, notificaciones pendientes y estado financiero', icon: '📊' },
              { step: '3', title: 'Participa Activamente', desc: 'Vota en propuestas importantes, sube actas y documentos, y mantente informado', icon: '🗳️' },
              { step: '4', title: 'Recibe Notificaciones', desc: 'Te avisamos cuando hay votaciones pendientes, nuevas actas o información importante', icon: '🔔' },
              { step: '5', title: 'Consulta y Gestiona', desc: 'Revisa el historial completo, consulta finanzas y gestiona toda la documentación', icon: '📄' },
              { step: '6', title: 'Colabora y Comunica', desc: 'Comparte información con vecinos, accede al foro de ayuda y mantén tu comunidad conectada', icon: '🤝' }
            ].map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section section-benefits">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Beneficios para tu Comunidad</h2>
            <p className="section-subtitle">
              Descubre por qué miles de comunidades confían en nuestra plataforma
            </p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Rapidez</h3>
              <p>Accede a toda la información en segundos, sin esperas ni trámites complicados</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌐</div>
              <h3>Accesibilidad</h3>
              <p>Funciona en cualquier dispositivo: ordenador, tablet o móvil, desde cualquier lugar</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Seguridad</h3>
              <p>Tus datos están protegidos con sistemas de seguridad avanzados</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💡</div>
              <h3>Simplicidad</h3>
              <p>Interfaz intuitiva que cualquiera puede usar sin necesidad de formación</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Eficiencia</h3>
              <p>Ahorra tiempo y recursos en la gestión diaria de tu comunidad</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Transparencia</h3>
              <p>Toda la información está disponible para todos los miembros autorizados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="section section-white">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Ejemplo de Uso</h2>
            <p className="section-subtitle">
              Descubre cómo puedes gestionar tu comunidad de forma eficiente
            </p>
          </div>
          <div className="example-card">
            <div className="example-grid">
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Caso de Uso Real</h3>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-gray)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Imagina que necesitas consultar el acta de la última reunión donde se aprobaron las obras de mejora en la fachada. 
                  Con nuestra plataforma:
                </p>
                <ul className="example-list">
                  <li className="example-list-item">Recibes una notificación cuando se publica el acta</li>
                  <li className="example-list-item">Accedes con un clic desde cualquier dispositivo</li>
                  <li className="example-list-item">Encuentras el acta en segundos con búsqueda intuitiva</li>
                  <li className="example-list-item">Revisas todos los detalles: participantes, decisiones, presupuestos</li>
                  <li className="example-list-item">Consultas el estado financiero relacionado con las obras</li>
                  <li className="example-list-item">Puedes votar sobre propuestas relacionadas directamente desde la plataforma</li>
                </ul>
              </div>
              <div className="example-preview">
                <div className="example-preview-item">
                  <span className="example-preview-label">Saldo Actual</span>
                  <span className="example-preview-value">45.230,75 €</span>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div className="example-preview-movement">
                    <span className="example-preview-movement-label">Cuota Marzo</span>
                    <span className="example-preview-movement-value positive">+1.250,00 €</span>
                  </div>
                  <div className="example-preview-movement">
                    <span className="example-preview-movement-label">Mantenimiento</span>
                    <span className="example-preview-movement-value negative">-850,50 €</span>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4ff', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span>🔔</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>2 notificaciones nuevas</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                    Nueva votación disponible
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-badge">🚀 Comienza Ahora</div>
          <h2 className="cta-title">
            ¿Listo para comenzar?
          </h2>
          <p className="cta-subtitle">
            Únete a las comunidades que ya están digitalizando su gestión. Regístrate para recibir información o accede directamente.
          </p>
          <div className="cta-buttons">
            <button onClick={handleGetStarted} className="cta-button-primary">
              <span>Acceder Ahora</span>
              <span className="cta-arrow">→</span>
            </button>
            <button 
              onClick={() => setShowRegister(true)}
              className="cta-button-secondary"
            >
              📧 Recibir Información
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="footer-logo-icon">🏢</span>
                <span className="footer-logo-text">Comunidad de Vecinos</span>
              </div>
              <p className="footer-description">
                La plataforma digital más completa para gestionar tu comunidad de vecinos de forma eficiente y transparente.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Producto</h4>
              <ul className="footer-links">
                <li><a href="#features">Funcionalidades</a></li>
                <li><a href="#pricing">Precios</a></li>
                <li><a href="#how-it-works">Cómo Funciona</a></li>
                <li><a href="#benefits">Beneficios</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Empresa</h4>
              <ul className="footer-links">
                <li><a href="#about">Sobre Nosotros</a></li>
                <li><a href="#contact">Contacto</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#careers">Carreras</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#privacy">Política de Privacidad</a></li>
                <li><a href="#terms">Términos y Condiciones</a></li>
                <li><a href="#cookies">Política de Cookies</a></li>
                <li><a href="#legal">Aviso Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2024 Comunidad de Vecinos. Todos los derechos reservados.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">📘</a>
              <a href="#" className="footer-social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
};

export default Home;
