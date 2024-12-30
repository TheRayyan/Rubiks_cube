document.addEventListener('drag',e=>e.preventDefault());
document.addEventListener('dragstart',e=>e.preventDefault());
document.addEventListener('mousedown',e=>e.preventDefault());




function multiply(a,b){

    if (a[0].length !== b.length) throw new RangeError('dimensional mismatch')
  
      const ans = [];
    for (let i=0; i<a.length; i++) ans[i] = [];
    
      for (let rowA=0; rowA<a.length; rowA++){
        for (let colB=0; colB<b[0].length; colB++){
          let val = 0;
          for (let i=0; i<a[0].length; i++){
            val += a[rowA][i] * b[i][colB];
        }
        ans[rowA][colB] = val;
      }
    }
    
    return ans;
  }
  
  const Rz = theta => [
      [Math.cos(theta), -Math.sin(theta),0,0],
      [Math.sin(theta), Math.cos(theta),0,0],
      [0, 0, 1,0],
      [0, 0, 0,1],
  ];

  const Ry = theta => [
      [Math.cos(theta), 0, Math.sin(theta),0],
      [0, 1, 0,0],
      [-Math.sin(theta), 0, Math.cos(theta),0],
    [0, 0, 0,1]
  ];

 const Rx = theta => [
      [1, 0, 0,0],
      [0, Math.cos(theta), Math.sin(theta),0],
      [0, -Math.sin(theta), Math.cos(theta),0],
    [0, 0, 0,1]
  ];

const mxLookup = {x: Rx, y: Ry, z: Rz};

function rotate(p, axis, theta){
      const vec = [[p.x], [p.y], [p.z]];
    const r = mxLookup[axis](theta);
    const result = multiply(r, vec);
    
    return ({
        x: result[0][0],
        y: result[1][0],
        z: result[2][0]
    })
  }
//////////////////////////////////



const orientations = {
  front:{
    normal: [[0],[0],[1],[1]],
    yaw: [1,0,0],
    pitch: [0,-1,0],
  },
  back:{
    normal: [[0],[0],[-1],[1]],
    yaw: [-1,0,0],
    pitch: [0,1,0],
  },
  left:{
    normal: [[-1],[0],[0],[1]],
    yaw: [0,0,1],
    roll: [0,-1,0],
  },
  right:{
    normal: [[1],[0],[0],[1]],
    yaw: [0,0,-1],
    roll: [0,1,0],
  },
  top:{
    normal: [[0],[-1],[0],[1]],
    pitch: [0,0,-1],
    roll: [1,0,0],
  },
  bottom:{
    normal: [[0],[1],[0],[1]],
    pitch: [0,0,1],
    roll: [-1,0,0],
  }
}



























//////////////////////////////////////////////////

const p = document.getElementById('perspective');


const colors = {
  r: 'red',
  g: 'lime',
  b: 'blue',
  o: 'orange',
  w: 'white',
  y: 'yellow'
}


const tform = {
  front: "rotateY(0deg)",
  left: "rotateY(-90deg)",
  right: "rotateY(90deg)",
  back: "rotateX(180deg)",
  top: "rotateX(90deg)",
  bottom: "rotateX(-90deg)",
}






function rotate(arr, direction = 'clockwise'){
  
  if (!(
    new Set(['clockwise', 'counterclockwise']).has(direction)
  )) throw 'err';
  
  const result = [];
  for (let i=0; i<arr[0].length; i++) result.push([]);
  
  for(let i=0; i<arr.length; i++){
    for(let j=0; j<arr[0].length; j++){
      const iPrime = 
            direction === 'counterclockwise' ? 
            arr[0].length - j - 1 :
            j;
      
      const jPrime = 
            direction === 'counterclockwise' ?
            i:
            arr.length - i - 1;
      
      result[iPrime][jPrime] = arr[i][j]
    }
  }
  return result;
}


class Rubix{
  constructor(){
    this.front = [
      [{color:'g'},{color:'g'},{color:'g'}],
      [{color:'g'},{color:'g'},{color:'g'}],
      [{color:'g'},{color:'g'},{color:'g'}]
    ]
    
    this.left = [
      [{color:'b'},{color:'b'},{color:'b'}],
      [{color:'b'},{color:'b'},{color:'b'}],
      [{color:'b'},{color:'b'},{color:'b'}]
    ]
    
    this.right = [
      [{color:'w'},{color:'w'},{color:'w'}],
      [{color:'w'},{color:'w'},{color:'w'}],
      [{color:'w'},{color:'w'},{color:'w'}]
    ]
    
    this.top = [
      [{color:'o'},{color:'o'},{color:'o'}],
      [{color:'o'},{color:'o'},{color:'o'}],
      [{color:'o'},{color:'o'},{color:'o'}]
    ]
    
    this.bottom = [
      [{color:'r'},{color:'r'},{color:'r'}],
      [{color:'r'},{color:'r'},{color:'r'}],
      [{color:'r'},{color:'r'},{color:'r'}]
    ]
    
    this.back = [
      [{color:'y'},{color:'y'},{color:'y'}],
      [{color:'y'},{color:'y'},{color:'y'}],
      [{color:'y'},{color:'y'},{color:'y'}]
    ]
    
    const container = document.createElement('div');
    container.id = 'container';
    p.appendChild(container);
    this.container = container;
    
   
    this.paint();
  }
  
  shiftLeft(){
    const prime = {
      front: this.left,
      top: rotate(this.top,'counterclockwise'),
      bottom: rotate(this.bottom, 'clockwise'),
      right: this.front,
      left: rotate(rotate(this.back,'clockwise'),'clockwise'),
      back: rotate(rotate(this.right,'clockwise'),'clockwise'),
    }

    Object.assign(this,prime);
  }
  
  shiftRight(){
    const prime = {
      front: this.right,
      top: rotate(this.top,'clockwise'),
      bottom: rotate(this.bottom, 'counterclockwise'),
      right: rotate(rotate(this.back,'clockwise'),'clockwise'),
      left: this.front,
      back: rotate(rotate(this.left,'clockwise'),'clockwise'),
    }

    Object.assign(this,prime);
  }
  
  shiftUp(){
    const prime = {
      front: this.top,
      top: this.back,
      bottom: this.front,
      right: rotate(this.right,'counterclockwise'),
      left: rotate(this.left,'clockwise'),
      back: this.bottom
    }

    Object.assign(this,prime);
  }
  
  shiftDown(){
    const prime = {
      front: this.bottom,
      top: this.front,
      bottom: this.back,
      right: rotate(this.right,'clockwise'),
      left: rotate(this.left,'counterclockwise'),
      back: this.top
    }
    Object.assign(this,prime);
  }
  
  rotate(dir){
    ['front', 'top', 'right', 'bottom', 'left']
      .forEach(d => this[d] = rotate(this[d], dir === 1 ? 'clockwise' : 'counterclockwise'));
    
    [this.top, this.right, this.bottom, this.left] = dir === 1 ?
      [this.left, this.top, this.right, this.bottom] :
      [this.right, this.bottom, this.left, this.top]
    
    this.back = rotate(this.back, dir === 1 ? 'counterclockwise' : 'clockwise')

  }
  
   vLeft(dir){
     let to = [this.back, this.bottom, this.front, this.top];
     if (dir === -1) to = revArr(to);
     
     const store = to[0].map(r => r[0]);
     for (let i=0; i<to.length-1;i++) for (let j=0; j<to[0].length; j++) to[i][j][0] = to[i+1][j][0];
     for (let j=0; j<to[0].length; j++) to[to.length - 1][j][0] = store[j]
     
     this.left = rotate(this.left, dir === -1 ? 'counterclockwise' : 'clockwise');
   }
  
   topMove(dir){
     this.rotate(-1);
     this.vLeft(dir);
     this.rotate(1);
   }
  
   bottomMove(dir){
     this.rotate(1);
     this.vLeft(-dir);
     this.rotate(-1);
   }
  
  rightMove(dir){
    this.rotate(1);
    this.rotate(1);
    this.vLeft(dir);
    this.rotate(-1);
    this.rotate(-1);
  }
  
  frontMove(dir){
    this.shiftRight();
    this.vLeft(dir);
    this.shiftLeft();
  }
  
  backMove(dir){
    this.shiftLeft();
    this.vLeft(dir);
    this.shiftRight();
  }
  
  paint(){
    this.container.innerHTML = "";
    this.paintFace('front');
    this.paintFace('top');
    this.paintFace('right');
    this.paintFace('bottom');
    this.paintFace('left');
    this.paintFace('back');
  }
  
  paintFace(face){
    const side = this[face];
    const sidel = document.createElement('div');
    sidel.classList.add('side');
    
    
    for (let i=0; i< side.length; i++){
      for (let j=0; j<side[0].length; j++){
        
        const pip = document.createElement('div');
        if (j===1 || i===1){ 
          pip.addEventListener('mousedown', dragRotate);
          pip.classList.add('grab')
        }else{
          pip.addEventListener('mousedown', pull(pip,face))
          pip.classList.add('move')
        }
        
        pip.classList.add('pip');
        //pip.style.background="black";
        pip.style.display="flex";
        pip.style['align-items']='center';
        pip.style['justify-content']='center';
        
        const front = document.createElement('div');
        front.classList.add('pip');
        front.style.background = colors[side[i][j].color];
        front.style.height = '80%';
        front.style.width = '80%';
        front.style['border-radius'] = '7px';
        front.style['transform'] = 'translateZ(.1px)';

        
        pip.appendChild(front);
        
        const back = document.createElement('div');
        back.classList.add('pip');
        back.style.background = '#222';
        back.style.position = 'absolute';
        back.style.left = 0;
        back.style.top = 0;
        back.style.transform = "rotateX(180deg)";
        back.style['backface-visibility'] = "visible !important";
        pip.appendChild(back);
       
       
        pip.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        pip.__ORIGINAL_TRANSFORM__ = tform[face];
        pip.style.transform = tform[face];
        sidel.appendChild(pip);
        side[i][j].element = pip;
      }
    }
    
    this.container.appendChild(sidel);
  }
  
  
  leftTheta(theta, dir){
    [this.top,this.front,this.bottom,this.back].forEach(side => {
      for (let i=0; i<side.length; i++) side[i][0].element.style.transform = `rotateX(${dir*theta}deg)` + side[i][0].element.__ORIGINAL_TRANSFORM__;
    })
    for (let i=0;i<this.left.length;i++){
      for (let j=0;j<this.left[0].length;j++){
        this.left[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.left[i][j].element.style.transform = this.left[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${-dir*theta}deg)`;
      }
    }
  }
  
  rightTheta(theta, dir){
    [this.top,this.front,this.bottom,this.back].forEach(side => {
      for (let i=0; i<side.length; i++) side[i][2].element.style.transform = `rotateX(${dir*theta}deg)` + side[i][2].element.__ORIGINAL_TRANSFORM__;
    })
    for (let i=0;i<this.right.length;i++){
      for (let j=0;j<this.right[0].length;j++){
        this.right[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.right[i][j].element.style.transform = this.right[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${dir*theta}deg)`;
      }
    }
  }
  
  
  
  frontTheta(theta, dir){
    for (let i=0; i<this.left.length; i++){
      this.left[i][2].element.style.transform = this.left[i][2].element.__ORIGINAL_TRANSFORM__ + `rotateX(${dir*theta}deg)`
    }
    
    for (let i=0; i<this.right.length; i++){
      this.right[i][0].element.style.transform = this.right[i][0].element.__ORIGINAL_TRANSFORM__ + `rotateX(${-dir*theta}deg)`
    }
    
    for (let i=0; i<this.top.length; i++){
      this.top[2][i].element.style.transform = this.top[2][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${dir*theta}deg)`
    }
    
    for (let i=0; i<this.bottom.length; i++){
      this.bottom[0][i].element.style.transform = this.bottom[0][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${-dir*theta}deg)`
    }
    
    
    for (let i=0;i<this.front.length;i++){
      for (let j=0;j<this.front[0].length;j++){
        this.front[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.front[i][j].element.style.transform = this.front[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${dir*theta}deg)`;
      }
    }
  }
  
  backTheta(theta, dir){
    for (let i=0; i<this.left.length; i++){
      this.left[i][0].element.style.transform = this.left[i][0].element.__ORIGINAL_TRANSFORM__ + `rotateX(${dir*theta}deg)`
    }
    
    for (let i=0; i<this.right.length; i++){
      this.right[i][2].element.style.transform = this.right[i][2].element.__ORIGINAL_TRANSFORM__ + `rotateX(${-dir*theta}deg)`
    }
    
    for (let i=0; i<this.top.length; i++){
      this.top[0][i].element.style.transform = this.top[0][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${dir*theta}deg)`
    }
    
    for (let i=0; i<this.bottom.length; i++){
      this.bottom[2][i].element.style.transform = this.bottom[2][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${-dir*theta}deg)`
    }
    
    
    for (let i=0;i<this.back.length;i++){
      for (let j=0;j<this.back[0].length;j++){
        this.back[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.back[i][j].element.style.transform = this.back[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${-dir*theta}deg)`;
      }
    }
  }
  
  topTheta(theta, dir){
    [this.front,this.left,this.right].forEach(side => {
      for (let i=0; i<side.length; i++) side[0][i].element.style.transform = `rotateY(${dir*theta}deg)` + side[0][i].element.__ORIGINAL_TRANSFORM__;
    })
    
    //back has to have two orientations;
    for(let i=0; i<3; i++){
        this.back[2][i].element.style.transform = this.back[2][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${-dir*theta}deg)`;
    }
    
    for (let i=0;i<this.top.length;i++){
      for (let j=0;j<this.top[0].length;j++){
        this.top[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.top[i][j].element.style.transform = this.top[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${-dir*theta}deg)`;
      }
    }
  }
  
  bottomTheta(theta, dir){
    [this.front,this.left,this.right].forEach(side => {
        for (let i=0; i<side.length; i++) side[2][i].element.style.transform = `rotateY(${dir*theta}deg)` + side[2][i].element.__ORIGINAL_TRANSFORM__;
      })

      //back has to have two orientations;
      for(let i=0; i<3; i++){
          this.back[0][i].element.style.transform = this.back[0][i].element.__ORIGINAL_TRANSFORM__ + `rotateY(${-dir*theta}deg)`;
      }
    
    for (let i=0;i<this.bottom.length;i++){
      for (let j=0;j<this.bottom[0].length;j++){
        this.bottom[i][j].element.style['transform-origin'] = `${150-j*100}px ${150-i*100}px -150px`;
        this.bottom[i][j].element.style.transform = this.bottom[i][j].element.__ORIGINAL_TRANSFORM__ + `rotateZ(${dir*theta}deg)`;
      }
    }
  }
  
  
  animateLeft(dir, turns=1){
    this.container.classList.add('animate');
    this.left[0][0].element.addEventListener('transitionend',()=>{
      for (let i=0;i<turns;i++) this.vLeft(-dir);
      this.container.classList.remove('animate');
      this.paint();
    },{once: true});
    
    setTimeout(()=>this.leftTheta(90*turns,dir),0);
  }
 
  
  
  
  animateRight(dir,turns=1){
    this.container.classList.add('animate');
    this.right[0][0].element.addEventListener('transitionend',()=>{
      for (let i=0;i<turns;i++) this.rightMove(dir);
      this.container.classList.remove('animate');
      this.paint();
    },{once: true});
    
    setTimeout(()=>this.rightTheta(90*turns,dir),0);
  }
  
  
  animateFront(dir,turns=1){
    this.container.classList.add('animate');
    this.front[0][0].element.addEventListener('transitionend',()=>{
      for(let i=0;i<turns;i++) this.frontMove(dir);
      this.container.classList.remove('animate');
      this.paint();
    },{once: true});
    
    setTimeout(()=>this.frontTheta(90*turns,dir),0);

    
  }
  
  
  animateBack(dir,turns=1){
    this.container.classList.add('animate');

    this.back[0][0].element.addEventListener('transitionend',()=>{
      this.container.classList.remove('animate');
      for(let i=0;i<turns;i++) this.backMove(-dir);
      this.paint();
    },{once: true}); 
    
    setTimeout(()=>this.backTheta(90*turns,dir),0);
  }
  
  
  
  animateTop(dir,turns=1){
    this.container.classList.add('animate');
    
    this.top[0][0].element.addEventListener('transitionend',()=>{
      this.container.classList.remove('animate');
      for(let i=0;i<turns;i++) this.topMove(-dir);
      this.paint();
    },{once: true}); 
    
    setTimeout(()=>this.topTheta(90*turns,dir),0);
  }
  
  animateBottom(dir,turns=1){
    this.container.classList.add('animate');
    
    this.bottom[0][0].element.addEventListener('transitionend',()=>{
      this.container.classList.remove('animate');
      for(let i=0;i<turns;i++) this.bottomMove(-dir);
      this.paint();
    },{once: true}); 
    
    setTimeout(()=>this.bottomTheta(90*turns,dir),0);  
  }
}






function revArr(arr){
  const result = [];
  for (let i=arr.length-1; i>=0; i--) result.push(arr[i]);
  return result;
}

function flatten(arr){
  let result = [];
  if (!Array.isArray(arr)) return arr;
  for (let i=0; i<arr.length; i++) result = result.concat(flatten(arr[i]));
  return result;
}

const cube = new Rubix();

/////////////////////////////////////////

let mx = [
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,1]
]

let inv = [
  [1,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,1]
]


//////////////////////////////

function mxToCSS(mx){
  let result = [];
  for(let i=0;i<4; i++){
    for(let j=0;j<4; j++){
      result.push(mx[j][i]);
    }
  }
  return result.join(',')
}

const rot = multiply(Ry(Math.PI/3),Rx(Math.PI/5));
const invrot = multiply(Rx(-Math.PI/5),Ry(-Math.PI/3));

mx = multiply(rot,mx);
inv = multiply(inv, invrot);

document.getElementById('container').style.transform = `matrix3d(${mxToCSS(mx)})translateZ(150px)`;
/////////////////////////////////////////

let delx = 0;
let dely = 0;


function dragRotate(e){
    document.body.classList.add('grabbing');
  
    let [x,y] = [e.clientX, e.clientY];
  function move(e){
    delx = (e.clientX - x);
    dely = (e.clientY - y);
    
    const rotation = multiply(Ry(delx*.005),Rx(dely*.005));
    const reverse = multiply(Rx(-dely*.005),Ry(-delx*.005));
    mx = multiply(rotation,mx);
    inv = multiply(inv,reverse);

    
    
    
    document.getElementById('container').style.transform = `matrix3d(${mxToCSS(mx)})translateZ(150px)`;
    x = e.clientX;
    y = e.clientY;
  }
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', ()=>{
    document.removeEventListener('mousemove', move);
    document.body.classList.remove('grabbing');
  },{once: true})
}






// setTimeout(() => cube.animateFront(1), 3000);
// setTimeout(() => cube.animateLeft(1), 5000);
// setTimeout(() => cube.animateBottom(-1), 7000);
// setTimeout(() => cube.animateTop(1), 9000);
// setTimeout(() => cube.animateBack(1), 11000);
// setTimeout(() => cube.animateRight(1), 13000);
// setTimeout(() => cube.animateBottom(1), 15000);
// setTimeout(() => cube.animateTop(-1), 17000);
// setTimeout(() => cube.animateRight(-1), 19000);
// setTimeout(() => cube.animateLeft(-1), 21000);
// setTimeout(() => cube.animateBack(-1), 23000);
// setTimeout(() => cube.animateFront(-1), 25000);





function getProjection(normal,x,y){
    const a = normal[0][0];
    const b = normal[1][0];
    const c = normal[2][0];
    const d = -150;
    
    const p = 1000;
    
    const z = (-a*x*p - b*y*p - d*p)/(c*p - a*x - b*y);
    const realX = (p - z) / p *x;
    const realY = (p - z) / p *y;
    
    return multiply(inv,[[realX],[realY],[z],[1]])
}

function pull(pip,face){
  return function(e){
    if (cube.container.classList.contains('animate')){
      console.log('wait');
      return;
    }
    
    let func = undefined;
    let vecName = undefined;
    let sideName = undefined;
    let lastRotation = undefined;
    
    const {normal} = orientations[face];

    const newNormal = multiply(mx,normal);
    const x = e.clientX - window.innerWidth/2; //todo: change to use bounding box of container.
    const y = e.clientY - window.innerHeight/2;
    
    const p_init_flat = [x,y];
    const p_init = getProjection(newNormal,x,y);
    const moves = {};
    
    moves.yaw = p_init[1] > 0 ? 'bottom' : 'top';
    moves.pitch = p_init[0] > 0 ? 'right' : 'left'; 
    moves.roll = moves.roll = p_init[2] > 0 ? 'front' : 'back';

    
    
    function move(e){
      const x = e.clientX - window.innerWidth/2;
      const y = e.clientY - window.innerHeight/2;
      
      const p = getProjection(newNormal,x,y);
      
      const delta = [
        p[0][0]-p_init[0][0],
        p[1][0]-p_init[1][0],
        p[2][0]-p_init[2][0]
      ];
       
      
      if (func){
        //this gross code puts the unit vec from start point into 2d screen space
        //then compares to actual 2d delta vec to get "usable" component.
        //compared to prev, where usable component is calculated in 3d space
        //rotation speed is much more intuitive because even when faces are nearly
        //orthogonal to the screen, there's no *surprise* z that makes the vector huge.
        //note that original calculation for which move was intended is still in 3d space.
        //this is because projecting the moves onto the 3d plane actually gives much more
        //precise detection of the user's intention than it would in 2d space.
        //Ends up being a weird dual computation, but the UX is much nicer.
        
        //NOTE: if a user tries to drag before the 1s animation has elapsed, things get bonked.
        //Need to LOCK the object while animation is occuring to prevent race conditions.
        let unit = orientations[face][vecName];
        unit = [[unit[0]],[unit[1]],[unit[2]],[1]];
        unit = multiply(mx,unit);
        const p_next = [p_init[0][0]+unit[0][0],p_init[1][0]+unit[1][0],p_init[2][0]+unit[2][0]];
        const P0 = [
          p_init[0]*1000/(1000-p_init[2]),
          p_init[1]*1000/(1000-p_init[2])
        ]

        const P1 = [
          p_next[0]*1000/(1000-p_next[2]),
          p_next[1]*1000/(1000-p_next[2])
        ]

        const dir = [P1[0]-P0[0], P1[1]-P0[1]];
        const actual = [x-p_init_flat[0],y-p_init_flat[1]];
        const VAL = (actual[0]*dir[0] + actual[1]*dir[1])/Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]) * .5;
        
        func(VAL,1);
        lastRotation = VAL;
        return;
      }
      
       if (mag2(delta) < 80) return;
      
      const options = [];
      
      ['roll','pitch','yaw'].forEach(vecName => {
        const vec = orientations[face][vecName];
        if (!vec) return;
        options.push({name:vecName, val: scalarProj(delta,vec)})
      })
      
      let max = undefined;

      options.forEach(option => {
        if (typeof max === 'undefined'){max = option; return;}
        if (Math.abs(option.val) > Math.abs(max.val)) max = option;
      });
      
      vecName = max.name;
      
      let unit = orientations[face][vecName];
      unit = [[unit[0]],[unit[1]],[unit[2]],[1]];
      unit = multiply(mx,unit);
      const p_next = [p_init[0][0]+unit[0][0],p_init[1][0]+unit[1][0],p_init[2][0]+unit[2][0]];
      const P0 = [
        p_init[0]*1000/(1000-p_init[2]),
        p_init[1]*1000/(1000-p_init[2])
      ]
      
      const P1 = [
        p_next[0]*1000/(1000-p_next[2]),
        p_next[1]*1000/(1000-p_next[2])
      ]
      
      const dir = [P1[0]-P0[0], P1[1]-P0[1]];
      const actual = [x-p_init_flat[0],y-p_init_flat[1]];
      const VAL = (actual[0]*dir[0] + actual[1]*dir[1])/Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1])*.5;
      
      
      sideName = moves[vecName];
      
      func = cube[`${moves[vecName]}Theta`].bind(cube);
      func(VAL,1); //TODO TODO TODO : make this not projected - use absval of mag of delta times dir of max.val.
      lastRotation = VAL;
      
    }
    
    document.addEventListener('mousemove',move);
    document.addEventListener('mouseup', ()=>{
      document.removeEventListener('mousemove', move);
      if (!sideName) return;

      const cap = sideName[0].toUpperCase() + sideName.slice(1);
      const snapTheta = Math.round((lastRotation/90));
      const animate = cube[`animate${cap}`].bind(cube);
      animate(snapTheta < 0 ? -1 : 1,Math.abs(snapTheta))
      
      
    },{once: true})
  }
}

function dotprod(a,b){
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

function mag2(vec){
  return vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]
}

function scalarProj(a,unitVec){
  return dotprod(a,unitVec);
}
