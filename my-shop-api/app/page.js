export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "4rem" }}>
      <h1> My Shop API est en ligne</h1>
      <p>Bienvenue sur votre API Next.js déployée sur Vercel !</p>
      <p>Routes disponibles :</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><a href="/api/products" target="_blank">/api/products</a></li>
        <li><a href="/api/users" target="_blank">/api/users</a></li>
        <li><a href="/api/cart" target="_blank">/api/cart</a></li>
      </ul>
    </main>
  );
}
