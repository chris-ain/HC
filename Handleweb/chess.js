 
import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';


var Composer;
let stats, fxaaPass;
const objects = [];
const selects = [];
let gui;
const spheres = [];

export var id;
export  var scene;
export var expModel;

export function chessScene(smoothScroll) {



    //===================================================== canvas
    const chessCanvas = document.getElementById("chess");

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true, canvas: chessCanvas});
    renderer.setSize(window.innerWidth, window.innerHeight);

    //===================================================== scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xf7f7f7, 0.005 );

    // ////
    // const paramsts = {
    //   exposure: .1,
    //   bloomStrength: .8,
    //   bloomThreshold: 0,
    //   bloomRadius: 0
    // };
    let tooLazyToHandleLoadingProperly = 0;
    const loadingLol = () => tooLazyToHandleLoadingProperly++;
    const ENV_URL = "https://uploads-ssl.webflow.com/612d2c01db57a270ec502b3f/617481136662332a5d3e39bb_gregzaal-venicedawn-1.jpg";
    const reflectionCube = new THREE.TextureLoader().load(ENV_URL, loadingLol);
    const refractionCube = new THREE.TextureLoader().load(ENV_URL, loadingLol);
    reflectionCube.mapping = THREE.EquirectangularReflectionMapping;
    refractionCube.mapping = THREE.EquirectangularRefractionMapping;
    scene.environment = reflectionCube;
    // texLoader = new THREE.TextureLoader();
    // var normal = texLoader.load( 'https://uploads-ssl.webflow.com/612d2c01db57a270ec502b3f/61885cd22ccdfed3d95febbf_download.jpg');

    //===================================================== camera
    
    const transmissionoptions = {
 
      transmission: 1,
      thickness: 15,
      roughness: 0.2,
      envMapIntensity: 2.6,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      // normalScale: .31,
      // clearcoatNormalScale: 0,
      // normalRepeat: 1
    };
    
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 1.5;




    //===================================================== lights
   
   
   
    var lightamb = new THREE.AmbientLight(0xf7f7f7, 0.1);
    scene.add(lightamb);
    var light2 = new THREE.DirectionalLight(0xef7f7f7);
    light2.position.set(1, 1, .1).normalize();
    scene.add(light2);
    light2.shadow.camera = new THREE.OrthographicCamera(
      100,
      100,
      100,
      100,
      0.1,
      0.1
    );
    light2.castShadow = true;
    var light3 = new THREE.SpotLight(0xf7f7f7, .1);
    light3.position.set(-1, -1, -1).normalize();
    scene.add(light3);
    
    const paramst = {
			enableSSRr: true,
			autoRotate: true,
      exposure: 1,
				bloomStrength: 1.5,
				bloomThreshold: 0,
				bloomRadius: 0
		};


    const groupBubbles = new THREE.Group();


    const materialTrans = new THREE.MeshPhysicalMaterial({
      transmission: transmissionoptions.transmission,
      thickness: transmissionoptions.thickness,
      roughness: transmissionoptions.roughness,
      envMap: reflectionCube,
      envMapIntensity: transmissionoptions.envMapIntensity,
      clearcoat: transmissionoptions.clearcoat,
      clearcoatRoughness: transmissionoptions.clearcoatRoughness,
      // normalScale: new THREE.Vector2(transmissionoptions.normalScale),
      // normalMap: normal,
      // clearcoatNormalMap: normalMapTexture,
      // clearcoatNormalScale: new THREE.Vector2(transmissionoptions.clearcoatNormalScale)
    });
    const geometrySphere = new THREE.SphereGeometry( 2, 100, 100 );
    const sphere = new THREE.Mesh( geometrySphere, materialTrans );

    for ( let i = 0; i < 10; i ++ ) {

      const mesh = new THREE.Mesh( geometrySphere, materialTrans );

      mesh.position.x = Math.random() * 5 - 5;
      mesh.position.y = Math.random() * 5 - 5;
      mesh.position.z = Math.random() * 5 - 5;

      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * .4 +0;

      groupBubbles.add( mesh );
      scene.add(groupBubbles)

      spheres.push( mesh );

    }


    
     //===================================================== model




var loader = new GLTFLoader();
var mixer;
var model;
var clips;
var mixers = [];

const group = new THREE.Group();


loader.load(
  "https://raw.githubusercontent.com/chris-ain/handlefinal/main/chess_board21.glb",
  function (gltf) {
    gltf.castShadow = true;
    gltf.receiveShadow = true;

    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.side = THREE.DoubleSide;
        selects.push(node);
        objects.push(node);
      }
    });

    model = gltf.scene;
    expModel = gltf.scene;
    group.scale.set(0.31, 0.31, 0.31);
    group.position.set(0,.65, 0);
    // group.rotation.set(Math.PI /7, 0, 0);

    group.add( model);
    scene.add( group );

    mixer = new THREE.AnimationMixer(model);
    mixer.timeScale = 1;

    // mixer.clipAction(gltf.animations[1]).play();
    var action = mixer.clipAction(gltf.animations[1]);
    clips=gltf.animations;

    clips.forEach(element => {
      mixer.clipAction( element ).play();
    });

    clips.paused= true;
    createAnimation(mixer, action, gltf.animations[1]);

    // gsap.from(model.position, {
    //           duration: 3,
    //           ease: Power3.easeInOut,
    //           x:150,

    //       });

  
  }
);
    
    
    
    
        
     //===================================================== Postprocessing
    
    
    
    
    //  const pixelRatio = renderer.getPixelRatio();

    
    
    // const paramsts = {
		// 	enableSSRr: true,
		// 	autoRotate: true,
		// };
    // let composer;
		// let ssrrPass;
    // const renderScene = new rpass( scene, camera );


    // composer = new EffectComposer( renderer );
    // // composer.addPass( new spass( GammaCorrectionShader ) );

    // composer.addPass( renderScene );
    // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
		// 		bloomPass.threshold = paramst.bloomThreshold;
		// 		bloomPass.strength = paramst.bloomStrength;
		// 		bloomPass.radius = paramst.bloomRadius;
    // // composer.addPass( bloomPass );
   
   
   
    // ssrrPass = new SSRrPass( {
    //   renderer,
    //   scene,
    //   camera,
    //   width: innerWidth,
    //   height: innerHeight,
    //   selects: selects
    // } );

    // composer.addPass( ssrrPass );

    // fxaaPass = new spass( FXAAShader );

    // fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
    // fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
	// const copyPass = new spass( CopyShader );
      // composer.addPass( ssrrPass );


    
  // // GUI

  // gui = new GUI();
  // gui.add( paramst, 'enableSSRr' ).name( 'Enable SSRr' );
  // ssrrPass.ior = 1.1;
  // gui.add( ssrrPass, 'ior' ).name( 'IOR' ).min( .1 ).max( 1.5 ).step( .0001 );
  // gui.add( ssrrPass, 'fillHole' );
  // gui.add( paramst, 'autoRotate' ).onChange( () => {


  // } );

  // gui.add( paramst, 'exposure', 0.1, 2 ).onChange( function ( value ) {

  //   renderer.toneMappingExposure = Math.pow( value, 4.0 );

  // } );

  // gui.add( paramst, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

  //   bloomPass.threshold = Number( value );

  // } );

  // gui.add( paramst, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

  //   bloomPass.strength = Number( value );

  // } );

  // gui.add( paramst, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

  //   bloomPass.radius = Number( value );

  // } );

  // const folder = gui.addFolder( 'more settings' );
  // folder.add( ssrrPass, 'specular' );
  // folder.add( ssrrPass.specularMaterial, 'metalness' ).min( 0 ).max( 10 ).step( .01 );
  // folder.add( ssrrPass.specularMaterial, 'roughness' ).min( 0 ).max( 10 ).step( .01 );
  // folder.add( ssrrPass, 'output', {
  //   'Default': SSRrPass.OUTPUT.Default,
  //   'SSRr Only': SSRrPass.OUTPUT.SSRr,
  //   'Beauty': SSRrPass.OUTPUT.Beauty,
  //   'Depth': SSRrPass.OUTPUT.Depth,
  //   'DepthSelects': SSRrPass.OUTPUT.DepthSelects,
  //   'NormalSelects': SSRrPass.OUTPUT.NormalSelects,
  //   'Refractive': SSRrPass.OUTPUT.Refractive,
  //   'Specular': SSRrPass.OUTPUT.Specular,
  // } ).onChange( function ( value ) {

  //   ssrrPass.output = parseInt( value );

  // } );
  // ssrrPass.surfDist = 0.0015;
  // // folder.add( ssrrPass, 'surfDist' ).min( 0 ).max( .005 ).step( .0001 );
  // ssrrPass.maxDistance = 50;
  // // folder.add( ssrrPass, 'maxDistance' ).min( 0 ).max( 100 ).step( .001 );
  // // folder.add( ssrrPass, 'infiniteThick' );
  // // folder.open()
  // // gui.close()


  //   //===================================================== resize
    window.addEventListener("resize", function () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      // renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Composer.setSize(canvas.clientWidth, canvas.clientHeight);
      const pixelRatio = renderer.getPixelRatio();

      // fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( container.offsetWidth * pixelRatio );
      // fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( container.offsetHeight * pixelRatio );
    });




    // const handlePointerMove = ({ clientX, clientY }) => {
    //   const centerPoint = {
    //     x: window.innerWidth / 2,
    //     y: window.innerHeight / 2,
    //   };
    //   const z = (clientX - centerPoint.x) / 6000;
    //   const x = (clientY - centerPoint.y) / 6000;
    //   gsap.to(camera.rotation, {
    //     x: -x,
    //     y: -z,
    //     duration: 1,
    //     ease: "power2.out",
    //     onUpdate: renderer.render(scene, camera),
    //   });

    // };
    // window.addEventListener("pointermove", handlePointerMove);
 

    // const handlePointerMove = ({ clientX, clientY }) => {
    //   const centerPoint = {
    //     x: window.innerWidth / 2,
    //     y: window.innerHeight / 2,
    //   };
    //   const z = (clientX - centerPoint.x) / 60;
    //   const x = (clientY - centerPoint.y) / 60;
    //   gsap.to(sphere.position, {
    //     x: x,
    //     y: z,
    //     duration: 1,
    //     ease: "power2.out",
    //     onUpdate: renderer.render(scene, camera),
    //   });
    // };
    // window.addEventListener("pointermove", handlePointerMove);
 



    // var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    // // scene.add(new THREE.PlaneHelper( plane, 100, 0xffff00 ));
    
    
    


    // var mouse = new THREE.Vector2();
    // var raycaster = new THREE.Raycaster();
    // var intersects = new THREE.Vector3();
    
    // function onMouseMove(e) {
    //   mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //   mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //   raycaster.setFromCamera(mouse, camera);
    //   raycaster.ray.intersectPlane(plane, intersects);
    //   sphere.position.set(intersects.x, intersects.y, intersects.z);
    // }
    



    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.toneMappingExposure = .8;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.shadowMap.enabled = true;
    // renderer.physicallyCorrectLights;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.gammaFactor = 5;


  

var clock = new THREE.Clock();
function render() {

  id = requestAnimationFrame(render);
  renderer.render(scene, camera);
  // stats.update();
  const timer = 0.0001 * Date.now();

  var delta = clock.getDelta();

  if (mixer != null) mixer.update(delta);
  if (group) group.rotation.y += 0.001;
  for ( let i = 0, il = spheres.length; i < il; i ++ ) {

					const sphere = spheres[ i ];

					sphere.position.x = 5 * Math.cos( timer + i );
					sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

				}

}

render();

function createAnimation(mixer, action, clip) {
  let proxy = {

    get time() {
      return mixer.time;
    },
    set time(value) {

      clips.forEach(element => {
        var last = mixer.clipAction( element );
        last.paused = false;

      });
      mixer.setTime(value);
      clips.forEach(element => {
        var last = mixer.clipAction( element );
        last.paused = true;
      });
    }
  };

  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      // offset: -100,
      trigger: ".smooth-scroll",
      scroller: ".smooth-scroll",
      start: "top top",
      end: "bottom",
      pin: true,
      scrub: true,
      ease: Power3.easeInOut,
      onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  });

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 0,
  });

  let scrollingTL2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".smooth-scroll",
      scroller: ".smooth-scroll",
      start: "top top",
      end: "bottom",
      pin: true,
      scrub: true,
        ease: Power3.easeInOut,
onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  }, );

  scrollingTL2.to(model.rotation, {
    x:Math.PI/5,
    y:Math.PI,
    z:-Math.PI/5,

  });
  
  let scrollingTL3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".smooth-scroll",
      scroller: ".smooth-scroll",
      start: "top top",
      end: "bottom",
      pin: true,
      scrub: true,
        ease: Power3.easeInOut,
onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  }, );

  

    scrollingTL3.to(model.position, {
    x:2,
    y:-2,

  });

  let scrollingTLBubbles = gsap.timeline({
    scrollTrigger: {
      trigger: ".smooth-scroll",
      scroller: ".smooth-scroll",
      start: "top top",
      end: "bottom",
      pin: true,
      scrub: true,
        ease: Power3.easeInOut,
onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  }, );

  

    scrollingTLBubbles.to(groupBubbles.position, {
 
    y:20

  });

  let scrollingTL4 = gsap.timeline({
    scrollTrigger: {
      trigger: ".smooth-scroll",
      scroller: ".smooth-scroll",
      start: "top top",
      end: "bottom",
      pin: true,
      scrub: true,
        ease: Power3.easeInOut,
onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  }, );

  

    scrollingTL4.to('#chess', {
    opacity:0,

  });



//   let scrollingTL5 = gsap.timeline({
//     scrollTrigger: {
//       trigger: ".smooth-scroll",
//       scroller: ".smooth-scroll",
//       start: "top top",
//       endtrigger: "#intro",
//       pin: true,
//       scrub: true,
//         ease: Power3.easeInOut,
// onUpdate: function () {
//         camera.updateProjectionMatrix();
//       }
//     }
//   }, );

  

//     scrollingTL5.to('.hero_head', {
//       scale:0,
//     opacity:0,

//   });

  // $(gui.domElement).attr("hidden", true);


}


};
