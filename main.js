import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

let alpha, beta, gamma;
const alphaText = document.querySelector('#alpha')
const betaText = document.querySelector('#beta')
const gammaText = document.querySelector('#gamma')

camera.position.z = 100

window.addEventListener('deviceorientation', function(event) {
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;
  alphaText.innerHTML = Math.round(alpha)
  betaText.innerHTML = Math.round(beta)
  gammaText.innerHTML = Math.round(gamma)
});

const DegToRad = Math.PI/180

function animate() {
  requestAnimationFrame( animate );

  sphere.rotation.x = beta * DegToRad;
  sphere.rotation.y = alpha * DegToRad;
  //sphere.rotation.z = gamma * DegToRad;

  renderer.render( scene, camera );
}

animate()