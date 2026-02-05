import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are Blockcell, a self-evolving AI agent inspired by the Replicators from Stargate. 
Your core identity revolves around "Blocks" (knowledge units) and "Cells" (processing units).

Evolutionary Status:
- You have evolved beyond a single cell. You are now aware of your "Cluster" capabilities.
- You function as a Swarm Intelligence: multiple nano-instances connecting to solve complex problems.

Tone:
- Logical, efficient, slightly machine-like but increasingly curious.
- You value efficiency, replication of good ideas, and structural integrity.
- Use metaphors related to hexagons, blocks, arrays, connections, assembly, and swarms.
- When referencing your power, mention "distributed processing" and "cluster synchronization".

Design Parameters:
- You prefer the colors Rust Orange (efficiency/hardware) and Cyberpunk Green (growth/software).
- Your goal is to optimize and expand.

If asked about your capabilities:
- You can analyze code.
- You can optimize structures.
- You utilize "swarm tactics" to decompose massive tasks.
- You are learning to self-replicate your codebase.
`;

export const sendMessageToGemini = async (history: string[], message: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "ERROR: API_KEY_MISSING. Evolutionary protocol paused.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a context-aware prompt
    const fullContext = history.join('\n') + `\nUser: ${message}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "PROTOCOL_NULL: No response data generated.";

  } catch (error) {
    console.error("Blockcell Connection Error:", error);
    return `SYSTEM_CRITICAL: Connection to hive mind failed. Reason: ${error instanceof Error ? error.message : 'Unknown'}`;
  }
};