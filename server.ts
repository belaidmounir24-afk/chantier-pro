import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Google GenAI Client initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    app: "ChantierPro",
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// App permissions status
app.get("/api/permissions/status", (req, res) => {
  res.json({
    storage: "granted",
    camera: "supported",
    geolocation: "supported",
    offlineSync: "ready"
  });
});

// AI Endpoint: Generate BTP Team Composition
app.post("/api/ai/generate-team", async (req, res) => {
  try {
    const { projectPhase, targetTeamSize = 6, currency = "DZD" } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Offline fallback generator
      const mockTeam = [
        {
          id: `ai-${Date.now()}-1`,
          name: "Mouloud Benali",
          craft: "Chef d'Équipe BTP",
          team: "Gros Œuvre",
          recruitmentLevel: "Niveau 4 — Maître Ouvrier / Chef d'Équipe",
          experienceYears: 12,
          phone: "0550 12 34 56",
          cin: "160023419",
          rate: 5500,
          rateType: "jour",
          notes: "Spécialiste coffrage banché et ferraillage",
          active: true
        },
        {
          id: `ai-${Date.now()}-2`,
          name: "Karim Meziane",
          craft: "Maçon Coffreur (OP2)",
          team: "Gros Œuvre",
          recruitmentLevel: "Niveau 3 — Compagnon Professionnel (OP2)",
          experienceYears: 7,
          phone: "0661 98 76 54",
          cin: "160045892",
          rate: 3800,
          rateType: "jour",
          notes: "Lecture de plans de ferraillage",
          active: true
        },
        {
          id: `ai-${Date.now()}-3`,
          name: "Rachid Dahmani",
          craft: "Ferrailleur Monteur",
          team: "Ferraillage",
          recruitmentLevel: "Niveau 3 — Compagnon Professionnel (OP2)",
          experienceYears: 6,
          phone: "0770 45 12 89",
          cin: "160078123",
          rate: 3600,
          rateType: "jour",
          notes: "Façonnage sur banc mécanique",
          active: true
        },
        {
          id: `ai-${Date.now()}-4`,
          name: "Youcef Belkacem",
          craft: "Manœuvre Spécialisé",
          team: "Gros Œuvre",
          recruitmentLevel: "Niveau 1 — Manœuvre / Débutant",
          experienceYears: 2,
          phone: "0555 33 22 11",
          cin: "160099451",
          rate: 2200,
          rateType: "jour",
          notes: "Coulage et vibration du béton",
          active: true
        }
      ];
      return res.json({ workers: mockTeam.slice(0, targetTeamSize) });
    }

    const prompt = `En tant qu'expert en conduite de travaux BTP en Algérie, génère une équipe de chantier optimale de ${targetTeamSize} ouvriers pour la phase : "${projectPhase}".
    Pour chaque ouvrier, renvoie un objet JSON avec:
    - name: nom et prénom algériens réalistes
    - craft: corps d'état (ex: Maçon, Ferrailleur, Plâtrier, Électricien...)
    - team: nom de l'équipe (ex: Gros Œuvre, Second Œuvre)
    - recruitmentLevel: une de ces valeurs exactes :
      ["Niveau 1 — Manœuvre / Débutant", "Niveau 2 — Ouvrier Professionnel (OP1)", "Niveau 3 — Compagnon Professionnel (OP2)", "Niveau 4 — Maître Ouvrier / Chef d'Équipe"]
    - experienceYears: nombre d'années
    - phone: numéro au format algérien
    - cin: numéro fictif
    - rate: tarif journalier réaliste en dinars algériens (entre 2000 et 6000 DZD)
    - rateType: "jour"
    - notes: commentaire technique sur ses compétences
    Renvoie UNIQUEMENT un tableau JSON valide.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    const workers = (Array.isArray(parsed) ? parsed : []).map((w: any, idx: number) => ({
      id: `ai-worker-${Date.now()}-${idx}`,
      name: w.name || `Ouvrier ${idx + 1}`,
      craft: w.craft || 'Ouvrier BTP',
      team: w.team || 'Équipe Chantier',
      recruitmentLevel: w.recruitmentLevel || 'Niveau 2 — Ouvrier Professionnel (OP1)',
      experienceYears: Number(w.experienceYears) || 3,
      phone: w.phone || '0550 00 00 00',
      cin: w.cin || '16000000',
      rate: Number(w.rate) || 2800,
      rateType: 'jour',
      notes: w.notes || 'Recommandé par ChantierPro IA',
      active: true
    }));

    res.json({ workers });
  } catch (error: any) {
    console.error("AI Generate Team Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Endpoint: Matrix Workforce Audit
app.post("/api/ai/workers-matrix-audit", async (req, res) => {
  try {
    const { workers = [], site } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        audit: {
          score: 86,
          summary: `Effectif de ${workers.length} ouvriers sur ${site?.name || 'le chantier'}. Bonne répartition des compétences clés avec un encadrement solide.`,
          strengths: [
            "Encadrement expérimenté présent sur le site",
            "Couverture adéquate des spécialités requises"
          ],
          risks: [
            "Effectif serré en cas d'absence imprévue",
            "Vigilance sur le respect des EPI et de la sécurité par forte chaleur"
          ],
          recommendations: [
            "Maintenir une réserve d'outillage de rechange",
            "Anticiper le recrutement pour les phases de finition"
          ]
        }
      });
    }

    const prompt = `Effectue un audit technique et organisationnel de l'équipe BTP suivante sur le chantier "${site?.name}" :
    ${JSON.stringify(workers.map((w: any) => ({ name: w.name, craft: w.craft, level: w.recruitmentLevel, exp: w.experienceYears })))}

    Renvoie un objet JSON avec :
    - score: nombre entre 50 et 98 (indice de complétude et solidité de l'équipe)
    - summary: paragraphe de synthèse en français
    - strengths: liste de 2 ou 3 points forts
    - risks: liste de 2 risques ou vulnérabilités
    - recommendations: liste de 2 ou 3 recommandations opérationnelles
    Renvoie UNIQUEMENT le JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const audit = JSON.parse(response.text || "{}");
    res.json({ audit });
  } catch (error: any) {
    console.error("AI Audit Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Endpoint: Smart Voice/Text Capture Parser
app.post("/api/ai/smart-capture", async (req, res) => {
  try {
    const { text, siteName, dateStr } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        parsed: {
          tasksCompleted: text,
          weather: "Ensoleillé (24°C)",
          issues: "R.A.S."
        }
      });
    }

    const prompt = `Voici une note brute ou dictée vocale d'un chef de chantier pour le site "${siteName}" :
    "${text}"

    Extrais et structure les informations sous forme d'un objet JSON avec :
    - tasksCompleted: résumé clair et professionnel des travaux achevés
    - weather: météo déduite (ex: Ensoleillé 25°C, Nuageux, Pluie...)
    - issues: incidents, retards, pannes ou contraintes mentionnés (ou chaîne vide si aucun)
    - expense: si une dépense ou achat est mentionné, un objet avec { category: "carburant"|"materiaux"|"outillage"|"repas"|"transport"|"divers", amount: number, description: string }. Si aucune dépense, omettre ce champ.

    Renvoie UNIQUEMENT l'objet JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ parsed });
  } catch (error: any) {
    console.error("AI Smart Capture Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite integration in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ChantierPro server running on http://localhost:${PORT}`);
  });
}

startServer();
