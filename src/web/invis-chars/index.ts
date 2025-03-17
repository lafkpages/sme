import { decode } from "@msgpack/msgpack";

const statsKey = document.getElementById(
  "stats-key",
) as unknown as HTMLSelectElement;
const keyHeader = document.getElementById("key-header") as HTMLTableCellElement;
const statsTbody = document.getElementById(
  "stats-tbody",
) as HTMLTableSectionElement;

function renderStats() {
  const key = statsKey.value;
  const stats = charsStats.stats[key];

  keyHeader.textContent = statsKey.selectedOptions.item(0)?.textContent || key;

  if (!stats) {
    statsTbody.textContent = "No stats available for this key.";
  }

  statsTbody.textContent = "";
  for (const [charCode, count] of stats) {
    const tr = document.createElement("tr");
    const charTd = document.createElement("td");
    const previewTd = document.createElement("td");
    const countTd = document.createElement("td");

    charTd.textContent = `U+${charCode.toString(16).toUpperCase().padStart(4, "0")}`;
    previewTd.textContent = `ab${String.fromCharCode(charCode)}cd`;
    countTd.textContent = count.toLocaleString();

    tr.appendChild(charTd);
    tr.appendChild(previewTd);
    tr.appendChild(countTd);
    statsTbody.appendChild(tr);
  }
}

const charsStatsData = await fetch("/api/invis-chars/stats").then((r) => {
  if (r.status === 401) {
    const smeAuth = prompt("smeAuth");

    document.cookie = `smeAuth=${smeAuth}; path=/; max-age=604800`;
    location.reload();
  }

  return r.bytes();
});
const charsStats = decode(charsStatsData) as {
  testsCount: number;
  stats: Record<string, [number, number][]>;
};

console.debug("Loaded charsStats:", charsStats);

statsKey.disabled = false;
statsKey.addEventListener("input", renderStats);

renderStats();
