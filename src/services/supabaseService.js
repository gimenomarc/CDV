import { supabase } from '../config/supabase';

// ============================================
// SERVICIO DE LOGS (definido primero para uso en otros servicios)
// ============================================

export const logService = {
  // Crear log
  async createLog(userId, accion, detalles = {}) {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .insert({
          usuario_id: userId,
          accion,
          detalles,
          ip_address: detalles.ip_address || null,
          user_agent: detalles.user_agent || null
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando log:', error);
      // No lanzar error para no interrumpir el flujo principal
      return { data: null, error };
    }
  },

  // Obtener logs del usuario
  async getUserLogs(userId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo logs:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// SERVICIO DE AUTENTICACIÓN
// ============================================

export const authService = {
  // Registrar nuevo usuario
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: userData.nombre || '',
            telefono: userData.telefono || '',
            comunidad: userData.comunidad || ''
          }
        }
      });

      if (error) throw error;

      // Crear perfil de usuario
      if (data.user) {
        await this.createUserProfile(data.user.id, userData);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en signUp:', error);
      return { data: null, error };
    }
  },

  // Iniciar sesión
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Registrar log de login
      if (data.user) {
        await logService.createLog(data.user.id, 'login', {
          email: data.user.email
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error en signIn:', error);
      return { data: null, error };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const user = await this.getCurrentUser();
      if (user) {
        await logService.createLog(user.id, 'logout');
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error };
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  // Obtener sesión actual
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return null;
    }
  },

  // Crear perfil de usuario
  async createUserProfile(userId, userData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          nombre: userData.nombre || '',
          telefono: userData.telefono || '',
          rol: userData.rol || 'vecino'
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando perfil:', error);
      return { data: null, error };
    }
  },

  // Obtener perfil de usuario
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*, communities(*)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// SERVICIO DE ACTAS
// ============================================

export const actasService = {
  // Obtener todas las actas de la comunidad del usuario
  async getActas(userId) {
    try {
      // Primero obtener la comunidad del usuario
      const { data: profile } = await authService.getUserProfile(userId);
      if (!profile?.data?.comunidad_id) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('actas')
        .select('*, user_profiles(nombre)')
        .eq('comunidad_id', profile.data.comunidad_id)
        .order('fecha', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo actas:', error);
      return { data: [], error };
    }
  },

  // Crear nueva acta
  async createActa(actaData, userId) {
    try {
      // Obtener comunidad del usuario
      const { data: profile } = await authService.getUserProfile(userId);
      if (!profile?.data?.comunidad_id) {
        throw new Error('Usuario no tiene comunidad asignada');
      }

      const { data, error } = await supabase
        .from('actas')
        .insert({
          comunidad_id: profile.data.comunidad_id,
          usuario_id: userId,
          titulo: actaData.titulo,
          descripcion: actaData.descripcion,
          tipo: actaData.tipo,
          fecha: actaData.fecha,
          estado: actaData.estado || 'Pendiente',
          participantes: actaData.participantes || 0,
          archivo_nombre: actaData.archivo_nombre || null
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log
      await logService.createLog(userId, 'upload_acta', {
        acta_id: data.id,
        titulo: data.titulo
      });

      // Crear notificación para otros usuarios de la comunidad
      await notificationsService.createNotificationForCommunity(
        profile.data.comunidad_id,
        {
          titulo: 'Nueva acta publicada',
          mensaje: `Se ha publicado el acta: ${actaData.titulo}`,
          tipo: 'acta',
          relacion_id: data.id,
          relacion_tipo: 'acta'
        },
        userId // Excluir al usuario que la creó
      );

      return { data, error: null };
    } catch (error) {
      console.error('Error creando acta:', error);
      return { data: null, error };
    }
  },

  // Subir archivo de acta a Storage
  async uploadActaFile(file, actaId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${actaId}.${fileExt}`;
      const filePath = `actas/${fileName}`;

      const { data, error } = await supabase.storage
        .from('actas')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('actas')
        .getPublicUrl(filePath);

      // Actualizar acta con la URL
      const { error: updateError } = await supabase
        .from('actas')
        .update({ archivo_url: urlData.publicUrl })
        .eq('id', actaId);

      if (updateError) throw updateError;

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      return { data: null, error };
    }
  },

  // Actualizar acta
  async updateActa(actaId, updates) {
    try {
      const { data, error } = await supabase
        .from('actas')
        .update(updates)
        .eq('id', actaId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando acta:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// SERVICIO DE NOTIFICACIONES
// ============================================

export const notificationsService = {
  // Obtener notificaciones del usuario
  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return { data: [], error };
    }
  },

  // Marcar notificación como leída
  async markAsRead(notificationId, userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ leida: true })
        .eq('id', notificationId)
        .eq('usuario_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marcando notificación:', error);
      return { data: null, error };
    }
  },

  // Crear notificación
  async createNotification(userId, notification) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          usuario_id: userId,
          titulo: notification.titulo,
          mensaje: notification.mensaje,
          tipo: notification.tipo,
          icono: notification.icono || '🔔',
          relacion_id: notification.relacion_id || null,
          relacion_tipo: notification.relacion_tipo || null
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando notificación:', error);
      return { data: null, error };
    }
  },

  // Crear notificación para todos los usuarios de una comunidad
  async createNotificationForCommunity(comunidadId, notification, excludeUserId = null) {
    try {
      // Obtener todos los usuarios de la comunidad
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('comunidad_id', comunidadId);

      if (usersError) throw usersError;

      // Filtrar usuario excluido si existe
      const userIds = excludeUserId
        ? users.filter(u => u.id !== excludeUserId).map(u => u.id)
        : users.map(u => u.id);

      if (userIds.length === 0) return { data: [], error: null };

      // Crear notificaciones para cada usuario
      const notifications = userIds.map(userId => ({
        usuario_id: userId,
        titulo: notification.titulo,
        mensaje: notification.mensaje,
        tipo: notification.tipo,
        icono: notification.icono || '🔔',
        relacion_id: notification.relacion_id || null,
        relacion_tipo: notification.relacion_tipo || null
      }));

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando notificaciones para comunidad:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// SERVICIO DE CUENTA BANCARIA
// ============================================

export const bankService = {
  // Obtener cuenta bancaria de la comunidad
  async getBankAccount(userId) {
    try {
      const { data: profile } = await authService.getUserProfile(userId);
      if (!profile?.data?.comunidad_id) {
        return { data: null, error: null };
      }

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('comunidad_id', profile.data.comunidad_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo cuenta bancaria:', error);
      return { data: null, error };
    }
  },

  // Obtener movimientos bancarios
  async getMovements(userId) {
    try {
      const { data: account } = await this.getBankAccount(userId);
      if (!account) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('bank_movements')
        .select('*')
        .eq('cuenta_id', account.id)
        .order('fecha', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo movimientos:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// SERVICIO DE PLANES Y SUSCRIPCIONES
// ============================================

export const plansService = {
  // Obtener todos los planes activos
  async getPlans() {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('activo', true)
        .order('precio', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo planes:', error);
      return { data: [], error };
    }
  },

  // Obtener suscripción del usuario
  async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, plans(*)')
        .eq('user_id', userId)
        .eq('activo', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo suscripción:', error);
      return { data: null, error };
    }
  },

  // Crear suscripción
  async createSubscription(userId, planId) {
    try {
      // Desactivar suscripciones anteriores
      await supabase
        .from('user_subscriptions')
        .update({ activo: false })
        .eq('user_id', userId)
        .eq('activo', true);

      // Crear nueva suscripción
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          activo: true
        })
        .select('*, plans(*)')
        .single();

      if (error) throw error;

      // Registrar log
      await logService.createLog(userId, 'subscribe_plan', {
        plan_id: planId
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creando suscripción:', error);
      return { data: null, error };
    }
  }
};


// ============================================
// SERVICIO DE COMUNIDADES
// ============================================

export const communitiesService = {
  // Crear comunidad
  async createCommunity(communityData) {
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          nombre: communityData.nombre,
          direccion: communityData.direccion || null
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando comunidad:', error);
      return { data: null, error };
    }
  },

  // Obtener comunidad
  async getCommunity(comunidadId) {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', comunidadId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo comunidad:', error);
      return { data: null, error };
    }
  }
};

