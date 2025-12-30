import React, { useState } from 'react';
import './RegisterModal.css';

const RegisterModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    comunidad: '',
    interes: 'informacion'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío (en MVP no se envía realmente)
    console.log('Datos registrados:', formData);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2 className="modal-title">¡Gracias por registrarte!</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginTop: '1rem' }}>
            Te mantendremos informado sobre todas las novedades de la plataforma.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📧 Recibe Información</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginBottom: '1.5rem' }}>
          Regístrate para recibir información sobre nuevas funcionalidades y actualizaciones
        </p>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+34 600 000 000"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="comunidad" className="form-label">
              Nombre de tu Comunidad
            </label>
            <input
              type="text"
              id="comunidad"
              name="comunidad"
              value={formData.comunidad}
              onChange={handleChange}
              placeholder="Comunidad de Vecinos..."
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="interes" className="form-label">
              ¿Qué te interesa más?
            </label>
            <select
              id="interes"
              name="interes"
              value={formData.interes}
              onChange={handleChange}
              className="form-input"
            >
              <option value="informacion">Información general</option>
              <option value="actas">Gestión de actas</option>
              <option value="finanzas">Control financiero</option>
              <option value="notificaciones">Sistema de notificaciones</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;

