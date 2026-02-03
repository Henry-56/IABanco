import React, { useState, useRef } from 'react';
import ClienteForm from './components/ClienteForm';
import RiskCharts from './components/RiskCharts';
import { RAGEngine } from './utils/ragEngine';
import { Key, Upload, FileJson, BrainCircuit, AlertTriangle, CheckCircle } from 'lucide-react';

const rag = new RAGEngine();

function App() {
    // Intentar leer de variable de entorno VITE_GEMINI_API_KEY
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [apiKey, setApiKey] = useState(envKey || '');
    const [isKeySet, setIsKeySet] = useState(!!(envKey && envKey.length > 10)); // Simple check

    // Inicializar RAG si la key ya existe al cargar
    React.useEffect(() => {
        if (envKey && envKey.length > 10) {
            rag.init(envKey);
        }
    }, [envKey]);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [indexing, setIndexing] = useState(false);
    const [indexingStatus, setIndexingStatus] = useState('');
    const [customFileLoaded, setCustomFileLoaded] = useState(false);
    const [error, setError] = useState('');

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
            // Pequeño delay para mostrar el estado
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
        setResult(null);
        try {
            const decision = await rag.evaluate(data);
            setResult({ ...decision, clientData: data });
        } catch (err) {
            setError('Error en la evaluación: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    CrediAI Serverless <BrainCircuit color="#007bff" />
                </h1>
                <p>Sistema RAG Client-Side (React + OpenAI)</p>
            </header>

            {/* Configuración API Key */}
            {!isKeySet ? (
                <div className="card" style={{ borderLeft: '5px solid #ffc107' }}>
                    <h3><Key size={18} style={{ marginRight: '8px' }} /> Configuración Inicial</h3>
                    <p>Ingresa tu OpenAI API Key para activar el motor de inteligencia.</p>
                    <form onSubmit={handleSetKey} style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="password"
                            placeholder="sk-..."
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
                    <small>Columnas esperadas aprox: Edad, Ingresos, Deuda, Historial, Empleo, Resultado.</small>
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

            <ClienteForm onEvaluate={handleEvaluate} isLoading={loading} />

            {error && (
                <div style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '4px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                    <AlertTriangle size={18} style={{ marginRight: '8px' }} /> {error}
                </div>
            )}

            {result && (
                <div className={`result-box ${result.decision === 'Aprobado' ? 'approved' : 'rejected'}`}>
                    <h2>Decisión: {result.decision}</h2>
                    <h3>Analisis Detallado:</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result.explicacion}</p>

                    {/* Gráficos de Riesgo */}
                    <RiskCharts clientData={result.clientData || {}} similarCases={result.similarCases} />
                </div>
            )}
        </div>
    );
}

export default App;
