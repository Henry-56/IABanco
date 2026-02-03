import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskCharts = ({ clientData, similarCases }) => {
    // Si no hay casos similares, no graficamos
    if (!similarCases || similarCases.length === 0) return null;

    // Calculamos promedios de casos similares (extraemos números de "originalData" si existe, o parseamos texto)
    // Asumimos que ragEngine ahora devuelve "originalData" en similarCases

    // Preparar datos para gráfica
    // Comparativa: Cliente vs Promedio Similar

    // Extraer datos de los casos similares
    const avgIncome = similarCases.reduce((acc, curr) => acc + (curr.originalData ? curr.originalData['Ingresos Mensuales'] : 0), 0) / similarCases.length;
    const avgDebt = similarCases.reduce((acc, curr) => acc + (curr.originalData ? curr.originalData['Deuda Total'] : 0), 0) / similarCases.length;

    const chartData = [
        {
            name: 'Ingresos (S/.)',
            Cliente: clientData.ingresos_mensuales,
            Promedio: Math.round(avgIncome)
        },
        {
            name: 'Deuda (S/.)',
            Cliente: clientData.deuda_total,
            Promedio: Math.round(avgDebt)
        }
    ];

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
            <h3 style={{ textAlign: 'center', color: '#1a73e8' }}>Comparativa Financiera</h3>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>Tu perfil vs Casos Históricos Similares</p>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Cliente" fill="#8884d8" name="Tú" />
                        <Bar dataKey="Promedio" fill="#82ca9d" name="Promedio Casos Similares" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RiskCharts;
