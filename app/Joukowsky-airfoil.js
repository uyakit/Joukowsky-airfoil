/*!
* Joukowski Airfoil - 2D modeler v1.0.0
* Copyright 2024 Yuya KITANO (https://www.linkedin.com/in/yuya-kitano/)
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
*/


//==================================================================
var X_min, X_max, X_step;
var Y_min, Y_max, Y_step;
//==================================================================
function ang_leadingEdge( alpha, xi0, eta0, wingl, c, r ){
	
	var x_posi;
	var x_nega;
	for (var i = 1; i < 360; ++i) {
		//-------------------------------------------------
		x_posi = realX( alpha, xi0, eta0, wingl, c, r, (i - 1) * 1.0);
		x_nega = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		//-------------------------------------------------
		if ((x_posi - x_nega) <= 0) {
			return (i * 1.0);
			break;
		}
		//-------------------------------------------------
	}
}
//==================================================================
function Xrange_min( alpha, xi0, eta0, wingl, c, r ){
	
	var x_min = 999999;
	for (var i = 0; i < 360; ++i) {
		//-------------------------------------------------
		var x_cand = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		//-------------------------------------------------
		if (x_cand <= x_min) {
			x_min = x_cand;
		}
		//-------------------------------------------------
	}
	return x_min;
}
//==================================================================
function Xrange_max( alpha, xi0, eta0, wingl, c, r ){
	
	var x_max = - 999999;
	for (var i = 0; i < 360; ++i) {
		//-------------------------------------------------
		var x_cand = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		//-------------------------------------------------
		if (x_cand >= x_max) {
			x_max = x_cand;
		}
		//-------------------------------------------------
	}
	return x_max;
}
//==================================================================
function Yrange_min( alpha, xi0, eta0, wingl, c, r ){
	
	var y_min = 999999;
	for (var i = 0; i < 360; ++i) {
		//-------------------------------------------------
		var y_cand = realY( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		//-------------------------------------------------
		if (y_cand <= y_min) {
			y_min = y_cand;
		}
		//-------------------------------------------------
	}
	return y_min;
}
//==================================================================
function Yrange_max( alpha, xi0, eta0, wingl, c, r ){
	
	var y_max = - 999999;
	for (var i = 0; i < 360; ++i) {
		//-------------------------------------------------
		var y_cand = realY( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		//-------------------------------------------------
		if (y_cand >= y_max) {
			y_max = y_cand;
		}
		//-------------------------------------------------
	}
	return y_max;
}
//==================================================================
function realX( alpha, xi0, eta0, wingl, c, r, theta){
	var xi	= xi0	+ r * Math.cos( theta * Math.PI/180 );
	var eta = eta0 + r * Math.sin( theta * Math.PI/180 );
	var x0	= xi	* ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	var y0	= eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	var x	 =	x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
	var y	 = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
	return x;
}
//==================================================================
function realY( alpha, xi0, eta0, wingl, c, r, theta){
	var xi	= xi0	+ r * Math.cos( theta * Math.PI/180 );
	var eta = eta0 + r * Math.sin( theta * Math.PI/180 );
	var x0	= xi	* ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	var y0	= eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	var x	 =	x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
	var y	 = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
	return y;
}
//==================================================================
function realY_fromX( alpha, xi0, eta0, wingl, c, r, x, upper){
	
	var theta;
	var y = 999999;
	
	for (var i = 0; i < 360; ++i) {
		if (upper==1){
			theta = 360 - i * 1.0;
		} else {
			theta = i * 1.0;
		}
		if (realX( alpha, xi0, eta0, wingl, c, r, theta) < x){ //※upperに拠らず、常にx:正→負
			var delx = realX( alpha, xi0, eta0, wingl, c, r, ( upper == 1 ? (theta + 1.0) : (theta - 1.0)))
							 - realX( alpha, xi0, eta0, wingl, c, r, theta);
			
			theta =	(realX( alpha, xi0, eta0, wingl, c, r, ( upper == 1 ? (theta + 1.0) : (theta - 1.0))) - x)/delx
								* (theta)
						 + (x -	realX( alpha, xi0, eta0, wingl, c, r, theta))/delx
								* (upper == 1 ? (theta + 1.0) : (theta - 1.0));
			
			var xi	= xi0	+ r * Math.cos( theta * Math.PI/180 );
			var eta = eta0 + r * Math.sin( theta * Math.PI/180 );
			var x0	= xi	* ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
			var y0	= eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
			var x	 =	x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
			y = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
			
			break;
		}
	}
	return y;
}
//==================================================================
function round( number, precision )
{
	var shift = function (number, precision, reverseShift) {
	if (reverseShift) {
		precision = -precision;
	}
	var numArray = ("" + number).split("e");
	return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
	};
	return shift(Math.round(shift(number, precision, false)), precision, true);
}
//==================================================================
download = function (data, fileName){
	var blob = new Blob(data, {type: "text/plain"});
	var a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.target = '_blank';
	a.download = fileName;
	a.click();
}
//==================================================================
class CSV {
	constructor(data, keys = false) {
		this.ARRAY	= Symbol('ARRAY')
		this.OBJECT = Symbol('OBJECT')
		
		this.data = data
		
		if (CSV.isArray(data)) {
			if (0 == data.length) {
			this.dataType = this.ARRAY
			} else if (CSV.isObject(data[0])) {
			this.dataType = this.OBJECT
			} else if (CSV.isArray(data[0])) {
			this.dataType = this.ARRAY
			} else {
			throw Error('Error: 未対応のデータ型です')
			}
		} else {
			throw Error('Error: 未対応のデータ型です')
		}
		
		this.keys = keys
	}
	
	toString() {
		if (this.dataType === this.ARRAY) {
			return this.data.map((record) => (
			record.map((field) => (
				CSV.prepare(field)
			)).join(',')
			)).join('\n')
		} else if (this.dataType === this.OBJECT) {
			const keys = this.keys || Array.from(this.extractKeys(this.data))
			
			const arrayData = this.data.map((record) => (
			keys.map((key) => record[key])
			))
			
			console.log([].concat([keys], arrayData))
			
			return [].concat([keys], arrayData).map((record) => (
			record.map((field) => (
				CSV.prepare(field)
			)).join(',')
			)).join('\n')
		}
	}
	
	save(filename = 'data.csv') {
		if (!filename.match(/\.csv$/i)) { filename = filename + '.csv' }
		
		console.info('filename:', filename)
		console.table(this.data)
		
		const csvStr_SJIS = this.toString()
		
		const blob = new Blob([csvStr_SJIS], {'type': 'text/csv'});
		const url = window.URL || window.webkitURL;
		const blobURL = url.createObjectURL(blob);
		
		var a = document.createElement('a');
		a.download = decodeURI(filename);
		a.href = blobURL;
		a.type = 'text/csv';
		
		a.click();
	}
	
	extractKeys(data) {
		return new Set([].concat(...this.data.map((record) => Object.keys(record))))
	}
	
	static prepare(field) {
		return '"' + (''+field).replace(/"/g, '""') + '"'
	}
	
	static isObject(obj) {
		return '[object Object]' === Object.prototype.toString.call(obj)
	}
	
	static isArray(obj) {
		return '[object Array]' === Object.prototype.toString.call(obj)
	}
}
//==================================================================

