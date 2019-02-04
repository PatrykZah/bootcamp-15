'use strict';

function Phone(brand, price, color) {
  this.brand = brand;
	this.price = price;
	this.color = color;
}

Phone.prototype.printInfo = function() {
	console.log("The phone brand is " + this.brand + ", color is " + this.color + " and the price is " + this.price + ".");
}

var SamsungGalaxyS6 = new Phone("Apple", 1250, "black");
var iPhone6S = new Phone("Apple", 2250, "silver");
var OnePlusOne = new Phone("OnePlus", 550, "red");

SamsungGalaxyS6.printInfo();
iPhone6S.printInfo();
OnePlusOne.printInfo();


///////

function Button(text) {
	this.text = text || 'Hello'
}

Button.prototype = {
	create : function() {
		this.element = document.createElement('button')
		this.element.innerText = this.text
		this.element.addEventListener('click', function() {
			alert(this.innerText);
		});
		document.body.appendChild(this.element);
	}
}

var btn1 = new Button("test1")
btn1.create();

var btn2 = new Button("test2")
btn2.create();

var btn3 = new Button()
btn3.create();