/**
 * AI Controller — Smart package suggestions + trip planning
 * Supports: Gemini (default) | OpenAI (fallback)
 * Routes:
 *   POST /api/ai/suggest-packages   — budget/time based suggestions
 *   POST /api/ai/plan-trip          — custom itinerary generation
 *   POST /api/ai/chat               — general travel assistant
 */

const { TourPackage } = require('../models');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const dbType = process.env.DB_TYPE || 'mongodb';

// ── AI provider helper ─────────────────────────────────────────
async function callAI(prompt) {
  const provider = process.env.AI_PROVIDER || 'gemini';

  if (provider === 'gemini') {
    const { getModel } = require('../config/gemini');
    const model = getModel();
    if (!model) throw new AppError('Gemini API key not configured', 503);
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // OpenAI fallback
  const openai = require('../config/openai');
  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1500
  });
  return res.choices[0].message.content;
}

// ── POST /api/ai/suggest-packages ─────────────────────────────
// Body: { budget, duration, travelers, preferences, from }
exports.suggestPackages = async (req, res, next) => {
  try {
    const { budget, duration, travelers = 1, preferences = [], from = '' } = req.body;

    if (!budget || !duration) {
      return next(new AppError('budget and duration are required', 400));
    }

    // Fetch all active packages from DB
    let packages;
    if (dbType === 'postgresql') {
      packages = await TourPackage.findAll({ where: { isActive: true }, limit: 50 });
    } else {
      packages = await TourPackage.find({ isActive: true }).limit(50);
    }

    // Summarize packages for the AI
    const pkgSummary = packages.map(p => ({
      id: p.id || p._id,
      name: p.name,
      destination: p.destination,
      duration: p.duration,
      price: p.discountedPrice || p.price,
      category: p.category,
      highlights: (p.highlights || []).slice(0, 3)
    }));

    const prompt = `
You are a smart travel package advisor for SK ToursiQ, an Indian travel company.

User requirements:
- Budget per person: ₹${budget}
- Trip duration: ${duration} days
- Number of travelers: ${travelers}
- Preferences: ${preferences.length ? preferences.join(', ') : 'no specific preferences'}
- Departing from: ${from || 'flexible'}

Available packages (JSON):
${JSON.stringify(pkgSummary, null, 2)}

Instructions:
1. Recommend the TOP 3 best-matching packages from the list above.
2. For each, explain WHY it matches the user's requirements in 2-3 sentences.
3. If no package perfectly fits, suggest the closest ones and mention what to adjust.
4. Also give 1 "budget tip" at the end.

Respond STRICTLY in this JSON format:
{
  "recommendations": [
    {
      "packageId": "<id>",
      "packageName": "<name>",
      "matchScore": <0-100>,
      "reason": "<why this is a good match>",
      "estimatedCostPerPerson": <number>,
      "estimatedTotalCost": <number>
    }
  ],
  "budgetTip": "<one useful money-saving tip>",
  "aiNote": "<any overall suggestion or adjustment>"
}`;

    const aiResponse = await callAI(prompt);

    // Parse JSON from AI response
    let parsed;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch {
      // Return raw if JSON parse fails
      return res.status(200).json({ success: true, data: { raw: aiResponse } });
    }

    // Attach full package details to recommendations
    if (parsed.recommendations) {
      parsed.recommendations = parsed.recommendations.map(rec => {
        const fullPkg = packages.find(p => String(p.id || p._id) === String(rec.packageId));
        return { ...rec, package: fullPkg || null };
      });
    }

    res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    if (error.status) return next(error);
    logger.error(`AI suggest-packages error: ${error.message}`);
    next(new AppError('AI service unavailable. Please try again.', 503));
  }
};

// ── POST /api/ai/plan-trip ────────────────────────────────────
// Body: { destination, duration, budget, travelers, interests, style }
exports.planTrip = async (req, res, next) => {
  try {
    const {
      destination, duration, budget, travelers = 1,
      interests = [], style = 'balanced'
    } = req.body;

    if (!destination || !duration) {
      return next(new AppError('destination and duration are required', 400));
    }

    const prompt = `
You are an expert Indian travel planner. Create a detailed day-by-day itinerary.

Trip details:
- Destination: ${destination}
- Duration: ${duration} days
- Budget: ₹${budget || 'flexible'} per person
- Travelers: ${travelers}
- Interests: ${interests.length ? interests.join(', ') : 'general sightseeing'}
- Travel style: ${style} (budget / comfort / luxury / adventure / balanced)

Create a practical itinerary with:
1. Day-by-day plan (morning, afternoon, evening activities)
2. Estimated daily cost breakdown
3. Top 3 places to eat (local cuisine focus)
4. 3 practical travel tips for this destination
5. Best time to visit note

Respond in JSON:
{
  "destination": "${destination}",
  "totalDays": ${duration},
  "estimatedBudget": { "min": <number>, "max": <number>, "currency": "INR" },
  "itinerary": [
    {
      "day": 1,
      "theme": "<day theme>",
      "morning": "<activity>",
      "afternoon": "<activity>",
      "evening": "<activity>",
      "estimatedCost": <number>,
      "accommodation": "<suggestion>"
    }
  ],
  "foodRecommendations": ["<place 1>", "<place 2>", "<place 3>"],
  "travelTips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "bestTimeToVisit": "<months>"
}`;

    const aiResponse = await callAI(prompt);

    let parsed;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
    } catch {
      return res.status(200).json({ success: true, data: { raw: aiResponse } });
    }

    res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    if (error.status) return next(error);
    logger.error(`AI plan-trip error: ${error.message}`);
    next(new AppError('AI service unavailable. Please try again.', 503));
  }
};

// ── POST /api/ai/chat ─────────────────────────────────────────
// Body: { message, history: [{ role, content }] }
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return next(new AppError('message is required', 400));

    const context = history.slice(-6).map(h => `${h.role}: ${h.content}`).join('\n');
    const prompt = `
You are a friendly travel assistant for SK ToursiQ, an Indian travel platform.
Help users with travel planning, package info, bookings, and destination advice.
Be concise, friendly, and helpful. Focus on India and international travel.

${context ? `Previous conversation:\n${context}\n` : ''}
User: ${message}

Respond helpfully in 2-4 sentences. If they ask for packages, suggest visiting /packages page.`;

    const reply = await callAI(prompt);

    res.status(200).json({
      success: true,
      data: {
        reply: reply.trim(),
        provider: process.env.AI_PROVIDER || 'gemini'
      }
    });
  } catch (error) {
    if (error.status) return next(error);
    logger.error(`AI chat error: ${error.message}`);
    next(new AppError('AI service unavailable. Please try again.', 503));
  }
};
