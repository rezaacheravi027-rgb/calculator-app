class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.memory = 0;
        this.history = [];
        this.historyExpression = '';
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadHistory();
        this.updateMemoryIndicator();
    }

    initializeElements() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history');
        this.historyList = document.getElementById('history-list');
        this.memoryIndicator = document.getElementById('memory-indicator');
    }

    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => {
                this.inputDigit(button.dataset.value);
            });
        });

        // Operator buttons
        document.querySelectorAll('.btn.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.handleOperator(button.dataset.action);
            });
        });

        // Function buttons
        document.querySelectorAll('.btn.function').forEach(button => {
            button.addEventListener('click', () => {
                this.handleFunction(button.dataset.action);
            });
        });

        // Equals button
        document.querySelector('.btn.equals').addEventListener('click', () => {
            this.handleEquals();
        });

        // Memory buttons
        document.getElementById('mc').addEventListener('click', () => this.memoryClear());
        document.getElementById('mr').addEventListener('click', () => this.memoryRecall());
        document.getElementById('m-plus').addEventListener('click', () => this.memoryAdd());
        document.getElementById('m-minus').addEventListener('click', () => this.memorySubtract());

        // Clear history button
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
        this.updateDisplay();
    }

    handleOperator(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.deleteLastDigit();
                break;
            case 'percent':
                this.calculatePercent();
                break;
            case 'negate':
                this.negate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperator(action);
                break;
        }
    }

    handleFunction(action) {
        const value = parseFloat(this.displayValue);
        let result;
        let expression;

        switch(action) {
            case 'sqrt':
                if (value < 0) {
                    this.displayValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = Math.sqrt(value);
                expression = `√(${value})`;
                break;
            case 'square':
                result = value * value;
                expression = `(${value})²`;
                break;
            case 'inverse':
                if (value === 0) {
                    this.displayValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = 1 / value;
                expression = `1/(${value})`;
                break;
            case 'power':
                this.firstOperand = value;
                this.operator = 'power';
                this.waitingForSecondOperand = true;
                this.historyExpression = `${value}^`;
                this.updateHistoryDisplay();
                return;
        }

        this.displayValue = String(result);
        this.addToHistory(expression, result);
        this.updateDisplay();
    }

    setOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = String(result);
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        
        const operatorSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        
        this.historyExpression = `${this.firstOperand} ${operatorSymbols[nextOperator]}`;
        this.updateHistoryDisplay();
    }

    handleEquals() {
        const inputValue = parseFloat(this.displayValue);

        if (this.operator && this.firstOperand !== null) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            
            const operatorSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷',
                'power': '^'
            };
            
            const expression = `${this.firstOperand} ${operatorSymbols[this.operator]} ${inputValue}`;
            this.addToHistory(expression, result);
            
            this.displayValue = String(result);
            this.firstOperand = null;
            this.operator = null;
            this.historyExpression = '';
            this.updateDisplay();
            this.updateHistoryDisplay();
        }
    }

    calculate(firstOperand, secondOperand, operator) {
        switch(operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            case 'power':
                return Math.pow(firstOperand, secondOperand);
            default:
                return secondOperand;
        }
    }

    clear() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.historyExpression = '';
        this.updateDisplay();
        this.updateHistoryDisplay();
    }

    deleteLastDigit() {
        if (this.displayValue.length > 1) {
            this.displayValue = this.displayValue.slice(0, -1);
        } else {
            this.displayValue = '0';
        }
        this.updateDisplay();
    }

    calculatePercent() {
        const value = parseFloat(this.displayValue);
        this.displayValue = String(value / 100);
        this.updateDisplay();
    }

    negate() {
        const value = parseFloat(this.displayValue);
        this.displayValue = String(value * -1);
        this.updateDisplay();
    }

    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
    }

    memoryRecall() {
        this.displayValue = String(this.memory);
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.displayValue);
        this.updateMemoryIndicator();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.displayValue);
        this.updateMemoryIndicator();
    }

    updateMemoryIndicator() {
        if (this.memory !== 0) {
            this.memoryIndicator.textContent = 'M';
        } else {
            this.memoryIndicator.textContent = '';
        }
    }

    addToHistory(calculation, result) {
        const historyItem = {
            calculation,
            result,
            timestamp: new Date().toLocaleString('fa-IR')
        };
        
        this.history.unshift(historyItem);
        
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        
        this.history.forEach((item, index) => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.innerHTML = `
                <div class="calculation">${item.calculation}</div>
                <div class="result">= ${item.result}</div>
            `;
            
            historyElement.addEventListener('click', () => {
                this.displayValue = String(item.result);
                this.updateDisplay();
            });
            
            this.historyList.appendChild(historyElement);
        });
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }

    updateDisplay() {
        this.display.textContent = this.displayValue;
    }

    updateHistoryDisplay() {
        this.historyDisplay.textContent = this.historyExpression;
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            this.inputDigit(e.key);
        } else if (e.key === '+') {
            this.setOperator('add');
        } else if (e.key === '-') {
            this.setOperator('subtract');
        } else if (e.key === '*') {
            this.setOperator('multiply');
        } else if (e.key === '/') {
            e.preventDefault();
            this.setOperator('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.handleEquals();
        } else if (e.key === 'Escape') {
            this.clear();
        } else if (e.key === 'Backspace') {
            this.deleteLastDigit();
        } else if (e.key === '%') {
            this.calculatePercent();
        }
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
