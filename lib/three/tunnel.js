// Hero: 3D fly-through of real Prokolpo projects. Three.js r128.
import * as THREE from 'three';
const lerp = (a,b,t) => a + (b - a) * t;
const clamp01 = v => Math.min(1, Math.max(0, v));
const ease = t => 1 - Math.pow(1 - t, 3);
export function initTunnel(sec, byId){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alive = true, raf = 0; const disposers = [];
  const on = (type, fn, opts) => { window.addEventListener(type, fn, opts); disposers.push(() => window.removeEventListener(type, fn, opts)); };

  
  const intro = sec.querySelector('#heroIntro'), outro = sec.querySelector('#'+'heroOutro');
  const cap = sec.querySelector('#'+'heroCap'), capLoc = sec.querySelector('#'+'capLoc'), capTitle = sec.querySelector('#'+'capTitle'), capSub = sec.querySelector('#'+'capSub');
  const meter = sec.querySelector('#'+'meter'), hint = sec.querySelector('.scrollhint');
  const frames = [
    ['japandi','japandi-0'],['nirupam','nirupam-0'],['family2200','family2200-0'],['shipon','shipon-0'],
    ['cuet','cuet-0'],['didar','didar-0'],['staircase','staircase-0'],['rimon','rimon-0'],
    ['shahanshah','shahanshah-0'],['bluemoon','bluemoon-0'],['concepts','concept-0']
  ];
  const N = frames.length, GAP = 6.5;
  frames.forEach(() => meter.appendChild(document.createElement('i')));
  const ticks = [...meter.children];
  let heroP = 0, heroTarget = 0;
  const progress = () => { const r = sec.getBoundingClientRect(); return clamp01(-r.top / (sec.offsetHeight - innerHeight)); };
  on('scroll', () => { heroTarget = progress(); }, {passive:true});
  heroTarget = progress();

  function overlays(p, nearest){
    intro.style.opacity = clamp01(1 - p / .07);
    hint.style.opacity = clamp01(1 - p / .03) * .7;
    intro.style.transform = `translateY(${-p * 600}px) scale(${1 + p * 1.5})`;
    const o = clamp01((p - .9) / .07);
    outro.style.opacity = o; outro.style.transform = `scale(${1.1 - o * .1})`;
    outro.style.pointerEvents = o > .5 ? 'auto' : 'none';
    const showCap = p > .08 && p < .9 && nearest >= 0;
    cap.classList.toggle('on', showCap);
    if (nearest >= 0 && cap.dataset.i != nearest){
      cap.dataset.i = nearest; const pr = byId[frames[nearest][0]];
      capLoc.textContent = pr.location; capTitle.textContent = pr.title;
      capSub.textContent = [pr.client !== 'Private residence' ? pr.client : '', pr.size].filter(Boolean).join(' · ');
    }
    ticks.forEach((t, i) => t.classList.toggle('on', i === nearest && showCap));
  }


  const canvas = sec.querySelector('#'+'tunnel');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x0e0b08, 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x0e0b08, 8, 30);
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 120);

  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const planes = [];
  // golden-angle spiral corridor of framed photos
  frames.forEach(([pid, img], i) => {
    const side = i % 2 ? 1 : -1;
    const a = i * 2.399;
    const x = side * (2.3 + Math.abs(Math.sin(a)) * 1.2);
    const y = Math.cos(a) * 1.1;
    const z = -i * GAP - 4;
    const g = new THREE.Group(); g.position.set(x, y, z);
    g.rotation.y = -side * .38; g.rotation.z = side * .025;
    const mat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0});
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({color:0xc9a25c, transparent:true, opacity:0}));
    frame.position.z = -.01;
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({color:0xffb874, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false}));
    glow.position.z = -.05;
    g.add(glow, frame, mesh); scene.add(g);
    const H = 2.6; let W = H * 1.5;
    const setSize = w => { mesh.scale.set(w, H, 1); frame.scale.set(w + .08, H + .08, 1); glow.scale.set(w * 1.5, H * 1.6, 1); };
    setSize(W);
    loader.load(`/projects/${img}.jpg`, t => {
      t.encoding = THREE.sRGBEncoding; t.anisotropy = maxAniso;
      mat.map = t; mat.needsUpdate = true;
      setSize(H * t.image.width / t.image.height);
      mesh.userData.ready = true;
    });
    planes.push({g, mesh, frame, glow, side, base:{x, y, z}, i});
  });

  // warm floating dust
  const pc = 700, pos = new Float32Array(pc * 3);
  for (let i = 0; i < pc; i++){ pos[i*3] = (Math.random() - .5) * 16; pos[i*3+1] = (Math.random() - .5) * 9; pos[i*3+2] = -Math.random() * (N * GAP + 12) + 6; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({color:0xffd9a6, size:.035, transparent:true, opacity:.55, depthWrite:false}));
  scene.add(dust);

  // floor & ceiling light lines that run down the corridor
  const lineMat = new THREE.LineBasicMaterial({color:0xc9a25c, transparent:true, opacity:.22});
  [[-4.6,-2.4],[4.6,-2.4],[-4.6,2.6],[4.6,2.6]].forEach(([lx, ly]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(lx, ly, 8), new THREE.Vector3(lx, ly, -N * GAP - 20)]);
    scene.add(new THREE.Line(geo, lineMat));
  });

  let mx = 0, my = 0, smx = 0, smy = 0;
  on('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, {passive:true});
  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 700 ? 68 : 50; camera.updateProjectionMatrix();
  }
  on('resize', resize); resize();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(sec);

  const startZ = 16, endZ = -(N - 1) * GAP - 6;
  const clock = new THREE.Clock();

  // ---- click / tap a photo to enlarge ----
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(planes.filter(pl => pl.mesh.material.opacity > .35).map(pl => pl.mesh))[0];
    return hit ? planes.find(pl => pl.mesh === hit.object) : null;
  };
  const onMove = (e) => { if (e.pointerType !== 'mouse') return; hovered = pick(e); canvas.style.cursor = hovered ? 'zoom-in' : ''; };
  const onClick = (e) => {
    const pl = pick(e); if (!pl) return;
    sec.dispatchEvent(new CustomEvent('hero-open', { detail: { index: pl.i, frames } }));
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('click', onClick);
  disposers.push(() => { canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('click', onClick); });

  function frame(){
    if (!alive) return; raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    heroP += (heroTarget - heroP) * (reduce ? 1 : .06);
    const p = heroP;
    smx += (mx - smx) * .05; smy += (my - smy) * .05;
    const camZ = lerp(startZ, endZ, ease(clamp01((p - .02) / .9)) * .25 + clamp01((p - .02) / .9) * .75);
    camera.position.set(Math.sin(t * .25) * .25 + smx * 1.4, Math.cos(t * .3) * .15 - smy * .8, camZ);
    camera.lookAt(smx * .6, -smy * .3, camZ - 10);
    camera.rotation.z += Math.sin(p * Math.PI * 2) * .02;

    let nearest = -1, best = 1e9;
    planes.forEach(pl => {
      const d = camZ - pl.base.z;             // distance in front of camera
      const fadeIn = clamp01((30 - d) / 12) * lerp(.6, 1, clamp01(p / .08));   // appear out of the fog
      const fadeOut = clamp01((d - 3.2) / 2.6);// fade before it fills the screen
      const o = pl.mesh.userData.ready ? fadeIn * fadeOut : 0;
      pl.mesh.material.opacity = o;
      pl.frame.material.opacity = o * .9;
      const focus = clamp01(1 - Math.abs(d - 6) / 4);
      pl.glow.visible = false;
      // swing toward the viewer as it approaches
      pl.g.rotation.y = -pl.side * lerp(.42, .12, focus);
      pl.g.position.y = pl.base.y + Math.sin(t * .6 + pl.i) * .08;
      pl.g.position.x = pl.base.x * lerp(1, .82, focus);
      const sc = hovered === pl ? 1.06 : 1; pl.g.scale.x += (sc - pl.g.scale.x) * .15; pl.g.scale.y = pl.g.scale.x;
      if (d > 2 && d < 11 && Math.abs(d - 6) < best){ best = Math.abs(d - 6); nearest = pl.i; }
    });
    dust.rotation.z = t * .01;
    overlays(p, nearest);
    renderer.render(scene, camera);
  }
  frame();
  disposers.push(() => renderer.dispose());

  return () => { alive = false; cancelAnimationFrame(raf); disposers.forEach(d => d()); };
}
