import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit3, Save } from 'lucide-react';

const DecisionAnalista = ({ evaluacionIA, evaluacionTradicional, onDecisionFinal }) => {
    const [metodoSeleccionado, setMetodoSeleccionado] = useState('');
    const [decisionFinal, setDecisionFinal] = useState('');
    const [justificacion, setJustificacion] = useState('');
    const [ajustes, setAjustes] = useState({
        monto_ajustado: '',
        plazo_ajustado: '',
        tasa_ajustada: '',
        condiciones_especiales: ''
    });
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleMetodoChange = (metodo) => {
        setMetodoSeleccionado(metodo);
        setMostrarFormulario(true);

        // Pre-llenar la decisión según el método seleccionado
        if (metodo === 'ia') {
            setDecisionFinal(evaluacionIA.decision);
        } else if (metodo === 'tradicional') {
            setDecisionFinal(evaluacionTradicional.decision);
        } else {
            setDecisionFinal('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!metodoSeleccionado || !decisionFinal || !justificacion.trim()) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        const decisionData = {
            metodo: metodoSeleccionado,
            decision: decisionFinal,
            justificacion: justificacion.trim(),
            ajustes: metodoSeleccionado === 'ajustado' ? ajustes : null
        };

        onDecisionFinal(decisionData);

        // Resetear formulario
        setMostrarFormulario(false);
        setMetodoSeleccionado('');
        setDecisionFinal('');
        setJustificacion('');
        setAjustes({
            monto_ajustado: '',
            plazo_ajustado: '',
            tasa_ajustada: '',
            condiciones_especiales: ''
        });
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1.5rem', border: '3px solid #28a745', borderRadius: '12px', background: '#e9f7ef' }}>
            <h2 style={{ textAlign: 'center', color: '#28a745', marginBottom: '1.5rem' }}>
                👨‍💼 Decisión Final del Analista
            </h2>

            {/* Opciones de Método */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => handleMetodoChange('ia')}
                    style={{
                        padding: '1rem',
                        border: metodoSeleccionado === 'ia' ? '3px solid #007bff' : '2px solid #ddd',
                        borderRadius: '8px',
                        background: metodoSeleccionado === 'ia' ? '#e7f3ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🤖 Aceptar IA</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Usar decisión del sistema RAG
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: evaluacionIA.decision === 'Aprobado' ? '#28a745' : '#dc3545' }}>
                        {evaluacionIA.decision}
                    </div>
                </button>

                <button
                    onClick={() => handleMetodoChange('tradicional')}
                    style={{
                        padding: '1rem',
                        border: metodoSeleccionado === 'tradicional' ? '3px solid #007bff' : '2px solid #ddd',
                        borderRadius: '8px',
                        background: metodoSeleccionado === 'tradicional' ? '#e7f3ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📊 Mantener Tradicional</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Usar método scorecard
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: evaluacionTradicional.decision === 'Aprobado' ? '#28a745' : '#dc3545' }}>
                        {evaluacionTradicional.decision}
                    </div>
                </button>

                <button
                    onClick={() => handleMetodoChange('ajustado')}
                    style={{
                        padding: '1rem',
                        border: metodoSeleccionado === 'ajustado' ? '3px solid #007bff' : '2px solid #ddd',
                        borderRadius: '8px',
                        background: metodoSeleccionado === 'ajustado' ? '#e7f3ff' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>✏️ Ajustar Manualmente</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Personalizar condiciones
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                        Personalizado
                    </div>
                </button>
            </div>

            {/* Formulario de Decisión */}
            {mostrarFormulario && (
                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '2px solid #007bff' }}>
                    <h3 style={{ marginTop: 0, color: '#007bff' }}>
                        Completar Decisión - Método: {metodoSeleccionado === 'ia' ? 'IA' : metodoSeleccionado === 'tradicional' ? 'Tradicional' : 'Ajustado'}
                    </h3>

                    {/* Decisión Final */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Decisión Final *
                        </label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="decision"
                                    value="Aprobado"
                                    checked={decisionFinal === 'Aprobado'}
                                    onChange={(e) => setDecisionFinal(e.target.value)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <CheckCircle size={20} color="#28a745" style={{ marginRight: '0.3rem' }} />
                                Aprobado
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="decision"
                                    value="Rechazado"
                                    checked={decisionFinal === 'Rechazado'}
                                    onChange={(e) => setDecisionFinal(e.target.value)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                <XCircle size={20} color="#dc3545" style={{ marginRight: '0.3rem' }} />
                                Rechazado
                            </label>
                        </div>
                    </div>

                    {/* Ajustes (solo para método ajustado) */}
                    {metodoSeleccionado === 'ajustado' && (
                        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                            <h4 style={{ marginTop: 0 }}>⚙️ Ajustes Personalizados</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        Monto Ajustado (S/.)
                                    </label>
                                    <input
                                        type="number"
                                        value={ajustes.monto_ajustado}
                                        onChange={(e) => setAjustes({ ...ajustes, monto_ajustado: e.target.value })}
                                        placeholder="Ej: 4500"
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        Plazo Ajustado (meses)
                                    </label>
                                    <input
                                        type="number"
                                        value={ajustes.plazo_ajustado}
                                        onChange={(e) => setAjustes({ ...ajustes, plazo_ajustado: e.target.value })}
                                        placeholder="Ej: 18"
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        Tasa Ajustada (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={ajustes.tasa_ajustada}
                                        onChange={(e) => setAjustes({ ...ajustes, tasa_ajustada: e.target.value })}
                                        placeholder="Ej: 16.5"
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                        Condiciones Especiales
                                    </label>
                                    <input
                                        type="text"
                                        value={ajustes.condiciones_especiales}
                                        onChange={(e) => setAjustes({ ...ajustes, condiciones_especiales: e.target.value })}
                                        placeholder="Ej: Garantía adicional"
                                        style={{ width: '100%', padding: '0.5rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Justificación */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Justificación de la Decisión *
                        </label>
                        <textarea
                            value={justificacion}
                            onChange={(e) => setJustificacion(e.target.value)}
                            placeholder="Explica brevemente por qué tomaste esta decisión y qué factores consideraste..."
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontSize: '0.95rem',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem' }}>
                            Mínimo 20 caracteres. Sé específico sobre los factores que influyeron en tu decisión.
                        </div>
                    </div>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarFormulario(false);
                                setMetodoSeleccionado('');
                            }}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
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
                            Guardar Decisión Final
                        </button>
                    </div>
                </form>
            )}

            {!mostrarFormulario && (
                <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                    👆 Selecciona un método para registrar la decisión final
                </div>
            )}
        </div>
    );
};

export default DecisionAnalista;
