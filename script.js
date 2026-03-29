import * as THREE from 'three';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';

let scene, camera, renderer, mouseX = 0, mouseY = 0;
let isModelLoaded = false;
let canAnimateCamera = false;
const lookTarget = new THREE.Vector3(0, 10, 0);

const cursor = document.querySelector('.cursor');
const loader = document.querySelector('.loader');
const main = document.querySelector('main');
const heroTitle = document.querySelector('.hero-title');

init3D();
initUIInteractions();
animate();

function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 50, 120);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(60, 30, 20);
    scene.add(light, light.clone().translateX(-120));

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    new MMDLoader().load('model.pmx', (mesh) => {
        mesh.position.y = -40;
        scene.add(mesh);

        onModelReady();
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function onModelReady() {
    isModelLoaded = true;
 
    setTimeout(() => {
        loader.style.transform = 'translateY(-100%)';
        main.style.opacity = '1';
        document.body.style.overflow = 'visible';
        
        heroTitle.classList.add('animate-in');
        
        setTimeout(() => {
            canAnimateCamera = true;
        }, 1000); 
    }, 2000);
}

function initUIInteractions() {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        if (canAnimateCamera) {
            const moveX = mouseX * 20;
            const moveY = -mouseY * 15;
            heroTitle.style.transform = `translate(${moveX}px, ${moveY}px) scale(1)`;
            heroTitle.style.transform += ` rotate(${mouseX * 1.5}deg)`;
        }
    });

    const links = document.querySelectorAll('.hover-link');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(4)';
            cursor.style.background = 'rgba(0,0,0,0.05)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'none';
        });
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (canAnimateCamera) {
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 + 10 - camera.position.y) * 0.05;
        camera.position.z += (50 - camera.position.z) * 0.05;
    }

    camera.lookAt(lookTarget);
    renderer.render(scene, camera);
}