
class CandlestickChart {

	// ==== ==== ==== ==== ... ==== ==== ==== ====

	#data    = null;
	#canvas  = null;
  #context = null;

  #startPoint  = null;
  #sizeWinddow = null;

	#width         = 1250.00;
  #height        = 	250.00;
  #marginXLeft   =   65.00;
  #marginXRight  =   25.00;
  #marginYBottom =   65.00;
  #marginYTop    =   25.00;
  #xAxisGridStep =   60.00;
  #yAxisGridStep =   25.00;
  #candleWidth   =   10.00;
  #candleIndent  =    2.50;

  #labels = [
		"date",
  	"time", 
  	"open", 
  	"high", 
  	"low" , 
  	"close" ];

  // ==== ==== ==== ==== ... ==== ==== ==== ====
      
  constructor(selector) { 
  	this.#canvas  = document.querySelector(selector);
  	this.#context = this.#canvas.getContext("2d");
  	this.#canvas.style.width  = (this.#width  + this.#marginXLeft + this.#marginXRight)  + "px"; 
		this.#canvas.style.height = (this.#height + this.#marginYTop  + this.#marginYBottom) + "px";
		this.#canvas.width  = (this.#width  + this.#marginXLeft + this.#marginXRight);
		this.#canvas.height = (this.#height + this.#marginYTop  + this.#marginYBottom);
    
  }

  // ==== ==== ==== ==== ... ==== ==== ==== ====

  setData(data) {
  	this.#data = new Object();
  	this.#labels.forEach(
  		(element) => {
  			this.#data[element] = new Array(data.length)
  			for (let i = 0; i < data.length; i++)
  				this.#data[element][i] = data[i][element];
  		})}

  getCanvas() {
    return this.#canvas;
  }

  getSizeData() {
    return this.#data["time"].length;
  }

  getStartPoint() {
    return this.#startPoint;
  }

  // ==== ==== ==== ==== ... ==== ==== ==== ====

  clearCanvas() {
    this.#context.clearRect(0.0, 0.0, this.#canvas.width, this.#canvas.height);
  }

  // ==== ... ====

  drawGrid() {

		for (let x  = this.#marginXLeft + this.#xAxisGridStep; 
						 x <= this.#marginXLeft + this.#width; 
						 x += this.#xAxisGridStep) 
		{
			this.#context.beginPath();
			this.#context.setLineDash([]);
			this.#context.lineWidth   = "1.0";
			this.#context.strokeStyle = "RGBA(255.0, 255.0, 255.0, 0.20)";
			this.#context.moveTo(x, this.#marginYTop);
			this.#context.lineTo(x, this.#marginYTop + this.#height);
			this.#context.stroke();
			this.#context.closePath();
		}

		for (let y  = this.#marginYTop; 
						 y  < this.#marginYTop + this.#height; 
						 y += this.#yAxisGridStep) 
		{
			this.#context.beginPath();
			this.#context.setLineDash([]);
			this.#context.lineWidth   = "1.0";
			this.#context.strokeStyle = "RGBA(255.0, 255.0, 255.0, 0.20)";
			this.#context.moveTo(              this.#marginXLeft, y);
			this.#context.lineTo(this.#width + this.#marginXLeft, y);
			this.#context.stroke();
			this.#context.closePath();
		}

  }

  // ==== ... ====

  drawGraph(startPoint, sizeWinddow) {

  	if (startPoint < 0 || 
  		 (startPoint + sizeWinddow) >= this.#data["time"].length) { 
  		throw new Error() 
  	} 

  	this.#startPoint  = startPoint;
    this.#sizeWinddow = sizeWinddow;

    // ====  ==== ... ====  ====

    this.drawGrid();

    // ====  ==== ... ====  ====

    function min(array) {
    	let minValue = +(10**10);
    	for(let i = startPoint; i < startPoint + sizeWinddow; i++)
    		if (array[i] < minValue) minValue = array[i];
    	return minValue;
    }

    function max(array) {
    	let maxValue = -(10**10);
    	for(let i = startPoint; i < startPoint + sizeWinddow; i++)
    		if (array[i] > maxValue) maxValue = array[i];
    	return maxValue;
    }

    let minY  = Math.floor(0.9985 * min(this.#data["low" ]));
    let maxY  = Math.ceil (1.0015 * max(this.#data["high"]));
    let yRate = this.#height / (maxY - minY);

    // ====  ==== ... ====  ==== 

    this.#context.font      = "12px serif";
    this.#context.fillStyle = "RGBA(255.0, 255.0, 255.0, 1.0)";

    let rowsCount = this.#height / this.#yAxisGridStep;

    for (let i = 1; i < rowsCount; i++) {
    	this.#context.fillText(
    		`${Math.round(minY + i * (maxY - minY) / rowsCount)}`, 
    		this.#marginXLeft - 40.0, 
    		this.#marginYTop + (rowsCount - i) * this.#yAxisGridStep + 4.0);
    }

    // ====  ==== ... ====  ==== 

    for (let i = 1; i < (this.#width / this.#xAxisGridStep); i++) {
    	this.#context.fillText(
    		`${this.#data["time"][this.#startPoint + i * 4].substring(0, 5)}`, 
    		this.#marginXLeft + i * this.#xAxisGridStep - 14, 
    		this.#marginYTop + this.#height + 20);
    }

    let array = [];
    for (let i = 0; i < sizeWinddow - 1; i++) {
    	let currentDate = this.#data["date"][this.#startPoint + i];
    	let nextDate    = this.#data["date"][this.#startPoint + (i + 1)];
    	if (currentDate != nextDate) {
    		array.push(i);
    		this.#context.beginPath();
    		this.#context.setLineDash([]);
    		this.#context.lineWidth   = "1.0";
    		this.#context.strokeStyle = "RGBA(255.0, 255.0, 255.0, 0.20)";
    		this.#context.moveTo(
    		this.#marginXLeft + i * (this.#candleWidth + 2 * this.#candleIndent), 
    		this.#marginYTop + this.#height + 30);
    		this.#context.lineTo(
    		this.#marginXLeft + i * (this.#candleWidth + 2 * this.#candleIndent), 
    		this.#marginYTop + this.#height + 60);
    		this.#context.stroke();
    		this.#context.closePath();
    	}
    }

		array.unshift(0);
    array.push(sizeWinddow - 1);
    for (let i = 0; i < array.length - 1; i++) {
    	let p = array[i] + (array[i + 1] - array[i]) / 2;
    	this.#context.fillText(
    		`${this.#data["date"][this.#startPoint + i * 4].replace(/-/gi, "/")}`, 
    		this.#marginXLeft + p * (this.#candleWidth + 2 * this.#candleIndent), 
    		this.#marginYTop + this.#height + 45);
    }

    // ====  ==== ... ====  ==== 

		let y;
		let xCandleBody; 
		let xCandleShadows; 
		let height;

    let upperShadowLength;
    let bottomShadowLength;

    let bottomOfUpperShadow;
    let topOfLowerShadow;

    let topOfUpperShadow;
    let bottomOfLowerShadow;

    for (let i = 0; i < sizeWinddow; i++) {

    	xCandleBody = this.#marginXLeft + this.#candleIndent + i * (this.#candleWidth + 2 * this.#candleIndent);
      xCandleShadows = xCandleBody + this.#candleWidth / 2;
      height = Math.abs(this.#data["open"][this.#startPoint + i] - this.#data["close"][this.#startPoint + i]) * yRate;

      topOfUpperShadow    = this.#data["high"][this.#startPoint + i];
      bottomOfLowerShadow = this.#data["low" ][this.#startPoint + i];

       if (this.#data["open"][this.#startPoint + i] <= this.#data["close"][this.#startPoint + i]) {
       	y = this.#marginYTop + (maxY - this.#data["close"][this.#startPoint + i]) * yRate;
       	this.#context.strokeStyle = "RGBA(0.0, 255.0, 0.0, 1.0)";
       	upperShadowLength   = (this.#data["high" ][this.#startPoint + i] - this.#data["close"][this.#startPoint + i]) * yRate;
       	bottomShadowLength  = (this.#data["open" ][this.#startPoint + i] - this.#data["low"  ][this.#startPoint + i]) * yRate;
       	bottomOfUpperShadow =  this.#data["close"][this.#startPoint + i];
       	topOfLowerShadow    =  this.#data["open" ][this.#startPoint + i];
      } 

      if (this.#data["open"][this.#startPoint + i] >  this.#data["close"][this.#startPoint + i]) {
      	y = this.#marginYTop + (maxY - this.#data["open" ][this.#startPoint + i]) * yRate;
      	this.#context.strokeStyle = "RGBA(255.0, 0.0, 0.0, 1.0)";
      	upperShadowLength   = (this.#data["high" ][this.#startPoint + i] - this.#data["open"][this.#startPoint + i]) * yRate;
      	bottomShadowLength  = (this.#data["close"][this.#startPoint + i] - this.#data["low" ][this.#startPoint + i]) * yRate;
      	bottomOfUpperShadow =  this.#data["open" ][this.#startPoint + i];
      	topOfLowerShadow    =  this.#data["close"][this.#startPoint + i];
      }

      this.#context.beginPath();
      this.#context.setLineDash([]);
      this.#context.lineWidth = "1.00";
      this.#context.rect(xCandleBody, y, this.#candleWidth, (Math.ceil(height) < 1.0) ? 1.0 : Math.ceil(height));
      this.#context.stroke();
      this.#context.closePath();

      if (Math.ceil(upperShadowLength) >= 4.0) {
      	this.#context.beginPath();
      	this.#context.setLineDash([]);
      	this.#context.lineWidth = "1.00";
      	this.#context.moveTo(xCandleShadows, Math.ceil(this.#marginYTop + (maxY - topOfUpperShadow)    * yRate));
      	this.#context.lineTo(xCandleShadows, Math.ceil(this.#marginYTop + (maxY - bottomOfUpperShadow) * yRate));
      	this.#context.stroke();
      	this.#context.closePath();
      }

      if (Math.ceil(bottomShadowLength) >= 4.0) {
      	this.#context.beginPath();
      	this.#context.setLineDash([]);
      	this.#context.lineWidth = "1.00";
      	this.#context.moveTo(xCandleShadows, Math.ceil(this.#marginYTop + (maxY - topOfLowerShadow)    * yRate));
      	this.#context.lineTo(xCandleShadows, Math.ceil(this.#marginYTop + (maxY - bottomOfLowerShadow) * yRate));
      	this.#context.stroke();
      	this.#context.closePath();
      }

    }

  }

}