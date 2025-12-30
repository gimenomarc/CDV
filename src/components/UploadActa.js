import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { actasService } from '../services/supabaseService';
import './UploadActa.css';

const UploadActa = ({ onClose, onUpload }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'ordinaria',
    fecha: '',
    descripcion: '',
    participantes: 0,
    archivo: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'archivo') {
      setFormData({
        ...formData,
        archivo: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes estar autenticado para subir actas');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      // Crear acta en la base de datos
      const { data: acta, error: actaError } = await actasService.createActa({
        titulo: formData.titulo,
        tipo: formData.tipo,
        fecha: formData.fecha,
        descripcion: formData.descripcion,
        participantes: parseInt(formData.participantes) || 0,
        archivo_nombre: formData.archivo?.name || null
      }, user.id);

      if (actaError) {
        throw actaError;
      }

      // Si hay archivo, subirlo a Storage
      if (formData.archivo && acta?.id) {
        const { error: uploadError } = await actasService.uploadActaFile(formData.archivo, acta.id);
        if (uploadError) {
          console.error('Error subiendo archivo:', uploadError);
          // No lanzar error, la acta ya está creada
        }
      }

      setUploading(false);
      setUploaded(true);
      
      if (onUpload) {
        onUpload();
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error subiendo acta:', err);
      setError(err.message || 'Error al subir el acta. Intenta nuevamente.');
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">✓</div>
          <h2 className="modal-title">¡Acta subida correctamente!</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginTop: '1rem' }}>
            El acta será revisada y publicada próximamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📤 Subir Nueva Acta</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">
              Título del Acta *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Acta de Junta Ordinaria - Marzo 2024"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo" className="form-label">
              Tipo de Reunión *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="ordinaria">Junta Ordinaria</option>
              <option value="extraordinaria">Junta Extraordinaria</option>
              <option value="comite">Comité</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="fecha" className="form-label">
              Fecha de la Reunión *
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe los temas tratados en la reunión..."
              className="form-input form-textarea"
              rows="4"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="participantes" className="form-label">
              Número de Participantes
            </label>
            <input
              type="number"
              id="participantes"
              name="participantes"
              value={formData.participantes}
              onChange={handleChange}
              placeholder="0"
              className="form-input"
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="archivo" className="form-label">
              Archivo del Acta (PDF, DOC, DOCX)
            </label>
            <div className="file-upload-area">
              <input
                type="file"
                id="archivo"
                name="archivo"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="file-input"
              />
              <label htmlFor="archivo" className="file-label">
                {formData.archivo ? (
                  <span className="file-name">📄 {formData.archivo.name}</span>
                ) : (
                  <span className="file-placeholder">
                    <span className="file-icon">📎</span>
                    <span>Haz clic para seleccionar archivo</span>
                  </span>
                )}
              </label>
            </div>
          </div>
          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir Acta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadActa;

