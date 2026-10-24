import { CalculatorKey } from './CalculatorKey.js';
import { DPadNavigation } from './DPadNavigation.js';

interface ScientificKeypadProps {
  onInsert: (token: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onCalculate: () => void;
  onToggleShift: () => void;
  onToggleAlpha: () => void;
  onToggleAngleUnit: () => void;
  onToggleSD: () => void;
  onReplayUp: () => void;
  onReplayDown: () => void;
  shiftActive: boolean;
  alphaActive: boolean;
}

export function ScientificKeypad({
  onInsert,
  onDelete,
  onClear,
  onCalculate,
  onToggleShift,
  onToggleAlpha,
  onToggleAngleUnit,
  onToggleSD,
  onReplayUp,
  onReplayDown,
  shiftActive,
  alphaActive,
}: ScientificKeypadProps) {
  const handleKey = (normal: string, shift?: string, alpha?: string) => {
    if (shiftActive && shift) {
      onInsert(shift);
    } else if (alphaActive && alpha) {
      onInsert(alpha);
    } else {
      onInsert(normal);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 xs:space-y-2 mt-2 select-none w-full">
      {/* Top Controls Cluster: SHIFT, ALPHA, D-PAD, MODE, ON */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex flex-col space-y-1.5 sm:space-y-2 w-12 xs:w-13 sm:w-14">
          <CalculatorKey
            label="SHIFT"
            variant="shift"
            onClick={onToggleShift}
            className={shiftActive ? 'ring-2 ring-amber-400' : ''}
          />
          <CalculatorKey
            label="ALPHA"
            variant="alpha"
            onClick={onToggleAlpha}
            className={alphaActive ? 'ring-2 ring-rose-400' : ''}
          />
        </div>

        {/* Central Circular Replay Controller */}
        <DPadNavigation
          onUp={onReplayUp}
          onDown={onReplayDown}
        />

        <div className="flex flex-col space-y-1.5 sm:space-y-2 w-12 xs:w-13 sm:w-14">
          <CalculatorKey
            label="MODE"
            shiftLabel="SETUP"
            variant="function"
            onClick={onToggleAngleUnit}
          />
          <CalculatorKey
            label="ON"
            variant="function"
            onClick={onClear}
          />
        </div>
      </div>

      {/* Scientific Function Grid (Row 1: Fraction, Sqrt, Square, Power, Log, Ln) */}
      <div className="grid grid-cols-6 gap-1 xs:gap-1.5 px-0.5">
        <CalculatorKey
          label="x/y"
          shiftLabel="d/c"
          onClick={() => handleKey('/')}
        />
        <CalculatorKey
          label="√"
          shiftLabel="³√"
          onClick={() => handleKey('sqrt(', 'nthRoot(')}
        />
        <CalculatorKey
          label="x²"
          shiftLabel="x³"
          onClick={() => handleKey('^2', '^3')}
        />
        <CalculatorKey
          label="xʸ"
          shiftLabel="ʸ√x"
          onClick={() => handleKey('^', 'nthRoot(')}
        />
        <CalculatorKey
          label="log"
          shiftLabel="10ˣ"
          onClick={() => handleKey('log10(', '10^(')}
        />
        <CalculatorKey
          label="ln"
          shiftLabel="eˣ"
          onClick={() => handleKey('ln(', 'e^(')}
        />
      </div>

      {/* Scientific Function Grid (Row 2: (-), DEG, hyp, sin, cos, tan) */}
      <div className="grid grid-cols-6 gap-1 xs:gap-1.5 px-0.5">
        <CalculatorKey
          label="(-)"
          alphaLabel="A"
          onClick={() => handleKey('-')}
        />
        <CalculatorKey
          label="° ' ''"
          shiftLabel="<-"
          alphaLabel="B"
          onClick={onToggleAngleUnit}
        />
        <CalculatorKey
          label="hyp"
          alphaLabel="C"
          onClick={() => handleKey('sinh(')}
        />
        <CalculatorKey
          label="sin"
          shiftLabel="sin⁻¹"
          alphaLabel="D"
          onClick={() => handleKey('sin(', 'asin(')}
        />
        <CalculatorKey
          label="cos"
          shiftLabel="cos⁻¹"
          alphaLabel="E"
          onClick={() => handleKey('cos(', 'acos(')}
        />
        <CalculatorKey
          label="tan"
          shiftLabel="tan⁻¹"
          alphaLabel="F"
          onClick={() => handleKey('tan(', 'atan(')}
        />
      </div>

      {/* Scientific Function Grid (Row 3: RCL, ENG, (, ), S<=>D, M+) */}
      <div className="grid grid-cols-6 gap-1 xs:gap-1.5 px-0.5">
        <CalculatorKey
          label="RCL"
          shiftLabel="STO"
          onClick={() => handleKey('Ans')}
        />
        <CalculatorKey
          label="ENG"
          shiftLabel="<-"
          onClick={() => handleKey('*10^')}
        />
        <CalculatorKey
          label="("
          onClick={() => handleKey('(')}
        />
        <CalculatorKey
          label=")"
          alphaLabel="X"
          onClick={() => handleKey(')')}
        />
        <CalculatorKey
          label="S<=>D"
          onClick={onToggleSD}
        />
        <CalculatorKey
          label="M+"
          alphaLabel="M"
          onClick={onCalculate}
        />
      </div>

      {/* Main Numeric & Operator Pad (5 columns) */}
      <div className="grid grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2 px-0.5 pt-0.5 sm:pt-1">
        {/* Row 1: 7, 8, 9, DEL, AC */}
        <CalculatorKey
          label="7"
          variant="number"
          onClick={() => handleKey('7')}
        />
        <CalculatorKey
          label="8"
          variant="number"
          onClick={() => handleKey('8')}
        />
        <CalculatorKey
          label="9"
          variant="number"
          onClick={() => handleKey('9')}
        />
        <CalculatorKey
          label="DEL"
          variant="action"
          shiftLabel="INS"
          onClick={onDelete}
        />
        <CalculatorKey
          label="AC"
          variant="action"
          shiftLabel="OFF"
          onClick={onClear}
        />

        {/* Row 2: 4, 5, 6, ×, ÷ */}
        <CalculatorKey
          label="4"
          variant="number"
          onClick={() => handleKey('4')}
        />
        <CalculatorKey
          label="5"
          variant="number"
          onClick={() => handleKey('5')}
        />
        <CalculatorKey
          label="6"
          variant="number"
          onClick={() => handleKey('6')}
        />
        <CalculatorKey
          label="×"
          shiftLabel="nPr"
          onClick={() => handleKey('×', 'nPr(')}
        />
        <CalculatorKey
          label="÷"
          shiftLabel="nCr"
          onClick={() => handleKey('÷', 'nCr(')}
        />

        {/* Row 3: 1, 2, 3, +, − */}
        <CalculatorKey
          label="1"
          variant="number"
          onClick={() => handleKey('1')}
        />
        <CalculatorKey
          label="2"
          variant="number"
          onClick={() => handleKey('2')}
        />
        <CalculatorKey
          label="3"
          variant="number"
          onClick={() => handleKey('3')}
        />
        <CalculatorKey
          label="+"
          shiftLabel="Pol"
          onClick={() => handleKey('+')}
        />
        <CalculatorKey
          label="−"
          shiftLabel="Rec"
          onClick={() => handleKey('-')}
        />

        {/* Row 4: 0, ., ×10ˣ, Ans, = */}
        <CalculatorKey
          label="0"
          variant="number"
          onClick={() => handleKey('0')}
        />
        <CalculatorKey
          label="."
          variant="number"
          shiftLabel="Ran#"
          onClick={() => handleKey('.')}
        />
        <CalculatorKey
          label="×10ˣ"
          shiftLabel="π"
          alphaLabel="e"
          onClick={() => handleKey('*10^', 'pi', 'e')}
        />
        <CalculatorKey
          label="Ans"
          shiftLabel="%"
          onClick={() => handleKey('Ans', '%')}
        />
        <CalculatorKey
          label="="
          variant="equals"
          onClick={onCalculate}
        />
      </div>
    </div>
  );
}
