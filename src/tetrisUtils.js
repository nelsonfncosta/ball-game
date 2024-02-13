export const BLOCK = 20;

export function draw(ctx, piece, params) {
  ctx.beginPath();

  piece(ctx, params);

  ctx.closePath();
}

// [][][][]
export function drawLine(ctx, { x, y }) {
  ctx.rect(x, y, BLOCK * 4, BLOCK);

  ctx.fillStyle = '#0095DD';
  ctx.fill();
}

// [][]
//   [][]
export function drawZ(ctx, { x, y }) {
  ctx.rect(x, y, BLOCK * 2, BLOCK);
  ctx.rect(x + BLOCK, y + BLOCK, BLOCK * 2, BLOCK);

  ctx.fillStyle = '#0095DD';
  ctx.fill();
}

//  [][]
//  [][]
export function drawSquare(ctx, { x, y }) {
  ctx.rect(x, y, BLOCK * 2, BLOCK * 2);

  ctx.fillStyle = '#0095DD';
  ctx.fill();
}

// [][][]
//   []

export function drawT(ctx, { x, y }) {
  ctx.rect(x, y, BLOCK * 3, BLOCK);
  ctx.rect(x + BLOCK, y + BLOCK, BLOCK, BLOCK);

  ctx.fillStyle = '#0095DD';
  ctx.fill();
}

// [][]
//   []
//   []

export function drawL(ctx, { x, y }) {
  ctx.rect(x, y, BLOCK * 2, BLOCK);
  ctx.rect(x + BLOCK, y + BLOCK, BLOCK, BLOCK * 2);

  ctx.fillStyle = '#0095DD';
  ctx.fill();
}
