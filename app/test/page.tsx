"use client";

import { useState } from "react";

export default function TestPage() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<any>(null);

  const testAPI = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients,
      }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "600px",
      }}
    >
      <h1>Test Analyze API</h1>

      <textarea
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Example: Niacinamide,Glycerin,MagicCream123"
        rows={5}
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      />

      <button
        onClick={testAPI}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Analyze
      </button>

      {result && (
        <pre
          style={{
            padding: "12px",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}