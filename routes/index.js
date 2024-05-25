/**
Copyright (c) 2024 Yuya KITANO
Released under the MIT license
https://opensource.org/licenses/mit-license.php
*/


const express = require("express");
const router = express.Router();
const fs = require('fs');
const subproc = require('child_process');

//==================================================================
function realX( alpha, xi0, eta0, wingl, c, r, theta){
	let xi = xi0 + r * Math.cos( theta * Math.PI/180 );
	let eta = eta0 + r * Math.sin( theta * Math.PI/180 );
	let x0 = xi * ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	let y0 = eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	let x  = x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
	let y  = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
	
	return x;
}
//==================================================================
function realY( alpha, xi0, eta0, wingl, c, r, theta){
	let xi = xi0 + r * Math.cos( theta * Math.PI/180 );
	let eta = eta0 + r * Math.sin( theta * Math.PI/180 );
	let x0 = xi * ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	let y0 = eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
	let x  = x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
	let y  = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
	
	return y;
}
//==================================================================
function realY_fromX( alpha, xi0, eta0, wingl, c, r, x, upper){
	
	let theta;
	let y = 999999;
	
	for (let i = 0; i < 360; ++i) {
		if (upper==1){
			theta = 360 - i * 1.0;
		} else {
			theta = i * 1.0;
		}
		
		if (realX( alpha, xi0, eta0, wingl, c, r, theta) < x){ //※upperに拠らず、常にx:正→負
			let delx = realX( alpha, xi0, eta0, wingl, c, r, ( upper == 1 ? (theta + 1.0) : (theta - 1.0)))
			- realX( alpha, xi0, eta0, wingl, c, r, theta);
			
			theta = (realX( alpha, xi0, eta0, wingl, c, r, ( upper == 1 ? (theta + 1.0) : (theta - 1.0))) - x)/delx
			       * theta
			       + (x - realX( alpha, xi0, eta0, wingl, c, r, theta))/delx
			       * (upper == 1 ? (theta + 1.0) : (theta - 1.0));
			
			let xi = xi0 + r * Math.cos( theta * Math.PI/180 );
			let eta = eta0 + r * Math.sin( theta * Math.PI/180 );
			let x0 = xi * ( 1 + Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
			let y0 = eta * ( 1 - Math.pow(c, 2)/( Math.pow(xi, 2) + Math.pow(eta, 2) ));
			x  = x0 * Math.cos( alpha * Math.PI/180 ) + y0 * Math.sin( alpha * Math.PI/180 );
			y = -x0 * Math.sin( alpha * Math.PI/180 ) + y0 * Math.cos( alpha * Math.PI/180 );
			
			break;
		}
	}
	return y;
}
//==================================================================
function exportModel(res, alpha, xi0, eta0, wingl)
{
	//-------------------------------------------------
	let c = wingl/4;
	let r = Math.sqrt( Math.pow(c-xi0, 2) + Math.pow(eta0, 2));
	//-------------------------------------------------
	let arrStl = [];
	arrStl.push('solid 2D Sheet on Z=0');
	//-------------------------------------------------
	let x_cent0 = realX( alpha, xi0, eta0, wingl, c, r, 90);
	let x_cent1 = realX( alpha, xi0, eta0, wingl, c, r, 270);
	let y_cent0 = realY_fromX( alpha, xi0, eta0, wingl, c, r, x_cent0, 0);
	let y_cent1 = realY_fromX( alpha, xi0, eta0, wingl, c, r, x_cent1, 1);
	
	let pline_stlcent;
	pline_stlcent = 'vertex ' + (x_cent0 * 0.5 + x_cent1 * 0.5) 
	                    + ' ' + (y_cent0 * 0.5 + y_cent1 * 0.5) + ' 0';
	//-------------------------------------------------
	let x = realX( alpha, xi0, eta0, wingl, c, r, 0);
	let y = realY_fromX( alpha, xi0, eta0, wingl, c, r, x, 0);
	
	let pline_1st;
	pline_1st = 'vertex ' + x + ' ' + y + ' 0';
	
	let pline_prev;
	pline_prev = pline_1st
	
	let arrCsv = [];
	for (let i = 1; i < 360; ++i) {
		//-------------------------------------------------
		x = realX( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		y = realY( alpha, xi0, eta0, wingl, c, r, i * 1.0);
		if(y == 999999) continue;
		//-------------------------------------------------
		arrStl.push('facet normal -0 0 -1');
		arrStl.push('outer loop');
		arrStl.push(pline_stlcent);
		arrStl.push(pline_prev);
		arrStl.push('vertex ' + x + ' ' + y + ' 0');
		arrStl.push('endloop');
		arrStl.push('endfacet');
		
		pline_prev = 'vertex ' + x + ' ' + y + ' 0';
		//-------------------------------------------------
		arrCsv.push( {x:x, y:y});
		//-------------------------------------------------
	}
	//-------------------------------------------------
	arrStl.push('facet normal -0 0 -1');
	arrStl.push('outer loop');
	arrStl.push(pline_stlcent);
	arrStl.push(pline_prev);
	arrStl.push(pline_1st);
	arrStl.push('endloop');
	arrStl.push('endfacet');
	
	arrStl.push('endsolid 2D Sheet');
	arrStl.push('');
	// ------------------------------------------------------
	// Save .stl
	
	// https://zenn.dev/daiyaone/articles/5da30a5b248351#:~:text=console.log(data)%3B%0A%7D)%3B-,%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%AE%E4%BD%9C%E6%88%90%E3%81%A8%E5%89%8A%E9%99%A4,-fs%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB%E3%82%92
	fs.writeFileSync('./app/PyVista/Joukowsky-airfoil.stl', arrStl.join("\n"));
	
	res.download('./app/PyVista/Joukowsky-airfoil.stl', 'Joukowsky-airfoil.stl');
	// ------------------------------------------------------
	// .stl -> .html
	//
	// https://t-salad.com/node-exe/
	
	subproc.execSync('py ./app/PyVista/stl2html.py  ./Joukowsky-airfoil.stl');
	
	res.download('./app/PyVista/Joukowsky-airfoil.html', 'Joukowsky-airfoil.html');
	// ------------------------------------------------------
	
	
	
	
	
	
	
	// -------------------------------------------------
	// (new CSV(arrCsv)).save('Joukowsky-airfoil.csv');
	// -------------------------------------------------
	// const anchor = document.createElement("a");
	// anchor.href = './app/PyVista/Joukowsky-airfoil.html';
	// anchor.download = 'Joukowsky-airfoil.html';
	// document.body.appendChild(anchor);
	// anchor.click();
	// document.body.removeChild(anchor);
	//-------------------------------------- */
};
//==================================================================

// https://zenn.dev/wkb/books/node-tutorial/viewer/todo_03

let val_alpha;
let val_xi0;
let val_eta0;
let val_wingl;

router.get("/", (req, res) => {
	res.render("./index.ejs",{ val_alpha, val_xi0, val_eta0, val_wingl } );
});

router.post("/", (req, res) => {
	val_alpha = parseFloat(req.body.alpha_num);
	val_xi0 = parseFloat(req.body.xi0_num);
	val_eta0 = parseFloat(req.body.eta0_num);
	val_wingl = parseFloat(req.body.wingl_num);
	
	exportModel(res, val_alpha, val_xi0, val_eta0, val_wingl);
	
	// res.send();
	res.redirect('/');
});

module.exports = router;
