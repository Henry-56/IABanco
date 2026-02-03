import * as XLSX from 'xlsx';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Utilitario para cálculo de similitud coseno
const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
};

export class RAGEngine {
    constructor() {
        this.knowledgeBase = [];
        this.genAI = null;
        this.embeddingModel = null;
        this.model = null;
    }

    init(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Usamos el modelo más nuevo para embeddings (mejor cuota)
        this.embeddingModel = this.genAI.getGenerativeModel({ model: "text-embedding-004" });

        // CAMBIO: Usamos el modelo detectado en el diagnóstico
        this.modelName = "gemini-2.5-flash";
        this.model = this.genAI.getGenerativeModel({ model: this.modelName });
    }

    // ... (indexData y search se mantienen igual) ...

    async evaluate(clientData) {
        if (!this.genAI) throw new Error("API Key no configurada.");

        const clientDesc = `Edad: ${clientData.edad}, Ingresos: ${clientData.ingresos_mensuales}, Deuda: ${clientData.deuda_total}, Historial: ${clientData.historial_crediticio}, Empleo: ${clientData.empleo_estable}, Monto Solicitado: ${clientData.monto_solicitado}`;

        // RAG Search
        const similarCases = await this.search(clientDesc, 3);
        const contextStr = similarCases.map(c => `- Caso Similar: ${c.text}`).join('\n');

        const prompt = `
            Actúa como un experto analista de riesgo crediticio.
            Evalúa al siguiente cliente basándote en su perfil y en los casos históricos (RAG).

            CLIENTE ACTUAL:
            ${clientDesc}

            CONTEXTO HISTÓRICO:
            ${contextStr}

            IMPORTANTE: Responde ÚNICAMENTE con un JSON válido. No uses bloques de código markdown.
            La moneda es Nuevos Soles (S/.).
            Formato:
            {
                "decision": "Aprobado" o "Rechazado",
                "explicacion": "Texto breve justificando."
            }
            `;

        try {
            console.log(`Generando con modelo: ${this.modelName}`);
            const result = await this.model.generateContent(prompt);
            const responseText = result.response.text();

            // Limpieza agresiva de markdown para asegurar JSON válido
            let cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const firstBracket = cleanedText.indexOf('{');
            const lastBracket = cleanedText.lastIndexOf('}');
            if (firstBracket !== -1 && lastBracket !== -1) {
                cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
            }

            const decisionJson = JSON.parse(cleanedText);

            // Devolvemos contexto para gráficas
            return {
                ...decisionJson,
                similarCases: similarCases
            };

        } catch (error) {
            console.error("Gemini Error Final:", error);
            if (error.message.includes("401") || error.message.includes("403")) {
                throw new Error("Clave API rechazado. Verifica que tu API Key sea correcta.");
            }
            if (error.message.includes("404")) {
                throw new Error(`Error 404: El modelo ${this.modelName} no está disponible. Verifica tu API Key.`);
            }
            throw new Error("Error: " + error.message);
        }
    }
}
