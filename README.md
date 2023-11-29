# Foins' Fighters

## Table of Contents
1. [Introduction](#introduction)
2. [Controls](#controls)
3. [Gameplay](#gameplay)
4. [Classes](#classes)
5. [Animations](#animations)
6. [Collision Detection](#collision-detection)
7. [Health and Victory](#health-and-victory)

---

## Introduction

Foins' Fighters is a mutiplayer PvP combat experience. The game features two characters Player 1 and Player 2, controlled by WASD and the arrow keys respectively. The characters can move horizontally, jump and attack. The goal of the game is to reduce the opponent's health to zero or to have more health than the opponent when the timer runs out.

## Controls

- **Player Controls:**
  - Move Left: `A` key or left arrow key
  - Move Right: `D` key or right arrow key
  - Jump: `W` key
  - Attack: `S` key

- **Enemy Controls:**
  - Move Left: Left arrow key
  - Move Right: Right arrow key
  - Jump: Up arrow key
  - Attack: Down arrow key

## Gameplay

Foins' Fighters offers an engaging gameplay experience with responsive controls and captivating animations. Here's a brief overview:

- **Player Character (Fire Knight):**
  - Idle Animation
  - Running Animation
  - Jumping Animation
  - Falling Animation
  - Attack Animation
  - Taking Hit Animation
  - Death Animation

- **Enemy Character (Water Princess):**
  - Idle Animation
  - Running Animation
  - Jumping Animation
  - Falling Animation
  - Attack Animation
  - Taking Hit Animation
  - Death Animation

## Classes

### 1. `Sprite` Class

The `Sprite` class handles the rendering and animation of game elements. It includes parameters for position, direction, image source, scale, frames, and offset.

### 2. `Fighter` Class

The `Fighter` class extends the `Sprite` class and introduces additional features such as velocity, health, attack functionality, and specialized animations for different states.

---

## Animations

The game features fluid animations for both the player character and the enemy. Animation frames are managed seamlessly, providing a visually appealing and immersive experience.

## Collision Detection

Precise collision detection is implemented, especially in the attack zone. The game checks for collisions between the player and enemy characters during attacks, triggering appropriate actions and animations.

## Health and Victory

Players and enemies have health bars displayed at the top of the screen. The game ends when either the player or the enemy's health drops to zero. A winner is declared based on the remaining health.

---
## Installation
```bash
# Clone the repository
git clone https://github.com/your-username/your-game.git

# Navigate to the game directory
cd your-game

# Open index.html in a web browser
```
## How to Play
Run the game in your browser, and play with a friend!

## Dependencies
None since the game is implemented using plain HTML, CSS, and JavaScript, making use of the HTML5 Canvas API for rendering graphics.
