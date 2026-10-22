import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export const FINISHES={'Matte black':[0x1b1b1d,.45,'#1b1b1d'],'Brushed gold':[0xd4af37,.22,'#d4af37'],'Chrome':[0xf2f2f2,.05,'#e9e9e9'],'Gunmetal':[0x5b6068,.3,'#5b6068']};
export function createShowroom(canvas,ui){
const offs=[],on=(t,e,f)=>{t.addEventListener(e,f);offs.push(()=>t.removeEventListener(e,f))};let raf;
const cv=canvas;let R;
try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true})}catch(e){}
if(!R){ui.onNoGL&&ui.onNoGL();return null}
R.setPixelRatio(Math.min(devicePixelRatio,1.75));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;R.outputEncoding=THREE.sRGBEncoding;R.setClearColor(0x050506);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(34,1,.05,60);S.fog=new THREE.Fog(0x050506,9,24);
// studio reflections
const es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(40,24,12),new THREE.MeshBasicMaterial({color:0x17171a,side:THREE.BackSide})));
[[0,25,0,40,1,40,4],[-25,8,6,1,18,28,3],[25,5,-8,1,14,24,3],[0,5,30,30,10,1,2]].forEach(([x,y,z,w,h,d,i])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.95,.88).multiplyScalar(i)}));m.position.set(x,y,z);es.add(m)});
const ENV=new THREE.PMREMGenerator(R).fromScene(es,.02).texture;
const mat=(c,m,r,e=1,x={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,metalness:m,roughness:r,envMap:ENV,envMapIntensity:e},x));
function tex(w,h,fn,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;t.encoding=THREE.sRGBEncoding;return t}
const rnd=Math.random;
const stone=tex(512,512,x=>{x.fillStyle='#2b2d31';x.fillRect(0,0,512,512);for(let i=0;i<5000;i++){x.fillStyle='rgba('+(rnd()<.5?'255,255,255':'0,0,0')+','+rnd()*.07+')';x.fillRect(rnd()*512,rnd()*512,rnd()*3+1,rnd()*3+1)}
 x.lineWidth=1.2;for(let i=0;i<7;i++){x.strokeStyle='rgba(255,255,255,'+(.04+rnd()*.06)+')';x.beginPath();x.moveTo(rnd()*512,0);x.bezierCurveTo(rnd()*512,170,rnd()*512,340,rnd()*512,512);x.stroke()}},3,1.6);
const wood=tex(256,256,x=>{x.fillStyle='#c3a070';x.fillRect(0,0,256,256);for(let i=0;i<180;i++){x.fillStyle='rgba('+(rnd()<.5?'90,60,30':'255,235,200')+','+rnd()*.12+')';x.fillRect(rnd()*256,0,rnd()*2+.5,256)}},1,1);
const tile=tex(256,256,x=>{x.fillStyle='#17181b';x.fillRect(0,0,256,256);for(let i=0;i<2500;i++){x.fillStyle='rgba(255,255,255,'+rnd()*.04+')';x.fillRect(rnd()*256,rnd()*256,2,2)}x.fillStyle='#09090a';x.fillRect(0,0,256,3);x.fillRect(0,0,3,256)},7,7);
const metals=[],metal=()=>{const m=mat(0xd4af37,1,.22,1.5);metals.push(m);return m};
const MT=metal(),dk=mat(0x0c0c0e,.6,.35,1),cer=mat(0xf4f1ec,0,.1,1.1,{side:THREE.DoubleSide});
const RB=(w,h,d,r)=>new RoundedBoxGeometry(w,h,d,3,r),B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),Cy=(a,b,h,s=32,o=false)=>new THREE.CylinderGeometry(a,b,h,s,1,o);
const add=(geo,m,x=0,y=0,z=0,p=S)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o};
const tube=(p,r,s=48)=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p.map(v=>new THREE.Vector3(...v))),s,r,16);
// room
add(new THREE.PlaneGeometry(16,8),mat(0xb4b4b4,.1,.5,.5,{map:stone}),0,4,-1.75).receiveShadow=true;
const fl=add(new THREE.PlaneGeometry(16,16),mat(0xffffff,.45,.16,1,{map:tile}),0,0,3);fl.rotation.x=-Math.PI/2;
const slat=mat(0x1b1b1e,.2,.55,.6);for(let i=0;i<14;i++)add(RB(.1,3.8,.09,.01),slat,-4.4+i*.16,1.9,-1.69);
// vanity
const wd=mat(0xe3c9a4,0,.5,.4,{map:wood});add(RB(2.2,.7,1,.015),wd,0,1,-1.25);
const gap=new THREE.MeshBasicMaterial({color:0x1a120a});
add(B(2.2,.008,.01),gap,0,1.0,-.748);add(B(.008,.7,.01),gap,0,1,-.748);
[-.55,.55].forEach(x=>add(B(.5,.018,.014),gap,x,1.27,-.748));
add(B(2,.012,.03),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.78,.45).multiplyScalar(1.4)}),0,.645,-.9);
const sh=new THREE.Shape();sh.moveTo(-1.2,-.55);sh.lineTo(1.2,-.55);sh.lineTo(1.2,.55);sh.lineTo(-1.2,.55);
const hole=new THREE.Path();hole.absellipse(0,0,.6,.36,0,Math.PI*2,true);sh.holes.push(hole);
const top=add(new THREE.ExtrudeGeometry(sh,{depth:.1,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:3,curveSegments:48}),cer,0,1.35,-1.2);top.rotation.x=-Math.PI/2;
const bowl=add(new THREE.SphereGeometry(1,48,24,0,Math.PI*2,Math.PI/2,Math.PI/2),cer,0,1.45,-1.2);bowl.scale.set(.6,.3,.36);
add(Cy(.05,.05,.02),MT,0,1.16,-1.2);
// mixer
const tap=new THREE.Group();tap.position.set(0,1.45,-1.58);S.add(tap);
add(Cy(.075,.085,.04),MT,0,.02,0,tap);add(Cy(.035,.04,.34),MT,0,.21,0,tap);
add(tube([[0,.34,0],[0,.42,0],[0,.44,.12],[0,.4,.28],[0,.33,.38]],.03),MT,0,0,0,tap);
add(Cy(.034,.03,.03),MT,0,.315,.38,tap);const lv=add(B(.15,.022,.022),MT,.1,.3,0,tap);lv.rotation.z=.25;
// mirror with LED halo
add(B(1.66,1.26,.01),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.74,.42).multiplyScalar(1.15)}),0,2.45,-1.745);
add(RB(1.6,1.2,.04,.012),dk,0,2.45,-1.72);const mir=new Reflector(new THREE.PlaneGeometry(1.5,1.1),{clipBias:.003,textureWidth:768,textureHeight:560,color:0xb0b0b0});
mir.position.set(0,2.45,-1.69);S.add(mir);
// pendants
const pend=[];[[2,2.35],[2.4,2.7]].forEach(([x,y])=>{add(Cy(.004,.004,4.6-y),dk,x,(4.6+y)/2,-1.2);add(Cy(.05,.05,.5),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.82,.55).multiplyScalar(1.6)}),x,y,-1.2);
 const l=new THREE.PointLight(0xffc880,1,6);l.position.set(x,y-.3,-1.1);S.add(l);pend.push(l)});
add(RB(1,.04,.26,.01),dk,-1.9,1.9,-1.62);
[[-2.2,.26,0xcfc6b4],[-2.05,.2,0x2a2a2e],[-1.9,.32,0xb8a78a]].forEach(([x,h,c])=>add(Cy(.04,.04,h,24),mat(c,.1,.35,.8),x,1.92+h/2,-1.62));
const tw=add(Cy(.07,.07,.5,24),mat(0xcfd8e0,0,.9,.2),-1.6,1.99,-1.62);tw.rotation.z=Math.PI/2;
add(Cy(.14,.1,.5,32),mat(0x2b2b2e,.2,.5,.6),2.1,.25,-1.4);
for(let i=0;i<6;i++)add(tube([[2.1,.5,-1.4],[2.1+Math.sin(i)*.12,.9,-1.4+Math.cos(i)*.08],[2.1+Math.sin(i)*.3,1.35+i*.04,-1.4+Math.cos(i)*.15]],.006,12),mat(0x6b5236,0,.8,.3));
const BT=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
const blob=(w,h,x,y,z,rx,o)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:BT,transparent:true,opacity:o,depthWrite:false}));m.position.set(x,y,z);m.rotation.x=rx;S.add(m)};
blob(16,.9,0,.3,-1.74,0,.4);blob(2.9,1.2,0,.56,-1.74,0,.5);blob(2.6,1.4,0,.004,-1.25,-Math.PI/2,.4);
blob(.7,.7,2.1,.004,-1.4,-Math.PI/2,.65);blob(.4,.4,0,1.452,-1.58,-Math.PI/2,.5);blob(1.4,.4,-1.9,1.83,-1.74,0,.45);
const led=new THREE.PointLight(0xffdca8,.9,4.5);led.position.set(0,2.45,-1.3);S.add(led);
const key=new THREE.DirectionalLight(0xfff1de,.9);key.position.set(1.5,4.5,3.5);key.target.position.set(0,1.3,-1.4);S.add(key,key.target);
key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-3,right:3,top:3,bottom:-1,near:.5,far:14});key.shadow.bias=-.0005;key.shadow.radius=5;
S.add(new THREE.HemisphereLight(0x8a93a8,0x2a2018,.5));const fill=new THREE.DirectionalLight(0xaab4c8,.45);fill.position.set(-3,2.5,5);S.add(fill);const ug=new THREE.PointLight(0xffc880,.8,3);ug.position.set(0,.5,-1.1);S.add(ug);
// water
const stream=new THREE.Mesh(Cy(.013,.02,.61,16,true),mat(0xcfeeff,0,.05,2,{transparent:true,opacity:.5}));stream.position.set(0,1.475,-1.2);S.add(stream);
const DOT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
function pts(n,size,col,bl,op){const p=new Float32Array(n*3),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({map:DOT,color:col,size,transparent:true,opacity:op,blending:bl,depthWrite:false}));o.frustumCulled=false;S.add(o);return{o,p,g}}
const wp=pts(110,.03,0xdff4ff,THREE.AdditiveBlending,.9),sp=pts(60,.035,0xdff4ff,THREE.AdditiveBlending,.8),st=pts(40,.26,0xffffff,THREE.NormalBlending,0);
const rip=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.TorusGeometry(.05,.004,6,40),new THREE.MeshBasicMaterial({color:0xdff4ff,transparent:true}));m.rotation.x=Math.PI/2;m.position.set(0,1.19,-1.2);S.add(m);return m});
// ui state
const F=FINISHES;
let wOn=false,auto=false,rinse=0,flow=0,temp=38;
function setFin(k){const f=F[k];if(!f)return;metals.forEach(m=>{m.color.setHex(f[0]);m.roughness=f[1]})}
const tc=new THREE.Color(),cold=new THREE.Color(0x8fd0ff),mid=new THREE.Color(0xdff4ff),hot=new THREE.Color(0xffb27a);
function setTemp(v){temp=v;tc.copy(temp<30?cold.clone().lerp(mid,(temp-15)/15):mid.clone().lerp(hot,(temp-30)/15));stream.material.color.copy(tc);wp.o.material.color.copy(tc);sp.o.material.color.copy(tc)}
setFin('Brushed gold');setTemp(38);
// camera
const smooth=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x)};
function kf(arr,p){for(let i=1;i<arr.length;i++)if(p<=arr[i][0]||i===arr.length-1){const a=arr[i-1],b=arr[i],t=smooth(a[0],b[0],p);return a[1].map((v,k)=>v+(b[1][k]-v)*t)}}
const CP=[[0,[1.8,2,8.5]],[.265,[.5,1.95,2.5]],[.5,[-1,1.62,.35]],[.735,[1.05,1.95,.55]],[1,[0,2,5.2]]];
const CT=[[0,[0,1.5,-1.5]],[.265,[0,1.55,-1.3]],[.5,[0,1.55,-1.3]],[.735,[0,1.65,-1.4]],[1,[0,1.55,-1.4]]];
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);C.aspect=w/h;C.fov=w/h<1?46:34;C.updateProjectionMatrix()}
on(window,'resize',size);size();
let ox=0,oy=0,down=false,lx=0,ly=0;
on(cv,'pointerdown',e=>{down=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
on(window,'pointerup',()=>down=false);
on(cv,'pointermove',e=>{if(down){ox=Math.max(-.8,Math.min(.8,ox-(e.clientX-lx)*.006));oy=Math.max(-.25,Math.min(.35,oy+(e.clientY-ly)*.003));lx=e.clientX;ly=e.clientY}});
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const {story,chs,d3,d4,lbs,load}=ui;
let spP=0,t0=null,dt=0,last=0;
const v=new THREE.Vector3(),tg=new THREE.Vector3();
function frame(t){raf=requestAnimationFrame(frame);t*=.001;if(t0===null)t0=t;const el=t-t0;dt=Math.min(.05,t-last);last=t;
 if(el>.8&&load)load.classList.add('off');
 const max=story.offsetHeight-innerHeight,p=max>0?Math.min(1,scrollY/max):0;if(scrollY>max+innerHeight*1.1)return;
 spP+=(p-spP)*(calm?1:.075);const q=spP;
 // lights come on
 const on=calm?1:1-Math.pow(1-Math.min(1,el/2.8),3);R.toneMappingExposure=.2+.95*on;pend.forEach(l=>l.intensity=on);led.intensity=.9*on;
 // camera
 const cp=kf(CP,q),ct=kf(CT,q),f=C.aspect<1?1.5:1;
 tg.set(...ct);v.set(...cp).sub(tg).multiplyScalar(f);
 if(!down){ox*=.96;oy*=.96}
 const ca=Math.cos(ox),sa=Math.sin(ox),sway=calm?0:Math.sin(t*.35)*.05;
 C.position.set(tg.x+v.x*ca+v.z*sa+sway,tg.y+v.y+oy*v.length(),tg.z-v.x*sa+v.z*ca);C.lookAt(tg);
 // overlay + docks
 const bh=(1-smooth(0,.1,q))*9;lbs.forEach(b=>b.style.height=bh+'svh');
 const a3=smooth(.38,.44,q)*(1-smooth(.58,.64,q)),a4=smooth(.64,.7,q)*(1-smooth(max,max+innerHeight*.4,scrollY));
 d3.style.opacity=a3;d3.style.pointerEvents=a3>.2?'auto':'none';d4.style.opacity=a4;d4.style.pointerEvents=a4>.2?'auto':'none';
 if(!auto&&q>.44){auto=true;wOn=true;ui.onAutoWater&&ui.onAutoWater()}
 chs.forEach(c=>{const r=c.getBoundingClientRect(),d=(r.top+r.height*.5-innerHeight*.5)/innerHeight;c.style.opacity=Math.max(0,Math.min(1,1.3-Math.abs(d)*1.8))});
 // water
 if(rinse>0)rinse-=dt;
 flow+=(((wOn||rinse>0)?1:0)-flow)*Math.min(1,dt*7);
 const fw=flow*(rinse>0?1.7:1),vis=flow>.02;
 stream.visible=vis;stream.scale.set(fw,1,fw);stream.material.opacity=.5*Math.min(1,flow);
 wp.o.visible=sp.o.visible=vis;
 if(vis){for(let i=0;i<110;i++){const k=(i/110+t*1.8)%1;wp.p[i*3]=Math.sin(i*12.9)*.012*fw;wp.p[i*3+1]=1.78-.61*k;wp.p[i*3+2]=-1.2+Math.cos(i*7.1)*.012*fw}wp.g.attributes.position.needsUpdate=true;
  for(let i=0;i<60;i++){const k=(i/60+t*1.3)%1,a=i*2.4,r=k*.28*fw;sp.p[i*3]=Math.cos(a)*r;sp.p[i*3+1]=1.17+.12*Math.sin(k*Math.PI)*fw;sp.p[i*3+2]=-1.2+Math.sin(a)*r*.6}sp.g.attributes.position.needsUpdate=true}
 const sv=Math.max(0,Math.min(1,(temp-34)/10))*flow;st.o.visible=sv>.02;st.o.material.opacity=.22*sv;
 if(sv>.02){for(let i=0;i<40;i++){const k=(i/40+t*.14)%1;st.p[i*3]=Math.sin(i*5+t)*.18*k;st.p[i*3+1]=1.5+k*.55;st.p[i*3+2]=-1.2+Math.cos(i*3+t)*.1*k}st.g.attributes.position.needsUpdate=true}
 rip.forEach((m,i)=>{const k=(t*.8+i*.5)%1;m.visible=vis;m.scale.set(1+k*9,1+k*9,1);m.material.opacity=(1-k)*.7*flow});
 R.render(S,C)}
raf=requestAnimationFrame(frame);
return{setFin,setTemp,setWater:v=>{wOn=v},rinse:()=>{rinse=2.6},dispose(){cancelAnimationFrame(raf);mir.getRenderTarget().dispose();offs.forEach(f=>f());R.dispose()}};
}
