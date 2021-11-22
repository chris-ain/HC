export function guiInterface (){
    var gui = new dat.GUI();
       
const paramst = {
    enableSSRr: true,
    autoRotate: true,
    exposure: 1,
      bloomStrength: .45,
      bloomThreshold: .38,
      bloomRadius: 0,
      x:0,
  };
  // GUI


  // gui.add( paramst, 'enableSSRr' ).name( 'Enable SSRr' );
  // ssrrPass.ior = 1.1;
  // gui.add( ssrrPass, 'ior' ).name( 'IOR' ).min( .1 ).max( 1.5 ).step( .0001 );
  // gui.add( ssrrPass, 'fillHole' );
  // gui.add( paramst, 'autoRotate' ).onChange( () => {


  // } );

  gui.add( paramst, 'exposure', 0.1, 2 ).onChange( function ( value ) {

    renderer.toneMappingExposure = Math.pow( value, 4.0 );

  } );

  gui.add( paramst, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

    bloomPass.threshold = Number( value );

  } );

  gui.add( paramst, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

    bloomPass.strength = Number( value );

  } );

  gui.add( paramst, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    bloomPass.radius = Number( value );

  } );


  gui.add( paramst, 'x', 0.0, 10.0 ).step( 0.1 ).onChange( function ( value ) {

    group.rotation.x = Number( value );

  } );


  gui.add( paramst, 'x', 0.0, 10.0 ).step( 0.1 ).onChange( function ( value ) {

    group.position.x = Number( value );

  } );

  gui.add( paramst, 'y', 0.0, 10.0 ).step( 0.1 ).onChange( function ( value ) {

    group.position.x = Number( value );

  } );

  gui.add( paramst, 'z', 0.0, 10.0 ).step( 0.1 ).onChange( function ( value ) {

    group.position.x = Number( value );

  } );

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
  // folder.open()
  // gui.close()
 
        

}
 