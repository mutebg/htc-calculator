'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Calculator = (function () {
	function Calculator() {
		var _this = this;

		_classCallCheck(this, Calculator);

		this.operators = ['+', '-', 'x', '/'];
		this.functions = ['sin', 'cos', 'tan', 'in', 'log'];
		this.screenInput = document.querySelector('.screen');
		this.buttons = document.querySelector('.buttons-container');
		this.buttons.addEventListener('click', function (event) {
			_this.press(event);
		});
	}

	_createClass(Calculator, [{
		key: 'press',
		value: function press(event) {
			if (event.target.tagName === 'BUTTON') {
				var value = event.target.getAttribute('data-name');

				// Operator is clicked
				if (this.operators.indexOf(value) >= 0) {

					this.operation(value);

					// FUNCTIONS
				} else if (this.functions.indexOf(value) >= 0) {
					console.log('to do ');

					// CLEAR
				} else if (value === 'clear') {

					this.clear();

					//BACKSPACE
				} else if (value === 'back') {

					this.backspace();

					//EQUAL
				} else if (value === '=') {

					this.equation();

					//DEFAULT BEHAVIOR - add symbol to sreen
				} else {

					this.screenInput.value += value;
				}
			}
		}
	}, {
		key: 'operation',
		value: function operation(value) {
			var inputValue = this.screenInput.value;

			// Get the last character from the equation
			var lastChar = inputValue[inputValue.length - 1];

			// Only add operator if input is not empty and there is no operator at the last
			if (inputValue != '' && this.operators.indexOf(lastChar) == -1) {
				this.screenInput.value += value;

				// Allow minus if the string is empty
			} else if (inputValue == '' && value == '-') {
				this.screenInput.value += value;
			}

			// Replace the last operator (if exists) with the newly pressed operator
			if (this.operators.indexOf(lastChar) > -1 && inputValue.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				this.screenInput.value = inputValue.replace(/.$/, value);
			}
		}
	}, {
		key: 'equation',
		value: function equation() {
			var equation = this.screenInput.value;
			var lastChar = equation[equation.length - 1];

			// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			equation = equation.replace(/x/g, '*').replace(/÷/g, '/');

			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if (this.operators.indexOf(lastChar) > -1 || lastChar == '.') {
				equation = equation.replace(/.$/, '');
			}

			if (equation) {
				this.screenInput.value = eval(equation);
			}
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.screenInput.value = '';
		}
	}, {
		key: 'backspace',
		value: function backspace() {
			this.screenInput.value = this.screenInput.value.substring(0, this.screenInput.value.length - 1);
		}
	}]);

	return Calculator;
})();

var calc = new Calculator();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js').then(function (registration) {
		// Registration was successful
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	})['catch'](function (err) {
		// registration failed :(
		console.log('ServiceWorker registration failed: ', err);
	});
}