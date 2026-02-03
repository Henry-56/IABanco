import React, { useState } from 'react';

const ClienteForm = ({ onEvaluate, isLoading }) => {
    const [formData, setFormData] = useState({
        edad: 30,
        ingresos_mensuales: 3000,
        deuda_total: 1000,
        historial_crediticio: 'Bueno',
        empleo_estable: 'Sí',
        monto_solicitado: 5000,
        plazo_meses: 12
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEvaluate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2>Datos del Solicitante</h2>

            <div className="form-group">
                <label>Edad</label>
                <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Ingresos Mensuales (S/.)</label>
                <input
                    type="number"
                    name="ingresos_mensuales"
                    value={formData.ingresos_mensuales}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Deuda Total (S/.)</label>
                <input
                    type="number"
                    name="deuda_total"
                    value={formData.deuda_total}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Historial Crediticio</label>
                <select
                    name="historial_crediticio"
                    value={formData.historial_crediticio}
                    onChange={handleChange}
                >
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                </select>
            </div>

            <div className="form-group">
                <label>Empleo Estable</label>
                <select
                    name="empleo_estable"
                    value={formData.empleo_estable}
                    onChange={handleChange}
                >
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div className="form-group">
                <label>Monto Solicitado (S/.)</label>
                <input
                    type="number"
                    name="monto_solicitado"
                    value={formData.monto_solicitado}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Plazo (meses)</label>
                <select
                    name="plazo_meses"
                    value={formData.plazo_meses}
                    onChange={handleChange}
                >
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                    <option value="18">18 meses</option>
                    <option value="24">24 meses</option>
                    <option value="36">36 meses</option>
                    <option value="48">48 meses</option>
                    <option value="60">60 meses</option>
                </select>
            </div>

            <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? 'Evaluando...' : 'Evaluar Riesgo'}
            </button>
        </form>
    );
};

export default ClienteForm;
