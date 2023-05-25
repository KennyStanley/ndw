import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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
const modelConnectedData = await modelLoader(
  'https://cdn.jsdelivr.net/gh/KennyStanleyJr/ndw/assets/23.glb'
)
// const modelConnectedData = await modelLoader('/assets/23.glb')
// const modelDisconnectedData = await modelLoader('/assets/sphere-grid.glb')

const modelConnected = modelConnectedData.scene
// const modelDisconnected = modelDisconnectedData.scene

modelConnected.position.set(0, 0, 0)
modelConnected.rotation.set(0, -Math.PI / 2, 0)
// modelDisconnected.position.set(0, 0, 0)
// modelDisconnected.rotation.set(0, -Math.PI / 2, 0)

modelConnected.updateMatrix()
// modelDisconnected.updateMatrix()

scene.add(modelConnected)

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
 * Controls
 */
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.dampingFactor = 0.05

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
  // controls.update()

  // Hover Mesh
  const yPos = Math.sin(elapsedTime) * 0.05
  camera.position.y = yPos
  // modelDisconnected.position.y = yPos

  // Rotate Mesh with Scroll
  const scroll = window.scrollY
  const yRot = Math.sin(scroll * 0.005) * 0.25 - Math.PI / 2
  modelConnected.rotation.y = yRot
  // modelDisconnected.rotation.y = yRot

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

function modelLoader(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject)
  })
}
