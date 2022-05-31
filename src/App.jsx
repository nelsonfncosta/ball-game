import React, { useEffect, useRef, useCallback } from 'react';
import { clear, drawBall, drawBricks, drawPaddle } from './drawUtils';
import style from './styles.css';

const WIDTH = 1000;
const HEIGHT = 600;

const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 75;
const PADDLE_SPEED = 7;

const BALL_RADIUS = 10;

let ballPosX = WIDTH / 2;
let ballPosY = HEIGHT - 30;

const BALL_SPEED = 8;
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

const BRICK_WIDTH = 75;
const BRICK_PADDING = 10;
const BRICK_ROWS = 3;
const BRICK_COLUMNS = 8;

const BRICK_SETTINGS = {
  brickRowCount: BRICK_ROWS,
  brickColumnCount: BRICK_COLUMNS,
  brickWidth: BRICK_WIDTH,
  brickPadding: BRICK_PADDING,
  brickHeight: 20,
  brickOffsetTop: 60,
  brickOffsetLeft: (WIDTH - (BRICK_WIDTH + BRICK_PADDING) * BRICK_COLUMNS) / 2,
  color: '#0095DD',
};

const bricks = [];

// initialize the bricks
for (let c = 0; c < BRICK_SETTINGS.brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < BRICK_SETTINGS.brickRowCount; r += 1) {
    bricks[c][r] = {
      x:
        c * (BRICK_SETTINGS.brickWidth + BRICK_SETTINGS.brickPadding) +
        BRICK_SETTINGS.brickOffsetLeft,
      y:
        r * (BRICK_SETTINGS.brickHeight + BRICK_SETTINGS.brickPadding) +
        BRICK_SETTINGS.brickOffsetTop,
      hits: 0,
    };
  }
}

function moveBall() {
  if (ballPosY + dy < BALL_RADIUS) {
    dy = -dy;
  } else if (ballPosY + dy > HEIGHT - BALL_RADIUS) {
    if (ballPosX > paddle.x && ballPosX < paddle.x + paddle.width) {
      dy = -dy;
    } else {
      document.location.reload();
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

function hitBrick(c, r) {
  bricks[c][r].hits += 1;
}
function collision() {
  bricks.forEach((columns, c) => {
    columns.forEach((brick, r) => {
      if (
        ballPosX > brick.x &&
        ballPosX < brick.x + BRICK_SETTINGS.brickWidth &&
        ballPosY > brick.y &&
        ballPosY < brick.y + BRICK_SETTINGS.brickHeight
      ) {
        if (brick.hits === 0) {
          dy = -dy;
          hitBrick(c, r);
        }
      }
    });
  });
}

function draw(ctx, update) {
  clear(ctx, WIDTH, HEIGHT);

  drawPaddle(ctx, paddle);
  drawBall(ctx, ballPosX, ballPosY, BALL_RADIUS);
  drawBricks(ctx, BRICK_SETTINGS, bricks);

  moveBall();

  movePaddle();

  collision();

  const ref = requestAnimationFrame(() => draw(ctx, update));
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

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      goRight = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      goLeft = true;
    }
  }, []);

  const handleKeyUp = useCallback(e => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      goRight = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
      goLeft = false;
    }
  }, []);

  const handleMouseMove = useCallback(e => {
    const relativeX = e.clientX - ref.current.offsetLeft;

    if (relativeX > 0 && relativeX < WIDTH) {
      paddle.x = relativeX - paddle.width / 2;
    }
  }, []);

  const handleTouchMove = useCallback(e => {
    if (e.touches) {
      const relativeX = e.touches[0].clientX - ref.current.offsetLeft;

      if (relativeX > 0 && relativeX < WIDTH) {
        paddle.x = relativeX - paddle.width / 2;
      }
    }
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    canvas.focus();
    const ctx = canvas.getContext('2d');

    draw(ctx, updateDrawRef);
    return () => cancelAnimationFrame(drawRef.current);
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
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
}
