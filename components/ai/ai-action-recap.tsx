import { JsonValue } from "@/generated/prisma/runtime/library";

export default function AiActionRecap({ data }: { data: JsonValue }) {
  if (!data) return null;
  return (
    <div className="mt-3 p-3 bg-muted rounded-lg">
      <h4 className="font-semibold mb-2">Dettagli:</h4>
      <div className="space-y-2 text-sm">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium capitalize">
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span className="text-muted-foreground">
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
