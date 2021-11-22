
import * as THREE from 'https://threejs.org/build/three.module.js';

var $hamburger = $('.button');
gsap.set('.navwrapper',{y:1000});  
gsap.set('.navitem',{opacity:0, y:50});  
gsap.set('.sm_menu',{opacity:0})

// var hamburgerMotion = new gsap.timeline()
// .to('.navitems', {opacity: 1, y: -20,  duration:.5, delay:.3, stagger: .1,},0)
// .to('.line_menu', {scaleY:1,  delay: 0, duration:.5  },0)
// .to('.sm_menu', {opacity:100,  delay:0, duration:.5  },0)

// .reverse()

// $hamburger.on('click', function(e) {
//   hamburgerMotion.reversed(!hamburgerMotion.reversed());
// });

const menucanvas = document.getElementById("fullscreen");

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, {
			value: value,
			enumerable: true,
			configurable: true,
			writable: true,
		});
	} else {
		obj[key] = value;
	}
	return obj;
}
const bounds = {
	ww: window.innerWidth,
	wh: window.innerHeight,
};

class Transition {
	constructor() {
		_defineProperty(
			this,
			"render",

			() => {
				this.renderer.render(this.scene, this.camera);
			}
		);
		_defineProperty(
			this,
			"out",

			() => {
				this.animating = true;
				this.reverse = true;

				const { uProgress } = this.mat.uniforms;

				gsap.timeline({
					paused: true,
					defaults: { duration: 1.25, ease: "power3.inOut" },
				})

					.to(
						uProgress,
						{
							value: 1,
							onUpdate: () => this.render(),
						},
						0
					)
					.to(
						this.bend(),
						{
							progress: 1,
						},
						0
					)
					.to('.navwrapper', {opacity: 1, y:0,  duration:0, stagger: .1, delay:.5,},0)
					.to('.navitem', {opacity: 1, y:0,  duration:.5, delay:.4, stagger: .1,},0)
					.to('.sm_menu', {opacity:100,  delay:0, duration:.5  },0)

					.add(() => {
						this.animating = false;
					})
					
					.play();
			}
		);
		_defineProperty(
			this,
			"in",

			() => {
				this.animating = true;
				this.reverse = false;

				const { uProgress, uOut } = this.mat.uniforms;


				gsap.timeline({
					paused: true,
					defaults: { duration: 1.25, delay:2, ease: "power3.inOut" },
				})
					.clear()
					.set(uOut, { value: false })
					.to(
						uProgress,
						{
							value: 0,
							onUpdate: () => this.render(),
						},
						0
					)
					.to(
						this.bend(),
						{
							progress: 1,
						},
						0
					)
					.to('.navitem', {opacity: 0, y:50,   duration:.5, delay:0,},0)
					.to('.sm_menu', {opacity:0,  delay:0, duration:.5  },0)
					.to('.navwrapper', {opacity: 1, y:-1000,  duration:0, delay:.8,},0)

					.set(uOut, { value: true })
					.add(() => {
						this.animating = false;
					})
					.play();
			}
		);
		_defineProperty(
			this,
			"bend",

			() => {
				const { uPower } = this.mat.uniforms;

				return gsap
					.timeline({
						paused: true,
						defaults: {
							ease: "linear",
							duration: 0.5,
						},
					})
					.to(uPower, { value: 1 })
					.to(uPower, { value: 0 });
			}
		);
		_defineProperty(
			this,
			"resize",

			() => {
				const { ww, wh } = bounds;

				this.camera.left = ww / -2;
				this.camera.right = ww / 2;
				this.camera.top = wh / 2;
				this.camera.bottom = wh / -2;
				this.camera.updateProjectionMatrix();

				this.renderer.setSize(ww, wh);

				this.triangle.scale.set(ww / 2, wh / 2, 1);
			}
		);
		const { ww: _ww, wh: _wh } = bounds;
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setPixelRatio(1);
		this.renderer.setSize(_ww, _wh);
		this.renderer.setClearColor(0xffffff, 0);
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera(
			_ww / -2,
			_ww / 2,
			_wh / 2,
			_wh / -2,
			1,
			100
		);
		this.camera.lookAt(this.scene.position);
		this.camera.position.z = 1;
		menucanvas.appendChild(this.renderer.domElement);
		this.geo = new THREE.BufferGeometry();
		const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
		const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
		this.geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
		this.geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
		this.mat = new THREE.ShaderMaterial({
			vertexShader: `
          precision highp float;
          varying vec2 vUv;
  
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `,
			fragmentShader: `   precision highp float;

			uniform float uProgress;
			uniform float uPower;
  
			uniform bool uOut;
  
			vec4 transparent = vec4(0., 0., 0., 0.);
		  vec4 black = vec4(1.0, 1.0, 1.0, 1.);

  
			#define M_PI 3.1415926535897932384626433832795
  
			varying vec2 vUv;
  
			void main() {
			  vec2 uv = vUv;
  
			  uv.y -= ((sin(uv.x * M_PI) * uPower) * .25);
  
			  if (!uOut) uv.y = 1. - uv.y;
  
			  float t = smoothstep(uv.y - fwidth(uv.y), uv.y, uProgress);
			  vec4 color = mix(transparent, black, t);
  
			  gl_FragColor = color;
			}
		  `,
			uniforms: {
				uProgress: { value: 0 },
				uPower: { value: 0 },
				uOut: { value: true },
			},
		});
		this.triangle = new THREE.Mesh(this.geo, this.mat);
		this.triangle.scale.set(_ww / 2, _wh / 2, 1);
		this.triangle.frustumCulled = false;
		this.scene.add(this.triangle);
		this.tl = gsap.timeline({
			paused: true,
			defaults: { duration: 1.25, ease: "power3.inOut" },
		});
		this.addEvents();
	}
	addEvents() {
		document.querySelector(".button").addEventListener("click", () => {
			this.reverse ? this.in() : this.out();
		});

		$(".navitem").click(() => {
			
			this.reverse ? this.in() : this.out();

		});

		document.addEventListener("load", function () {
			this.out();
		});
	}
}
const transition = new Transition();
window.addEventListener("resize", () => {
	bounds.ww = window.innerWidth;
	bounds.wh = window.innerHeight;
	transition.resize();
});


/*--------------------
   Touch
   --------------------*/
let touchStart = 0;
let touchY = 0;
let isDragging = false;
const handleTouchStart = (e) => {
	touchStart = e.clientY || e.touches[0].clientY;
	isDragging = true;
	$menu.classList.add("is-dragging");
};
const handleTouchMove = (e) => {
	if (!isDragging) return;
	touchY = e.clientY || e.touches[0].clientY;
	scrollY += (touchY - touchStart) * 2.5;
	touchStart = touchY;
};
const handleTouchEnd = () => {
	isDragging = false;
	$menu.classList.remove("is-dragging");
};

/*--------------------
    Render
    --------------------*/
const render = () => {
	requestAnimationFrame(render);

};



render();