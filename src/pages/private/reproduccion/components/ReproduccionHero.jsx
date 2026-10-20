// src/pages/private/reproduccion/components/ReproduccionHero.jsx

export default function ReproduccionHero({ onNuevoServicio }) {
  return (
    <div className="rp-hero">
      <div className="rp-hero__content">
        <div className="rp-hero__badge">
          <span className="rp-hero__badge-dot" />
          Módulo Reproductivo
        </div>
        <h1 className="rp-hero__h1">
          Reproducción<br />
          <span>y Genética</span>
        </h1>
        <p className="rp-hero__p">
          Registro y seguimiento de servicios reproductivos, gestaciones y partos
          del hato ganadero.
        </p>
        <div className="rp-hero__btns">
          <button className="rp-btn rp-btn--primary" onClick={onNuevoServicio}>
            ➕ Nuevo Servicio
          </button>
        </div>
      </div>
      <div className="rp-hero__img-wrap">
        <img
          className="rp-hero__img"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBZJZXbVPUkwBE3Gsi6apMlNG8LaqSHk_-8ftv9CFhLWsG57qdPywNe77mMnlumGfb2LTx7KBF4ii_ssHNicQBKYY6XUIC3G_ZpYyiRQYFaKlag-0F8Vgyk5zDVgWH0Rf4qG5w78AB26D66c160ENJK7r9v1Uj1L1wUYKl8W5STqMcpY_IO-vuynnbY7CXZ4H4dSQqJOC38lmi3UmY3jh-pXPN7JiKbtW_k38YX39CRVjWYym8Q-su9_mjwbPNnn1wL3cngR1UV4"
          alt="Reproducción ganadera"
        />
        <div className="rp-hero__img-overlay" />
      </div>
    </div>
  );
}