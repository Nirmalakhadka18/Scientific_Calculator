# Scientific Calculator (fx-991ES Plus Edition)

A high-precision, responsive scientific calculator web application inspired by the classic scientific calculator (fx-991ES Plus 2nd Edition). Built with React, TypeScript, Tailwind CSS, MathLive, and mathjs.

## ✨ Features

- **Realistic Physical Calculator Design**: Authentic keypad layout, natural textbook display, LCD status bar (DEG/RAD, M, STO, Math), and solar panel aesthetic.
- **Natural Math Input & Display**: Supports natural fractions, square roots, exponents, parentheses, and algebraic expressions powered by MathLive.
- **Full Scientific Functions**:
  - Trigonometry (sin, cos, tan, cot, sec, cosec) in both DEG and RAD modes
  - Hyperbolic functions (sinh, cosh, tanh)
  - Logarithms ($\ln$, $\log_{10}$, custom base $\log$)
  - Powers & Roots ($x^2$, $x^3$, $x^y$, $\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt[y]{x}$)
  - Factorials ($x!$), permutations ($nPr$), and combinations ($nCr$)
  - Scientific constants ($\pi$, $e$)
  - Angle unit toggles (DEG / RAD)
  - Standard/Decimal conversion ($S \Leftrightarrow D$)
- **Memory & Variables**: Ans, M+, M-, MR, Clear memory
- **Calculation History**: Review past expressions and recall previous results
- **Keyboard Support**: Full physical keyboard support (numbers, +, -, *, /, Enter, Backspace, etc.)
- **Fully Responsive**: Optimized for mobile phones, tablets, laptops, and desktop screens.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nirmalakhadka18/Scientific_Calculator.git
   cd Scientific_Calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running Tests & Building

- **Run Unit & Component Tests**:
  ```bash
  npm run test
  ```
- **Type Checking**:
  ```bash
  npx tsc --noEmit
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Math Engine**: mathjs + custom evaluator & latexParser
- **Math Formatting**: MathLive
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## 📄 License

MIT
