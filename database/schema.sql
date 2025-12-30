-- ============================================
-- ESQUEMA DE BASE DE DATOS - COMUNIDAD DE VECINOS
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: communities (Comunidades)
-- ============================================
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: plans (Planes de Precios)
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE, -- 'individual', 'comunidad', 'premium'
  precio DECIMAL(10, 2) NOT NULL,
  periodo TEXT NOT NULL DEFAULT 'al mes',
  descripcion TEXT,
  caracteristicas JSONB DEFAULT '[]'::jsonb,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar planes iniciales
INSERT INTO plans (nombre, precio, periodo, descripcion, caracteristicas) VALUES
('individual', 1.99, 'al mes', 'Perfecto para vecinos que quieren acceso individual', 
 '["Acceso completo al dashboard", "Consulta de actas", "Visualización de finanzas", "Sistema de notificaciones", "Participación en votaciones", "Subida de documentos", "Soporte por email"]'::jsonb),
('comunidad', 50.00, 'al mes', 'Ideal para comunidades completas',
 '["Todo lo del Plan Individual", "Acceso para todos los vecinos", "Panel de administración", "Gestión centralizada", "Estadísticas y reportes", "Prioridad en soporte", "Actualizaciones automáticas", "Backup de datos"]'::jsonb),
('premium', 99.00, 'al mes', 'Con inteligencia artificial avanzada',
 '["Todo lo del Plan Comunidad", "Asistente IA para gestión", "Análisis predictivo de finanzas", "Generación automática de actas", "Recomendaciones inteligentes", "Chatbot de soporte 24/7", "Integración con otros sistemas", "API personalizada", "Soporte prioritario premium"]'::jsonb)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- TABLA: user_subscriptions (Suscripciones Usuario-Plan)
-- ============================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice único parcial para asegurar solo una suscripción activa por usuario-plan
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_unique_active 
ON user_subscriptions(user_id, plan_id) 
WHERE activo = true;

-- ============================================
-- TABLA: user_profiles (Perfiles de Usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  telefono TEXT,
  comunidad_id UUID REFERENCES communities(id) ON DELETE SET NULL,
  rol TEXT DEFAULT 'vecino' CHECK (rol IN ('vecino', 'administrador', 'presidente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: actas (Actas de Reuniones)
-- ============================================
CREATE TABLE IF NOT EXISTS actas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comunidad_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('ordinaria', 'extraordinaria', 'comite')),
  fecha DATE NOT NULL,
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Aprobada', 'Pendiente', 'Rechazada')),
  participantes INTEGER DEFAULT 0,
  archivo_url TEXT,
  archivo_nombre TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para actas
CREATE INDEX IF NOT EXISTS idx_actas_comunidad ON actas(comunidad_id);
CREATE INDEX IF NOT EXISTS idx_actas_usuario ON actas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_actas_fecha ON actas(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_actas_estado ON actas(estado);

-- ============================================
-- TABLA: notifications (Notificaciones)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensaje TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('votacion', 'acta', 'pago', 'sistema')),
  icono TEXT DEFAULT '🔔',
  leida BOOLEAN DEFAULT false,
  relacion_id UUID, -- ID de la entidad relacionada (acta, votación, etc)
  relacion_tipo TEXT, -- Tipo de relación
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notifications_usuario ON notifications(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notifications_leida ON notifications(usuario_id, leida);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- TABLA: bank_accounts (Cuentas Bancarias)
-- ============================================
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comunidad_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  numero_cuenta TEXT NOT NULL,
  entidad TEXT,
  saldo_actual DECIMAL(12, 2) DEFAULT 0,
  saldo_disponible DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comunidad_id)
);

-- ============================================
-- TABLA: bank_movements (Movimientos Bancarios)
-- ============================================
CREATE TABLE IF NOT EXISTS bank_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cuenta_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  concepto TEXT NOT NULL,
  importe DECIMAL(12, 2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  fecha DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para movimientos bancarios
CREATE INDEX IF NOT EXISTS idx_movements_cuenta ON bank_movements(cuenta_id);
CREATE INDEX IF NOT EXISTS idx_movements_fecha ON bank_movements(fecha DESC);

-- ============================================
-- TABLA: user_logs (Logs de Actividad de Usuarios)
-- ============================================
CREATE TABLE IF NOT EXISTS user_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accion TEXT NOT NULL, -- 'login', 'logout', 'upload_acta', 'view_dashboard', etc.
  detalles JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para logs
CREATE INDEX IF NOT EXISTS idx_logs_usuario ON user_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_accion ON user_logs(accion);
CREATE INDEX IF NOT EXISTS idx_logs_created ON user_logs(created_at DESC);

-- ============================================
-- TABLA: votaciones (Votaciones - Para futuro)
-- ============================================
CREATE TABLE IF NOT EXISTS votaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comunidad_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  estado TEXT DEFAULT 'abierta' CHECK (estado IN ('abierta', 'cerrada', 'finalizada')),
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  resultado JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: votes (Votos Individuales - Para futuro)
-- ============================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  votacion_id UUID NOT NULL REFERENCES votaciones(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voto TEXT NOT NULL CHECK (voto IN ('a_favor', 'en_contra', 'abstencion')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(votacion_id, usuario_id)
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actas_updated_at BEFORE UPDATE ON actas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votaciones_updated_at BEFORE UPDATE ON votaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, nombre, rol)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nombre', ''), 'vecino');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrar usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE actas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies para user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies para actas
CREATE POLICY "Users can view actas from their community" ON actas
  FOR SELECT USING (
    comunidad_id IN (
      SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert actas in their community" ON actas
  FOR INSERT WITH CHECK (
    comunidad_id IN (
      SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update actas" ON actas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND rol IN ('administrador', 'presidente')
    )
  );

-- Policies para notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Policies para bank_accounts
CREATE POLICY "Users can view bank account from their community" ON bank_accounts
  FOR SELECT USING (
    comunidad_id IN (
      SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Policies para bank_movements
CREATE POLICY "Users can view movements from their community account" ON bank_movements
  FOR SELECT USING (
    cuenta_id IN (
      SELECT id FROM bank_accounts 
      WHERE comunidad_id IN (
        SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- Policies para user_logs
CREATE POLICY "Users can view own logs" ON user_logs
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "System can insert logs" ON user_logs
  FOR INSERT WITH CHECK (true);

-- Policies para plans
CREATE POLICY "Anyone can view active plans" ON plans
  FOR SELECT USING (activo = true);

-- Policies para user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies para communities
CREATE POLICY "Users can view their community" ON communities
  FOR SELECT USING (
    id IN (
      SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Policies para votaciones
CREATE POLICY "Users can view votaciones from their community" ON votaciones
  FOR SELECT USING (
    comunidad_id IN (
      SELECT comunidad_id FROM user_profiles WHERE id = auth.uid()
    )
  );

-- Policies para votes
CREATE POLICY "Users can view own votes" ON votes
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

