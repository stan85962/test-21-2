// Données d'exemple (à remplacer plus tard)
const state = {
  recruiter: { name: "Sarah Martin", level: "Gold" },
  kpis: {
    conformityRate: 1.0,               // 100% exigé
    avgValidationDelayDays: 9,         // objectif <= 15
    activeSellers: 5,
    anomalies: 0
  },
  targets: { maxDelayDays: 15, minActiveSellers: 4 },
  sellers: [
    { name: "Julie Martin", active: true, validatedSales15d: 5, lastSale: "2025-10-14", conformity: 1.0 },
    { name: "Léo Durand", active: true, validatedSales15d: 11, lastSale: "2025-10-15", conformity: 1.0 },
    { name: "Nina Leroy", active: false, validatedSales15d: 2, lastSale: "2025-10-10", conformity: 1.0 }
  ]
};

function computeScore(kpis, targets){
  // 1) Conformité (70 pts) – binaire car exigé à 100 %
  const s1 = kpis.conformityRate >= 1 ? 70 : 0;
  // 2) Délai (20 pts) – 20 si <= target, décroît linéairement jusqu'à 0 à 2x target
  const d = kpis.avgValidationDelayDays, td = targets.maxDelayDays;
  let s2 = d <= td ? 20 : Math.max(0, 20 * (1 - (d-td)/td));
  // 3) Vendeurs actifs (10 pts) – proportionnel au minimum requis
  const a = kpis.activeSellers, ta = targets.minActiveSellers;
  let s3 = Math.min(10, Math.max(0, 10 * (a/ta)));
  return Math.round(s1 + s2 + s3);
}

function mountDashboard(){
  const score = computeScore(state.kpis, state.targets);
  const levelEl = document.getElementById("recruiter-level");
  const scoreEl = document.getElementById("score-value");
  const confEl  = document.getElementById("conformity");
  const delayEl = document.getElementById("delay");
  const tableBody = document.querySelector("#sellers-table tbody");
  const sanctions = document.getElementById("sanctions");

  if(levelEl) levelEl.textContent = state.recruiter.level;
  if(scoreEl) scoreEl.textContent = score;
  if(confEl) confEl.textContent = (state.kpis.conformityRate*100).toFixed(0) + " %";
  if(delayEl) delayEl.textContent = state.kpis.avgValidationDelayDays + " j";

  if(tableBody){
    tableBody.innerHTML = state.sellers.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.active ? "✅" : "—"}</td>
        <td>${s.validatedSales15d}</td>
        <td>${s.lastSale}</td>
        <td>${(s.conformity*100).toFixed(0)}%</td>
      </tr>`).join("");
  }

  if(sanctions){
    sanctions.innerHTML = "";
    if(state.kpis.anomalies === 0){
      sanctions.innerHTML = `<li class="ok">Aucune anomalie — badges actifs</li>`;
    } else if(state.kpis.anomalies === 1){
      sanctions.innerHTML = `<li class="warn">1 anomalie — badge en pause</li>`;
    } else if(state.kpis.anomalies === 2){
      sanctions.innerHTML = `<li class="bad">2 anomalies — commissions suspendues 7 jours</li>`;
    } else {
      sanctions.innerHTML = `<li class="bad">3+ anomalies — réévaluation par le boss</li>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", mountDashboard);
console.log("Test-21 prêt ✅");
