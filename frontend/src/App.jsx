import React, { useState, useRef } from 'react';
import ClienteForm from './components/ClienteForm';
import RiskCharts from './components/RiskCharts';
import ComparativaMetodos from './components/ComparativaMetodos';
import DecisionAnalista from './components/DecisionAnalista';
import ConfigPanel from './components/ConfigPanel';
import AuditPanel from './components/AuditPanel';
import { RAGEngine } from './utils/ragEngine';
import { TraditionalEngine } from './utils/traditionalEngine';
import { AuditSystem } from './utils/auditSystem';
import { Key, Upload, FileJson, BrainCircuit, AlertTriangle, CheckCircle } from 'lucide-react';

const rag = new RAGEngine();
const traditionalEngine = new TraditionalEngine();
const auditSystem = new AuditSystem();

function App() {
    // Intentar leer de variable de entorno VITE_GEMINI_API_KEY
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [apiKey, setApiKey] = useState(envKey || '');
    const [isKeySet, setIsKeySet] = useState(!!(envKey && envKey.length > 10));

    // Inicializar RAG si la key ya existe al cargar
    React.useEffect(() => {
        if (envKey && envKey.length > 10) {
            rag.init(envKey);
        }
    }, [envKey]);

    const [evaluacionIA, setEvaluacionIA] = useState(null);
    const [evaluacionTradicional, setEvaluacionTradicional] = useState(null);
    const [comparativa, setComparativa] = useState(null);
    const [currentLogId, setCurrentLogId] = useState(null);
    const [clientDataActual, setClientDataActual] = useState(null);

    const [loading, setLoading] = useState(false);
    const [indexing, setIndexing] = useState(false);
    const [indexingStatus, setIndexingStatus] = useState('');
    const [customFileLoaded, setCustomFileLoaded] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSetKey = (e) => {
        e.preventDefault();
        if (apiKey.trim().length > 10) {
            rag.init(apiKey);
            setIsKeySet(true);
            setError('');
        } else {
            setError('La API Key parece inválida');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isKeySet) {
            setError('Primero ingresa tu API Key para poder procesar la base de datos.');
            return;
        }

        setIndexing(true);
        setIndexingStatus('Leyendo archivo...');
        try {
            const count = await rag.ingestExcel(file);
            setIndexingStatus(`Generando embeddings para ${count} registros...`);
            await new Promise(r => setTimeout(r, 500));
            await rag.indexData((status) => setIndexingStatus(status));
            setCustomFileLoaded(true);
            setIndexingStatus(`¡Base de datos lista! (${count} clientes indexados)`);
        } catch (err) {
            console.error(err);
            setError('Error al procesar el archivo Excel: ' + err.message);
        } finally {
            setIndexing(false);
        }
    };

    const handleEvaluate = async (data) => {
        if (!isKeySet) {
            setError('Configura tu API Key primero.');
            return;
        }
        if (!customFileLoaded) {
            setError('Sube un archivo Excel con historial de clientes primero.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');
        setEvaluacionIA(null);
        setEvaluacionTradicional(null);
        setComparativa(null);
        setCurrentLogId(null);
        setClientDataActual(data);

        try {
            // Ejecutar ambas evaluaciones en paralelo
            const [resultIA, resultTradicional] = await Promise.all([
                rag.evaluate(data),
                Promise.resolve(traditionalEngine.evaluate(data))
            ]);

            setEvaluacionIA(resultIA);
            setEvaluacionTradicional(resultTradicional);

            // Calcular comparativa
            const comp = calcularComparativa(resultIA, resultTradicional);
            setComparativa(comp);

            // Registrar en auditoría
            const logId = auditSystem.logEvaluation({
                usuario: 'Analista',
                clienteData: data,
                evaluacionIA: resultIA,
                evaluacionTradicional: resultTradicional,
                comparativa: comp
            });

            setCurrentLogId(logId);

        } catch (err) {
            setError('Error en la evaluación: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const calcularComparativa = (ia, trad) => {
        // Diferencia de score
        const scoreIA = parseFloat(ia.scoreTotal) || 0;
        const scoreTrad = parseFloat(trad.scoreTotal) || 0;
        const diferencia_riesgo_num = scoreIA - scoreTrad;
        const diferencia_riesgo = `${diferencia_riesgo_num > 0 ? '+' : ''}${diferencia_riesgo_num.toFixed(1)} puntos`;

        // Diferencia de tasa
        const tasaIA = parseFloat(ia.tasa) || 15;
        const tasaTrad = parseFloat(trad.tasa) || 15;
        const diferencia_tasa_num = tasaIA - tasaTrad;
        const diferencia_tasa = `${diferencia_tasa_num > 0 ? '+' : ''}${diferencia_tasa_num.toFixed(1)}%`;

        // Diferencia de tiempo
        const tiempoIA = ia.tiempoEvaluacion || 0;
        const tiempoTrad = trad.tiempoEvaluacion || 0;
        const diferencia_tiempo_num = tiempoIA - tiempoTrad;
        const diferencia_tiempo = `${diferencia_tiempo_num > 0 ? '+' : ''}${diferencia_tiempo_num.toFixed(0)} ms`;

        return {
            diferencia_riesgo,
            diferencia_riesgo_num,
            diferencia_tasa,
            diferencia_tasa_num,
            diferencia_tiempo,
            diferencia_tiempo_num
        };
    };

    const handleDecisionFinal = (decisionData) => {
        if (!currentLogId) {
            setError('No hay evaluación activa para registrar la decisión.');
            return;
        }

        const success = auditSystem.updateAnalistaDecision(currentLogId, decisionData);

        if (success) {
            setSuccessMessage(`✓ Decisión registrada exitosamente: ${decisionData.decision} (Método: ${decisionData.metodo})`);

            // Limpiar después de 5 segundos
            setTimeout(() => {
                setSuccessMessage('');
                setEvaluacionIA(null);
                setEvaluacionTradicional(null);
                setComparativa(null);
                setCurrentLogId(null);
            }, 5000);
        } else {
            setError('Error al registrar la decisión.');
        }
    };

    const handleConfigUpdate = (newConfig) => {
        traditionalEngine.updateConfig(newConfig);
    };

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    CrediAI Pro <BrainCircuit color="#007bff" />
                </h1>
                <p>Sistema Híbrido de Evaluación de Riesgo Crediticio (IA + Tradicional)</p>
            </header>

            {/* Configuración API Key */}
            {!isKeySet ? (
                <div className="card" style={{ borderLeft: '5px solid #ffc107' }}>
                    <h3><Key size={18} style={{ marginRight: '8px' }} /> Configuración Inicial</h3>
                    <p>Ingresa tu Gemini API Key para activar el motor de inteligencia.</p>
                    <form onSubmit={handleSetKey} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="password"
                            placeholder="AIza..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{ flex: 1, padding: '8px' }}
                        />
                        <button type="submit" className="btn">Activar</button>
                    </form>
                </div>
            ) : (
                <div className="card" style={{ borderLeft: '5px solid #28a745', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><CheckCircle size={18} color="green" style={{ marginRight: '8px' }} /> Motor IA Activado</span>
                    <button onClick={() => { setIsKeySet(false); setApiKey(''); }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>Cambiar Key</button>
                </div>
            )}

            {/* Carga de Datos */}
            <div className="card">
                <h3><Upload size={18} style={{ marginRight: '8px' }} /> Base de Conocimiento (Excel)</h3>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                    Sube un archivo Excel (.xlsx) con el historial de clientes para que la IA aprenda de él.
                    <br />
                    <small>Columnas esperadas: Edad, Ingresos Mensuales, Deuda Total, Historial Crediticio, Empleo Estable, etc.</small>
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" disabled={!isKeySet || indexing} />
                    {customFileLoaded && <span style={{ color: 'green', fontWeight: 'bold' }}>¡Datos cargados!</span>}
                </div>

                {indexing && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                        ⏳ {indexingStatus}
                    </div>
                )}
            </div>

            {/* Panel de Configuración */}
            {isKeySet && <ConfigPanel traditionalEngine={traditionalEngine} onConfigUpdate={handleConfigUpdate} />}

            {/* Formulario de Cliente */}
            <ClienteForm onEvaluate={handleEvaluate} isLoading={loading} />

            {/* Mensajes */}
            {error && (
                <div style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '4px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                    <AlertTriangle size={18} style={{ marginRight: '8px' }} /> {error}
                </div>
            )}

            {successMessage && (
                <div style={{ color: '#155724', background: '#d4edda', padding: '10px', borderRadius: '4px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                    <CheckCircle size={18} style={{ marginRight: '8px' }} /> {successMessage}
                </div>
            )}

            {/* Resultados */}
            {evaluacionIA && evaluacionTradicional && (
                <>
                    {/* Resultados Individuales */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                        {/* Resultado IA */}
                        <div className={`result-box ${evaluacionIA.decision === 'Aprobado' ? 'approved' : 'rejected'}`} style={{ borderLeft: '5px solid #007bff' }}>
                            <h2>🤖 Evaluación IA (RAG)</h2>
                            <h3>Decisión: {evaluacionIA.decision}</h3>
                            <div style={{ background: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                                <p><strong>Score:</strong> {evaluacionIA.scoreTotal || 'N/A'}/100</p>
                                <p><strong>Tasa:</strong> {evaluacionIA.tasa || '15.0%'}</p>
                                <p><strong>Cuota Mensual:</strong> S/. {evaluacionIA.cuota_mensual}</p>
                                <p><strong>Ratio Endeudamiento:</strong> {evaluacionIA.ratio_endeudamiento}</p>
                                <p><strong>Tiempo:</strong> {evaluacionIA.tiempoEvaluacion} ms</p>
                            </div>
                            <h4 style={{ marginTop: '1rem' }}>Explicación:</h4>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{evaluacionIA.explicacion}</p>
                            {evaluacionIA.factores_clave && (
                                <>
                                    <h4>Factores Clave Considerados:</h4>
                                    <ul>
                                        {evaluacionIA.factores_clave.map((factor, idx) => (
                                            <li key={idx}>{factor}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Resultado Tradicional */}
                        <div className={`result-box ${evaluacionTradicional.decision === 'Aprobado' ? 'approved' : 'rejected'}`} style={{ borderLeft: '5px solid #6c757d' }}>
                            <h2>📊 Evaluación Tradicional (Scorecard)</h2>
                            <h3>Decisión: {evaluacionTradicional.decision}</h3>
                            <div style={{ background: 'rgba(255,255,255,0.9)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                                <p><strong>Score:</strong> {evaluacionTradicional.scoreTotal}/100</p>
                                <p><strong>Banda:</strong> {evaluacionTradicional.banda}</p>
                                <p><strong>Tasa:</strong> {evaluacionTradicional.tasa}</p>
                                <p><strong>Cuota Mensual:</strong> S/. {evaluacionTradicional.cuota_mensual}</p>
                                <p><strong>Ratio Endeudamiento:</strong> {evaluacionTradicional.ratio_endeudamiento}</p>
                                <p><strong>Tiempo:</strong> {evaluacionTradicional.tiempoEvaluacion} ms</p>
                            </div>
                            <h4 style={{ marginTop: '1rem' }}>Explicación:</h4>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{evaluacionTradicional.explicacion}</p>
                        </div>
                    </div>

                    {/* Comparativa */}
                    <ComparativaMetodos
                        evaluacionIA={evaluacionIA}
                        evaluacionTradicional={evaluacionTradicional}
                        comparativa={comparativa}
                    />

                    {/* Gráficos de Casos Similares */}
                    {evaluacionIA.similarCases && (
                        <RiskCharts clientData={clientDataActual} similarCases={evaluacionIA.similarCases} />
                    )}

                    {/* Decisión del Analista */}
                    <DecisionAnalista
                        evaluacionIA={evaluacionIA}
                        evaluacionTradicional={evaluacionTradicional}
                        onDecisionFinal={handleDecisionFinal}
                    />
                </>
            )}

            {/* Panel de Auditoría */}
            {isKeySet && <AuditPanel auditSystem={auditSystem} />}

            <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
                <p>CrediAI Pro - Sistema Híbrido de Evaluación de Riesgo Crediticio</p>
                <p>Combina la inteligencia artificial (RAG) con métodos tradicionales (Scorecard) para una evaluación completa</p>
            </footer>
        </div>
    );
}

export default App;
