document.addEventListener('DOMContentLoaded', () => {
    const connectionTypeRadios = document.querySelectorAll('input[name="connectionType"]');
    const addResistorBtn = document.getElementById('addResistor');
    const resistorValueInput = document.getElementById('resistorValue');
    const resistorList = document.getElementById('resistorList');
    const resultDisplay = document.getElementById('result');

    let resistors = [];
    let connectionType = 'parallel';

    // Update connection type
    connectionTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            connectionType = e.target.value;
            calculateResistance();
        });
    });

    // Add resistor
    addResistorBtn.addEventListener('click', () => {
        const value = parseFloat(resistorValueInput.value);
        if (!isNaN(value) && value > 0) {
            resistors.push(value);
            renderResistors();
            calculateResistance();
            resistorValueInput.value = '';
        } else {
            alert('Please enter a valid positive resistance value.');
        }
    });

    // Render resistor list
    function renderResistors() {
        resistorList.innerHTML = '';
        resistors.forEach((res, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `${res} Ω <span class="remove-btn" data-index="${index}">✖</span>`;
            resistorList.appendChild(li);
        });

        // Add remove functionality
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                resistors.splice(index, 1);
                renderResistors();
                calculateResistance();
            });
        });
    }

    // Calculate resultant resistance
    function calculateResistance() {
        if (resistors.length === 0) {
            resultDisplay.textContent = '0 Ω';
            return;
        }

        let total;
        if (connectionType === 'series') {
            total = resistors.reduce((acc, curr) => acc + curr, 0);
        } else {
            total = 1 / resistors.reduce((acc, curr) => acc + 1 / curr, 0);
        }

        resultDisplay.textContent = `${total.toFixed(2)} Ω`;
    }
});