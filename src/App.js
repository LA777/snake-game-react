import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

const App = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [direction, _setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoopTimeout = useRef(null);
  const latestDirectionRef = useRef(direction);

  const setDirection = data => {
    latestDirectionRef.current = data;
    _setDirection(data);
  };

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (latestDirectionRef.current !== DIRECTIONS.DOWN) {
          setDirection(DIRECTIONS.UP);
        }
        break;
      case 'ArrowDown':
        if (latestDirectionRef.current !== DIRECTIONS.UP) {
          setDirection(DIRECTIONS.DOWN);
        }
        break;
      case 'ArrowLeft':
        console.log("LEFT!");
        if (latestDirectionRef.current !== DIRECTIONS.RIGHT) {
          console.log("Go LEFT!");
          setDirection(DIRECTIONS.LEFT);
        }
        break;
      case 'ArrowRight':
        if (latestDirectionRef.current !== DIRECTIONS.LEFT) {
          setDirection(DIRECTIONS.RIGHT);
        }
        break;
      default:
        break;
    }
  }, [latestDirectionRef]);

  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    console.log(direction)
    switch (direction) {
      case DIRECTIONS.UP:
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case DIRECTIONS.DOWN:
        head.y = (head.y + 1) % GRID_SIZE;
        break;
      case DIRECTIONS.LEFT:
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
        break;
      case DIRECTIONS.RIGHT:
        head.x = (head.x + 1) % GRID_SIZE;
        break;
      default:
        break;
    }

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
      const newFood = generateRandomFood();
      setFood(newFood);
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    // Check for collision with self
    if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);
    setSnake(newSnake);
  }, [direction, snake, food, score]);

  const generateRandomFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleKeyDown(e));

    return () => {
      document.removeEventListener('keydown', (e) => handleKeyDown(e));
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isGameOver) {
      gameLoopTimeout.current = setTimeout(moveSnake, 100);
    }

    return () => clearTimeout(gameLoopTimeout.current);
  }, [snake, direction, isGameOver, moveSnake]);

  return (
    <div className="game">
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      <div className="grid">
        {[...Array(GRID_SIZE).keys()].map((row) => (
          <div key={row} className="row">
            {[...Array(GRID_SIZE).keys()].map((col) => (
              <div
                key={col}
                className={`cell ${snake.some((segment) => segment.x === col && segment.y === row) ? 'snake' : ''
                  } ${food.x === col && food.y === row ? 'food' : ''}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            ))}
          </div>
        ))}
      </div>
      {isGameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default App;