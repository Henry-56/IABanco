import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const AuditPanel = ({ auditSystem }) => {
    const [mostrarPanel, setMostrarPanel] = useState(false);
    const [logs, setLogs] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [filtros, setFiltros] = useState({
        estado: '',
        metodoFinal: ''
    });

    useEffect(() => {
        if (mostrarPanel) {
            cargarDatos();
        }
    }, [mostrarPanel]);

    const cargarDatos = () => {
        setLogs(auditSystem.getFilteredLogs(filtros));
        setEstadisticas(auditSystem.getStatistics());
    };

    const handleExportCSV = () => {
        const csv = auditSystem.exportToCSV();
        if (!csv) {
            alert('No hay datos para exportar');
            return;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `crediai_auditoria_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleExportStats = () => {
        const json = auditSystem.exportStatsToJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `crediai_estadisticas_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleFiltroChange = (campo, valor) => {
        const nuevosFiltros = { ...filtros, [campo]: valor };
        setFiltros(nuevosFiltros);
        setLogs(auditSystem.getFilteredLogs(nuevosFiltros));
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '2px solid #17a2b8', borderRadius: '12px', background: '#d1ecf1' }}>
            <div
                onClick={() => setMostrarPanel(!mostrarPanel)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    padding: '0.5rem'
                }}
            >
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={24} />
                    Auditoría y Reportes
                </h3>
                <span style={{ fontSize: '1.5rem' }}>{mostrarPanel ? '▼' : '▶'}</span>
            </div>

            {mostrarPanel && (
                <div style={{ marginTop: '1rem' }}>
                    {/* Estadísticas Generales */}
                    {estadisticas && (
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TrendingUp size={20} />
                                Estadísticas Generales
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{estadisticas.total}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Evaluaciones</div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: '#d4edda', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{estadisticas.aprobados}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Aprobados</div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8d7da', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>{estadisticas.rechazados}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Rechazados</div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>{estadisticas.pendientes}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Pendientes</div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>{estadisticas.tasaAprobacion}%</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Tasa Aprobación</div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6610f2' }}>{estadisticas.concordanciaIATradicional}%</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Concordancia IA-Trad</div>
                                </div>
                            </div>

                            {/* Decisiones por Método */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <h5 style={{ marginBottom: '0.5rem' }}>Decisiones Finales por Método:</h5>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <span style={{ padding: '0.5rem 1rem', background: '#e7f3ff', borderRadius: '4px' }}>
                                        🤖 IA: {estadisticas.decisionesIA}
                                    </span>
                                    <span style={{ padding: '0.5rem 1rem', background: '#e7f3ff', borderRadius: '4px' }}>
                                        📊 Tradicional: {estadisticas.decisionesTradicional}
                                    </span>
                                    <span style={{ padding: '0.5rem 1rem', background: '#fff3cd', borderRadius: '4px' }}>
                                        ✏️ Ajustado: {estadisticas.decisionesAjustadas}
                                    </span>
                                </div>
                            </div>

                            {/* Tiempos Promedio */}
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
                                    <Clock size={24} style={{ margin: '0 auto' }} />
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{estadisticas.avgTiempoIA} ms</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Tiempo Promedio IA</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', flex: 1 }}>
                                    <Clock size={24} style={{ margin: '0 auto' }} />
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{estadisticas.avgTiempoTradicional} ms</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Tiempo Promedio Tradicional</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filtros */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={20} />
                            Filtros
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Estado:</label>
                                <select
                                    value={filtros.estado}
                                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <option value="">Todos</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="aprobado">Aprobado</option>
                                    <option value="rechazado">Rechazado</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Método Final:</label>
                                <select
                                    value={filtros.metodoFinal}
                                    onChange={(e) => handleFiltroChange('metodoFinal', e.target.value)}
                                    style={{ padding: '0.5rem' }}
                                >
                                    <option value="">Todos</option>
                                    <option value="ia">IA</option>
                                    <option value="tradicional">Tradicional</option>
                                    <option value="ajustado">Ajustado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Exportación */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={20} />
                            Exportar Datos
                        </h4>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleExportCSV}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Download size={18} />
                                Exportar Auditoría (CSV)
                            </button>

                            <button
                                onClick={handleExportStats}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    background: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <BarChart3 size={18} />
                                Exportar Estadísticas (JSON)
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Logs */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                        <h4 style={{ marginTop: 0 }}>Historial de Evaluaciones ({logs.length})</h4>
                        <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead style={{ position: 'sticky', top: 0, background: '#007bff', color: 'white' }}>
                                    <tr>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Fecha</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Usuario</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Monto</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Dec. IA</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Dec. Trad</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Método</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, idx) => (
                                        <tr key={log.id} style={{ background: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '0.5rem' }}>{log.fecha}</td>
                                            <td style={{ padding: '0.5rem' }}>{log.usuario}</td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                S/. {log.clienteData?.monto_solicitado || '-'}
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <span style={{
                                                    color: log.evaluacionIA?.decision === 'Aprobado' ? '#28a745' : '#dc3545',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {log.evaluacionIA?.decision || '-'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <span style={{
                                                    color: log.evaluacionTradicional?.decision === 'Aprobado' ? '#28a745' : '#dc3545',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {log.evaluacionTradicional?.decision || '-'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                {log.decisionAnalista?.metodo || '-'}
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px',
                                                    background: log.estado === 'aprobado' ? '#d4edda' :
                                                               log.estado === 'rechazado' ? '#f8d7da' : '#fff3cd',
                                                    color: log.estado === 'aprobado' ? '#155724' :
                                                          log.estado === 'rechazado' ? '#721c24' : '#856404'
                                                }}>
                                                    {log.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditPanel;
