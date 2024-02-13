import React, { useCallback, useEffect, useRef } from 'react';
import { random, reduce } from 'lodash';
import style from './styles.css';
import { clear } from './drawUtils';
import {
  draw,
  drawL,
  drawLine,
  drawSquare,
  drawT,
  drawZ,
  BLOCK,
} from './tetrisUtils';

const WIDTH = 400;
const HEIGHT = 800;

const mapPiece = {
  0: { draw: drawLine, height: BLOCK },
  1: { draw: drawSquare, height: 2 * BLOCK },
  2: { draw: drawL, height: 3 * BLOCK },
  3: { draw: drawT, height: 2 * BLOCK },
  4: { draw: drawZ, height: 2 * BLOCK },
};

const pieces = [];
window.pieces = pieces;

const cnt = 0;

function genPiece() {
  const p = mapPiece[random(4)];
  const startingPos = { x: 0, y: 0 };

  const piece = { ...p, ...startingPos, id: cnt, landed: false };

  return piece;
}

let currentPiece = genPiece();

function stackHeight() {
  return reduce(
    pieces,
    (acc, cur) => {
      if (cur.landed) {
        return acc + cur.height;
      }
      return acc;
    },
    0
  );
}

function gravity() {
  pieces.forEach((_, index) => {
    const p = pieces[index];

    if (!p.landed) {
      if (p.y < HEIGHT - p.height - stackHeight()) {
        p.y += BLOCK / 2;
      } else {
        p.landed = true;
      }
    }
  });
}

function drop() {
  pieces.push(currentPiece);

  currentPiece = genPiece();
}

function drawCurrentPiece(ctx) {
  draw(ctx, currentPiece.draw, { x: currentPiece.x, y: 0 });
}

function render(context, update) {
  clear(context, WIDTH, HEIGHT);

  //   draw(context, mapPiece[random(4)].draw, { x: 0, y: 100 });

  drawCurrentPiece(context);

  pieces.forEach(p => {
    draw(context, p.draw, { x: p.x, y: p.y });
  });

  gravity();

  const ref = requestAnimationFrame(() => render(context, update));
  update(ref);
}

export default function App() {
  const ref = useRef();
  const drawRef = useRef();

  const updateDrawRef = useCallback(
    request => {
      drawRef.current = request;
    },
    [drawRef]
  );

  useEffect(() => {
    const canvas = ref.current;
    canvas.focus();
    const ctx = canvas.getContext('2d');

    render(ctx, updateDrawRef);
    return () => cancelAnimationFrame(drawRef.current);
  }, []);

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Down' || e.key === 'ArrowDown') {
      drop();
    }
  }, []);

  const handleMouseMove = useCallback(e => {
    const relativeX = e.clientX - ref.current.offsetLeft;
    if (relativeX < WIDTH) {
      currentPiece.x = parseInt(relativeX / BLOCK, 10) * BLOCK;
    }
  }, []);

  return (
    <div>
      <canvas
        id="myCanvas"
        tabIndex={0}
        className={style.canvas}
        ref={ref}
        width={WIDTH}
        height={HEIGHT}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onClick={drop}
      />
    </div>
  );
}
