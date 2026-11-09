import { WHATSAPP_NUMBER } from "../config";

// Sends selected products and quantities for a price/availability confirmation.
// Product prices are intentionally omitted because the values in the catalogue are placeholders.
export function whatsappUrl(lines) {
  const body = lines.map((line, index) => `${index + 1}. ${line.name}${line.size && line.size !== "One size" ? ` — Size ${line.size}` : ""} — Qty ${line.qty}`).join("\n");
  const message = `Hello AURAÈ, please confirm the current price, availability and delivery details for these AURAÈ pieces:\n\n${body}\n\nPlease let me know the final total before I confirm the order. Thank you.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
