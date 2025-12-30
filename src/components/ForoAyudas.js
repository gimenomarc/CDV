import React, { useState } from 'react';
import './ForoAyudas.css';

const ForoAyudas = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  const categorias = [
    { id: 'todas', nombre: 'Todas', icono: '📚' },
    { id: 'actas', nombre: 'Actas', icono: '📋' },
    { id: 'finanzas', nombre: 'Finanzas', icono: '💰' },
    { id: 'votaciones', nombre: 'Votaciones', icono: '🗳️' },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: '🔔' },
    { id: 'tecnico', nombre: 'Técnico', icono: '⚙️' }
  ];

  const ayudas = [
    {
      id: 1,
      titulo: 'Cómo subir una nueva acta',
      categoria: 'actas',
      descripcion: 'Aprende a subir actas de reuniones paso a paso. Incluye cómo adjuntar documentos y completar todos los campos necesarios.',
      pasos: [
        'Accede al Dashboard y haz clic en "Subir Nueva Acta"',
        'Completa el formulario con título, tipo de reunión y fecha',
        'Añade una descripción detallada de los temas tratados',
        'Adjunta el archivo del acta (PDF, DOC o DOCX)',
        'Haz clic en "Subir Acta" y espera la confirmación'
      ],
      icono: '📤'
    },
    {
      id: 2,
      titulo: 'Consultar el estado financiero',
      categoria: 'finanzas',
      descripcion: 'Guía completa para entender y consultar la información financiera de tu comunidad.',
      pasos: [
        'En el Dashboard, busca la sección "Cuenta Bancaria"',
        'Visualiza el saldo actual y disponible',
        'Revisa los últimos movimientos con sus conceptos',
        'Consulta el número de cuenta y entidad bancaria',
        'Los movimientos se actualizan automáticamente'
      ],
      icono: '💰'
    },
    {
      id: 3,
      titulo: 'Gestionar notificaciones',
      categoria: 'notificaciones',
      descripcion: 'Aprende a gestionar tus notificaciones y no perderte información importante.',
      pasos: [
        'Haz clic en el icono de campana en el header',
        'Revisa todas tus notificaciones organizadas por fecha',
        'Marca como leídas haciendo clic en ellas',
        'Las notificaciones incluyen votaciones, actas y recordatorios',
        'El contador muestra las no leídas'
      ],
      icono: '🔔'
    },
    {
      id: 4,
      titulo: 'Participar en votaciones',
      categoria: 'votaciones',
      descripcion: 'Cómo votar en las propuestas importantes de tu comunidad.',
      pasos: [
        'Recibirás una notificación cuando haya una votación disponible',
        'Accede a la sección de votaciones desde el Dashboard',
        'Lee la propuesta completa y la información relacionada',
        'Selecciona tu voto (A favor, En contra, Abstención)',
        'Confirma tu voto y visualiza los resultados en tiempo real'
      ],
      icono: '🗳️'
    },
    {
      id: 5,
      titulo: 'Optimizar la gestión de actas',
      categoria: 'actas',
      descripcion: 'Consejos para mantener tus actas organizadas y fáciles de encontrar.',
      pasos: [
        'Usa títulos descriptivos y claros',
        'Incluye siempre la fecha de la reunión',
        'Añade una descripción detallada de los temas',
        'Mantén los archivos en formato PDF cuando sea posible',
        'Revisa el estado de las actas regularmente'
      ],
      icono: '📋'
    },
    {
      id: 6,
      titulo: 'Recomendaciones de seguridad',
      categoria: 'tecnico',
      descripcion: 'Mejores prácticas para mantener tu cuenta segura.',
      pasos: [
        'Nunca compartas tus credenciales de acceso',
        'Cierra sesión cuando uses dispositivos compartidos',
        'Mantén tu contraseña segura y cámbiala periódicamente',
        'Reporta cualquier actividad sospechosa',
        'Usa solo dispositivos de confianza para acceder'
      ],
      icono: '🔒'
    },
    {
      id: 7,
      titulo: 'Entender los estados de las actas',
      categoria: 'actas',
      descripcion: 'Explicación de los diferentes estados que puede tener una acta.',
      pasos: [
        'Aprobada: La acta ha sido revisada y aprobada',
        'Pendiente: La acta está en proceso de revisión',
        'Rechazada: La acta necesita correcciones',
        'Los estados se actualizan automáticamente',
        'Puedes filtrar actas por estado'
      ],
      icono: '✅'
    },
    {
      id: 8,
      titulo: 'Interpretar movimientos bancarios',
      categoria: 'finanzas',
      descripcion: 'Cómo entender los movimientos y clasificaciones en la cuenta bancaria.',
      pasos: [
        'Los ingresos aparecen en verde con signo +',
        'Los gastos aparecen en rojo con signo -',
        'Cada movimiento incluye concepto y fecha',
        'Puedes ver el historial completo de movimientos',
        'El saldo se actualiza en tiempo real'
      ],
      icono: '📊'
    }
  ];

  const filteredAyudas = ayudas.filter(ayuda => {
    const matchesCategory = selectedCategory === 'todas' || ayuda.categoria === selectedCategory;
    const matchesSearch = ayuda.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ayuda.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content foro-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">💡 Foro de Ayudas y Recomendaciones</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="foro-search">
          <input
            type="text"
            placeholder="Buscar ayuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="foro-search-input"
          />
        </div>

        <div className="foro-categories">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`foro-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span>{cat.icono}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>

        <div className="foro-content">
          {filteredAyudas.length === 0 ? (
            <div className="foro-empty">
              <div className="foro-empty-icon">🔍</div>
              <p>No se encontraron ayudas con esos criterios</p>
            </div>
          ) : (
            <div className="ayudas-list">
              {filteredAyudas.map(ayuda => (
                <div key={ayuda.id} className="ayuda-card">
                  <div className="ayuda-header">
                    <div className="ayuda-icon">{ayuda.icono}</div>
                    <div className="ayuda-header-content">
                      <h3 className="ayuda-title">{ayuda.titulo}</h3>
                      <span className="ayuda-category">{categorias.find(c => c.id === ayuda.categoria)?.nombre}</span>
                    </div>
                  </div>
                  <p className="ayuda-description">{ayuda.descripcion}</p>
                  <div className="ayuda-pasos">
                    <h4>Pasos:</h4>
                    <ol>
                      {ayuda.pasos.map((paso, index) => (
                        <li key={index}>{paso}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForoAyudas;

