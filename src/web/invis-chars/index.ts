import { decode } from "@msgpack/msgpack";
// TODO: only register the necessary components
import { Chart } from "chart.js/auto";

async function fetchCharsStats() {
  const charsStatsData = await fetch("/api/invis-chars/stats").then((r) => {
    if (r.status === 401) {
      const smeAuth = prompt("smeAuth");

      if (smeAuth) {
        document.cookie = `smeAuth=${encodeURIComponent(smeAuth)}; path=/; max-age=604800`;
        location.reload();
      }

      return null;
    }

    return r.bytes();
  });

  if (charsStatsData === null) {
    throw new Error("Unauthorized");
  }

  const charsStats = decode(charsStatsData) as {
    testsCount: number;
    stats: {
      charCode: number;
      browserNameCount: number;
      cpuArchitectureCount: number;
      deviceModelCount: number;
      deviceVendorCount: number;
      engineNameCount: number;
      osNameCount: number;
      totalCount: number;
      score: number;
    }[];
  };

  console.debug("Loaded charsStats:", charsStats);

  return charsStats;
}

function charCodeLabel(charCode: number) {
  return `U+${charCode.toString(16).toUpperCase().padStart(4, "0")}`;
}

const chartElm = document.getElementById("chart") as HTMLCanvasElement;
const statsTbody = document.getElementById(
  "stats-tbody",
) as HTMLTableSectionElement;

const labels: string[] = [];
const datasets: {
  label: string;
  data: { x: number; y: number }[];
}[] = [
  {
    label: "Browsers",
    data: [],
  },
  {
    label: "CPU Architectures",
    data: [],
  },
  {
    label: "Device Models",
    data: [],
  },
  {
    label: "Device Vendors",
    data: [],
  },
  {
    label: "Engines",
    data: [],
  },
  {
    label: "Operating Systems",
    data: [],
  },
  {
    label: "Score",
    data: [],
  },
];

const charsStats = await fetchCharsStats();

for (const char of charsStats.stats) {
  labels.push(charCodeLabel(char.charCode));
  datasets[0].data.push({ x: char.charCode, y: char.browserNameCount });
  datasets[1].data.push({ x: char.charCode, y: char.cpuArchitectureCount });
  datasets[2].data.push({ x: char.charCode, y: char.deviceModelCount });
  datasets[3].data.push({ x: char.charCode, y: char.deviceVendorCount });
  datasets[4].data.push({ x: char.charCode, y: char.engineNameCount });
  datasets[5].data.push({ x: char.charCode, y: char.osNameCount });
  datasets[6].data.push({ x: char.charCode, y: char.score });
}

const chart = new Chart(chartElm, {
  type: "line",
  data: {
    labels,
    datasets,
  },
  options: {
    animation: false,
  },
});

for (const char of charsStats.stats) {
  const tr = document.createElement("tr");
  const charTd = document.createElement("td");
  const previewTd = document.createElement("td");
  const browserNameCountTd = document.createElement("td");
  const cpuArchitectureCountTd = document.createElement("td");
  const deviceModelCountTd = document.createElement("td");
  const deviceVendorCountTd = document.createElement("td");
  const engineNameCountTd = document.createElement("td");
  const osNameCountTd = document.createElement("td");
  const scoreTd = document.createElement("td");

  charTd.textContent = charCodeLabel(char.charCode);
  previewTd.textContent = `ab${String.fromCharCode(char.charCode)}cd`;
  browserNameCountTd.textContent = char.browserNameCount.toString();
  cpuArchitectureCountTd.textContent = char.cpuArchitectureCount.toString();
  deviceModelCountTd.textContent = char.deviceModelCount.toString();
  deviceVendorCountTd.textContent = char.deviceVendorCount.toString();
  engineNameCountTd.textContent = char.engineNameCount.toString();
  osNameCountTd.textContent = char.osNameCount.toString();
  scoreTd.textContent = char.score.toString();

  tr.appendChild(charTd);
  tr.appendChild(previewTd);
  tr.appendChild(browserNameCountTd);
  tr.appendChild(cpuArchitectureCountTd);
  tr.appendChild(deviceModelCountTd);
  tr.appendChild(deviceVendorCountTd);
  tr.appendChild(engineNameCountTd);
  tr.appendChild(osNameCountTd);
  tr.appendChild(scoreTd);
  statsTbody.appendChild(tr);
}
