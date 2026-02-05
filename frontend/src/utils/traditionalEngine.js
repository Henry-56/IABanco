// Motor de evaluación tradicional basado en scorecard
export class TraditionalEngine {
    constructor() {
        // Configuración por defecto del scorecard
        this.config = {
            // Pesos de cada factor (suma = 100)
            pesos: {
                edad: 15,
                ingresos: 25,
                deuda: 20,
                historial: 25,
                empleo: 15
            },
            // Rangos de puntuación para cada factor
            scoring: {
                edad: [
                    { min: 18, max: 25, puntos: 60 },
                    { min: 26, max: 35, puntos: 100 },
                    { min: 36, max: 50, puntos: 90 },
                    { min: 51, max: 65, puntos: 70 },
                    { min: 66, max: 100, puntos: 40 }
                ],
                ingresos: [
                    { min: 0, max: 1500, puntos: 40 },
                    { min: 1501, max: 3000, puntos: 70 },
                    { min: 3001, max: 5000, puntos: 90 },
                    { min: 5001, max: Infinity, puntos: 100 }
                ],
                ratioDeuda: [ // deuda_total / ingresos_mensuales
                    { min: 0, max: 0.3, puntos: 100 },
                    { min: 0.3, max: 0.5, puntos: 80 },
                    { min: 0.5, max: 0.7, puntos: 60 },
                    { min: 0.7, max: Infinity, puntos: 30 }
                ],
                historial: {
                    'Bueno': 100,
                    'Regular': 60,
                    'Malo': 20
                },
                empleo: {
                    'Sí': 100,
                    'No': 40
                }
            },
            // Bandas de tasas según score total
            bandasTasas: [
                { minScore: 90, maxScore: 100, tasa: 0.10, nombre: 'AAA - Excelente' },
                { minScore: 80, maxScore: 89, tasa: 0.12, nombre: 'AA - Muy Bueno' },
                { minScore: 70, maxScore: 79, tasa: 0.15, nombre: 'A - Bueno' },
                { minScore: 60, maxScore: 69, tasa: 0.18, nombre: 'BBB - Regular' },
                { minScore: 50, maxScore: 59, tasa: 0.22, nombre: 'BB - Moderado' },
                { minScore: 0, maxScore: 49, tasa: 0.25, nombre: 'B - Alto Riesgo' }
            ],
            // Umbral de aprobación
            umbralAprobacion: 60
        };
    }

    // Actualizar configuración
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Calcular puntuación de un factor numérico con rangos
    calcularPuntuacionRango(valor, rangos) {
        for (const rango of rangos) {
            if (valor >= rango.min && valor <= rango.max) {
                return rango.puntos;
            }
        }
        return 0;
    }

    // Evaluación completa
    evaluate(clientData) {
        const startTime = Date.now();

        // 1. Calcular puntuaciones individuales
        const puntuaciones = {};

        puntuaciones.edad = this.calcularPuntuacionRango(
            parseInt(clientData.edad),
            this.config.scoring.edad
        );

        puntuaciones.ingresos = this.calcularPuntuacionRango(
            parseFloat(clientData.ingresos_mensuales),
            this.config.scoring.ingresos
        );

        const ratioDeuda = parseFloat(clientData.deuda_total) / parseFloat(clientData.ingresos_mensuales);
        puntuaciones.deuda = this.calcularPuntuacionRango(
            ratioDeuda,
            this.config.scoring.ratioDeuda
        );

        puntuaciones.historial = this.config.scoring.historial[clientData.historial_crediticio] || 0;
        puntuaciones.empleo = this.config.scoring.empleo[clientData.empleo_estable] || 0;

        // 2. Calcular score ponderado total
        const scoreTotal =
            (puntuaciones.edad * this.config.pesos.edad / 100) +
            (puntuaciones.ingresos * this.config.pesos.ingresos / 100) +
            (puntuaciones.deuda * this.config.pesos.deuda / 100) +
            (puntuaciones.historial * this.config.pesos.historial / 100) +
            (puntuaciones.empleo * this.config.pesos.empleo / 100);

        // 3. Determinar banda de tasa
        const banda = this.config.bandasTasas.find(
            b => scoreTotal >= b.minScore && scoreTotal <= b.maxScore
        ) || this.config.bandasTasas[this.config.bandasTasas.length - 1];

        // 4. Calcular cuota mensual con tasa asignada
        const tasaMensual = banda.tasa / 12;
        const plazo = parseInt(clientData.plazo_meses) || 12;
        const monto = parseFloat(clientData.monto_solicitado) || 0;
        const cuotaMensual = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazo)) /
                            (Math.pow(1 + tasaMensual, plazo) - 1);

        // 5. Decisión
        const decision = scoreTotal >= this.config.umbralAprobacion ? 'Aprobado' : 'Rechazado';

        // 6. Ratio de endeudamiento con nueva cuota
        const ratioEndeudamiento = ((cuotaMensual + parseFloat(clientData.deuda_total || 0) / plazo) /
                                    parseFloat(clientData.ingresos_mensuales) * 100).toFixed(1);

        const endTime = Date.now();
        const tiempoEvaluacion = endTime - startTime;

        // Generar explicación detallada
        const explicacion = this.generarExplicacion(
            puntuaciones,
            scoreTotal,
            decision,
            banda,
            ratioDeuda,
            ratioEndeudamiento
        );

        return {
            decision,
            scoreTotal: scoreTotal.toFixed(1),
            puntuaciones,
            banda: banda.nombre,
            tasa: (banda.tasa * 100).toFixed(1) + '%',
            tasaDecimal: banda.tasa,
            cuota_mensual: cuotaMensual.toFixed(2),
            ratio_endeudamiento: ratioEndeudamiento + '%',
            explicacion,
            tiempoEvaluacion,
            factoresDetallados: {
                edad: {
                    valor: clientData.edad,
                    puntuacion: puntuaciones.edad,
                    peso: this.config.pesos.edad,
                    contribucion: (puntuaciones.edad * this.config.pesos.edad / 100).toFixed(1)
                },
                ingresos: {
                    valor: clientData.ingresos_mensuales,
                    puntuacion: puntuaciones.ingresos,
                    peso: this.config.pesos.ingresos,
                    contribucion: (puntuaciones.ingresos * this.config.pesos.ingresos / 100).toFixed(1)
                },
                deuda: {
                    valor: ratioDeuda.toFixed(2),
                    puntuacion: puntuaciones.deuda,
                    peso: this.config.pesos.deuda,
                    contribucion: (puntuaciones.deuda * this.config.pesos.deuda / 100).toFixed(1)
                },
                historial: {
                    valor: clientData.historial_crediticio,
                    puntuacion: puntuaciones.historial,
                    peso: this.config.pesos.historial,
                    contribucion: (puntuaciones.historial * this.config.pesos.historial / 100).toFixed(1)
                },
                empleo: {
                    valor: clientData.empleo_estable,
                    puntuacion: puntuaciones.empleo,
                    peso: this.config.pesos.empleo,
                    contribucion: (puntuaciones.empleo * this.config.pesos.empleo / 100).toFixed(1)
                }
            }
        };
    }

    generarExplicacion(puntuaciones, scoreTotal, decision, banda, ratioDeuda, ratioEndeudamiento) {
        let explicacion = `EVALUACIÓN TRADICIONAL (SCORECARD)\n\n`;

        explicacion += `Score Total: ${scoreTotal.toFixed(1)}/100\n`;
        explicacion += `Clasificación de Riesgo: ${banda.nombre}\n`;
        explicacion += `Tasa Asignada: ${(banda.tasa * 100).toFixed(1)}% anual\n\n`;

        explicacion += `PUNTUACIONES POR FACTOR:\n`;
        explicacion += `• Edad: ${puntuaciones.edad}/100\n`;
        explicacion += `• Ingresos: ${puntuaciones.ingresos}/100\n`;
        explicacion += `• Ratio Deuda/Ingreso (${(ratioDeuda * 100).toFixed(1)}%): ${puntuaciones.deuda}/100\n`;
        explicacion += `• Historial Crediticio: ${puntuaciones.historial}/100\n`;
        explicacion += `• Empleo Estable: ${puntuaciones.empleo}/100\n\n`;

        explicacion += `ANÁLISIS:\n`;
        if (decision === 'Aprobado') {
            explicacion += `✓ El cliente cumple con el score mínimo requerido.\n`;
            explicacion += `✓ Ratio de endeudamiento proyectado: ${ratioEndeudamiento}%\n`;

            if (parseFloat(ratioEndeudamiento) > 40) {
                explicacion += `⚠ Advertencia: El ratio de endeudamiento es alto. Considerar reducir monto o extender plazo.\n`;
            }
        } else {
            explicacion += `✗ El cliente NO cumple con el score mínimo requerido (60 puntos).\n`;

            // Identificar áreas débiles
            const areas = [];
            if (puntuaciones.edad < 70) areas.push('edad');
            if (puntuaciones.ingresos < 70) areas.push('ingresos');
            if (puntuaciones.deuda < 70) areas.push('nivel de endeudamiento');
            if (puntuaciones.historial < 70) areas.push('historial crediticio');
            if (puntuaciones.empleo < 70) areas.push('estabilidad laboral');

            if (areas.length > 0) {
                explicacion += `• Áreas de mejora: ${areas.join(', ')}\n`;
            }
        }

        return explicacion;
    }
}
