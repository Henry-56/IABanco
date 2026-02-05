import React, { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';

const ConfigPanel = ({ traditionalEngine, onConfigUpdate }) => {
    const [config, setConfig] = useState(traditionalEngine.config);
    const [mostrarPanel, setMostrarPanel] = useState(false);

    const handlePesoChange = (factor, valor) => {
        setConfig({
            ...config,
            pesos: {
                ...config.pesos,
                [factor]: parseFloat(valor) || 0
            }
        });
    };

    const handleBandaTasaChange = (index, campo, valor) => {
        const nuevasBandas = [...config.bandasTasas];
        if (campo === 'tasa') {
            nuevasBandas[index][campo] = parseFloat(valor) / 100 || 0;
        } else {
            nuevasBandas[index][campo] = parseFloat(valor) || 0;
        }
        setConfig({
            ...config,
            bandasTasas: nuevasBandas
        });
    };

    const handleUmbralChange = (valor) => {
        setConfig({
            ...config,
            umbralAprobacion: parseFloat(valor) || 60
        });
    };

    const handleSave = () => {
        // Validar que los pesos sumen 100
        const sumaPesos = Object.values(config.pesos).reduce((a, b) => a + b, 0);
        if (Math.abs(sumaPesos - 100) > 0.1) {
            alert(`Los pesos deben sumar 100%. Actualmente suman ${sumaPesos.toFixed(1)}%`);
            return;
        }

        onConfigUpdate(config);
        setMostrarPanel(false);
        alert('Configuración guardada exitosamente');
    };

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de restaurar la configuración por defecto?')) {
            const defaultConfig = new TraditionalEngine().config;
            setConfig(defaultConfig);
            onConfigUpdate(defaultConfig);
        }
    };

    const sumaPesos = Object.values(config.pesos).reduce((a, b) => a + b, 0);

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '2px solid #6c757d', borderRadius: '12px', background: '#f8f9fa' }}>
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
                    <Settings size={24} />
                    Configuración del Método Tradicional
                </h3>
                <span style={{ fontSize: '1.5rem' }}>{mostrarPanel ? '▼' : '▶'}</span>
            </div>

            {mostrarPanel && (
                <div style={{ marginTop: '1rem' }}>
                    {/* Pesos de Factores */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0 }}>⚖️ Pesos de Factores (deben sumar 100%)</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Suma actual: {sumaPesos.toFixed(1)}%</strong>
                            <span style={{ color: Math.abs(sumaPesos - 100) < 0.1 ? '#28a745' : '#dc3545', marginLeft: '1rem' }}>
                                {Math.abs(sumaPesos - 100) < 0.1 ? '✓ Correcto' : '✗ Debe sumar 100%'}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {Object.entries(config.pesos).map(([factor, peso]) => (
                                <div key={factor}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', textTransform: 'capitalize' }}>
                                        {factor}
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input
                                            type="number"
                                            value={peso}
                                            onChange={(e) => handlePesoChange(factor, e.target.value)}
                                            min="0"
                                            max="100"
                                            step="1"
                                            style={{ flex: 1, padding: '0.5rem' }}
                                        />
                                        <span>%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Umbral de Aprobación */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0 }}>🎯 Umbral de Aprobación</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <label>Score mínimo para aprobar:</label>
                            <input
                                type="number"
                                value={config.umbralAprobacion}
                                onChange={(e) => handleUmbralChange(e.target.value)}
                                min="0"
                                max="100"
                                step="1"
                                style={{ padding: '0.5rem', width: '100px' }}
                            />
                            <span>/ 100</span>
                        </div>
                    </div>

                    {/* Bandas de Tasas */}
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ marginTop: 0 }}>📊 Bandas de Tasas de Interés</h4>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#6c757d', color: 'white' }}>
                                        <th style={{ padding: '0.5rem' }}>Clasificación</th>
                                        <th style={{ padding: '0.5rem' }}>Score Min</th>
                                        <th style={{ padding: '0.5rem' }}>Score Max</th>
                                        <th style={{ padding: '0.5rem' }}>Tasa (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {config.bandasTasas.map((banda, idx) => (
                                        <tr key={idx} style={{ background: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                            <td style={{ padding: '0.5rem' }}>{banda.nombre}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    value={banda.minScore}
                                                    onChange={(e) => handleBandaTasaChange(idx, 'minScore', e.target.value)}
                                                    style={{ width: '80px', padding: '0.3rem' }}
                                                />
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    value={banda.maxScore}
                                                    onChange={(e) => handleBandaTasaChange(idx, 'maxScore', e.target.value)}
                                                    style={{ width: '80px', padding: '0.3rem' }}
                                                />
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <input
                                                    type="number"
                                                    value={(banda.tasa * 100).toFixed(1)}
                                                    onChange={(e) => handleBandaTasaChange(idx, 'tasa', e.target.value)}
                                                    step="0.1"
                                                    style={{ width: '80px', padding: '0.3rem' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: '#ffc107',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <RotateCcw size={18} />
                            Restaurar Valores por Defecto
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold'
                            }}
                        >
                            <Save size={18} />
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Import necesario
import { TraditionalEngine } from '../utils/traditionalEngine';

export default ConfigPanel;
