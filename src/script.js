import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { color, distance } from "three/tsl";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

//add textureLoader
const textureLoader = new THREE.TextureLoader();


//adding textures
const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");
const backGroundTexture = textureLoader.load("textures/2k_stars_milky_way.jpg");
scene.background = backGroundTexture;

const mercuryMaterial = new THREE.MeshStandardMaterial(
  {
    map: mercuryTexture
  }
);

const venusMaterial = new THREE.MeshStandardMaterial(
  {
    map: venusTexture
  }
);


const earthMaterial = new THREE.MeshStandardMaterial(
  {
    map: earthTexture
  }
);

const marsMaterial = new THREE.MeshStandardMaterial(
  {
    map: marsTexture
  }
);


const moonMaterial = new THREE.MeshStandardMaterial(
  {
    map: moonTexture
  }
);







// add stuff here
const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial(
  {
    map: sunTexture
  }
);

const sun = new THREE.Mesh(sphereGeo, sunMaterial);

sun.scale.setScalar(5);
scene.add(sun);



const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];


//create planet helper function

const createPlanets = (planet) => {

  //create mesh for the planets
  const planetMesh = new THREE.Mesh(
    sphereGeo,
    planet.material
  );

  //set the scale
  planetMesh.scale.setScalar(planet.radius);

  //set the position
  planetMesh.position.x = planet.distance;

  return planetMesh;
}




//create moon helper function

const createMoon = (moon) => {

  const moonMesh = new THREE.Mesh(
    sphereGeo,
    moonMaterial
  );

  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = (moon.distance);

  return moonMesh;
}



//get the hold of planet meshes

const planetMeshes = planets.map((planet) => {

  const planetMesh = createPlanets(planet);

  //add it our scene
  scene.add(planetMesh);

  //loop through the moon and add to the planets

  planet.moons.forEach((moon) => {

    const moonMesh = createMoon(moon);

    planetMesh.add(moonMesh);
  })


  return planetMesh;

})



//intialize the light

const ambientLight = new THREE.AmbientLight(
  'white',
  2
)

scene.add(ambientLight)



// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// render loop
const renderloop = () => {


  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += planets[index].speed;

    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance;
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance;

    planet.children.forEach((moon, moonIndex) => {
      moon.rotation.y += planets[index].moons[moonIndex].speed;
      moon.position.x = Math.sin(moon.rotation.y) * planets[index].moons[moonIndex].distance;
      moon.position.z = Math.cos(moon.rotation.y) * planets[index].moons[moonIndex].distance;
    })
  })

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};


renderloop();