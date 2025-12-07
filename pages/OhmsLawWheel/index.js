function autoResizeFont(input) {
    let fontSize = 24;
    input.style.fontSize = fontSize + "px";

    while (input.scrollWidth > input.clientWidth && fontSize > 10) {
        fontSize--;
        input.style.fontSize = fontSize + "px";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.var-input');
    const clearBtn = document.getElementById('clear-btn');
    const clickSound = document.getElementById('click-sound');

    const inputSoundFiles = ['1.mp3'];

    const innerV = document.getElementById('inner-V');
    const innerI = document.getElementById('inner-I');
    const innerR = document.getElementById('inner-R');
    const innerP = document.getElementById('inner-P');

    const innerQuantities = [
        innerV, innerI, innerR, innerP
    ]


    // 1. CLEAR LOGIC
    const clearOtherInstances = (activeInput, variable) => {
        const targets = document.querySelectorAll(`.var-input[data-var="${variable}"]`);
        let clearedAny = false;
        targets.forEach(input => {
            if (input !== activeInput && input.value !== '') {
                input.value = '';
                // If we clear an input programmatically, we must re-evaluate THAT input's group too
                // to see if its inner label needs to revert to default.
                evaluateGroup(input.closest('.calc-group'));
                clearedAny = true;
            }
        });
    };

    clearBtn.addEventListener('click', () => {
        // Play random satisfying sound (1-10.mp3)
        if (clickSound) {
            const randomNum = Math.floor(Math.random() * 10) + 1;
            clickSound.src = `../../assets/ButtonClicks/${randomNum}.mp3`;
            clickSound.currentTime = 0;
            clickSound.play();
        }

        // Clear all inputs
        inputs.forEach(input => {
            input.value = '';
            input.style.fontSize = "24px";
        });

        // Reset all center labels to default letters
        innerV.textContent = 'V';
        innerI.textContent = 'I';
        innerR.textContent = 'R';
        innerP.textContent = 'P';

        innerV.style.fontSize = "60px";
        innerI.style.fontSize = "60px";
        innerR.style.fontSize = "60px";
        innerP.style.fontSize = "60px";
    });

    // 2. CALCULATION LOGIC
    const calculate = (formulaType, vars) => {
        const V = vars.V, I = vars.I, R = vars.R, P = vars.P;
        switch (formulaType) {
            // I Targets
            case 'V/R': return V / R;
            case 'P/V': return P / V;
            case 'sqrt(P/R)': return Math.sqrt(P / R);

            // R Targets
            case 'V^2/P': return (V * V) / P;
            case 'V/I': return V / I;
            case 'P/I^2': return P / (I * I);

            // P Targets
            case 'I^2*R': return (I * I) * R;
            case 'V^2/R': return (V * V) / R;
            case 'V*I': return V * I;

            // V Targets
            case 'I*R': return I * R;
            case 'sqrt(P*R)': return Math.sqrt(P * R);
            case 'P/I': return P / I;

            default: return null;
        }
    };

    const evaluateGroup = (group) => {
        if (!group) return;

        const target = group.getAttribute('data-target');
        const formula = group.getAttribute('data-formula');
        const groupInputs = group.querySelectorAll('.var-input');
        const innerLabel = document.getElementById(`inner-${target}`);

        // Check if all inputs in this group have values
        let allFilled = true;
        const vars = {};

        groupInputs.forEach(inp => {
            const val = parseFloat(inp.value);
            if (isNaN(val)) {
                allFilled = false;
            } else {
                vars[inp.getAttribute('data-var')] = val;
            }
        });

        if (allFilled) {
            const result = calculate(formula, vars);
            // Update inner text, fix to 2 decimal places if needed, remove trailing zeros
            if (result !== null && isFinite(result)) {
                innerLabel.textContent = parseFloat(result.toFixed(4));
            } else {
                innerLabel.textContent = target; // Fallback if div by zero
                innerV.style.fontSize = "60px";
                innerI.style.fontSize = "60px";
                innerR.style.fontSize = "60px";
                innerP.style.fontSize = "60px";
            }
            autoResizeFont(innerLabel)
        } else {
            // If not filled, REVERT to default letter
            // Note: In a real app we might check if ANOTHER group for this target is active,
            // but per user rules "only one V can be filled", so we can safely revert.
            innerLabel.textContent = target;
            innerV.style.fontSize = "60px";
            innerI.style.fontSize = "60px";
            innerR.style.fontSize = "60px";
            innerP.style.fontSize = "60px";
        }
    };

    // 3. EVENT LISTENERS
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const variable = e.target.getAttribute('data-var');
            clearOtherInstances(e.target, variable);
            const group = e.target.closest('.calc-group');
            evaluateGroup(group);
        });

        input.addEventListener('dblclick', (e) => {
            input.value = '';
            const group = e.target.closest('.calc-group');
            evaluateGroup(group);
            input.style.fontSize = "24px"
        });

        // Updated focus listener with sound logic
        input.addEventListener('focus', (e) => {
            e.target.select();

            if (clickSound) {
                // Select random sound from the specific list: 1, 4, 5, 6
                const randomSound = inputSoundFiles[Math.floor(Math.random() * inputSoundFiles.length)];
                clickSound.src = `../../assets/ButtonClicks/${randomSound}`;
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log(e));
            }
        });

        input.addEventListener('input', () => autoResizeFont(input));
    });

    inputs.forEach(input => {
        input.addEventListener('input', () => autoResizeFont(input));
    });
});