
class AuxiliarySchedule {

	#data1   = null;
	#canvas  = null;
  #context = null;

  #width        = 1250.00;
  #height       =  100.00;
  #marginXLeft  =   65.00;
  #marginXRight =   25.00;

  #labels = [
		"date",
  	"time", 
  	"open", 
  	"high", 
  	"low" , 
  	"close" ];

  constructor(selector) { 
  	this.#canvas  = document.querySelector(selector);
  	this.#context = this.#canvas.getContext("2d");
  	this.#canvas.style.width  = (this.#marginXLeft + this.#width + this.#marginXRight)  + "px"; 
		this.#canvas.style.height = this.#height + "px";
		this.#canvas.width  = this.#marginXLeft + this.#width;
		this.#canvas.height = this.#height;
  }

  setData(data1) {
  	this.#data1 = new Object();
  	this.#labels.forEach(
  		(element) => {
  			this.#data1[element] = new Array(data1.length)
  			for (let i = 0; i < data1.length; i++)
  				this.#data1[element][i] = data1[i][element];
  		})}

  drawGraph() {

  	function min(array) {
    	let minValue = +(10**10);
    	for(let i = 0; i < array.length; i++)
    		if (array[i] < minValue) minValue = array[i];
    	return minValue;
    }

    function max(array) {
    	let maxValue = -(10**10);
    	for(let i = 0; i < array.length; i++)
    		if (array[i] > maxValue) maxValue = array[i];
    	return maxValue;
    }

    let minY  = Math.floor(0.9985 * min(this.#data1["close"]));
    let maxY  = Math.ceil (1.0015 * max(this.#data1["close"]));
    let yRate = this.#height / (maxY - minY);
    let xRate = (this.#width - this.#marginXRight) / this.#data1["time"].length;

  	for (let i = 0; i < this.#data1["time"].length - 1; i++) {
  		this.#context.beginPath();
    	this.#context.setLineDash([]);
    	this.#context.lineWidth   = "1.0";
    	this.#context.strokeStyle = "RGBA(255.0, 255.0, 255.0, 0.850)";
    	this.#context.moveTo(this.#marginXLeft + xRate *  i     , yRate * (maxY - this.#data1["close"][i]));
    	this.#context.lineTo(this.#marginXLeft + xRate * (i + 1), yRate * (maxY - this.#data1["close"][i + 1]));
    	this.#context.stroke();
    	this.#context.closePath();
  	}
  }

}