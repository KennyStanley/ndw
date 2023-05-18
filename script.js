import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * from dom and window and other objects
 */
// ====== Canvas
const canvas = document.querySelector('canvas')
// ====== Sizes
const size = {
  width: window.innerWidth,
  height: window.innerHeight * 0.8,
}

//=====================
/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color('#222222')

//======================
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 0.5)
directionalLight.position.x = 1
directionalLight.position.y = 1
directionalLight.position.z = 1
scene.add(directionalLight)

//======================
/**
 * Mesh
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  'https://cdn.jsdelivr.net/gh/KennyStanley/ndw/assets/ndw.glb',
  result => {
    const model = result.scene
    model.position.set(0, 0, 0)

    scene.add(model)

    //======================
    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      70,
      size.width / size.height,
      0.1,
      100
    )
    camera.position.y = 0.5
    camera.position.z = 4
    scene.add(camera)

    //======================
    /**
     * Controls
     */
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

    //======================
    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    })
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
    // renderer update
    window.addEventListener('resize', () => {
      //Update Sizes:
      size.width = window.innerWidth
      size.height = window.innerHeight * 0.8

      //Camera
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()

      //Update renderer:
      renderer.setSize(size.width, size.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //======================
    // Track mouse position
    let mouseX = 0
    let mouseY = 0
    canvas.addEventListener('mousemove', e => {
      // Adjust mouse position to normalised device coordinates (-1 to +1)
      const x = window.innerWidth
      const y = window.innerHeight * 0.8
      mouseX = (e.clientX / x) * 2 - 1
      mouseY = -(e.clientY / y) * 2 + 1
      //   console.log(mouseX, mouseY)
    })

    /**
     * Animate
     */
    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      //Update Controls
      //   controls.update()

      // Move Mesh
      const magnitude = 0.5
      model.rotation.x = -mouseY * magnitude
      model.rotation.y = mouseX * magnitude - Math.PI * 0.5

      renderer.render(scene, camera)

      window.requestAnimationFrame(tick)
    }
    tick()
  }
)
