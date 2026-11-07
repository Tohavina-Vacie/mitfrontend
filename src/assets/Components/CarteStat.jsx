export default function CarteStat({ titre, valeur, sous, badge }) {
  return (
    <div className="dash-carte dash-stat">
      <div className="entete"><span className="titre">{titre}</span>{badge && <span className="dash-badge">{badge}</span>}</div>
      <div className="valeur">{valeur}</div>
      <div className="sous">{sous}</div>
    </div>
  );
}
