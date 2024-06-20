export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_OPENAI_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );
    if (!resp.ok) throw new Error("No se pudo realizar la comparación");
    const reader = resp.body?.getReader();
    if (!reader) throw new Error("No se pudo leer la respuesta");
    return reader;
  } catch (error) {
    return {
      ok: false,
      content: "No se pudo realizar la comparación",
    };
  }
};
