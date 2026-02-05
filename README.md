# CrediAI Pro - Sistema Híbrido de Evaluación de Riesgo Crediticio

Sistema avanzado que combina **Inteligencia Artificial (RAG)** con **Métodos Tradicionales (Scorecard)** para evaluación de riesgo crediticio.

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+
- API Key de Google Gemini ([Obtener aquí](https://makersuite.google.com/app/apikey))

### Instalación

```bash
cd frontend
npm install
```

### Configurar API Key

Crear archivo `.env.local` en `/frontend`:

```env
VITE_GEMINI_API_KEY=tu_clave_de_gemini_aqui
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir en navegador: http://localhost:5173

### Build para Producción

```bash
npm run build
```

## 📋 Características Principales

### ✅ Implementado en esta versión

- ✅ **Comparativa automática**: Diferencia de riesgo, tasa y tiempo de evaluación
- ✅ **Decisión final del analista**: Aceptar IA / Mantener tradicional / Ajustar con justificación
- ✅ **Panel de configuración**: Scorecard y bandas de tasas configurables
- ✅ **Auditoría y trazabilidad**: Logs completos por solicitud (usuario, fecha, reevaluaciones)
- ✅ **Reportes PRE-POST exportables**: Tiempo, reprocesos, consistencia riesgo-tasa (CSV + JSON)
- ✅ **Explicabilidad mejorada**: Factores que influyen y valores clave calculados

### Funcionalidades del Sistema

1. **Evaluación Dual**
   - Motor IA (RAG con Gemini)
   - Motor Tradicional (Scorecard configurable)
   - Ejecución en paralelo

2. **Comparativa Inteligente**
   - Diferencias de score, tasa y tiempo
   - Concordancia entre métodos
   - Visualizaciones interactivas

3. **Gestión de Decisiones**
   - 3 opciones: IA, Tradicional, Ajustado
   - Justificación obligatoria
   - Registro en auditoría

4. **Configuración Flexible**
   - Pesos de factores personalizables
   - Bandas de tasas ajustables
   - Umbral de aprobación configurable

5. **Auditoría Completa**
   - Registro de todas las evaluaciones
   - Filtros avanzados
   - Estadísticas en tiempo real
   - Exportación CSV y JSON

## 📊 Uso del Sistema

### 1. Configuración Inicial

1. Ingresar API Key de Gemini
2. Cargar archivo Excel con historial de clientes
3. (Opcional) Ajustar configuración del scorecard

### 2. Evaluar un Cliente

1. Completar formulario con datos del solicitante
2. Click en "Evaluar Riesgo"
3. Revisar resultados de ambos métodos
4. Analizar comparativa

### 3. Tomar Decisión

1. Seleccionar método preferido
2. Aprobar o rechazar
3. Ingresar justificación
4. Guardar decisión

### 4. Consultar Auditoría

1. Expandir "Auditoría y Reportes"
2. Filtrar por estado/método/fecha
3. Ver estadísticas generales
4. Exportar reportes

## 📁 Estructura del Proyecto

```
crediai---evaluación-de-riesgo/
├── frontend/
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── ClienteForm.jsx
│   │   │   ├── RiskCharts.jsx
│   │   │   ├── ComparativaMetodos.jsx
│   │   │   ├── DecisionAnalista.jsx
│   │   │   ├── ConfigPanel.jsx
│   │   │   └── AuditPanel.jsx
│   │   ├── utils/                # Lógica de negocio
│   │   │   ├── ragEngine.js      # Motor IA
│   │   │   ├── traditionalEngine.js  # Scorecard
│   │   │   └── auditSystem.js    # Auditoría
│   │   ├── App.jsx               # Componente principal
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── DOCUMENTACION_SISTEMA.md      # Documentación completa
└── README.md                      # Este archivo
```

## 🔧 Tecnologías

- **Frontend**: React 18 + Vite
- **IA**: Google Gemini AI (text-embedding-004, gemini-2.5-flash)
- **Gráficos**: Recharts
- **UI**: Lucide React (iconos)
- **Almacenamiento**: LocalStorage (auditoría)

## 📈 Métricas Clave

El sistema calcula y muestra:

- Tasa de aprobación general
- Concordancia IA vs Tradicional
- Tiempo promedio de evaluación
- Distribución de decisiones por método
- Estadísticas PRE-POST

## 🔒 Seguridad

- Procesamiento 100% client-side
- API Key solo en memoria del navegador
- Sin envío de datos a servidores externos
- Auditoría local (limpiable)

## 📖 Documentación Completa

Ver [DOCUMENTACION_SISTEMA.md](./DOCUMENTACION_SISTEMA.md) para:

- Guía detallada de uso
- Descripción de cada funcionalidad
- Casos de uso
- Configuración avanzada
- Troubleshooting

## 🤝 Contribuir

Este proyecto fue desarrollado para FYGRAD como sistema de evaluación de riesgo crediticio.

## 📝 Notas de Versión

### v2.0 (Febrero 2025)

**Nuevas funcionalidades:**
- Sistema de comparativa automática
- Panel de decisión del analista
- Configuración de scorecard
- Sistema completo de auditoría
- Reportes exportables (CSV + JSON)
- Explicabilidad mejorada
- Documentación completa

**Mejoras:**
- Evaluación dual en paralelo
- Interfaz responsive actualizada
- Mejor manejo de errores
- Registro de tiempos de evaluación

### v1.0 (Enero 2025)

**Funcionalidades base:**
- Evaluación con IA (RAG)
- Gráficos de casos similares
- Carga de base de conocimiento

## 🐛 Problemas Conocidos

- Build warning sobre chunk size (normal, no afecta funcionalidad)
- LocalStorage limitado a ~5-10MB (usar limpieza periódica)

## 📞 Soporte

Para problemas o preguntas, revisar la documentación completa en [DOCUMENTACION_SISTEMA.md](./DOCUMENTACION_SISTEMA.md)

---

**Desarrollado por FYGRAD** | Febrero 2025 | Versión 2.0
