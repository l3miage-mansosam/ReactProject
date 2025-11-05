export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "4rem" }}>
      <h1>✅ My Shop API est en ligne</h1>
      <p>Bienvenue sur votre API Next.js déployée sur Vercel !</p>
      <p>Routes disponibles :</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><a href="/api" target="_blank">/api - Documentation complète</a></li>
        <li><a href="/api/products" target="_blank">/api/products - Liste des produits</a></li>
        <li><a href="/api/users/login" target="_blank">/api/users/login - Connexion (POST)</a></li>
        <li><a href="/api/users/register" target="_blank">/api/users/register - Inscription (POST)</a></li>
        <li><a href="/api/users/profile" target="_blank">/api/users/profile - Profil (GET avec token)</a></li>
      </ul>
    </main>
  );
}
