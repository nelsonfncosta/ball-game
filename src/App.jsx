import React, { useEffect, useRef, useCallback } from 'react';
import { clear, drawBall, drawPaddle } from './drawUtils';
import style from './styles.css';

const WIDTH = 1000;
const HEIGHT = 600;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
const PADDLE_SPEED = 7;

const BALL_RADIUS = 10;

let ballPosX = WIDTH / 2;
let ballPosY = HEIGHT - 30;

const BALL_SPEED = 4;
let dx = BALL_SPEED;
let dy = -BALL_SPEED;

let goLeft = false;
let goRight = false;

const paddle = {
  x: (WIDTH - PADDLE_WIDTH) / 2,
  y: HEIGHT - PADDLE_HEIGHT,
  width: PADDLE_WIDTH * 2,
  height: PADDLE_HEIGHT,
};

function moveBall(interval) {
  if (ballPosY + dy < BALL_RADIUS) {
    dy = -dy;
  } else if (ballPosY + dy > HEIGHT - BALL_RADIUS) {
    if (ballPosX > paddle.x && ballPosX < paddle.x + paddle.width) {
      dy = -dy;
    } else {
      document.location.reload();
      clearInterval(interval);
    }
  }

  if (ballPosX + dx > WIDTH - BALL_RADIUS || ballPosX + dx < BALL_RADIUS) {
    dx = -dx;
  }

  ballPosX += dx;
  ballPosY += dy;
}

function movePaddle() {
  if (goRight) {
    paddle.x += PADDLE_SPEED;

    if (paddle.x + paddle.width > WIDTH) {
      paddle.x = WIDTH - paddle.width;
    }
  }

  if (goLeft) {
    paddle.x -= PADDLE_SPEED;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

function draw(ctx, { interval }) {
  clear(ctx, WIDTH, HEIGHT);

  drawPaddle(ctx, paddle);
  drawBall(ctx, ballPosX, ballPosY, BALL_RADIUS);

  moveBall(interval);

  movePaddle();
}

export default function App() {
  const ref = useRef();

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      goRight = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      goLeft = true;
    }
  });

  const handleKeyUp = useCallback(e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      goRight = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
      goLeft = false;
    }
  });

  useEffect(() => {
    const canvas = ref.current;
    canvas.focus();
    const ctx = canvas.getContext('2d');

    const interval = setInterval(() => {
      draw(ctx, { interval });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <canvas
        id="myCanvas"
        tabIndex={0}
        className={style.canvas}
        ref={ref}
        width={WIDTH}
        height={HEIGHT}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
