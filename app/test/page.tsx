"use client";

export default function TestPage() {
  const testAPI = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: "Niacinamide,Glycerin,Fragrance",
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <button onClick={testAPI}>
      Test Analyze API
    </button>
  );
}