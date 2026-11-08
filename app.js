import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const products={
 thorn:{name:'Thorn Graphic Tee',price:28000,detail:'Heavyweight cotton · Relaxed fit',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'},
 signal:{name:'Signal Oversized Tee',price:32000,detail:'Washed black · Boxy silhouette',image:'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80'},
 orbit:{name:'Orbit Utility Trouser',price:45000,detail:'Graphite · Wide-leg fit',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80'},
 static:{name:'Static Cargo Short',price:26000,detail:'Stone grey · Technical cotton',image:'https://images.unsplash.com/photo-1506629905607-d9b297d6a5e7?auto=format&fit=crop&w=400&q=80'}
};
const bag=new Map();const $=s=>document.querySelector(s);const money=n=>'₦ '+n.toLocaleString('en-NG');
function count(){return [...bag.values()].reduce((a,p)=>a+p.qty,0)}
function updateBag(){const n=count();$('#bag-count').textContent=n;$('#cart-count').textContent='('+n+')';$('#cart-items').innerHTML=bag.size?[...bag.values()].map(p=>'<div class="cart-row"><img src="'+p.image+'" alt=""><div><h3>'+p.name+'</h3><small>'+money(p.price)+' · '+p.detail+'</small><div class="qty"><button data-qty="'+p.id+'" data-step="-1">−</button><span>'+p.qty+'</span><button data-qty="'+p.id+'" data-step="1">+</button></div></div><button class="close-button" data-remove="'+p.id+'">×</button></div>').join(''):'<div class="empty-bag">Your bag is waiting.<br><small>Find a piece that feels like you.</small></div>';$('#cart-total').textContent=money([...bag.values()].reduce((a,p)=>a+p.qty*p.price,0))}
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2100)}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{const p=products[b.dataset.add];const item=bag.get(b.dataset.add)||{...p,id:b.dataset.add,qty:0};item.qty++;bag.set(item.id,item);updateBag();toast(p.name+' added to your bag');}));
$('#bag-open').onclick=()=>{$('#cart-backdrop').classList.add('open');document.body.style.overflow='hidden'};
$('#bag-close').onclick=closeBag;$('#cart-backdrop').addEventListener('click',e=>{if(e.target===$('#cart-backdrop'))closeBag()});
function closeBag(){$('#cart-backdrop').classList.remove('open');document.body.style.overflow=''}
$('#cart-items').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q){const p=bag.get(q.dataset.qty);p.qty+=Number(q.dataset.step);if(p.qty<=0)bag.delete(p.id);updateBag()}if(r){bag.delete(r.dataset.remove);updateBag()}});
$('#checkout').onclick=()=>{if(!bag.size){toast('Your bag is empty');return}const list=[...bag.values()].map(p=>p.name+' × '+p.qty+' — '+money(p.qty*p.price)).join('\n');const total=[...bag.values()].reduce((a,p)=>a+p.qty*p.price,0);const msg='Hello AURAÈ, I would like to place an order:\n'+list+'\nSubtotal: '+money(total)+'\nPlease confirm availability and delivery.';window.open('https://wa.me/2348168413921?text='+encodeURIComponent(msg),'_blank','noopener')};
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.product-card').forEach(card=>card.hidden=b.dataset.filter!=='all'&&card.dataset.category!==b.dataset.filter)});
$('#search-open').onclick=()=>$('#search-panel').classList.add('open');$('#search-close').onclick=()=>$('#search-panel').classList.remove('open');$('#search-input').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.product-card').forEach(c=>c.hidden=!c.innerText.toLowerCase().includes(q))});
$('#menu-toggle').onclick=()=>document.querySelector('#collection').scrollIntoView({behavior:'smooth'});$('#year').textContent=new Date().getFullYear();document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBag();$('#search-panel').classList.remove('open')}});updateBag();

// Interactive Three.js fashion preview. If a real GLB is added at /models/aurae-look.glb it replaces the procedural preview.
const stage=$('#three-stage');let scene,camera,renderer,controls,garment,raf,autoRotate=true;
function makeMannequin(){
 const group=new THREE.Group();const skin=new THREE.MeshStandardMaterial({color:0xaaa39a,metalness:.48,roughness:.38});const cloth=new THREE.MeshStandardMaterial({color:0x252525,metalness:.22,roughness:.62});
 const add=(geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;group.add(m);return m};
 add(new THREE.SphereGeometry(.19,32,24),skin,0,2.05,0,0.82,1.12,.82);
 add(new THREE.CylinderGeometry(.115,.15,.22,24),skin,0,1.78,0);
 add(new THREE.CylinderGeometry(.33,.29,.72,32,1,true),cloth,0,1.25,0,1,1,.58);
 add(new THREE.SphereGeometry(.34,32,20),cloth,0,1.55,0,1,.55,.58);
 add(new THREE.CylinderGeometry(.105,.08,.65,20),cloth,-.42,1.24,0,1,1,1);
 add(new THREE.CylinderGeometry(.105,.08,.65,20),cloth,.42,1.24,0,1,1,1);
 add(new THREE.SphereGeometry(.11,20,16),skin,-.42,.89,0);
 add(new THREE.SphereGeometry(.11,20,16),skin,.42,.89,0);
 add(new THREE.CylinderGeometry(.12,.1,.82,20),cloth,-.17,.48,0,1,1,1);
 add(new THREE.CylinderGeometry(.12,.1,.82,20),cloth,.17,.48,0,1,1,1);
 add(new THREE.CylinderGeometry(.12,.12,.09,20),skin,-.17,.02,0,1.2,.7,1.8);
 add(new THREE.CylinderGeometry(.12,.12,.09,20),skin,.17,.02,0,1.2,.7,1.8);
 garment=cloth;return group;
}
function initStudio(){
 try{
 scene=new THREE.Scene();scene.background=new THREE.Color(0x111111);camera=new THREE.PerspectiveCamera(35,stage.clientWidth/stage.clientHeight,.1,100);camera.position.set(0,1.5,5.6);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;stage.innerHTML='';stage.appendChild(renderer.domElement);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=3.5;controls.maxDistance=8;controls.target.set(0,1,0);controls.autoRotate=true;controls.autoRotateSpeed=.75;
 scene.add(new THREE.HemisphereLight(0xe9e4dc,0x28232a,2));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,5,4);scene.add(key);const rim=new THREE.PointLight(0x9b2635,18,8);rim.position.set(-2,2,1);scene.add(rim);const fill=new THREE.PointLight(0x8996ad,10,8);fill.position.set(2,1,-2);scene.add(fill);
 const model=makeMannequin();scene.add(model);const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,64),new THREE.MeshBasicMaterial({color:0x1b1b1b,transparent:true,opacity:.65}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;scene.add(floor);
 new GLTFLoader().load('/models/aurae-look.glb',g=>{scene.remove(model);const loaded=g.scene;loaded.scale.setScalar(1.6);loaded.position.y=-.05;scene.add(loaded)},undefined,()=>{});
 const tick=()=>{raf=requestAnimationFrame(tick);controls.update();renderer.render(scene,camera)};tick();
 new ResizeObserver(()=>{if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}).observe(stage);
 }catch(e){stage.innerHTML='<div class="model-loading">3D preview unavailable on this device.</div>';console.error(e)}
}
initStudio();
$('#rotate-toggle').onclick=()=>{autoRotate=!autoRotate;controls.autoRotate=autoRotate;$('#rotate-toggle').classList.toggle('active',autoRotate);$('#rotate-toggle').textContent=autoRotate?'↻ Auto rotate':'Ⅱ Auto rotate'};
$('#model-reset').onclick=()=>{camera.position.set(0,1.5,5.6);controls.target.set(0,1,0);controls.update()};
document.querySelectorAll('.swatch').forEach(b=>b.onclick=()=>{document.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');if(garment)garment.color.set(b.dataset.colour)});
window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));