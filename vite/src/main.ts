import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ADDITION, Brush, Evaluator, INTERSECTION } from 'three-bvh-csg'

/**
 * from dom and window and other objects
 */
// ====== Canvas
const canvas = document.querySelector('canvas')
if (!canvas) throw new Error('Canvas not found')

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
// const modelConnectedData = await modelLoader('https://cdn.jsdelivr.net/gh/KennyStanleyJr/ndw/assets/23.glb')
const modelConnectedData = await modelLoader('/23.glb')
const modelDisconnectedData = await modelLoader('/sphere-grid.glb')

const modelConnected = modelConnectedData.scene
const modelDisconnected = modelDisconnectedData.scene

modelConnected.position.set(0, 0, 0)
modelDisconnected.position.set(0, 0, 0)
modelDisconnected.rotation.set(0, -Math.PI / 2, 0)

modelConnected.updateMatrix()
modelDisconnected.updateMatrix()

scene.add(modelDisconnected)

// Add Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
boxMaterial.wireframe = true
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(0, 0, 1)
// box.position.set(0, 0, 2)
// scene.add(box)

box.rotation.set(0, -0.2, 0)

box.scale.set(5, 2.5, 2)

box.updateMatrix()

console.log(modelConnected)

const model23 = modelConnected.children[0] as THREE.Mesh

if (!model23) throw new Error('Model not found')

const evaluator = new Evaluator()

const model23Brush = new Brush(model23.geometry)
const boxBrush = new Brush(box.geometry)

const scale = 0.1717
model23Brush.scale.set(scale, scale, scale)
model23Brush.position.set(-0.15, -0.5, 0)
model23Brush.rotation.set(0, -Math.PI / 2, 0)
model23Brush.updateMatrixWorld()

boxBrush.scale.set(5, 2.5, 2)
boxBrush.position.set(0, 0, 0)
boxBrush.rotation.set(0, -0.2, 0)
boxBrush.updateMatrixWorld()

const intersection = evaluator.evaluate(model23Brush, boxBrush, INTERSECTION)
intersection.name = 'intersection'
intersection.material = model23.material
scene.add(intersection)

const updateIntersection = (zPos: number) => {
  boxBrush.geometry.dispose()
  boxBrush.position.set(0, 0, zPos)
  boxBrush.updateMatrixWorld()
  const newIntersection = evaluator.evaluate(
    model23Brush,
    boxBrush,
    INTERSECTION,
    intersection
  )
  newIntersection.material = model23.material
}

// if (model23) {
//   console.log(model23)
//   model23.position.set(-0.15, -0.5, 0)
//   model23.rotation.set(0, -Math.PI / 2, 0)
//   model23.updateMatrix()
//   const intersection = CSG.intersect(model23 as THREE.Mesh, box)
//   intersection.name = 'intersection'
//   scene.add(intersection)
// }

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
const controls = new OrbitControls(camera, canvas)
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
let buffer = 0
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //Update Controls
  controls.update()

  // Update buffer
  buffer += elapsedTime

  if (buffer > 1) {
    buffer = 0
    // Move box z position from 0 to 2 smoothly and loop
    // const zPos = Math.sin(elapsedTime * 0.05)
    // Change zPos range from -1 to 1 to 0 to 1.6
    const zPos = (-Math.cos(elapsedTime * 0.05) + 1) * 0.8
    console.log(zPos)
    updateIntersection(zPos)
  }

  // Hover Camera
  const yPos = Math.sin(elapsedTime) * 0.05
  camera.position.y = yPos

  // modelDisconnected.position.y = yPos

  // // Rotate Mesh with Scroll
  // const scroll = window.scrollY
  // const yRot = Math.sin(scroll * 0.005) * 0.25 - Math.PI / 2
  // modelConnected.rotation.y = yRot
  // // modelDisconnected.rotation.y = yRot

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

function modelLoader(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), undefined, reject)
  })
}
