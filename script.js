const state = {
  language: "en",
  k: 20,
  alphaConfidence: 15,
  beta: 20,
  maxBeta: 60,
};

const controls = {
  k: document.getElementById("k-range"),
  alphaConfidence: document.getElementById("alpha-confidence-range"),
  beta: document.getElementById("beta-range"),
};

const values = {
  docsLink: document.getElementById("docs-link"),
  panelEyebrow: document.getElementById("panel-eyebrow"),
  panelTitle: document.getElementById("panel-title"),
  kLabel: document.getElementById("k-label"),
  alphaConfidenceLabel: document.getElementById("alpha-confidence-label"),
  betaLabel: document.getElementById("beta-label"),
  boundLabel: document.getElementById("bound-label"),
  ratioLabel: document.getElementById("ratio-label"),
  baseLabel: document.getElementById("base-label"),
  safetyReadingCard: document.getElementById("safety-reading-card"),
  safetyReadingLabel: document.getElementById("safety-reading-label"),
  safetyReadingValue: document.getElementById("safety-reading-value"),
  safetyReadingNote: document.getElementById("safety-reading-note"),
  chartEyebrow: document.getElementById("chart-eyebrow"),
  chartTitle: document.getElementById("chart-title"),
  k: document.getElementById("k-value"),
  alphaConfidence: document.getElementById("alpha-confidence-value"),
  alphaConfidenceMax: document.getElementById("alpha-confidence-max"),
  beta: document.getElementById("beta-value"),
  probability: document.getElementById("probability-value"),
  ratio: document.getElementById("ratio-value"),
  base: document.getElementById("base-value"),
  formulaSubstitution: document.getElementById("formula-substitution"),
  boundPill: document.getElementById("bound-pill"),
  scaleCaption: document.getElementById("scale-caption"),
  footnote: document.getElementById("footnote"),
};

const chart = {
  svg: document.getElementById("safety-chart"),
  grid: document.getElementById("chart-grid"),
  yLabels: document.getElementById("chart-y-labels"),
  xLabels: document.getElementById("chart-x-labels"),
  area: document.getElementById("chart-area"),
  line: document.getElementById("chart-line"),
  crosshairX: document.getElementById("chart-crosshair-x"),
  crosshairY: document.getElementById("chart-crosshair-y"),
  marker: document.getElementById("chart-marker"),
  markerLabel: document.getElementById("chart-marker-label"),
};

const languageButtons = [...document.querySelectorAll(".lang-switch__button")];

const copy = {
  en: {
    docsLink: "Official docs",
    panelEyebrow: "Avalanche Safety Bound Lab",
    panelTitle: "Live parameters. One line chart.",
    kLabel: 'k <span>(sample size)</span>',
    alphaConfidenceLabel: 'α<sub>c</sub> <span>(confidence threshold)</span>',
    betaLabel: 'β <span>(finality rounds)</span>',
    boundLabel: "Current bound",
    ratioLabel: "α<sub>c</sub> / k",
    baseLabel: "1 - α<sub>c</sub> / k",
    safetyReadingLabel: "Safety reading",
    safetyReadingLevels: {
      strong: "Stronger",
      moderate: "Watch",
      fragile: "Fragile",
    },
    safetyReadingNote: "Indicative, not absolute.",
    chartEyebrow: "Safety curve",
    chartTitle: "Upper bound across β",
    chartAria:
      "Line chart showing the Avalanche safety upper bound across beta values",
    footnote:
      "This playground shows how sample size, confidence threshold, and repeated successful rounds reshape Avalanche's official safety upper bound.",
    scaleCaption: (floorExponent) => `Log scale: 10^0 to 10^${floorExponent}`,
    formulaSubstitution: (alphaConfidence, k, beta, probability) =>
      `P &lt; (1 - ${alphaConfidence} / ${k})<sup>${beta}</sup> ≈ ${probability}`,
    boundPill: (beta, probability) => `β = ${beta} · ${probability}`,
  },
  tr: {
    docsLink: "Resmi doküman",
    panelEyebrow: "Avalanche Safety Bound Lab",
    panelTitle: "Canlı değerler. Tek çizgi grafik.",
    kLabel: 'k <span>(örneklem boyutu)</span>',
    alphaConfidenceLabel: 'α<sub>c</sub> <span>(güven eşiği)</span>',
    betaLabel: 'β <span>(kesinleşme turu)</span>',
    boundLabel: "Güncel üst sınır",
    ratioLabel: "α<sub>c</sub> / k",
    baseLabel: "1 - α<sub>c</sub> / k",
    safetyReadingLabel: "Güven okuması",
    safetyReadingLevels: {
      strong: "Daha güçlü",
      moderate: "İzlenmeli",
      fragile: "Kırılgan",
    },
    safetyReadingNote: "Yön göstericidir, mutlak garanti değildir.",
    chartEyebrow: "Güvenlik eğrisi",
    chartTitle: "β boyunca üst sınır",
    chartAria:
      "Beta değerleri boyunca Avalanche güvenlik üst sınırını gösteren çizgi grafik",
    footnote:
      "Bu playground, örneklem boyutu, güven eşiği ve art arda başarılı turlar değiştikçe Avalanche'ın resmi güvenlik üst sınırının nasıl yeniden şekillendiğini gösterir.",
    scaleCaption: (floorExponent) => `Log ölçek: 10^0 ile 10^${floorExponent} arası`,
    formulaSubstitution: (alphaConfidence, k, beta, probability) =>
      `P &lt; (1 - ${alphaConfidence} / ${k})<sup>${beta}</sup> ≈ ${probability}`,
    boundPill: (beta, probability) => `β = ${beta} · ${probability}`,
  },
};

const dimensions = {
  width: 760,
  height: 400,
  paddingTop: 24,
  paddingRight: 22,
  paddingBottom: 44,
  paddingLeft: 62,
  maxExponent: 0,
};

function clampState() {
  state.k = Math.max(5, Math.min(40, state.k));
  state.alphaConfidence = Math.max(1, Math.min(state.k, state.alphaConfidence));
  state.beta = Math.max(1, Math.min(state.maxBeta, state.beta));
}

function syncControls() {
  controls.k.value = String(state.k);
  controls.alphaConfidence.value = String(state.alphaConfidence);
  controls.alphaConfidence.max = String(state.k);
  controls.beta.value = String(state.beta);
}

function applyLanguage() {
  const text = copy[state.language];

  document.documentElement.lang = state.language;
  values.docsLink.textContent = text.docsLink;
  values.panelEyebrow.textContent = text.panelEyebrow;
  values.panelTitle.textContent = text.panelTitle;
  values.kLabel.innerHTML = text.kLabel;
  values.alphaConfidenceLabel.innerHTML = text.alphaConfidenceLabel;
  values.betaLabel.innerHTML = text.betaLabel;
  values.boundLabel.textContent = text.boundLabel;
  values.ratioLabel.innerHTML = text.ratioLabel;
  values.baseLabel.innerHTML = text.baseLabel;
  values.safetyReadingLabel.textContent = text.safetyReadingLabel;
  values.safetyReadingNote.textContent = text.safetyReadingNote;
  values.chartEyebrow.textContent = text.chartEyebrow;
  values.chartTitle.textContent = text.chartTitle;
  chart.svg.setAttribute("aria-label", text.chartAria);
  values.footnote.textContent = text.footnote;

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === state.language);
  });
}

function formatScientific(value) {
  if (value === 0) {
    return "0";
  }

  if (value >= 0.001) {
    return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  }

  const [mantissa, exponent] = value.toExponential(2).split("e");
  return `${mantissa} × 10^${Number(exponent)}`;
}

function toPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function getSafetyLevel(probability) {
  if (probability <= 1e-12) {
    return "strong";
  }

  if (probability <= 1e-6) {
    return "moderate";
  }

  return "fragile";
}

function computeProbability(beta = state.beta) {
  const base = Math.max(0, 1 - state.alphaConfidence / state.k);

  if (base === 0) {
    return 0;
  }

  return Math.pow(base, beta);
}

function getAxisFloorExponent() {
  const minimumPositive = computeProbability(state.maxBeta);

  if (minimumPositive <= 0) {
    return -3;
  }

  const rawFloor = Math.floor(Math.log10(minimumPositive) / 3) * 3;
  return Math.min(-3, rawFloor);
}

function toExponent(probability, floorExponent) {
  if (probability <= 0) {
    return floorExponent;
  }

  return Math.max(floorExponent, Math.min(0, Math.log10(probability)));
}

function scaleX(beta) {
  const usableWidth =
    dimensions.width - dimensions.paddingLeft - dimensions.paddingRight;
  const ratio = (beta - 1) / (state.maxBeta - 1);
  return dimensions.paddingLeft + usableWidth * ratio;
}

function scaleY(probability, floorExponent) {
  const usableHeight =
    dimensions.height - dimensions.paddingTop - dimensions.paddingBottom;
  const exponent = toExponent(probability, floorExponent);
  const ratio =
    (dimensions.maxExponent - exponent) /
    (dimensions.maxExponent - floorExponent);
  return dimensions.paddingTop + usableHeight * ratio;
}

function buildGrid(floorExponent) {
  chart.grid.innerHTML = "";
  chart.yLabels.innerHTML = "";
  chart.xLabels.innerHTML = "";

  const yTicks = [];
  const xTicks = [1, 15, 30, 45, 60];
  const chartBottom = dimensions.height - dimensions.paddingBottom;
  const chartRight = dimensions.width - dimensions.paddingRight;

  for (let tick = 0; tick >= floorExponent; tick -= 3) {
    yTicks.push(tick);
  }

  yTicks.forEach((tick) => {
    const ratio =
      (dimensions.maxExponent - tick) /
      (dimensions.maxExponent - floorExponent);
    const y =
      dimensions.paddingTop +
      (dimensions.height - dimensions.paddingTop - dimensions.paddingBottom) *
        ratio;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "chart-grid-line");
    line.setAttribute("x1", String(dimensions.paddingLeft));
    line.setAttribute("y1", String(y));
    line.setAttribute("x2", String(chartRight));
    line.setAttribute("y2", String(y));
    chart.grid.append(line);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("class", "chart-axis-label");
    label.setAttribute("x", String(dimensions.paddingLeft - 14));
    label.setAttribute("y", String(y + 4));
    label.setAttribute("text-anchor", "end");
    label.textContent = tick === 0 ? "1" : `10^${tick}`;
    chart.yLabels.append(label);
  });

  xTicks.forEach((tick) => {
    const x = scaleX(tick);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "chart-grid-line");
    line.setAttribute("x1", String(x));
    line.setAttribute("y1", String(dimensions.paddingTop));
    line.setAttribute("x2", String(x));
    line.setAttribute("y2", String(chartBottom));
    chart.grid.append(line);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    label.setAttribute("class", "chart-axis-label");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(chartBottom + 26));
    label.setAttribute("text-anchor", "middle");
    label.textContent = String(tick);
    chart.xLabels.append(label);
  });
}

function buildCurve() {
  const floorExponent = getAxisFloorExponent();
  const points = [];

  for (let beta = 1; beta <= state.maxBeta; beta += 1) {
    points.push({
      beta,
      x: scaleX(beta),
      y: scaleY(computeProbability(beta), floorExponent),
    });
  }

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
    )
    .join(" ");

  const chartBottom = dimensions.height - dimensions.paddingBottom;
  const areaPath = [
    `M ${points[0].x.toFixed(2)} ${chartBottom.toFixed(2)}`,
    ...points.map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    `L ${points[points.length - 1].x.toFixed(2)} ${chartBottom.toFixed(2)}`,
    "Z",
  ].join(" ");

  chart.line.setAttribute("d", linePath);
  chart.area.setAttribute("d", areaPath);

  const activeX = scaleX(state.beta);
  const activeProbability = computeProbability(state.beta);
  const activeY = scaleY(activeProbability, floorExponent);
  const chartRight = dimensions.width - dimensions.paddingRight;
  const chartBottomValue = dimensions.height - dimensions.paddingBottom;

  chart.crosshairX.setAttribute("x1", String(activeX));
  chart.crosshairX.setAttribute("y1", String(dimensions.paddingTop));
  chart.crosshairX.setAttribute("x2", String(activeX));
  chart.crosshairX.setAttribute("y2", String(chartBottomValue));

  chart.crosshairY.setAttribute("x1", String(dimensions.paddingLeft));
  chart.crosshairY.setAttribute("y1", String(activeY));
  chart.crosshairY.setAttribute("x2", String(chartRight));
  chart.crosshairY.setAttribute("y2", String(activeY));

  chart.marker.setAttribute("cx", String(activeX));
  chart.marker.setAttribute("cy", String(activeY));

  const labelX = Math.min(chartRight - 12, activeX + 14);
  const labelY = Math.max(dimensions.paddingTop + 16, activeY - 14);
  chart.markerLabel.setAttribute("x", String(labelX));
  chart.markerLabel.setAttribute("y", String(labelY));
  chart.markerLabel.textContent = `β ${state.beta}`;

  return floorExponent;
}

function updateReadouts() {
  const text = copy[state.language];
  const probability = computeProbability();
  const ratio = state.alphaConfidence / state.k;
  const base = Math.max(0, 1 - ratio);
  const probabilityText = formatScientific(probability);
  const safetyLevel = getSafetyLevel(probability);

  values.k.textContent = String(state.k);
  values.alphaConfidence.textContent = String(state.alphaConfidence);
  values.alphaConfidenceMax.textContent = String(state.k);
  values.beta.textContent = String(state.beta);
  values.probability.textContent = probabilityText;
  values.ratio.textContent = toPercent(ratio);
  values.base.textContent = base.toFixed(2);
  values.safetyReadingCard.dataset.level = safetyLevel;
  values.safetyReadingValue.textContent = text.safetyReadingLevels[safetyLevel];
  values.formulaSubstitution.innerHTML = text.formulaSubstitution(
    state.alphaConfidence,
    state.k,
    state.beta,
    probabilityText,
  );
  values.boundPill.textContent = text.boundPill(state.beta, probabilityText);
}

function render() {
  clampState();
  syncControls();
  applyLanguage();
  const floorExponent = getAxisFloorExponent();
  buildGrid(floorExponent);
  buildCurve();
  updateReadouts();
  values.scaleCaption.textContent = copy[state.language].scaleCaption(
    floorExponent,
  );
}

function handleInput(event) {
  const nextValue = Number(event.target.value);

  if (event.target.id === "k-range") {
    state.k = nextValue;
  }

  if (event.target.id === "alpha-confidence-range") {
    state.alphaConfidence = nextValue;
  }

  if (event.target.id === "beta-range") {
    state.beta = nextValue;
  }

  render();
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", handleInput);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.language = button.dataset.lang;
    render();
  });
});

render();
