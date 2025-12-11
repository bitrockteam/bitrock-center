import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmployeeSkillDetail from "@/components/skills/employee-skill-detail";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Competenze Dipendente | Bitrock Hours",
  description: "Gestione delle competenze del dipendente",
};

export default async function EmployeeSkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Use environment variable or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/skills/employee/${id}`);

    // Log response details for debugging
    console.log(`API Response Status: ${res.status}`);
    console.log(`API Response Headers:`, Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      // Log the response text to see what's being returned
      const responseText = await res.text();
      console.error(`API Error Response:`, responseText);
      notFound();
    }

    const json = await res.json();
    const employee = json.success ? json.data : null;

    if (!employee) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <EmployeeSkillDetail employee={employee} />
      </div>
    );
  } catch (error) {
    console.error("Error in EmployeeSkillDetailPage:", error);
    notFound();
  }
}
