class PanoVR {
	//
	var ruta:MovieClip;
	var clip1:MovieClip;
	var clip2:MovieClip;
	var marco:MovieClip;
	var mascara:MovieClip;
	var mascara2:MovieClip;
	var prof:Number;
	var x:Number;
	var y:Number;
	var aceleracion:Number;
	//
	//--CONSTRUCTOR------------------------------------
	function PanoVR(queRuta:MovieClip, queClip1:String, queClip2:String, queX:Number, queY:Number, queW:Number, queH:Number, queAceleracion) {
		ruta = queRuta;
		prof = ruta.getNextHighestDepth();
		clip1 = ruta.clip1 = ruta.attachMovie(queClip1, queClip1, prof);
		clip2 = ruta.clip2 = ruta.attachMovie(queClip2, queClip2, prof + 1);
		//inis
		iniPosicion(queX, queY);
		iniMascara(queX, queY, queH, queW);
		iniMarco(queX, queY, queH, queW);
		iniEvents(queAceleracion);
		Mouse.hide();
	}
	//--INIS----------------------------------------
	function iniPosicion(queX, queY) {
		x = clip1.x = clip2.x = queX;
		y = clip1.y = clip2.y = queY;
		clip1._x = x;
		clip1._y = y;
		clip2._x = x + clip1._width;
		clip2._y = y;
	}
	//--------------------------------------------------
	function iniMascara(queX, queY, queH, queW) {
		prof = ruta.getNextHighestDepth();
		mascara = ruta.createEmptyMovieClip("mask_mc", prof);
		mascara.beginFill(0xFFFFFF);
		mascara.lineStyle(0, 0xFFFFFF, 0);
		mascara.moveTo(queX, queY);
		mascara.lineTo(queX + queW, queY);
		mascara.lineTo(queX + queW, queY + queH);
		mascara.lineTo(queX, queY + queH);
		mascara.lineTo(queX, queY);
		mascara.endFill();
		mascara2 = mascara.duplicateMovieClip("mask2_mc", prof + 1);
		clip1.setMask(mascara);
		clip2.setMask(mascara2);
	}
	//--------------------------------------------------
	function iniMarco(queX, queY, queH, queW) {
		prof = ruta.getNextHighestDepth();
		marco = ruta.createEmptyMovieClip("marco_mc", prof);
		marco.lineStyle(0, 0xFFFFFF, 0);
		marco.moveTo(queX, queY);
		marco.lineTo(queX + queW, queY);
		marco.lineTo(queX + queW, queY + queH);
		marco.lineTo(queX, queY + queH);
		marco.lineTo(queX, queY);
	}
	//--------------------------------------------------
	function iniEvents(queAceleracion) {
		clip1.useHandCursor = false;
		clip2.useHandCursor = false;
		aceleracion = clip1.ac = clip2.ac = queAceleracion;
		//-----
		clip1.onPress = clip2.onPress = function () {
			var pano1:MovieClip = this;
			var pano2:MovieClip = (this == this._parent.clip1) ? this._parent.clip2 : this._parent.clip1;
			this.onEnterFrame = function() {
				this.point2 = _xmouse;
				this.vel = (this.point2 - this.point1) / 15 * -1;
				pano1._x += pano1.vel;
				enlacaPanos(pano1, pano2);
			};
			this.point1 = _xmouse;
		};
		clip1.onRelease = clip1.onReleaseOutside = clip2.onRelease = clip2.onReleaseOutside = function () {
			movimientoInercia(this);
		};
		//-----
		function enlacaPanos(pano1, pano2) {
			if (pano1._x < pano1.x) {
				pano2._x = pano1._x + pano1._width;
			} else {
				pano2._x = pano1._x - pano1._width;
			}
			//vuelta
			if (pano1._x < pano1.x & pano2._x < pano2.x) {
				pano1._x = pano2._x + pano2._width;
			} else if (pano1._x > pano1.x & pano2._x > pano2.x) {
				pano1._x = pano2._x - pano2._width;
			}
		}
		function reCapturaPunto1() {
			this.point1 = _xmouse;
		}
		function movimientoInercia(quePano) {
			var pano1:MovieClip = quePano;
			var pano2:MovieClip = (pano1 == pano1._parent.clip1) ? pano1._parent.clip2 : pano1._parent.clip1;
			pano1.onEnterFrame = function() {
				var ac:Number = pano1.vel * pano1.ac;
				pano1.vel -= ac;
				pano1._x += pano1.vel;
				if (ac < 0.01 & ac > -0.01) {
					delete pano1.onEnterFrame;
				}
				enlacaPanos(pano1, pano2);
			};
		}
		//end iniEvents
	}
	//--------------------------------------------------
}
