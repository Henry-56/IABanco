import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Clock, TrendingUp, AlertCircle } from 'lucide-react';

const ComparativaMetodos = ({ evaluacionIA, evaluacionTradicional, comparativa }) => {
    if (!evaluacionIA || !evaluacionTradicional) return null;

    // Preparar datos para gráfica de barras
    const dataComparativa = [
        {
            metodo: 'IA (RAG)',
            Score: parseFloat(evaluacionIA.scoreTotal) || 0,
            Tasa: parseFloat(evaluacionIA.tasa) || 0,
            Tiempo: evaluacionIA.tiempoEvaluacion || 0
        },
        {
            metodo: 'Tradicional',
            Score: parseFloat(evaluacionTradicional.scoreTotal) || 0,
            Tasa: parseFloat(evaluacionTradicional.tasa) || 0,
            Tiempo: evaluacionTradicional.tiempoEvaluacion || 0
        }
    ];

    // Preparar datos para radar de factores (solo tradicional tiene desglose)
    const factores = evaluacionTradicional.factoresDetallados;
    const dataRadar = factores ? [
        { factor: 'Edad', puntuacion: factores.edad.puntuacion },
        { factor: 'Ingresos', puntuacion: factores.ingresos.puntuacion },
        { factor: 'Deuda', puntuacion: factores.deuda.puntuacion },
        { factor: 'Historial', puntuacion: factores.historial.puntuacion },
        { factor: 'Empleo', puntuacion: factores.empleo.puntuacion }
    ] : [];

    // Determinar color según concordancia
    const concordancia = evaluacionIA.decision === evaluacionTradicional.decision;
    const colorConcordancia = concordancia ? '#28a745' : '#ffc107';

    return (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid #007bff', borderRadius: '12px', background: '#f8f9fa' }}>
            <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '1rem' }}>
                📊 Comparativa: IA vs Método Tradicional
            </h2>

            {/* Resumen de Concordancia */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '2rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                border: `3px solid ${colorConcordancia}`
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: evaluacionIA.decision === 'Aprobado' ? '#28a745' : '#dc3545' }}>
                        {evaluacionIA.decision}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Decisión IA</div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '2rem', alignSelf: 'center' }}>
                    {concordancia ? '✓' : '⚠'}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: evaluacionTradicional.decision === 'Aprobado' ? '#28a745' : '#dc3545' }}>
                        {evaluacionTradicional.decision}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Decisión Tradicional</div>
                </div>
            </div>

            {/* Métricas Clave */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <TrendingUp size={24} color="#007bff" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: comparativa.diferencia_riesgo_num >= 0 ? '#28a745' : '#dc3545' }}>
                        {comparativa.diferencia_riesgo}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Diferencia de Riesgo</div>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <AlertCircle size={24} color="#ff6b6b" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: comparativa.diferencia_tasa_num >= 0 ? '#dc3545' : '#28a745' }}>
                        {comparativa.diferencia_tasa}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Diferencia de Tasa</div>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <Clock size={24} color="#6c757d" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {comparativa.diferencia_tiempo}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Diferencia de Tiempo</div>
                </div>
            </div>

            {/* Análisis de Comparativa */}
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ marginTop: 0 }}>📝 Análisis Comparativo</h4>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {concordancia ? (
                        <p style={{ color: '#28a745' }}>
                            ✓ <strong>Ambos métodos concuerdan</strong> en la decisión de {evaluacionIA.decision.toLowerCase()}.
                            Esto indica una evaluación consistente del riesgo del cliente.
                        </p>
                    ) : (
                        <p style={{ color: '#ffc107' }}>
                            ⚠ <strong>Los métodos difieren</strong> en la decisión.
                            Se recomienda revisión manual por parte del analista para determinar la decisión final.
                        </p>
                    )}

                    <p>
                        <strong>Tasa Asignada:</strong><br />
                        • IA: {evaluacionIA.tasa || 'N/A'} → Cuota: S/. {evaluacionIA.cuota_mensual}<br />
                        • Tradicional: {evaluacionTradicional.tasa} → Cuota: S/. {evaluacionTradicional.cuota_mensual}
                    </p>

                    <p>
                        <strong>Tiempo de Evaluación:</strong><br />
                        • IA: {evaluacionIA.tiempoEvaluacion || 'N/A'} ms<br />
                        • Tradicional: {evaluacionTradicional.tiempoEvaluacion} ms
                        {evaluacionTradicional.tiempoEvaluacion < (evaluacionIA.tiempoEvaluacion || Infinity) &&
                            ' (⚡ Método tradicional más rápido)'
                        }
                    </p>
                </div>
            </div>

            {/* Gráficas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1rem' }}>
                {/* Gráfica de Barras Comparativa */}
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ textAlign: 'center', marginTop: 0 }}>Comparación de Scores y Tasas</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataComparativa}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="metodo" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Score" fill="#007bff" name="Score (0-100)" />
                            <Bar dataKey="Tasa" fill="#ff6b6b" name="Tasa (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfica Radar de Factores */}
                {dataRadar.length > 0 && (
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                        <h4 style={{ textAlign: 'center', marginTop: 0 }}>Desglose de Factores (Tradicional)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={dataRadar}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="factor" />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                <Radar name="Puntuación" dataKey="puntuacion" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Tabla de Factores Detallados */}
            {factores && (
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                    <h4 style={{ marginTop: 0 }}>📈 Desglose Detallado de Factores (Método Tradicional)</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#007bff', color: 'white' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Factor</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Valor</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Puntuación</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Peso</th>
                                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Contribución</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(factores).map(([key, factor], idx) => (
                                <tr key={key} style={{ background: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                    <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{key}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>{factor.valor}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{factor.puntuacion}/100</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>{factor.peso}%</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center', color: '#007bff', fontWeight: 'bold' }}>
                                        {factor.contribucion}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ComparativaMetodos;
