/** Página 404 (só em português). */
export function NotFoundPage() {
  return (
    <main>
      <span className="tag">Erro 404</span>
      <h1>4<span>0</span>4</h1>
      <h2>Esta página saiu de bagatela.</h2>
      <p>Nem por um preço simbólico a encontrámos. Talvez o endereço esteja errado, ou a página já mudou de sítio.</p>
      <a className="btn" id="home" href="/">Voltar ao início</a>
    </main>
  );
}
