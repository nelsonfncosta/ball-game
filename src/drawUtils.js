export function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function drawBall(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

export function drawPaddle(ctx, { x, y, width, height }) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
