import './Welcome.css'

function Welcome({ onBack }: { onBack: () => void }) {
  return (
    <section id="welcome">
      <h1>¡Bienvenido a FlowSync!</h1>
      <p>Nos alegra tenerte por aquí.</p>
      <button type="button" className="counter" onClick={onBack}>
        Volver
      </button>
    </section>
  )
}

export default Welcome
