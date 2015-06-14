class Calculator {

    constructor() {
    	this.operators = ['+', '-', 'x', '/'];
		this.functions = ['sin', 'cos', 'tan', 'in', 'log'];
		this.screenInput = document.querySelector('.screen');
		this.buttons = document.querySelector('.buttons-container');
		this.buttons.addEventListener('click', event => {
			this.press(event);
		});
    }

    press(event) {
    	if ( event.target.tagName === 'BUTTON' ) {
			var value = event.target.getAttribute('data-name');


			// Operator is clicked
			if ( this.operators.indexOf(value) >= 0 ) {

				this.operation(value);


			// FUNCTIONS
			} else if ( this.functions.indexOf(value) >= 0 ) {
				console.log('to do ');


			// CLEAR
			} else if ( value === 'clear') {

				this.clear();


			//BACKSPACE
			} else if ( value === 'back' ) {

				this.backspace();


			//EQUAL
			} else if ( value === '=' ) {

				this.equation();


			//DEFAULT BEHAVIOR - add symbol to sreen
			} else {

				this.screenInput.value += value;

			}
		}
    }

    operation(value) {
    	var inputValue = this.screenInput.value;

		// Get the last character from the equation
		var lastChar = inputValue[inputValue.length - 1];

		// Only add operator if input is not empty and there is no operator at the last
		if(inputValue != '' && this.operators.indexOf(lastChar) == -1) {
			this.screenInput.value += value;

		// Allow minus if the string is empty
		} else if(inputValue == '' && value == '-')  {
			this.screenInput.value += value;
		}

		// Replace the last operator (if exists) with the newly pressed operator
		if( this.operators.indexOf(lastChar) > -1 && inputValue.length > 1) {
			// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
			this.screenInput.value = inputValue.replace(/.$/, value);
		}
    }

    equation() {
		var equation = this.screenInput.value;
		var lastChar = equation[equation.length - 1];

		// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
		equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

		// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
		if( this.operators.indexOf(lastChar) > -1 || lastChar == '.' ) {
			equation = equation.replace(/.$/, '');
		}

		if( equation ) {
			this.screenInput.value = eval(equation);
		}
    }

    clear() {
    	this.screenInput.value = '';
    }

    backspace() {
    	this.screenInput.value = this.screenInput.value.substring(0, this.screenInput.value.length - 1);
    }
}

var calc = new Calculator();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js').then( registration => {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	}).catch( err => {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	});
}