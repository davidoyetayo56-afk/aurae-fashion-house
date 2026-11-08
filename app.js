import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const products={
 thorn:{name:'Thorn Graphic Tee',detail:'Heavyweight cotton · Relaxed fit',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'},
 signal:{name:'Signal Oversized Tee',detail:'Washed black · Boxy silhouette',image:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80'},
 orbit:{name:'Orbit Utility Trouser',detail:'Graphite · Wide-leg fit',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'},
 static:{name:'Static Cargo Short',detail:'Stone grey · Technical cotton',image:'https://images.unsplash.com/photo-1506629905607-d9b297d6a5e7?auto=format&fit=crop&w=400&q=80'}
};
const bag=new Map();const $=s=>document.querySelector(s);
function count(){return [...bag.values()].reduce((a,p)=>a+p.qty,0)}
function updateBag(){const n=count();$('#bag-count').textContent=n;$('#cart-count').textContent='('+n+')';$('#cart-items').innerHTML=bag.size?[...bag.values()].map(p=>'<div class="cart-row"><img src="'+p.image+'" alt=""><div><h3>'+p.name+'</h3><small>'+p.detail+'</small><div class="qty"><button data-qty="'+p.id+'" data-step="-1" aria-label="Decrease quantity">−</button><span>'+p.qty+'</span><button data-qty="'+p.id+'" data-step="1" aria-label="Increase quantity">+</button></div></div><button class="close-button" data-remove="'+p.id+'" aria-label="Remove '+p.name+'">×</button></div>').join(''):'<div class="empty-bag">Your bag is waiting.<br><small>Find a piece that feels like you.</small></div>';$('#cart-total').textContent='Price confirmed on enquiry'}
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2100)}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const p=products[b.dataset.add];const item=bag.get(b.dataset.add)||{...p,id:b.dataset.add,qty:0};item.qty++;bag.set(item.id,item);updateBag();toast(p.name+' added to your bag')}));
$('#bag-open').onclick=()=>{$('#cart-backdrop').classList.add('open');document.body.style.overflow='hidden'};
$('#bag-close').onclick=closeBag;$('#cart-backdrop').addEventListener('click',e=>{if(e.target===$('#cart-backdrop'))closeBag()});
function closeBag(){$('#cart-backdrop').classList.remove('open');document.body.style.overflow=''}
$('#cart-items').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q){const p=bag.get(q.dataset.qty);p.qty+=Number(q.dataset.step);if(p.qty<=0)bag.delete(p.id);updateBag()}if(r){bag.delete(r.dataset.remove);updateBag()}});
$('#checkout').onclick=()=>{if(!bag.size){toast('Your bag is empty');return}const list=[...bag.values()].map(p=>p.name+' × '+p.qty).join('\n');const msg='Hello AURAÈ, I would like to enquire about these items:\n'+list+'\nPlease confirm current prices, availability and delivery.';window.open('https://wa.me/2348168413921?text='+encodeURIComponent(msg),'_blank','noopener')};
function applyFilters(){const active=$('.filter.active')?.dataset.filter||'all',q=$('#search-input').value.trim().toLowerCase();document.querySelectorAll('.product-card').forEach(c=>{const categoryMatch=active==='all'||c.dataset.category===active;const searchMatch=!q||c.innerText.toLowerCase().includes(q);c.hidden=!(categoryMatch&&searchMatch)})}
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');applyFilters()});
$('#search-open').onclick=()=>{$('#search-panel').classList.add('open');$('#search-input').focus()};$('#search-close').onclick=()=>$('#search-panel').classList.remove('open');$('#search-input').addEventListener('input',applyFilters);
$('#menu-toggle').onclick=()=>{const nav=$('#site-nav');const open=nav.classList.toggle('mobile-open');$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close menu':'Open menu')};
$('#site-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('#site-nav').classList.remove('mobile-open')));
$('#year').textContent=new Date().getFullYear();document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBag();$('#search-panel').classList.remove('open');$('#site-nav').classList.remove('mobile-open')}});updateBag();

// A stylised, touch-friendly 3D outfit preview. Drop a production GLB at /models/obsidian_black_boutique_mannequin_reference_v2.glb to replace it.
const stage=$('#three-stage');let scene,camera,renderer,controls,raf,autoRotate=true;const colourMaterials=[];
function latheBody(profile,material,segments=48){const pts=profile.map(([r,y])=>new THREE.Vector2(r,y));const mesh=new THREE.Mesh(new THREE.LatheGeometry(pts,segments),material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh}
function makeOutfit(){
 const root=new THREE.Group();
 const mannequin=new THREE.MeshStandardMaterial({color:0x08090a,roughness:.24,metalness:.62});
 const cloth=new THREE.MeshStandardMaterial({color:0x252525,roughness:.78,metalness:.04});
 const seam=new THREE.MeshStandardMaterial({color:0x77716b,roughness:.58,metalness:.16});
 const glass=new THREE.MeshPhysicalMaterial({color:0x9ba4aa,roughness:.12,metalness:.22,transparent:true,opacity:.28,clearcoat:1});
 colourMaterials.push(cloth);
 const add=(geo,mat,pos,rot)=>{const m=new THREE.Mesh(geo,mat);m.position.set(...pos);if(rot)m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;root.add(m);return m};
 // Featureless display mannequin: smooth head, athletic torso and relaxed limbs.
 add(new THREE.SphereGeometry(.185,40,32),mannequin,[0,2.12,0]);
 add(new THREE.CylinderGeometry(.105,.12,.19,32),mannequin,[0,1.91,0]);
 const body=latheBody([[.22,.85],[.27,1.02],[.31,1.34],[.34,1.59],[.27,1.72],[.13,1.78]],mannequin);body.scale.z=.62;root.add(body);
 add(new THREE.SphereGeometry(.31,32,24),mannequin,[0,1.56,0],[0,0,0]).scale.set(1,.52,.62);
 const armGeo=new THREE.CylinderGeometry(.075,.105,.7,28,1);
 add(armGeo,mannequin,[-.39,1.36,0],[0,0,-.16]);
 add(armGeo,mannequin,[.39,1.36,0],[0,0,.16]);
 add(new THREE.SphereGeometry(.085,24,18),mannequin,[-.43,.99,0]);
 add(new THREE.SphereGeometry(.085,24,18),mannequin,[.43,.99,0]);
 const legGeo=new THREE.CylinderGeometry(.105,.09,.87,32,1);
 add(legGeo,mannequin,[-.15,.45,0]);
 add(legGeo,mannequin,[.15,.45,0]);
 add(new THREE.BoxGeometry(.22,.1,.34),mannequin,[-.15,.035,.08]);
 add(new THREE.BoxGeometry(.22,.1,.34),mannequin,[.15,.035,.08]);
 // Oversized tee layer and sleeves, with relaxed straight-leg trousers.
 const shirt=latheBody([[.285,.91],[.32,1.02],[.35,1.36],[.39,1.58],[.43,1.67],[.35,1.74],[.14,1.78]],cloth);shirt.scale.z=.64;root.add(shirt);
 const sleeve=new THREE.CylinderGeometry(.12,.15,.48,32,1);
 add(sleeve,cloth,[-.43,1.51,0],[0,0,-.28]);
 add(sleeve,cloth,[.43,1.51,0],[0,0,.28]);
 const leftLeg=latheBody([[.11,.035],[.12,.12],[.135,.43],[.15,.78],[.16,.91]],cloth,32);leftLeg.position.x=-.16;root.add(leftLeg);
 const rightLeg=latheBody([[.11,.035],[.12,.12],[.135,.43],[.15,.78],[.16,.91]],cloth,32);rightLeg.position.x=.16;root.add(rightLeg);
 const waistband=add(new THREE.CylinderGeometry(.32,.31,.065,48),seam,[0,.91,0]);waistband.scale.z=.64;
 // Circular boutique display plinth with a glass-like top and brushed-metal rim.
 const base=add(new THREE.CylinderGeometry(.78,.78,.055,80),glass,[0,-.045,0]);
 const rim=add(new THREE.TorusGeometry(.77,.018,12,80),seam,[0,-.018,0]);rim.rotation.x=Math.PI/2;
 const foot=add(new THREE.CylinderGeometry(.19,.24,.12,48),seam,[0,.035,0]);
 return root;
}
function initStudio(){
 try{
 scene=new THREE.Scene();scene.background=new THREE.Color(0x111111);camera=new THREE.PerspectiveCamera(34,stage.clientWidth/stage.clientHeight,.1,100);camera.position.set(0,1.45,5.2);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.domElement.setAttribute('aria-label','Interactive 3D AURAÈ outfit preview. Drag to rotate and use touch gestures to zoom.');renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;stage.innerHTML='';stage.appendChild(renderer.domElement);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=3.2;controls.maxDistance=7.5;controls.maxPolarAngle=Math.PI*.88;controls.target.set(0,1.05,0);controls.autoRotate=true;controls.autoRotateSpeed=.65;
 scene.add(new THREE.HemisphereLight(0xe9e4dc,0x28232a,2.1));const key=new THREE.DirectionalLight(0xfff1df,3.1);key.position.set(3,5,4);scene.add(key);const rim=new THREE.PointLight(0x9b2635,17,8);rim.position.set(-2,2,1);scene.add(rim);const fill=new THREE.PointLight(0x8996ad,9,8);fill.position.set(2,1,-2);scene.add(fill);
 const model=makeOutfit();scene.add(model);const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,64),new THREE.MeshBasicMaterial({color:0x1b1b1b,transparent:true,opacity:.65}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;scene.add(floor);
 new GLTFLoader().load('/models/obsidian_black_boutique_mannequin_reference_v2.glb',g=>{scene.remove(model);const loaded=g.scene;loaded.traverse(node=>{if(node.isMesh&&node.material){const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(material=>{if(/cloth|fabric|garment|shirt|trouser|pants|apparel/i.test(material.name))colourMaterials.push(material)})}});const box=new THREE.Box3().setFromObject(loaded);const size=box.getSize(new THREE.Vector3());const scale=2.25/Math.max(size.y,size.x,size.z);loaded.scale.setScalar(scale);const center=box.getCenter(new THREE.Vector3());loaded.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);scene.add(loaded)},undefined,()=>{});
 const tick=()=>{raf=requestAnimationFrame(tick);controls.update();renderer.render(scene,camera)};tick();
 const resize=()=>{if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};new ResizeObserver(resize).observe(stage);window.addEventListener('orientationchange',resize);
 }catch(e){stage.innerHTML='<div class="model-loading">3D preview unavailable on this device.</div>';console.error('AURAÈ 3D studio:',e)}
}
initStudio();
$('#rotate-toggle').onclick=()=>{autoRotate=!autoRotate;controls.autoRotate=autoRotate;$('#rotate-toggle').classList.toggle('active',autoRotate);$('#rotate-toggle').textContent=autoRotate?'↻ Auto rotate':'Ⅱ Auto rotate'};
$('#model-reset').onclick=()=>{camera.position.set(0,1.45,5.2);controls.target.set(0,1.05,0);controls.update()};
document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');colourMaterials.forEach(m=>m.color.set(b.dataset.colour))});
window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
