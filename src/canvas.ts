export const createCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'stage');
  document.body.appendChild(canvas)
}