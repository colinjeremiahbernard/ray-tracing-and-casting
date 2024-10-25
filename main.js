import * as THREE from './node_modules/three/build/three.module.js';

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Ensure shadow mapping is enabled
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
document.body.appendChild(renderer.domElement);

// Create objects in the scene
const geometry = new THREE.SphereGeometry(2, 32, 32); // Made spheres bigger
const materialRed = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const materialBlue = new THREE.MeshStandardMaterial({ color: 0x0000ff });

const sphere1 = new THREE.Mesh(geometry, materialRed);
sphere1.position.set(6, 5, 5);
sphere1.castShadow = true; // Enable shadow casting
scene.add(sphere1);

const sphere2 = new THREE.Mesh(geometry, materialBlue);
sphere2.position.set(-4, 5, 5);
sphere2.castShadow = true; // Enable shadow casting
scene.add(sphere2);

camera.position.z = 15;

// Add a lime green plane to catch the shadow
const planeGeometry = new THREE.PlaneGeometry(21, 23); // Size
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Lime green
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -2.5;
plane.receiveShadow = true; // Enable shadow receiving
scene.add(plane);

// Set up the spotlight with yellow shine, focused on the plane
const spotLight = new THREE.SpotLight(0xffff00);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true; // Enable shadow casting for light
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.1;
spotLight.decay = 2;
spotLight.distance = 30; // Reduced distance to focus on the plane

// Configure shadow properties for better appearance
spotLight.shadow.mapSize.width = 2048; // Increase shadow map resolution
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 10; // Adjust shadow camera settings for accuracy
spotLight.shadow.camera.far = 50; // Ensure it's not too far

scene.add(spotLight);
scene.add(new THREE.SpotLightHelper(spotLight));

// Add ambient light to ensure visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light, normal intensity
scene.add(ambientLight);

// Set up the raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Store original colors
sphere1.userData.origColor = materialRed.color.clone();
sphere2.userData.origColor = materialBlue.color.clone();

// Define purple color for hover effect
const hoverColor = new THREE.Color(0x800080); // Purple color

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects([sphere1, sphere2]); // Only intersect with spheres

    // Reset colors for the spheres
    [sphere1, sphere2].forEach((sphere) => {
        sphere.material.color.copy(sphere.userData.origColor);
    });

    // Change color to purple only if hovering over a sphere
    if (intersects.length > 0) {
        intersects[0].object.material.color.set(hoverColor);
    }
});

// Animation loop
let theta = 0;
function animate() {
    requestAnimationFrame(animate);

    // Rotate the spheres around each other
    theta += 0.01;
    sphere1.position.x = 4 * Math.cos(theta);
    sphere1.position.z = 4 * Math.sin(theta);
    sphere2.position.x = -4 * Math.cos(theta);
    sphere2.position.z = -4 * Math.sin(theta);

    renderer.render(scene, camera);
}

animate();





