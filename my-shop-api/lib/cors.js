export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-user-id",
  "Access-Control-Allow-Credentials": "false",
};

export const getCorsHeaders = (origin) => {
  // pour debug/évolution : on renvoie l'origine si fournie, sinon wildcard
  return {
    ...corsHeaders,
    "Access-Control-Allow-Origin": origin || corsHeaders["Access-Control-Allow-Origin"],
  };
};

export const handleCORS = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};
