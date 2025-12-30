import React, { useState } from 'react';
import './MuroEvidencias.css';

const MuroEvidencias = () => {
  const [hitos] = useState([
    {
      id: 1,
      tipo: 'acta',
      titulo: 'Acta de Junta General Ordinaria 2024',
      fecha: new Date('2024-03-15'),
      estado: 'firmada',
      archivo: 'acta_junta_2024.pdf',
      firmantes: 12,
      totalFirmantes: 15,
      certificado: true
    },
    {
      id: 2,
      tipo: 'convocatoria',
      titulo: 'Convocatoria Junta Extraordinaria',
      fecha: new Date('2024-04-01'),
      estado: 'enviada',
      archivo: 'convocatoria_extraordinaria.pdf',
      acuseRecibo: true,
      recibosEnviados: 18,
      totalRecibos: 20
    },
    {
      id: 3,
      tipo: 'certificado',
      titulo: 'Certificado de Acuerdos Aprobados',
      fecha: new Date('2024-03-20'),
      estado: 'emitido',
      archivo: 'certificado_acuerdos_2024.pdf',
      validez: '2024-12-31'
    },
    {
      id: 4,
      tipo: 'acta',
      titulo: 'Acta de Junta Extraordinaria - Obras',
      fecha: new Date('2024-02-10'),
      estado: 'firmada',
      archivo: 'acta_obras_2024.pdf',
      firmantes: 10,
      totalFirmantes: 10,
      certificado: true
    }
  ]);

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'acta':
        return '📋';
      case 'convocatoria':
        return '📨';
      case 'certificado':
        return '✅';
      default:
        return '📄';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'acta':
        return 'Acta Firmada';
      case 'convocatoria':
        return 'Convocatoria';
      case 'certificado':
        return 'Certificado';
      default:
        return 'Documento';
    }
  };

  const getEstadoBadge = (hito) => {
    if (hito.estado === 'firmada') {
      return (
        <span className="evidencia-badge firmada">
          ✅ Firmada Digitalmente
        </span>
      );
    }
    if (hito.estado === 'enviada') {
      return (
        <span className="evidencia-badge enviada">
          📨 Enviada con Acuse de Recibo
        </span>
      );
    }
    if (hito.estado === 'emitido') {
      return (
        <span className="evidencia-badge emitido">
          ✅ Certificado Emitido
        </span>
      );
    }
    return null;
  };

  const hitosAgrupados = hitos.reduce((acc, hito) => {
    const tipo = hito.tipo;
    if (!acc[tipo]) {
      acc[tipo] = [];
    }
    acc[tipo].push(hito);
    return acc;
  }, {});

  return (
    <div className="muro-evidencias-container">
      <div className="muro-evidencias-header">
        <div>
          <h2 className="muro-evidencias-title">📚 Muro de Evidencias</h2>
          <p className="muro-evidencias-subtitle">Gestión documental organizada por hitos legales</p>
        </div>
      </div>

      {/* Resumen de Hitos */}
      <div className="hitos-resumen">
        <div className="hito-resumen-card">
          <div className="hito-resumen-icon">📋</div>
          <div className="hito-resumen-content">
            <span className="hito-resumen-value">
              {hitos.filter(h => h.tipo === 'acta').length}
            </span>
            <span className="hito-resumen-label">Actas Firmadas</span>
          </div>
        </div>
        <div className="hito-resumen-card">
          <div className="hito-resumen-icon">📨</div>
          <div className="hito-resumen-content">
            <span className="hito-resumen-value">
              {hitos.filter(h => h.tipo === 'convocatoria').length}
            </span>
            <span className="hito-resumen-label">Convocatorias</span>
          </div>
        </div>
        <div className="hito-resumen-card">
          <div className="hito-resumen-icon">✅</div>
          <div className="hito-resumen-content">
            <span className="hito-resumen-value">
              {hitos.filter(h => h.tipo === 'certificado').length}
            </span>
            <span className="hito-resumen-label">Certificados</span>
          </div>
        </div>
      </div>

      {/* Lista de Hitos por Tipo */}
      {Object.entries(hitosAgrupados).map(([tipo, documentos]) => (
        <div key={tipo} className="hito-seccion">
          <div className="hito-seccion-header">
            <h3 className="hito-seccion-title">
              {getTipoIcon(tipo)} {getTipoLabel(tipo)}s
            </h3>
            <span className="hito-seccion-count">{documentos.length} documento{documentos.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="hito-documentos-list">
            {documentos.map((hito) => (
              <div key={hito.id} className="hito-documento-card">
                <div className="hito-documento-header">
                  <div className="hito-documento-info">
                    <h4 className="hito-documento-titulo">{hito.titulo}</h4>
                    <p className="hito-documento-fecha">{formatDate(hito.fecha)}</p>
                  </div>
                  {getEstadoBadge(hito)}
                </div>

                <div className="hito-documento-details">
                  {hito.tipo === 'acta' && (
                    <div className="hito-detail-item">
                      <span className="hito-detail-label">Firmantes:</span>
                      <span className="hito-detail-value">
                        {hito.firmantes} / {hito.totalFirmantes}
                      </span>
                      <div className="hito-progress-bar">
                        <div 
                          className="hito-progress-fill"
                          style={{ width: `${(hito.firmantes / hito.totalFirmantes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {hito.tipo === 'convocatoria' && (
                    <div className="hito-detail-item">
                      <span className="hito-detail-label">Recibos enviados:</span>
                      <span className="hito-detail-value">
                        {hito.recibosEnviados} / {hito.totalRecibos}
                      </span>
                      {hito.acuseRecibo && (
                        <span className="hito-acuse-badge">✓ Acuse de recibo confirmado</span>
                      )}
                    </div>
                  )}

                  {hito.tipo === 'certificado' && (
                    <div className="hito-detail-item">
                      <span className="hito-detail-label">Válido hasta:</span>
                      <span className="hito-detail-value">
                        {new Date(hito.validez).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  )}

                  {hito.certificado && (
                    <div className="hito-certificado-badge">
                      🔒 Certificado digital activo
                    </div>
                  )}
                </div>

                <div className="hito-documento-actions">
                  <button className="hito-action-btn primary">
                    📄 Ver Documento
                  </button>
                  <button className="hito-action-btn secondary">
                    ⬇️ Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MuroEvidencias;
