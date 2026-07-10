const { GoogleGenAI, Type, Schema } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const processRecordsWithAI = async (recordsBatch) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
  }

  const prompt = `
You are an expert CRM data extractor. I will provide you with a JSON array representing a batch of rows parsed from a CSV file.
Your task is to intelligently map and extract the fields from each row into the standard GrowEasy CRM format.

Rules:
1. Allowed CRM Status Values (use exactly one of these, or leave empty if unsure):
GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE
2. Allowed Data Source Values (use exactly one of these, or leave empty if unsure):
leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots
3. Date Format:
The \`created_at\` field MUST be a string that can be parsed by JavaScript's \`new Date(created_at)\`. Try to standardize to ISO 8601 or YYYY-MM-DD HH:mm:ss.
4. CRM Notes (\`crm_note\`):
Use this field for remarks, follow-up notes, additional comments, and ANY useful information that doesn't fit another field.
If multiple emails exist, use the first for \`email\` and append the rest to \`crm_note\`.
If multiple mobile numbers exist, use the first for \`mobile_without_country_code\` and append the rest to \`crm_note\`.
5. Skipping Invalid Records:
If a record contains NEITHER an email NOR a mobile number, mark it as skipped by setting \`is_valid: false\` in the output. Otherwise, set \`is_valid: true\`.

Map as many of these fields as possible:
created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note, data_source, possession_time, description.

Input Data:
${JSON.stringify(recordsBatch, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              is_valid: { type: Type.BOOLEAN },
              created_at: { type: Type.STRING },
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              country_code: { type: Type.STRING },
              mobile_without_country_code: { type: Type.STRING },
              company: { type: Type.STRING },
              city: { type: Type.STRING },
              state: { type: Type.STRING },
              country: { type: Type.STRING },
              lead_owner: { type: Type.STRING },
              crm_status: { type: Type.STRING },
              crm_note: { type: Type.STRING },
              data_source: { type: Type.STRING },
              possession_time: { type: Type.STRING },
              description: { type: Type.STRING },
              original_row: { type: Type.STRING, description: "Stringified JSON of the original row data for skipped records" }
            },
            required: ["is_valid"]
          }
        }
      }
    });

    const resultText = response.text();
    const parsedResult = JSON.parse(resultText);

    const successfullyParsed = [];
    const skipped = [];

    parsedResult.forEach((record, index) => {
      if (record.is_valid) {
        // Clean up the object to remove is_valid and original_row
        const cleanRecord = { ...record };
        delete cleanRecord.is_valid;
        delete cleanRecord.original_row;
        successfullyParsed.push(cleanRecord);
      } else {
        // Include the original data for skipped records
        skipped.push({
          reason: 'Missing both email and mobile number',
          original_data: recordsBatch[index]
        });
      }
    });

    return { successfullyParsed, skipped };

  } catch (error) {
    console.error('Error calling Gemini API:', error.message || error);
    console.warn('Falling back to basic rule-based parser due to API error (likely rate limit).');
    
    // MOCK FALLBACK TO PREVENT CRASH
    const successfullyParsed = [];
    const skipped = [];

    recordsBatch.forEach(record => {
      // Find possible email and mobile fields using simple regex/string matching
      const keys = Object.keys(record);
      let email = '';
      let mobile = '';
      let name = '';
      
      keys.forEach(k => {
        const lowerK = k.toLowerCase();
        if (lowerK.includes('email') && !email) email = record[k];
        if ((lowerK.includes('mobile') || lowerK.includes('phone')) && !mobile) mobile = record[k];
        if (lowerK.includes('name') && !name) name = record[k];
      });

      if (!email && !mobile) {
        skipped.push({
          reason: 'Missing both email and mobile number (Fallback parser)',
          original_data: record
        });
      } else {
        successfullyParsed.push({
          name: name || 'Unknown',
          email: email || '',
          mobile_without_country_code: mobile || '',
          crm_note: 'Parsed via Fallback (API Rate Limit)',
          created_at: new Date().toISOString()
        });
      }
    });

    return { successfullyParsed, skipped };
  }
};

module.exports = {
  processRecordsWithAI
};
