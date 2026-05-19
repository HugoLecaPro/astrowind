import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  caseSummary,
  dashboardDiagnosis,
  initialPhaseId,
  initialTreatmentId,
  missionCheckpoints,
  missionPathPoints,
  missionPhases,
  treatmentOptions,
  tumorModel,
  type BiomarkerSignal,
} from '~/data/clinicianDashboard';

const canvas = document.querySelector<HTMLCanvasElement>('[data-brain-viewer]');

if (canvas) {
  const phaseHeading = document.querySelector<HTMLElement>('[data-phase-heading]');
  const phasePill = document.querySelector<HTMLElement>('[data-phase-pill]');
  const phaseCopy = document.querySelector<HTMLElement>('[data-phase-copy]');
  const phaseButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-phase-button]'));
  const phaseRows = Array.from(document.querySelectorAll<HTMLElement>('[data-phase-row]'));
  const scrubber = document.querySelector<HTMLInputElement>('[data-mission-scrubber]');
  const missionAlertTitle = document.querySelector<HTMLElement>('[data-mission-alert-title]');
  const missionAlertCopy = document.querySelector<HTMLElement>('[data-mission-alert-copy]');
  const missionAlertBadge = document.querySelector<HTMLElement>('[data-mission-alert-badge]');
  const missionSummaryBadge = document.querySelector<HTMLElement>('[data-mission-summary-badge]');
  const eventRows = Array.from(document.querySelectorAll<HTMLElement>('[data-event-log-index]'));
  const evidenceLabel = document.querySelector<HTMLElement>('[data-evidence-label]');
  const evidenceTime = document.querySelector<HTMLElement>('[data-evidence-time]');
  const evidenceNote = document.querySelector<HTMLElement>('[data-evidence-note]');
  const evidenceContext = document.querySelector<HTMLElement>('[data-evidence-context]');
  const evidenceOptical = document.querySelector<HTMLElement>('[data-evidence-optical]');
  const evidenceSignals = document.querySelector<HTMLElement>('[data-evidence-signals]');
  const evidenceProvenance = document.querySelector<HTMLElement>('[data-evidence-provenance]');
  const diagnosisState = document.querySelector<HTMLElement>('[data-diagnosis-state]');
  const diagnosisConfidence = document.querySelector<HTMLElement>('[data-diagnosis-confidence]');
  const reviewState = document.querySelector<HTMLElement>('[data-review-state]');
  const reviewPrompts = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-review-prompt]'));
  const treatmentSummary = document.querySelector<HTMLElement>('[data-treatment-summary]');
  const treatmentLabel = document.querySelector<HTMLElement>('[data-treatment-label]');
  const treatmentFit = document.querySelector<HTMLElement>('[data-treatment-fit]');
  const treatmentRisk = document.querySelector<HTMLElement>('[data-treatment-risk]');
  const treatmentCopy = document.querySelector<HTMLElement>('[data-treatment-copy]');
  const treatmentProgression = document.querySelector<HTMLElement>('[data-treatment-progression]');
  const treatmentReintervention = document.querySelector<HTMLElement>('[data-treatment-reintervention]');
  const treatmentMonitoring = document.querySelector<HTMLElement>('[data-treatment-monitoring]');
  const treatmentButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-treatment-button]'));
  const viewportReadout = document.querySelector<HTMLElement>('[data-brain-readout="viewport"]');
  const trianglesReadout = document.querySelector<HTMLElement>('[data-brain-readout="triangles"]');
  const phaseReadout = document.querySelector<HTMLElement>('[data-brain-readout="phase"]');
  const agentReadout = document.querySelector<HTMLElement>('[data-brain-readout="agent"]');
  const autorotateToggle = document.querySelector<HTMLInputElement>('[data-brain-toggle="autorotate"]');
  const wireframeToggle = document.querySelector<HTMLInputElement>('[data-brain-toggle="wireframe"]');
  const opacityRange = document.querySelector<HTMLInputElement>('[data-brain-range="opacity"]');
  const resetButton = document.querySelector<HTMLButtonElement>('[data-brain-action="reset"]');
  const focusLesionButton = document.querySelector<HTMLButtonElement>('[data-brain-action="focus-lesion"]');
  const accordionTriggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'));
  const accordionPanels = Array.from(document.querySelectorAll<HTMLElement>('[data-accordion-panel]'));
  const missionDurationReadout = document.querySelector<HTMLElement>('[data-mission-duration]');
  const pathCompletionReadout = document.querySelector<HTMLElement>('[data-path-completion]');
  const agentLocationReadout = document.querySelector<HTMLElement>('[data-agent-location]');

  const initialPhaseIndex = missionPhases.findIndex((phase) => phase.id === initialPhaseId);

  const setText = (node: HTMLElement | null, value: string) => {
    if (node) node.textContent = value;
  };

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xdce8ff, 10, 28);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(-1.2, 0.42, 6.2);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.minDistance = 3.8;
  controls.maxDistance = 9;
  controls.target.set(0, 0.16, 0);

  scene.add(new THREE.AmbientLight(0xd6e7ff, 2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffee7d, 1.25);
  rimLight.position.set(-6, 2, -4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0x8ab7ff, 20, 22, 2);
  fillLight.position.set(0.2, 0.2, 3.8);
  scene.add(fillLight);

  const lesionLight = new THREE.PointLight(0xffb45e, 6, 5, 2);
  lesionLight.position.set(...tumorModel.position);
  scene.add(lesionLight);

  const brainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd7e6ff,
    metalness: 0.04,
    roughness: 0.3,
    transmission: 0.1,
    transparent: true,
    opacity: 0.72,
    thickness: 0.9,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(0x6d8dff),
    emissiveIntensity: 0.34,
  });

  const brainGroup = new THREE.Group();
  const overlayGroup = new THREE.Group();
  brainGroup.add(overlayGroup);
  scene.add(brainGroup);

  const curve = new THREE.CatmullRomCurve3(
    missionPathPoints.map((point) => new THREE.Vector3(...point)),
    false,
    'catmullrom',
    0.45
  );
  const curvePoints = curve.getPoints(220);
  const inactivePathGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
  const activePathGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

  const inactivePath = new THREE.Line(
    inactivePathGeometry,
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    })
  );
  const activePath = new THREE.Line(
    activePathGeometry,
    new THREE.LineBasicMaterial({
      color: 0xffed67,
      transparent: true,
      opacity: 0.96,
    })
  );

  const robotCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffef8a,
      emissiveIntensity: 1.6,
      roughness: 0.16,
      metalness: 0.08,
    })
  );
  const robotHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xffed67,
      transparent: true,
      opacity: 0.22,
    })
  );
  const robotMarker = new THREE.Group();
  robotMarker.add(robotHalo, robotCore);

  const checkpointMeshes: THREE.Mesh[] = [];
  const checkpointBaseScales: number[] = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let brainMesh: THREE.Mesh | null = null;
  let activeCheckpointIndex = missionCheckpoints.length - 1;

  const createOrganicSphere = (radius: number, color: number, opacity: number, jitter: number) => {
    const geometry = new THREE.IcosahedronGeometry(radius, 5);
    const position = geometry.getAttribute('position');

    for (let index = 0; index < position.count; index += 1) {
      const vector = new THREE.Vector3(position.getX(index), position.getY(index), position.getZ(index)).normalize();
      const noise =
        Math.sin(vector.x * 10.4) * 0.03 + Math.cos(vector.y * 8.2) * 0.022 + Math.sin(vector.z * 9.4) * 0.026;
      const scale = radius * (1 + noise * jitter);
      position.setXYZ(index, vector.x * scale, vector.y * scale, vector.z * scale);
    }

    geometry.computeVertexNormals();

    return new THREE.Mesh(
      geometry,
      new THREE.MeshPhysicalMaterial({
        color,
        transparent: true,
        opacity,
        transmission: 0.06,
        roughness: 0.28,
        metalness: 0.05,
        emissive: color,
        emissiveIntensity: opacity * 0.75,
        clearcoat: 0.22,
      })
    );
  };

  const buildSceneObjects = () => {
    overlayGroup.clear();
    checkpointMeshes.length = 0;
    checkpointBaseScales.length = 0;

    const tumorGroup = new THREE.Group();
    const outerShell = createOrganicSphere(tumorModel.shellRadii[2], 0xffd974, 0.09, 0.8);
    const midShell = createOrganicSphere(tumorModel.shellRadii[1], 0xffad5d, 0.14, 0.55);
    const innerShell = createOrganicSphere(tumorModel.shellRadii[0], 0xff7a4c, 0.22, 0.4);
    const core = createOrganicSphere(tumorModel.coreRadius, 0xff5648, 0.88, 0.2);

    tumorGroup.position.set(...tumorModel.position);
    tumorGroup.add(outerShell, midShell, innerShell, core);
    overlayGroup.add(tumorGroup);

    inactivePath.renderOrder = 2;
    activePath.renderOrder = 3;
    overlayGroup.add(inactivePath, activePath);

    for (const [index, checkpoint] of missionCheckpoints.entries()) {
      const material = new THREE.MeshStandardMaterial({
        color: 0xffe76a,
        emissive: 0xc2a600,
        emissiveIntensity: 0.7,
        roughness: 0.18,
        metalness: 0.08,
      });

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 20, 20), material);
      mesh.position.set(...checkpoint.position);
      mesh.userData = { checkpointIndex: index };

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xffee80,
          transparent: true,
          opacity: 0.12,
        })
      );
      mesh.add(halo);

      checkpointMeshes.push(mesh);
      checkpointBaseScales.push(1);
      overlayGroup.add(mesh);
    }

    overlayGroup.add(robotMarker);
  };

  const updateViewport = () => {
    const bounds = canvas.parentElement?.getBoundingClientRect();
    const width = bounds?.width ?? 800;
    const height = bounds?.height ?? 600;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    setText(viewportReadout, `${Math.round(width)} × ${Math.round(height)}`);
  };

  const fitWholeBrain = () => {
    camera.position.set(-1.2, 0.42, 6.2);
    controls.target.set(0, 0.16, 0);
    controls.update();
  };

  const focusLesion = () => {
    const [x, y, z] = tumorModel.position;
    camera.position.set(x + 0.64, y + 0.36, z + 1.4);
    controls.target.set(x, y, z);
    controls.update();
  };

  const setAccordion = (panelId: string) => {
    for (const trigger of accordionTriggers) {
      trigger.setAttribute('aria-expanded', trigger.dataset.accordionTrigger === panelId ? 'true' : 'false');
    }

    for (const panel of accordionPanels) {
      panel.hidden = panel.dataset.accordionPanel !== panelId;
    }
  };

  const renderSignals = (signals: BiomarkerSignal[]) => {
    if (!evidenceSignals) return;
    evidenceSignals.innerHTML = signals
      .map(
        (signal) => `
          <div class="signal-card">
            <span>${signal.label}</span>
            <strong>${signal.value}</strong>
            <small>${signal.trend}</small>
          </div>
        `
      )
      .join('');
  };

  const renderTags = (container: HTMLElement | null, tags: string[]) => {
    if (!container) return;
    container.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join('');
  };

  const nearestCheckpointIndex = (progress: number) => {
    let checkpointIndex = 0;

    for (const [index, checkpoint] of missionCheckpoints.entries()) {
      if (checkpoint.progress <= progress) {
        checkpointIndex = index;
      }
    }

    return checkpointIndex;
  };

  const updateCheckpointHighlight = () => {
    for (const [index, mesh] of checkpointMeshes.entries()) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      const active = index === activeCheckpointIndex;
      mesh.scale.setScalar(active ? 1.42 : checkpointBaseScales[index]);
      material.emissiveIntensity = active ? 1.4 : 0.7;
      material.color.set(active ? 0xffffff : 0xffe76a);
    }
  };

  const updateEvidence = (checkpointIndex: number) => {
    activeCheckpointIndex = checkpointIndex;
    const checkpoint = missionCheckpoints[checkpointIndex];

    setText(evidenceLabel, checkpoint.label);
    setText(evidenceTime, checkpoint.time);
    setText(evidenceNote, checkpoint.note);
    setText(evidenceContext, checkpoint.context);
    setText(evidenceOptical, checkpoint.opticalBiopsy);

    renderSignals(checkpoint.signals);
    renderTags(evidenceProvenance, checkpoint.provenance);
    updateCheckpointHighlight();
  };

  const updateTreatment = (treatmentId: string) => {
    const option = treatmentOptions.find((item) => item.id === treatmentId) ?? treatmentOptions[0];

    setText(treatmentSummary, option.label);
    setText(treatmentLabel, option.label);
    setText(treatmentFit, option.fit);
    setText(treatmentRisk, option.riskBand);
    setText(treatmentCopy, option.summary);
    setText(treatmentProgression, option.progressionRisk);
    setText(treatmentReintervention, option.reinterventionLikelihood);
    setText(treatmentMonitoring, option.monitoringBurden);

    for (const button of treatmentButtons) {
      button.dataset.active = button.dataset.treatmentButton === option.id ? 'true' : 'false';
    }
  };

  const updateMissionAlert = (phaseIndex: number) => {
    const finalPhaseIndex = missionPhases.length - 1;
    const phase = missionPhases[phaseIndex];

    if (phaseIndex === finalPhaseIndex) {
      setText(missionAlertTitle, 'Mission complete');
      setText(
        missionAlertCopy,
        'Diagnostic package ready for review. The agent completed its route and halted at the lesion margin with stable local conditions.'
      );
      setText(missionAlertBadge, 'Review ready');
      setText(missionSummaryBadge, caseSummary.status);
      setText(diagnosisState, 'Reviewable');
      setText(diagnosisConfidence, dashboardDiagnosis.confidence);
    } else {
      setText(missionAlertTitle, `Replay mode · ${phase.label}`);
      setText(
        missionAlertCopy,
        'Diagnostic package remains anchored to the final milestone. Replay is showing how the agent advanced toward the lesion and what it recorded.'
      );
      setText(missionAlertBadge, 'Replay');
      setText(missionSummaryBadge, phase.status);
      setText(diagnosisState, 'Assembling');
      setText(diagnosisConfidence, phaseIndex >= finalPhaseIndex - 1 ? 'Pending review' : 'In progress');
    }
  };

  const updateMissionMetrics = (phaseIndex: number) => {
    const phase = missionPhases[phaseIndex];
    const percent = Math.round(phase.progress * 100);
    const agentLocation =
      phaseIndex === missionPhases.length - 1 ? caseSummary.distanceToCore : `${phase.status} · ${percent}% complete`;

    setText(missionDurationReadout, caseSummary.missionDuration);
    setText(pathCompletionReadout, `${percent}%`);
    setText(agentLocationReadout, agentLocation);
    setText(phaseReadout, phase.label);
    setText(agentReadout, agentLocation);
  };

  const updatePhaseUI = (phaseIndex: number) => {
    const phase = missionPhases[phaseIndex];

    setText(phaseHeading, phase.title);
    setText(phasePill, phase.label);
    setText(phaseCopy, phase.copy);
    if (scrubber) scrubber.value = `${phaseIndex}`;

    for (const [index, button] of phaseButtons.entries()) {
      button.dataset.active = index === phaseIndex ? 'true' : 'false';
    }

    for (const [index, row] of phaseRows.entries()) {
      row.dataset.active = index <= phaseIndex ? 'true' : 'false';
    }

    for (const [index, row] of eventRows.entries()) {
      row.dataset.active = index <= phaseIndex ? 'true' : 'false';
    }
  };

  const setPathProgress = (progress: number) => {
    const visibleCount = Math.max(2, Math.floor(curvePoints.length * progress));
    activePathGeometry.setDrawRange(0, visibleCount);
    const pathPosition = curve.getPoint(progress);
    robotMarker.position.copy(pathPosition);
  };

  const setMissionPhase = (phaseIndex: number) => {
    const phase = missionPhases[phaseIndex];
    const checkpointIndex = nearestCheckpointIndex(phase.progress);

    updatePhaseUI(phaseIndex);
    updateMissionAlert(phaseIndex);
    updateMissionMetrics(phaseIndex);
    setPathProgress(phase.progress);
    updateEvidence(checkpointIndex);
  };

  const pickCheckpointIndex = (event: PointerEvent | MouseEvent) => {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(checkpointMeshes, false);
    const hit = hits[0];

    if (!hit) return null;

    return Number((hit.object as THREE.Mesh).userData.checkpointIndex);
  };

  const loader = new STLLoader();
  loader.load(
    '/models/brain.stl',
    (geometry: THREE.BufferGeometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      geometry.rotateY(Math.PI);

      const mesh = new THREE.Mesh(geometry, brainMaterial);
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.25 / maxDim;
      mesh.scale.setScalar(scale);

      if (brainMesh) {
        brainGroup.remove(brainMesh);
      }

      brainMesh = mesh;
      brainGroup.add(mesh);
      buildSceneObjects();
      fitWholeBrain();

      const position = geometry.getAttribute('position');
      setText(trianglesReadout, `${Math.round(position.count / 3).toLocaleString()} triangles`);
    },
    undefined,
    () => {
      setText(trianglesReadout, 'Failed to load STL');
    }
  );

  autorotateToggle?.addEventListener('change', () => {
    controls.autoRotate = autorotateToggle.checked;
  });

  wireframeToggle?.addEventListener('change', () => {
    brainMaterial.wireframe = wireframeToggle.checked;
  });

  opacityRange?.addEventListener('input', () => {
    brainMaterial.opacity = Number(opacityRange.value) / 100;
  });

  resetButton?.addEventListener('click', fitWholeBrain);
  focusLesionButton?.addEventListener('click', focusLesion);

  scrubber?.addEventListener('input', () => {
    setMissionPhase(Number(scrubber.value));
  });

  for (const button of phaseButtons) {
    button.addEventListener('click', () => {
      setMissionPhase(Number(button.dataset.phaseIndex));
    });
  }

  for (const trigger of accordionTriggers) {
    trigger.addEventListener('click', () => {
      const panelId = trigger.dataset.accordionTrigger;
      if (panelId) setAccordion(panelId);
    });
  }

  for (const button of treatmentButtons) {
    button.addEventListener('click', () => {
      const treatmentId = button.dataset.treatmentButton;
      if (!treatmentId) return;
      updateTreatment(treatmentId);
    });
  }

  for (const prompt of reviewPrompts) {
    prompt.addEventListener('click', () => {
      const active = prompt.dataset.active === 'true';
      for (const button of reviewPrompts) {
        button.dataset.active = 'false';
      }

      prompt.dataset.active = active ? 'false' : 'true';
      setText(reviewState, active ? 'Needs acknowledgment' : 'Question raised');
    });
  }

  canvas.addEventListener('click', (event) => {
    const checkpointIndex = pickCheckpointIndex(event);
    if (checkpointIndex === null) return;
    updateEvidence(checkpointIndex);
    setAccordion('evidence');
  });

  canvas.addEventListener('pointermove', (event) => {
    const checkpointIndex = pickCheckpointIndex(event);
    canvas.style.cursor = checkpointIndex === null ? 'grab' : 'pointer';
  });

  const animate = () => {
    controls.update();
    robotHalo.scale.setScalar(1 + Math.sin(performance.now() * 0.005) * 0.08);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  setAccordion('evidence');
  updateTreatment(initialTreatmentId);
  updateViewport();
  setMissionPhase(Math.max(initialPhaseIndex, 0));
  window.addEventListener('resize', updateViewport);
  animate();
}
