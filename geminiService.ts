import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function fetchMenu() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find the menu items and prices for 'Chatka Matka' restaurant in Jaipur. Include popular street food, main courses, and drinks. Return the data as a JSON array of objects with keys: name, description, price, category, and image (a descriptive keyword for a placeholder). Surround the JSON with ```json and ``` markers.",
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    
    try {
      const menuData = JSON.parse(jsonStr.trim());
      return Array.isArray(menuData) ? menuData : [];
    } catch (e) {
      console.warn("Failed to parse JSON from Gemini response, using fallback logic", e);
      return [];
    }
  } catch (error) {
    console.error("Error fetching menu from Gemini:", error);
    // Fallback menu if Gemini fails or grounding is not available
    return [
      { name: "Pani Puri", description: "Crispy hollow puris filled with spicy tangy water.", price: 60, category: "Street Food", image: "pani-puri" },
      { name: "Pav Bhaji", description: "Spicy mashed vegetable curry served with buttered buns.", price: 120, category: "Street Food", image: "pav-bhaji" },
      { name: "Matka Kulfi", description: "Traditional Indian ice cream served in a clay pot.", price: 80, category: "Desserts", image: "kulfi" },
      { name: "Dal Baati Churma", description: "Authentic Rajasthani meal with lentils and wheat balls.", price: 250, category: "Main Course", image: "dal-baati" },
      { name: "Masala Chai", description: "Spiced Indian tea brewed with milk and herbs.", price: 40, category: "Drinks", image: "chai" }
    ];
  }
}
