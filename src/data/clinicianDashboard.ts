export type MissionPhase = {
  id: string;
  label: string;
  time: string;
  status: string;
  progress: number;
  title: string;
  copy: string;
};

export type BiomarkerSignal = {
  label: string;
  value: string;
  trend: string;
};

export type BiomarkerSeriesPoint = {
  checkpointId: string;
  label: string;
  value: number;
};

export type BiomarkerSeries = {
  id: string;
  label: string;
  unit: string;
  color: string;
  summary: string;
  points: BiomarkerSeriesPoint[];
};

export type MissionCheckpoint = {
  id: string;
  label: string;
  time: string;
  progress: number;
  position: [number, number, number];
  note: string;
  context: string;
  opticalBiopsy: string;
  provenance: string[];
  signals: BiomarkerSignal[];
};

export type TreatmentOption = {
  id: string;
  label: string;
  summary: string;
  fit: string;
  riskBand: string;
  progressionRisk: string;
  reinterventionLikelihood: string;
  monitoringBurden: string;
};

export const biomarkerSeries: BiomarkerSeries[] = [
  {
    id: 'proteomic-instability',
    label: 'Proteomic instability',
    unit: 'index',
    color: '#ff8c55',
    summary: 'Composite instability rises as the robot moves into the peritumoral field.',
    points: [
      { checkpointId: 'checkpoint-implant', label: 'Implant', value: 0.18 },
      { checkpointId: 'checkpoint-lure', label: 'Gradient', value: 0.41 },
      { checkpointId: 'checkpoint-edema', label: 'Edema', value: 0.58 },
      { checkpointId: 'checkpoint-margin', label: 'Margin', value: 0.74 },
      { checkpointId: 'checkpoint-core-adjacent', label: 'Package', value: 0.87 },
    ],
  },
  {
    id: 'gfap-response',
    label: 'GFAP response',
    unit: 'index',
    color: '#5f8fff',
    summary: 'Glial injury-associated signal remains low at deployment and strengthens near the lesion.',
    points: [
      { checkpointId: 'checkpoint-implant', label: 'Implant', value: 0.14 },
      { checkpointId: 'checkpoint-lure', label: 'Gradient', value: 0.28 },
      { checkpointId: 'checkpoint-edema', label: 'Edema', value: 0.68 },
      { checkpointId: 'checkpoint-margin', label: 'Margin', value: 0.79 },
      { checkpointId: 'checkpoint-core-adjacent', label: 'Package', value: 0.83 },
    ],
  },
  {
    id: 'cxcl12-gradient',
    label: 'CXCL12 gradient',
    unit: '% drift',
    color: '#f2db38',
    summary: 'Chemotactic guidance signal peaks during route lock and then stabilizes close to the lesion.',
    points: [
      { checkpointId: 'checkpoint-implant', label: 'Implant', value: 8 },
      { checkpointId: 'checkpoint-lure', label: 'Gradient', value: 27 },
      { checkpointId: 'checkpoint-edema', label: 'Edema', value: 33 },
      { checkpointId: 'checkpoint-margin', label: 'Margin', value: 29 },
      { checkpointId: 'checkpoint-core-adjacent', label: 'Package', value: 24 },
    ],
  },
  {
    id: 'drug-diffusion-index',
    label: 'Drug diffusion index',
    unit: 'index',
    color: '#7cd7c5',
    summary: 'Local tissue receptivity becomes more favorable as the agent nears the intervention zone.',
    points: [
      { checkpointId: 'checkpoint-implant', label: 'Implant', value: 0.22 },
      { checkpointId: 'checkpoint-lure', label: 'Gradient', value: 0.31 },
      { checkpointId: 'checkpoint-edema', label: 'Edema', value: 0.47 },
      { checkpointId: 'checkpoint-margin', label: 'Margin', value: 0.58 },
      { checkpointId: 'checkpoint-core-adjacent', label: 'Package', value: 0.64 },
    ],
  },
];

export const caseSummary = {
  patientName: 'Claire Moreau',
  patientAge: 52,
  caseTitle: 'Left temporal lesion review',
  missionDuration: '76 hours implanted',
  status: 'Diagnostic package ready',
  distanceToCore: '2.6 mm from lesion core',
  tags: ['Glioma suspicion', 'Implanted microrobot', 'Digital twin active'],
};

export const missionPhases: MissionPhase[] = [
  {
    id: 'implantation',
    label: 'Implantation',
    time: 'Day 1 · 08:18',
    status: 'Implanted',
    progress: 0.12,
    title: 'Robot implantation confirmed',
    copy: 'The microrobot is implanted and begins its localized multiday route from the entry corridor.',
  },
  {
    id: 'gradient-lock',
    label: 'Gradient lock',
    time: 'Day 1 · 16:12',
    status: 'Chemotactic lock',
    progress: 0.34,
    title: 'Localized chemotactic route established',
    copy: 'The agent locks onto the peritumoral gradient and starts a controlled inward trajectory.',
  },
  {
    id: 'transit',
    label: 'Transit',
    time: 'Day 2 · 11:05',
    status: 'Chemotactic transit',
    progress: 0.56,
    title: 'Chemotactic transit stabilized',
    copy: 'Agent advanced through inflammatory gradients while recording local biomarkers.',
  },
  {
    id: 'approach',
    label: 'Peritumoral approach',
    time: 'Day 3 · 19:42',
    status: 'Margin sensing',
    progress: 0.79,
    title: 'Peritumoral sensing complete',
    copy: 'Optical biopsy and local biomarker package captured around the lesion margin.',
  },
  {
    id: 'diagnosis-ready',
    label: 'Diagnosis ready',
    time: 'Day 4 · 09:14',
    status: 'Package ready',
    progress: 0.96,
    title: 'Diagnostic package ready for review',
    copy: 'The agent completed its route and generated a treatment-ready evidence package.',
  },
];

export const missionPathPoints: [number, number, number][] = [
  [-0.18, 0.08, -0.02],
  [-0.07, 0.09, -0.05],
  [0.08, 0.1, -0.08],
  [0.22, 0.105, -0.105],
  [0.36, 0.115, -0.13],
  [0.49, 0.128, -0.154],
  [0.6, 0.145, -0.175],
  [0.69, 0.162, -0.195],
  [0.75, 0.172, -0.212],
];

export const missionCheckpoints: MissionCheckpoint[] = [
  {
    id: 'checkpoint-implant',
    label: 'Implantation stable',
    time: 'Day 1 · 08:31',
    progress: 0.14,
    position: [-0.12, 0.088, -0.035],
    note: 'Implantation completed and the initial local baseline was recorded around the entry corridor.',
    context: 'The robot is deployed outside the lesion field with stable hemodynamics and no acute drift.',
    opticalBiopsy: 'No malignant optical signature at the implantation corridor.',
    provenance: ['route telemetry', 'local biomarkers'],
    signals: [
      { label: 'IL-6 baseline', value: '0.18', trend: 'Baseline' },
      { label: 'Perfusion stability', value: '96%', trend: 'Stable' },
      { label: 'Immune activation', value: 'Low', trend: 'Nominal' },
    ],
  },
  {
    id: 'checkpoint-lure',
    label: 'Cytokine-guided turn',
    time: 'Day 1 · 16:12',
    progress: 0.34,
    position: [0.1, 0.1, -0.082],
    note: 'Gradient sensing intensified and route curvature tightened toward the lesion field.',
    context: 'Signal pattern consistent with chemotactic attraction toward active tumor margin.',
    opticalBiopsy: 'Diffuse scattering increased without direct malignant confirmation.',
    provenance: ['path telemetry', 'inflammatory markers'],
    signals: [
      { label: 'CXCL12 gradient', value: '+27%', trend: 'Rising' },
      { label: 'Proteomic drift', value: '0.41', trend: 'Elevated' },
      { label: 'Motor efficiency', value: '91%', trend: 'Nominal' },
    ],
  },
  {
    id: 'checkpoint-edema',
    label: 'Edema boundary',
    time: 'Day 2 · 18:47',
    progress: 0.56,
    position: [0.34, 0.114, -0.126],
    note: 'Agent crossed from diffuse edema into denser peritumoral signaling field.',
    context: 'Microenvironment shows sustained inflammatory noise with intact local perfusion.',
    opticalBiopsy: 'Partial cellular disorganization visible at the edema margin.',
    provenance: ['optical biopsy', 'local biomarkers'],
    signals: [
      { label: 'GFAP response', value: '0.68', trend: 'Rising' },
      { label: 'Metabolic load', value: '62%', trend: 'Moderate' },
      { label: 'Edema signature', value: 'Present', trend: 'Confirmed' },
    ],
  },
  {
    id: 'checkpoint-margin',
    label: 'Peritumoral ring',
    time: 'Day 3 · 19:42',
    progress: 0.81,
    position: [0.58, 0.14, -0.17],
    note: 'The agent sampled the outer lesion ring and recorded a localized malignant profile.',
    context: 'Peritumoral band shows denser, more coherent signaling than earlier checkpoints.',
    opticalBiopsy: 'Hypercellular margin with infiltrative optical pattern detected.',
    provenance: ['optical biopsy', 'peritumoral profile'],
    signals: [
      { label: 'Tumor-associated markers', value: '+44%', trend: 'High' },
      { label: 'Cellular instability', value: '0.74', trend: 'High' },
      { label: 'Response index', value: '0.83', trend: 'Actionable' },
    ],
  },
  {
    id: 'checkpoint-core-adjacent',
    label: 'Diagnosis package complete',
    time: 'Day 4 · 09:14',
    progress: 0.94,
    position: [0.74, 0.171, -0.21],
    note: 'Combined optical biopsy and biomarker package supports a high-grade infiltrative lesion.',
    context: 'Agent halted 2.6 mm from the lesion core with stable local conditions.',
    opticalBiopsy: 'Optical biopsy aligns with infiltrative high-grade glioma morphology.',
    provenance: ['optical biopsy', 'local biomarkers', 'peritumoral profile'],
    signals: [
      { label: 'Proteomic instability', value: '0.87', trend: 'High' },
      { label: 'Thermal susceptibility', value: 'Favorable', trend: 'Therapy-ready' },
      { label: 'Drug diffusion index', value: '0.64', trend: 'Targetable' },
    ],
  },
];

export const missionEventLog = [
  { time: 'Day 0 · 07:53', label: 'MRI scan registered', phaseIndex: 0 },
  { time: 'Day 1 · 08:18', label: 'Robot implantation completed', phaseIndex: 0 },
  { time: 'Day 2 · 11:05', label: 'Monitoring route stabilized', phaseIndex: 2 },
  { time: 'Day 4 · 09:14', label: 'Diagnostic package ready', phaseIndex: 4 },
  { time: 'Day 4 · 09:42', label: 'Treatment proposal generated', phaseIndex: 4 },
];

export const dashboardDiagnosis = {
  label: 'Infiltrative high-grade glioma',
  confidence: '87%',
  rationale: [
    'Optical biopsy at the lesion margin shows an infiltrative hypercellular pattern.',
    'Proteomic and inflammatory markers intensify consistently as the agent approaches the peritumoral ring.',
    'Local thermal and diffusion signatures support intervention with focal therapy or drug delivery.',
  ],
  provenance: ['optical biopsy', 'local biomarkers', 'peritumoral profile'],
};

export const challengePrompts = [
  'Biomarker pattern inconsistent?',
  'Optical biopsy quality insufficient?',
  'Tumor margin interpretation uncertain?',
  'Needs more evidence before intervention?',
];

export const treatmentOptions: TreatmentOption[] = [
  {
    id: 'hifu',
    label: 'HiFU',
    summary: 'Focused ultrasound for rapid local ablation with moderate edema risk.',
    fit: 'Best when fast non-contact thermal treatment is prioritized.',
    riskBand: 'Moderate',
    progressionRisk: '34%',
    reinterventionLikelihood: '21%',
    monitoringBurden: 'Medium',
  },
  {
    id: 'litt',
    label: 'LITT',
    summary: 'Thermal ablation aligned with the current margin geometry and thermal signature.',
    fit: 'Best fit for this lesion profile based on local susceptibility and margin access.',
    riskBand: 'Moderate-low',
    progressionRisk: '22%',
    reinterventionLikelihood: '16%',
    monitoringBurden: 'Medium',
  },
  {
    id: 'local-drug-delivery',
    label: 'Local Drug Delivery',
    summary: 'Localized pharmacologic release with lower acute risk and higher follow-up intensity.',
    fit: 'Best when tissue preservation outweighs the need for immediate cytoreduction.',
    riskBand: 'Low acute / higher longitudinal',
    progressionRisk: '29%',
    reinterventionLikelihood: '27%',
    monitoringBurden: 'High',
  },
];

export const tumorModel = {
  position: [0.82, 0.18, -0.22] as [number, number, number],
  coreRadius: 0.15,
  shellRadii: [0.24, 0.34, 0.45],
};

export const initialPhaseId = 'diagnosis-ready';
export const initialTreatmentId = 'litt';
export const initialBiomarkerSeriesId = 'proteomic-instability';
