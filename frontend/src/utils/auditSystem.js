// Sistema de Auditoría y Trazabilidad
export class AuditSystem {
    constructor() {
        this.logs = this.loadLogs();
    }

    // Cargar logs desde localStorage
    loadLogs() {
        const saved = localStorage.getItem('crediai_audit_logs');
        return saved ? JSON.parse(saved) : [];
    }

    // Guardar logs en localStorage
    saveLogs() {
        localStorage.setItem('crediai_audit_logs', JSON.stringify(this.logs));
    }

    // Registrar una evaluación
    logEvaluation(data) {
        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            fecha: new Date().toLocaleString('es-PE'),
            usuario: data.usuario || 'Sistema',
            clienteData: data.clienteData,
            evaluacionIA: data.evaluacionIA,
            evaluacionTradicional: data.evaluacionTradicional,
            comparativa: data.comparativa,
            decisionAnalista: null, // Se completará después
            estado: 'pendiente' // pendiente, aprobado, rechazado, ajustado
        };

        this.logs.unshift(logEntry); // Agregar al inicio
        this.saveLogs();

        return logEntry.id;
    }

    // Actualizar decisión del analista
    updateAnalistaDecision(logId, decisionData) {
        const log = this.logs.find(l => l.id === logId);
        if (log) {
            log.decisionAnalista = {
                metodo: decisionData.metodo, // 'ia', 'tradicional', 'ajustado'
                decision: decisionData.decision, // 'Aprobado' o 'Rechazado'
                justificacion: decisionData.justificacion,
                ajustes: decisionData.ajustes || null,
                timestamp: new Date().toISOString(),
                fecha: new Date().toLocaleString('es-PE')
            };
            log.estado = decisionData.decision === 'Aprobado' ? 'aprobado' : 'rechazado';
            this.saveLogs();
            return true;
        }
        return false;
    }

    // Obtener log por ID
    getLog(logId) {
        return this.logs.find(l => l.id === logId);
    }

    // Obtener todos los logs
    getAllLogs() {
        return this.logs;
    }

    // Obtener logs filtrados
    getFilteredLogs(filters = {}) {
        let filtered = [...this.logs];

        if (filters.estado) {
            filtered = filtered.filter(log => log.estado === filters.estado);
        }

        if (filters.fechaDesde) {
            filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.fechaDesde));
        }

        if (filters.fechaHasta) {
            filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.fechaHasta));
        }

        if (filters.metodoFinal) {
            filtered = filtered.filter(log =>
                log.decisionAnalista && log.decisionAnalista.metodo === filters.metodoFinal
            );
        }

        return filtered;
    }

    // Generar estadísticas
    getStatistics() {
        const total = this.logs.length;
        const aprobados = this.logs.filter(l => l.estado === 'aprobado').length;
        const rechazados = this.logs.filter(l => l.estado === 'rechazado').length;
        const pendientes = this.logs.filter(l => l.estado === 'pendiente').length;

        // Concordancia IA vs Tradicional
        const logsCompletos = this.logs.filter(l => l.evaluacionIA && l.evaluacionTradicional);
        const concordantes = logsCompletos.filter(l =>
            l.evaluacionIA.decision === l.evaluacionTradicional.decision
        ).length;

        // Decisiones por método
        const logsConDecision = this.logs.filter(l => l.decisionAnalista);
        const decisionesIA = logsConDecision.filter(l => l.decisionAnalista.metodo === 'ia').length;
        const decisionesTradicional = logsConDecision.filter(l => l.decisionAnalista.metodo === 'tradicional').length;
        const decisionesAjustadas = logsConDecision.filter(l => l.decisionAnalista.metodo === 'ajustado').length;

        // Tiempos promedio
        const tiemposIA = logsCompletos.map(l => l.evaluacionIA.tiempoEvaluacion || 0);
        const tiemposTradicional = logsCompletos.map(l => l.evaluacionTradicional.tiempoEvaluacion || 0);

        const avgTiempoIA = tiemposIA.length > 0 ?
            tiemposIA.reduce((a, b) => a + b, 0) / tiemposIA.length : 0;
        const avgTiempoTradicional = tiemposTradicional.length > 0 ?
            tiemposTradicional.reduce((a, b) => a + b, 0) / tiemposTradicional.length : 0;

        return {
            total,
            aprobados,
            rechazados,
            pendientes,
            tasaAprobacion: total > 0 ? ((aprobados / total) * 100).toFixed(1) : 0,
            concordanciaIATradicional: logsCompletos.length > 0 ?
                ((concordantes / logsCompletos.length) * 100).toFixed(1) : 0,
            decisionesIA,
            decisionesTradicional,
            decisionesAjustadas,
            avgTiempoIA: avgTiempoIA.toFixed(0),
            avgTiempoTradicional: avgTiempoTradicional.toFixed(0)
        };
    }

    // Exportar logs a CSV
    exportToCSV() {
        if (this.logs.length === 0) {
            return '';
        }

        const headers = [
            'ID',
            'Fecha',
            'Usuario',
            'Cliente_Edad',
            'Cliente_Ingresos',
            'Cliente_Deuda',
            'Cliente_Historial',
            'Cliente_Empleo',
            'Monto_Solicitado',
            'Plazo_Meses',
            'Decision_IA',
            'Score_IA',
            'Tasa_IA',
            'Decision_Tradicional',
            'Score_Tradicional',
            'Tasa_Tradicional',
            'Diferencia_Riesgo',
            'Diferencia_Tasa',
            'Metodo_Final',
            'Decision_Final',
            'Justificacion',
            'Estado',
            'Tiempo_IA_ms',
            'Tiempo_Tradicional_ms'
        ];

        const rows = this.logs.map(log => {
            const cliente = log.clienteData || {};
            const ia = log.evaluacionIA || {};
            const trad = log.evaluacionTradicional || {};
            const comp = log.comparativa || {};
            const analista = log.decisionAnalista || {};

            return [
                log.id,
                log.fecha,
                log.usuario,
                cliente.edad,
                cliente.ingresos_mensuales,
                cliente.deuda_total,
                cliente.historial_crediticio,
                cliente.empleo_estable,
                cliente.monto_solicitado,
                cliente.plazo_meses,
                ia.decision || '',
                ia.scoreTotal || '',
                ia.tasa || '',
                trad.decision || '',
                trad.scoreTotal || '',
                trad.tasa || '',
                comp.diferencia_riesgo || '',
                comp.diferencia_tasa || '',
                analista.metodo || '',
                analista.decision || '',
                analista.justificacion ? `"${analista.justificacion.replace(/"/g, '""')}"` : '',
                log.estado,
                ia.tiempoEvaluacion || '',
                trad.tiempoEvaluacion || ''
            ].join(',');
        });

        return [headers.join(','), ...rows].join('\n');
    }

    // Exportar estadísticas a JSON
    exportStatsToJSON() {
        const stats = this.getStatistics();
        return JSON.stringify(stats, null, 2);
    }

    // Limpiar logs antiguos (más de 90 días)
    cleanOldLogs(days = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const before = this.logs.length;
        this.logs = this.logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        this.saveLogs();

        return before - this.logs.length;
    }

    // Generar ID único
    generateId() {
        return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
