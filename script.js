import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
/**
 * from dom and window and other objects
 */
// ====== Canvas
const canvas = document.querySelector('canvas')

//=====================
/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color('#e4e4e4')

//======================
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.x = 5.357
directionalLight.position.y = 0.878
directionalLight.position.z = 4.743
scene.add(directionalLight)

//======================
/**
 * Mesh
 */
const loader = new GLTFLoader()
const model1Data = await modelLoader(
  'https://cdn.jsdelivr.net/gh/KennyStanleyJr/ndw/assets/23.glb'
)

const model = model1Data.scene

model.position.set(0, 0, 0)
model.rotation.set(0, -Math.PI / 2, 0)

model.updateMatrix()

scene.add(model)

//======================
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.y = 0.1
camera.position.z = 3
scene.add(camera)

//======================
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)
// renderer update
window.addEventListener('resize', () => {
  //Camera
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  //Update renderer:
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //Update Controls
  //   controls.update()

  // Hover Mesh
  model.position.y = Math.sin(elapsedTime) * 0.05

  // Rotate Mesh with Scroll
  const scroll = window.scrollY
  model.rotation.y = Math.sin(scroll * 0.005) * 0.25 - Math.PI / 2

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

function modelLoader(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject)
  })
}