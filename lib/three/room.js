// Scroll-driven 3D room (ported from the static site). Three.js r128.
import * as THREE from 'three';
export function initRoom(sec){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alive = true, raf = 0; const disposers = [];
  const on = (type, fn, opts) => { window.addEventListener(type, fn, opts); disposers.push(() => window.removeEventListener(type, fn, opts)); };
/* ---------- HERO SCROLL PROGRESS ---------- */
const hero = sec;
const steps = [...sec.querySelectorAll('.step')];
const prog = sec.querySelector('#prog');
let target = 0, cur = reduce ? 1 : 0;
function heroProgress(){
  const r = hero.getBoundingClientRect();
  const total = hero.offsetHeight - innerHeight;
  return Math.min(1, Math.max(0, -r.top / total));
}
function updateSteps(p){
  steps.forEach(s => {
    const a = +s.dataset.from, b = +s.dataset.to;
    let o = 0;
    if (p >= a && p <= b){ const fade = .06; o = Math.min(1, (p - a) / fade, (b - p) / fade); if (a === 0 && p < fade) o = 1; if (b > 1 && p > b - fade) o = 1; }
    s.style.opacity = o;
    s.style.transform = `translateY(calc(-50% + ${(1 - o) * 30}px))`;
    s.style.pointerEvents = o > .5 ? 'auto' : 'none';
  });
  prog.textContent = String(Math.round(p * 100)).padStart(2, '0') + '%';
}
on('scroll', () => { target = heroProgress(); }, {passive:true});
updateSteps(0);
target = heroProgress();

/* ---------- THREE.JS ROOM ---------- */
(function(){
  const canvas = sec.querySelector('#scene');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x16130f, 18, 40);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);

  // lights
  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x2a1f16, .55));
  const sun = new THREE.DirectionalLight(0xffe2b8, 1.1);
  sun.position.set(-6, 10, 8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, {left:-9, right:9, top:9, bottom:-9, near:1, far:30});
  sun.shadow.bias = -.0008;
  scene.add(sun);
  const lampLight = new THREE.PointLight(0xffb866, 0, 9, 2);
  lampLight.position.set(-3.2, 2.5, -2.6); lampLight.castShadow = true;
  scene.add(lampLight);
  const pendantLight = new THREE.PointLight(0xffc98a, 0, 7, 2);
  pendantLight.position.set(.5, 3.2, -.6);
  scene.add(pendantLight);

  const M = (c, o={}) => new THREE.MeshStandardMaterial(Object.assign({color:c, roughness:.8, metalness:0}, o));
  const mats = {
    floor:M(0x8a5a36,{roughness:.6}), wall:M(0xe6ddd0), wall2:M(0xd7cbbb),
    sofa:M(0x5b6b4f,{roughness:.95}), terra:M(0xc4633d,{roughness:.9}), rug:M(0xd8c7a8,{roughness:1}),
    brass:M(0xc9a25c,{metalness:.8, roughness:.3}), walnut:M(0x4a2f1e,{roughness:.5}),
    dark:M(0x241d17), green:M(0x4f6b3e,{roughness:.9}), pot:M(0xe9e2d6,{roughness:.4}),
    glow:new THREE.MeshBasicMaterial({color:0xffe6b8}), windowM:new THREE.MeshBasicMaterial({color:0xf5dcae, transparent:true, opacity:.85}),
    art1:M(0xc4633d), art2:M(0xc9a25c), art3:M(0x2f3b2a)
  };

  const objs = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  function place(obj, explode){
    obj.traverse(m => { if (m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
    obj.userData.tp = obj.position.clone();
    obj.userData.tr = obj.rotation.clone();
    obj.userData.sp = obj.position.clone().add(explode || new THREE.Vector3(rnd(-7,7), rnd(6,12), rnd(-6,8)));
    obj.userData.sr = new THREE.Euler(rnd(-2,2), rnd(-3,3), rnd(-2,2));
    scene.add(obj); objs.push(obj); return obj;
  }
  function box(w,h,d,mat,x,y,z){ const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); return m; }
  function cyl(rt,rb,h,mat,x,y,z,seg=32){ const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat); m.position.set(x,y,z); return m; }
  function group(x,y,z,ry=0){ const g = new THREE.Group(); g.position.set(x,y,z); g.rotation.y = ry; return g; }

  // shell
  place(box(10,.25,8,mats.floor,0,-.125,0), new THREE.Vector3(0,-8,0));
  place(box(10,5,.2,mats.wall,0,2.5,-4.1), new THREE.Vector3(0,0,-10));
  place(box(.2,5,8,mats.wall2,-5.1,2.5,0), new THREE.Vector3(-10,0,0));
  // skirting
  place(box(10,.18,.06,mats.walnut,0,.09,-3.98), new THREE.Vector3(0,-3,-6));

  // window
  const win = group(-2.2,2.9,-3.98);
  win.add(box(2.6,2.2,.05,mats.windowM,0,0,0));
  win.add(box(2.8,.1,.12,mats.dark,0,1.12,0)); win.add(box(2.8,.1,.12,mats.dark,0,-1.12,0));
  win.add(box(.1,2.3,.12,mats.dark,-1.38,0,0)); win.add(box(.1,2.3,.12,mats.dark,1.38,0,0));
  win.add(box(.06,2.2,.1,mats.dark,0,0,0));
  place(win, new THREE.Vector3(0,6,-6));

  // art
  const art = group(1.6,2.9,-3.98);
  art.add(box(1.9,1.3,.06,mats.brass,0,0,0));
  const artTex = new THREE.TextureLoader().load('/projects/japandi-1.jpg'); artTex.encoding = THREE.sRGBEncoding;
  const artPic = new THREE.Mesh(new THREE.PlaneGeometry(1.75,1.15), new THREE.MeshStandardMaterial({map:artTex, roughness:.6}));
  artPic.position.z = .035; art.add(artPic);
  place(art);

  // rug
  place(box(5.2,.03,3.4,mats.rug,.4,.015,-.6), new THREE.Vector3(0,9,0));

  // sofa
  const sofa = group(.4,0,-2.7);
  sofa.add(box(4,.45,1.4,mats.sofa,0,.42,0));
  sofa.add(box(4,.95,.35,mats.sofa,0,1.05,-.55));
  sofa.add(box(.35,.75,1.4,mats.sofa,-1.85,.6,0));
  sofa.add(box(.35,.75,1.4,mats.sofa,1.85,.6,0));
  [-1.6,1.6].forEach(x => [-.55,.55].forEach(z => sofa.add(cyl(.04,.04,.2,mats.brass,x,.1,z,8))));
  place(sofa);
  const cush1 = box(.85,.6,.18,mats.terra,-.9,1.0,-2.95); cush1.rotation.set(-.2,.15,.08); place(cush1);
  const cush2 = box(.75,.55,.18,mats.art2,.95,1.0,-2.95); cush2.rotation.set(-.2,-.1,-.06); place(cush2);

  // coffee table
  const table = group(.4,0,-.5);
  table.add(cyl(.95,.95,.08,mats.walnut,0,.5,0,48));
  table.add(cyl(.1,.25,.46,mats.brass,0,.23,0,24));
  place(table);
  const vase = cyl(.1,.14,.35,mats.pot,.6,.71,-.45); place(vase);
  const books = group(.15,.58,-.4,.4);
  books.add(box(.6,.06,.42,mats.terra,0,0,0)); books.add(box(.55,.06,.4,mats.dark,0,.06,0));
  place(books);

  // armchair
  const chair = group(3.3,0,-.3,-.9);
  chair.add(box(1.2,.4,1.1,mats.terra,0,.42,0));
  chair.add(box(1.2,.8,.25,mats.terra,0,.95,-.45));
  chair.add(box(.2,.55,1.1,mats.terra,-.6,.6,0)); chair.add(box(.2,.55,1.1,mats.terra,.6,.6,0));
  [-.45,.45].forEach(x => [-.4,.4].forEach(z => chair.add(cyl(.035,.035,.22,mats.walnut,x,.11,z,8))));
  place(chair);

  // floor lamp
  const lamp = group(-3.2,0,-2.6);
  lamp.add(cyl(.28,.32,.06,mats.brass,0,.03,0));
  lamp.add(cyl(.025,.025,2.2,mats.brass,0,1.13,0,8));
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.42,.5,32,1,true), M(0xf3e4c8,{side:THREE.DoubleSide, emissive:0xffb866, emissiveIntensity:0}));
  shade.position.y = 2.45; shade.rotation.x = Math.PI; lamp.add(shade);
  place(lamp);

  // pendant
  const pend = group(.4,0,-.5);
  pend.add(cyl(.01,.01,1.4,mats.dark,0,4.3,0,6));
  const bulbM = new THREE.MeshStandardMaterial({color:0xfff0d0, emissive:0xffc98a, emissiveIntensity:0});
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.28,32,16), bulbM); bulb.position.y = 3.45; pend.add(bulb);
  pend.add(cyl(.12,.12,.08,mats.brass,0,3.75,0,16));
  place(pend, new THREE.Vector3(0,8,0));

  // shelf on left wall
  const shelf = group(-4.75,0,.8);
  for (let i = 0; i < 4; i++) shelf.add(box(.5,.06,2.2,mats.walnut,0,.9 + i*.75,0));
  shelf.add(box(.5,2.4,.06,mats.walnut,0,1.95,-1.1)); shelf.add(box(.5,2.4,.06,mats.walnut,0,1.95,1.1));
  const bookCols = [mats.terra, mats.art2, mats.sofa, mats.dark, mats.pot];
  for (let s = 0; s < 3; s++){
    let z = -.95;
    for (let b = 0; b < 6 && z < .7; b++){
      const h = rnd(.4,.6), t = rnd(.08,.14);
      shelf.add(box(.35,h,t,bookCols[(s*3+b)%5],0,.93 + s*.75 + h/2,z)); z += t + .03;
    }
    shelf.add(cyl(.1,.08,.25,mats.pot,0,.93 + s*.75 + .13,.8,16));
  }
  place(shelf, new THREE.Vector3(-7,2,0));

  // plant
  const plant = group(4,0,-3.2);
  plant.add(cyl(.38,.28,.75,mats.pot,0,.375,0));
  const leaf = new THREE.SphereGeometry(1,16,12);
  [[0,1.4,0,.55],[.3,1.85,.1,.42],[-.3,1.75,-.1,.45],[.05,2.25,0,.35],[-.2,1.15,.25,.35]].forEach(([x,y,z,s]) => {
    const l = new THREE.Mesh(leaf, mats.green); l.position.set(x,y,z); l.scale.set(s,s*1.1,s); plant.add(l);
  });
  place(plant);

  // side table + small lamp
  const side = group(-2.3,0,-2.9);
  side.add(cyl(.35,.35,.05,mats.brass,0,.6,0)); side.add(cyl(.03,.03,.6,mats.brass,0,.3,0,8)); side.add(cyl(.25,.25,.03,mats.brass,0,.015,0));
  place(side);

  // floating dust particles for atmosphere
  const pg = new THREE.BufferGeometry(); const pc = 260; const pos = new Float32Array(pc*3);
  for (let i = 0; i < pc; i++){ pos[i*3] = rnd(-5,5); pos[i*3+1] = rnd(0,5); pos[i*3+2] = rnd(-4,4); }
  pg.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({color:0xffe2b0, size:.03, transparent:true, opacity:0}));
  scene.add(dust);

  // order: shell first, then furniture
  const n = objs.length;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const lerp = (a,b,t) => a + (b - a) * t;
  let mx = 0, my = 0, smx = 0, smy = 0;
  on('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, {passive:true});

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 700 ? 55 : 40; camera.updateProjectionMatrix();
  }
  on('resize', resize); resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, {threshold:0}).observe(hero);

  const clock = new THREE.Clock();
  function frame(){
    if (!alive) return; raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    cur += (target - cur) * (reduce ? 1 : .07);
    const p = reduce ? 1 : cur;
    updateSteps(cur);

    objs.forEach((o, i) => {
      const delay = (i / n) * .5;
      const k = ease(Math.min(1, Math.max(0, (p - delay) / .3)));
      const u = o.userData;
      o.position.set(lerp(u.sp.x,u.tp.x,k), lerp(u.sp.y,u.tp.y,k), lerp(u.sp.z,u.tp.z,k));
      o.rotation.set(lerp(u.sr.x,u.tr.x,k), lerp(u.sr.y,u.tr.y,k), lerp(u.sr.z,u.tr.z,k));
      o.visible = k > 0.001 || p > 0.001 || i < 3;
    });

    // lights turn on in the last act
    const lightsOn = ease(Math.min(1, Math.max(0, (p - .72) / .2)));
    lampLight.intensity = lightsOn * 2.2;
    pendantLight.intensity = lightsOn * 1.6;
    shade.material.emissiveIntensity = lightsOn * .9;
    bulbM.emissiveIntensity = lightsOn * 1.4;
    sun.intensity = lerp(1.15, .55, lightsOn);
    dust.material.opacity = lightsOn * .6;
    dust.rotation.y = t * .02;

    // camera choreography
    smx += (mx - smx) * .05; smy += (my - smy) * .05;
    const theta = lerp(1.15, .42, ease(p)) + smx * .12 + Math.sin(t * .2) * .02;
    const r = lerp(17, 10.5, ease(p));
    const y = lerp(10, 3.8, ease(p)) - smy * .6;
    camera.position.set(Math.sin(theta) * r + .4, y, Math.cos(theta) * r - .8);
    camera.lookAt(.6 - (innerWidth > 900 ? 1.6 : 0) * (1 - p * .3), 1.3, -1.6);

    renderer.render(scene, camera);
  }
  frame();
  disposers.push(() => renderer.dispose());
  sec.querySelector('.fallback').style.opacity = .6;
})();


  return () => { alive = false; cancelAnimationFrame(raf); disposers.forEach(d => d()); };
}
