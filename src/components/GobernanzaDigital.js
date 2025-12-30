import React, { useState, useEffect } from 'react';
import './GobernanzaDigital.css';

const GobernanzaDigital = () => {
  const [junta, setJunta] = useState({
    titulo: 'Junta General Ordinaria 2024',
    fecha: new Date('2024-04-15'),
    asistentes: 12,
    totalPropietarios: 20,
    coeficientesAsistentes: 65.5,
    coeficientesTotales: 100,
    votaciones: [
      {
        id: 1,
        titulo: 'Aprobación de presupuesto anual',
        votosFavor: 8,
        votosContra: 2,
        votosAbstencion: 2,
        coeficientesFavor: 52.3,
        coeficientesContra: 10.2,
        coeficientesAbstencion: 3.0,
        estado: 'en_votacion'
      },
      {
        id: 2,
        titulo: 'Renovación de fachada',
        votosFavor: 10,
        votosContra: 1,
        votosAbstencion: 1,
        coeficientesFavor: 58.5,
        coeficientesContra: 5.0,
        coeficientesAbstencion: 2.0,
        estado: 'aprobada'
      }
    ]
  });

  const [plazoLegal, setPlazoLegal] = useState({
    tipo: 'votos_ausentes',
    fechaLimite: new Date('2024-04-22'),
    diasRestantes: 0
  });

  useEffect(() => {
    const calcularDiasRestantes = () => {
      const ahora = new Date();
      const diferencia = plazoLegal.fechaLimite - ahora;
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      setPlazoLegal(prev => ({ ...prev, diasRestantes: Math.max(0, dias) }));
    };

    calcularDiasRestantes();
    const interval = setInterval(calcularDiasRestantes, 1000 * 60 * 60); // Actualizar cada hora

    return () => clearInterval(interval);
  }, [plazoLegal.fechaLimite]);

  const getQuorumPercentage = () => {
    return (junta.coeficientesAsistentes / junta.coeficientesTotales) * 100;
  };

  const getQuorumStatus = () => {
    const percentage = getQuorumPercentage();
    return percentage >= 50 ? 'valid' : 'invalid';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getVotacionStatus = (votacion) => {
    if (votacion.estado === 'aprobada') return 'aprobada';
    if (votacion.coeficientesFavor > 50) return 'aprobada';
    if (votacion.coeficientesContra > 50) return 'rechazada';
    return 'en_votacion';
  };

  const quorumStatus = getQuorumStatus();
  const quorumPercentage = getQuorumPercentage();

  return (
    <div className="gobernanza-digital-container">
      <div className="gobernanza-header">
        <div>
          <h2 className="gobernanza-title">🏛️ Gobernanza Digital</h2>
          <p className="gobernanza-subtitle">Juntas virtuales con cumplimiento legal garantizado</p>
        </div>
      </div>

      {/* Información de la Junta */}
      <div className="junta-info-card">
        <div className="junta-info-header">
          <h3 className="junta-info-title">{junta.titulo}</h3>
          <span className="junta-info-date">{formatDate(junta.fecha)}</span>
        </div>
      </div>

      {/* Contador de Quórum */}
      <div className="quorum-card">
        <div className="quorum-header">
          <h3 className="quorum-title">Quórum de Asistencia</h3>
          <span className={`quorum-status-badge ${quorumStatus}`}>
            {quorumStatus === 'valid' ? '✅ Válido' : '❌ Insuficiente'}
          </span>
        </div>
        <div className="quorum-content">
          <div className="quorum-stats">
            <div className="quorum-stat">
              <span className="quorum-stat-label">Asistentes</span>
              <span className="quorum-stat-value">
                {junta.asistentes} / {junta.totalPropietarios}
              </span>
            </div>
            <div className="quorum-stat">
              <span className="quorum-stat-label">Coeficientes</span>
              <span className="quorum-stat-value">
                {junta.coeficientesAsistentes.toFixed(1)}% / {junta.coeficientesTotales}%
              </span>
            </div>
          </div>
          <div className="quorum-progress">
            <div className="quorum-progress-bar">
              <div 
                className={`quorum-progress-fill ${quorumStatus}`}
                style={{ width: `${quorumPercentage}%` }}
              ></div>
            </div>
            <div className="quorum-progress-label">
              <span>{quorumPercentage.toFixed(1)}% del quórum necesario</span>
              <span className={quorumStatus === 'valid' ? 'positive' : 'warning'}>
                {quorumStatus === 'valid' ? '✅ Cumple' : '⚠️ Requiere 50%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cronómetro de Plazos Legales */}
      <div className="plazo-legal-card">
        <div className="plazo-legal-header">
          <h3 className="plazo-legal-title">⏱️ Cronómetro de Plazos Legales</h3>
        </div>
        <div className="plazo-legal-content">
          <div className="plazo-legal-timer">
            <div className="timer-days">
              <span className="timer-value">{plazoLegal.diasRestantes}</span>
              <span className="timer-label">días</span>
            </div>
            <div className="timer-info">
              <p className="timer-text">
                {plazoLegal.diasRestantes > 0 
                  ? `Faltan ${plazoLegal.diasRestantes} días para el cierre de votos de ausentes`
                  : 'Plazo cerrado'}
              </p>
              <p className="timer-date">
                Fecha límite: {formatDate(plazoLegal.fechaLimite)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Votación con Doble Cómputo */}
      <div className="votaciones-section">
        <h3 className="votaciones-title">Votaciones Activas</h3>
        <div className="votaciones-list">
          {junta.votaciones.map((votacion) => {
            const status = getVotacionStatus(votacion);
            const totalVotos = votacion.votosFavor + votacion.votosContra + votacion.votosAbstencion;
            const totalCoeficientes = votacion.coeficientesFavor + votacion.coeficientesContra + votacion.coeficientesAbstencion;
            
            return (
              <div key={votacion.id} className="votacion-card">
                <div className="votacion-header">
                  <h4 className="votacion-titulo">{votacion.titulo}</h4>
                  <span className={`votacion-status-badge ${status}`}>
                    {status === 'aprobada' ? '✅ Aprobada' : 
                     status === 'rechazada' ? '❌ Rechazada' : '🗳️ En Votación'}
                  </span>
                </div>

                {/* Doble Cómputo: Votos Personales */}
                <div className="votacion-computo">
                  <h5 className="computo-title">Cómputo por Votos Personales</h5>
                  <div className="computo-stats">
                    <div className="computo-stat favor">
                      <span className="computo-label">A favor</span>
                      <span className="computo-value">{votacion.votosFavor}</span>
                      <span className="computo-percentage">
                        {totalVotos > 0 ? ((votacion.votosFavor / totalVotos) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="computo-stat contra">
                      <span className="computo-label">En contra</span>
                      <span className="computo-value">{votacion.votosContra}</span>
                      <span className="computo-percentage">
                        {totalVotos > 0 ? ((votacion.votosContra / totalVotos) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="computo-stat abstencion">
                      <span className="computo-label">Abstención</span>
                      <span className="computo-value">{votacion.votosAbstencion}</span>
                      <span className="computo-percentage">
                        {totalVotos > 0 ? ((votacion.votosAbstencion / totalVotos) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doble Cómputo: Porcentajes de Propiedad */}
                <div className="votacion-computo">
                  <h5 className="computo-title">Cómputo por Coeficientes de Propiedad</h5>
                  <div className="computo-stats">
                    <div className="computo-stat favor">
                      <span className="computo-label">A favor</span>
                      <span className="computo-value">{votacion.coeficientesFavor.toFixed(1)}%</span>
                    </div>
                    <div className="computo-stat contra">
                      <span className="computo-label">En contra</span>
                      <span className="computo-value">{votacion.coeficientesContra.toFixed(1)}%</span>
                    </div>
                    <div className="computo-stat abstencion">
                      <span className="computo-label">Abstención</span>
                      <span className="computo-value">{votacion.coeficientesAbstencion.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Barra de Progreso Visual */}
                <div className="votacion-progress">
                  <div className="votacion-progress-bar">
                    <div 
                      className="votacion-progress-fill favor"
                      style={{ width: `${votacion.coeficientesFavor}%` }}
                    ></div>
                    <div 
                      className="votacion-progress-fill contra"
                      style={{ width: `${votacion.coeficientesContra}%` }}
                    ></div>
                    <div 
                      className="votacion-progress-fill abstencion"
                      style={{ width: `${votacion.coeficientesAbstencion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GobernanzaDigital;
