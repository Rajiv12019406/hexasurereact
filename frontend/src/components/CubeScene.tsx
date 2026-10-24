import { useEffect, useRef } from 'react'

interface CubeFaceProps {
  face: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom'
  size: 3 | 4
  depth: number
}

function CubeFace({ face, size, depth }: CubeFaceProps) {
  const stickers = Array.from({ length: size * size }, (_, i) => i)
  
  const transforms: Record<string, string> = {
    front: `translateZ(${depth}px)`,
    back: `rotateY(180deg) translateZ(${depth}px)`,
    right: `rotateY(90deg) translateZ(${depth}px)`,
    left: `rotateY(-90deg) translateZ(${depth}px)`,
    top: `rotateX(90deg) translateZ(${depth}px)`,
    bottom: `rotateX(-90deg) translateZ(${depth}px)`,
  }

  const colors: Record<string, string> = {
    front: '#d94a3d',
    back: '#f28c28',
    right: '#218e62',
    left: '#2778bf',
    top: '#f8f7ed',
    bottom: '#f1ce3e',
  }

  return (
    <div
      className={`cube-face cube-face--${face}`}
      style={{
        '--cube-size': size,
        transform: transforms[face],
      }}
      aria-hidden="true"
    >
      {stickers.map(i => (
        <span
          key={i}
          className="cube-sticker"
          style={{
            background: face === 'front' || face === 'back' || face === 'right' || face === 'left' || face === 'top' || face === 'bottom' 
              ? colors[face] 
              : '#f8fafc',
          }}
        ></span>
      ))}
    </div>
  )
}

interface CubeOrbitProps {
  size: 'large' | 'small'
  edge: number
  depth: number
  margin: string
  baseTransform: string
  cubeSize: 3 | 4
}

function CubeOrbit({ size, edge, depth, margin, baseTransform, cubeSize }: CubeOrbitProps) {
  const orbitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = orbitRef.current
    if (!element) return

    let animationId: number
    let scrollY = 0

    const animate = () => {
      scrollY = window.scrollY
      const rotateX = -25 + scrollY * 0.02
      const rotateY = -35 + scrollY * 0.03
      
      if (size === 'small') {
        element.style.transform = `rotateX(${rotateX - 5}deg) rotateY(${rotateY + 3}deg)`
      } else {
        element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }
      
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [size])

  const faces: CubeFaceProps['face'][] = ['front', 'back', 'right', 'left', 'top', 'bottom']

  return (
    <div
      ref={orbitRef}
      className={`cube-orbit cube-orbit--${size}`}
      style={{
        '--edge': `${edge}px`,
        '--cube-depth': `${depth}px`,
        margin,
        transform: baseTransform,
      }}
      data-scroll-cube
      role="img"
      aria-label={size === 'large' ? 'Animated 3D-style 4 by 4 cube illustration' : 'Animated 3D-style 3 by 3 cube illustration'}
    >
      {faces.map(face => (
        <CubeFace key={face} face={face} size={cubeSize} depth={depth} />
      ))}
    </div>
  )
}

export default function CubeScene() {
  return (
    <div className="cube-scene" data-cube-scene>
      <CubeOrbit
        size="large"
        edge={190}
        depth={95}
        margin="-26px 50px 0 0"
        baseTransform="rotateX(-25deg) rotateY(-35deg)"
        cubeSize={4}
      />
      <CubeOrbit
        size="small"
        edge={132}
        depth={66}
        margin="100px 0 0 150px"
        baseTransform="rotateX(-20deg) rotateY(-32deg)"
        cubeSize={3}
      />
      <div className="cube-scene-caption">
        <span>3×3</span>
        <span>4×4</span>
        <span>Observe · Plan · Solve</span>
      </div>
    </div>
  )
}