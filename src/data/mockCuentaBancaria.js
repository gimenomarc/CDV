export const mockCuentaBancaria = {
  numeroCuenta: 'ES91 2100 0418 4502 0005 1332',
  entidad: 'CaixaBank',
  saldoActual: 45230.75,
  saldoDisponible: 45230.75,
  movimientos: [
    {
      id: 1,
      fecha: '2024-03-20',
      concepto: 'Cuota mensual comunidad - Marzo',
      importe: 1250.00,
      tipo: 'ingreso'
    },
    {
      id: 2,
      fecha: '2024-03-18',
      concepto: 'Mantenimiento ascensor',
      importe: -850.50,
      tipo: 'gasto'
    },
    {
      id: 3,
      fecha: '2024-03-15',
      concepto: 'Limpieza zonas comunes',
      importe: -320.00,
      tipo: 'gasto'
    },
    {
      id: 4,
      fecha: '2024-03-10',
      concepto: 'Cuota mensual comunidad - Febrero',
      importe: 1250.00,
      tipo: 'ingreso'
    },
    {
      id: 5,
      fecha: '2024-03-05',
      concepto: 'Seguro comunidad',
      importe: -450.00,
      tipo: 'gasto'
    },
    {
      id: 6,
      fecha: '2024-03-01',
      concepto: 'Administración de fincas',
      importe: -280.00,
      tipo: 'gasto'
    }
  ]
};

