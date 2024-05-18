/*!
* Joukowski Airfoil - 2D modeler v1.0.0
* Copyright 2024 Yuya KITANO (https://www.linkedin.com/in/yuya-kitano/)
* Licensed under MIT (https://opensource.org/licenses/mit-license.php)
*/


//==================================================================
var X_min, X_max, X_step;
var Y_min, Y_max, Y_step;
//==================================================================
function updateModel(form_id, plot_id, width, height)
{
	var forms	= document.getElementById(form_id);
	var alpha	= parseFloat(forms.alpha_rng.value);
	var xi0		= parseFloat(forms.xi0_rng.value);
	var eta0	= parseFloat(forms.eta0_rng.value);
	var wingl	= parseFloat(forms.wingl_rng.value);
	//-------------------------------------------------
	var c = wingl/4;
	var r = Math.sqrt( Math.pow(c-xi0, 2) + Math.pow(eta0, 2));
	//-------------------------------------------------
	document.getElementById("Xmin").innerHTML = 'Xmin:	' + round(Xrange_min( alpha, xi0, eta0, wingl, c, r ), 3);
	document.getElementById("Xmax").innerHTML = 'Xmax:	' + round(Xrange_max( alpha, xi0, eta0, wingl, c, r ), 3);
	document.getElementById("Ymin").innerHTML = 'Ymin:	' + round(Yrange_min( alpha, xi0, eta0, wingl, c, r ), 3);
	document.getElementById("Ymax").innerHTML = 'Ymax:	' + round(Yrange_max( alpha, xi0, eta0, wingl, c, r ), 3);
	//-------------------------------------------------
	X_min	= -0.7;
	X_max	= 0.7;
	X_step	= 0.1;
	Y_min	= -0.5;
	Y_max	= 0.5;
	Y_step	= 0.1;
	
	gopen(plot_id, 
			X_min, X_max, X_step,
			Y_min, Y_max, Y_step, 
			width, height, 25, 25, 40, 50);
	gclose();
	//-------------------------------------------------
	var x = realX( alpha, xi0, eta0, wingl, c, r, 0);
	var y = realY_fromX( alpha, xi0, eta0, wingl, c, r, x, 0);
	
	for (var i = 1; i < 360; ++i) {
		//-------------------------------------------------
		x = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		y = realY( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		if(y == 999999) continue;
		//-------------------------------------------------
		gplot(x, y);
		//-------------------------------------------------
	}
	//-------------------------------------------------
};
//==================================================================
function resetModel(form_id, plot_id, width, height)
{
	let alpha_default =  2.5;
	let xi0_default = 0.02;
	let eta0_default = 0.05;
	let wingl_default = 1.0;
	
	document.getElementById('sim').alpha_num.value = alpha_default;
	document.getElementById('sim').alpha_rng.value = alpha_default;
	
	document.getElementById('sim').xi0_num.value = xi0_default;
	document.getElementById('sim').xi0_rng.value = xi0_default;
	
	document.getElementById('sim').eta0_num.value = eta0_default;
	document.getElementById('sim').eta0_rng.value = eta0_default;
	
	document.getElementById('sim').wingl_num.value = wingl_default;
	document.getElementById('sim').wingl_rng.value = wingl_default;
	
	updateModel(form_id, plot_id, width, height);
};
//==================================================================
function exportModel(form_id, plot_id, width, height)
{
	var forms	= document.getElementById(form_id);
	var alpha	= parseFloat(forms.alpha_rng.value);
	var xi0		= parseFloat(forms.xi0_rng.value);
	var eta0	= parseFloat(forms.eta0_rng.value);
	var wingl	= parseFloat(forms.wingl_rng.value);
	//-------------------------------------------------
	var c = wingl/4;
	var r = Math.sqrt( Math.pow(c-xi0, 2) + Math.pow(eta0, 2));
	//-------------------------------------------------
	X_min	= -0.7;
	X_max	= 0.7;
	X_step	= 0.1;
	Y_min	= -0.5;
	Y_max	= 0.5;
	Y_step	= 0.1;
	//-------------------------------------------------
	var strStl = [];
	strStl.push('solid 2D Sheet on Z=0\n');
	//-------------------------------------------------
	var x_cent0 = realX( alpha, xi0, eta0, wingl, c, r,	90);
	var x_cent1 = realX( alpha, xi0, eta0, wingl, c, r, 270);
	var y_cent0 = realY_fromX( alpha, xi0, eta0, wingl, c, r, x_cent0, 0);
	var y_cent1 = realY_fromX( alpha, xi0, eta0, wingl, c, r, x_cent1, 1);
	
	var pline_stlcent;
	pline_stlcent = 'vertex ' + (x_cent0 * 0.5 + x_cent1 * 0.5) 
	                    + ' ' + (y_cent0 * 0.5 + y_cent1 * 0.5) + ' 0\n';
	//-------------------------------------------------
	var x = realX( alpha, xi0, eta0, wingl, c, r, 0);
	var y = realY_fromX( alpha, xi0, eta0, wingl, c, r, x, 0);
	
	var pline_1st;
	pline_1st = 'vertex ' + x + ' ' + y + ' 0\n';
	
	var pline_prev;
	pline_prev = pline_1st
	
	var arr = [];
	for (var i = 1; i < 360; ++i) {
		//-------------------------------------------------
		x = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		y = realY( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		if(y == 999999) continue;
		//-------------------------------------------------
		strStl.push('facet normal -0 0 -1\n');
		strStl.push('outer loop\n');
		strStl.push(pline_stlcent);
		strStl.push(pline_prev);
		strStl.push('vertex ' + x + ' ' + y + ' 0\n');
		strStl.push('endloop\n');
		strStl.push('endfacet\n');
		
		pline_prev = 'vertex ' + x + ' ' + y + ' 0\n';
		//-------------------------------------------------
		arr.push( {x:x, y:y});
		//-------------------------------------------------
	}
	//-------------------------------------------------
	strStl.push('facet normal -0 0 -1\n');
	strStl.push('outer loop\n');
	strStl.push(pline_stlcent);
	strStl.push(pline_prev);
	strStl.push(pline_1st);
	strStl.push('endloop\n');
	strStl.push('endfacet\n');
	
	strStl.push('endsolid 2D Sheet\n');
	strStl.push('\n');
	download(strStl, 'Joukowsky-airfoil.stl');
	//-------------------------------------------------
	(new CSV(arr)).save('Joukowsky-airfoil.csv');
	//-------------------------------------------------
	updateModel(form_id, plot_id, width, height);
};
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

