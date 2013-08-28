/**
 * @author 도플광어

 -버전 0.13
 Box2d 추가

 *
 * 버전 0.12
 * matrix 추가
 * box2d 추가
 *
 */

var gbox3d = {
	core : {}
	
};
///
//수학 함수관련 선언
///
gbox3d.core.PI = 3.14159265359;
gbox3d.core.RECIPROCAL_PI = 1 / 3.14159265359;
gbox3d.core.HALF_PI = 3.14159265359 / 2;
gbox3d.core.PI64 = 3.141592653589793;
gbox3d.core.DEGTORAD = 3.14159265359 / 180;
gbox3d.core.RADTODEG = 180 / 3.14159265359;
gbox3d.core.TOLERANCE = 1e-8;
gbox3d.core.radToDeg = function(a) {
	return a * gbox3d.core.RADTODEG
};
gbox3d.core.degToRad = function(a) {
	return a * gbox3d.core.DEGTORAD
};
gbox3d.core.iszero = function(b) {
	return (b < 1e-8) && (b > -1e-8)
};
gbox3d.core.isone = function(b) {
	return (b + 1e-8 >= 1) && (b - 1e-8 <= 1)
};
gbox3d.core.equals = function(d, c) {
	return (d + 1e-8 >= c) && (d - 1e-8 <= c)
};
gbox3d.core.clamp = function(c, a, b) {
	if (c < a) {
		return a
	}
	if (c > b) {
		return b
	}
	return c
};
gbox3d.core.fract = function(a) {
	return a - Math.floor(a)
};
gbox3d.core.max3 = function(e, d, f) {
	if (e > d) {
		if (e > f) {
			return e
		}
		return f
	}
	if (d > f) {
		return d
	}
	return f
};
gbox3d.core.min3 = function(e, d, f) {
	if (e < d) {
		if (e < f) {
			return e
		}
		return f
	}
	if (d < f) {
		return d
	}
	return f
};

gbox3d.core.round = function(num, valid) {
	v = Math.pow(10, valid);
	return Math.round(num * v) / v;
}

gbox3d.core.epsilon = function ( value ) {

    return Math.abs( value ) < 0.000001 ? 0 : value;

};

gbox3d.core.getAlpha = function(a) {
	return ((a & 4278190080) >>> 24)
};
gbox3d.core.getRed = function(a) {
	return ((a & 16711680) >> 16)
};
gbox3d.core.getGreen = function(a) {
	return ((a & 65280) >> 8)
};
gbox3d.core.getBlue = function(a) {
	return ((a & 255))
};
gbox3d.core.createColor = function(d, f, e, c) {
	d = d & 255;
	f = f & 255;
	e = e & 255;
	c = c & 255;
	return (d << 24) | (f << 16) | (e << 8) | c
};
gbox3d.core.ColorF = function() {
	this.A = 1;
	this.R = 1;
	this.G = 1;
	this.B = 1
};
gbox3d.core.ColorF.prototype.clone = function() {
	var a = new gbox3d.core.Light();
	a.A = this.A;
	a.R = this.R;
	a.G = this.G;
	a.B = this.B;
	return a
};
gbox3d.core.ColorF.prototype.A = 1;
gbox3d.core.ColorF.prototype.R = 1;
gbox3d.core.ColorF.prototype.G = 1;
gbox3d.core.ColorF.prototype.B = 1;

//타이머 객체
//gbox3d.core.CLTimer = function() {
//
//};
//
//gbox3d.core.CLTimer.getTime = function() {
//	var a = new Date();
//	return a.getTime()
//};

gbox3d.core.Timer = function() {
	this.prevTime =  (new Date()).getTime();
};

gbox3d.core.Timer.prototype.getTime = function() {
	var a = new Date();
	return a.getTime()
};

gbox3d.core.Timer.prototype.getDeltaTime = function() {
	var current = this.getTime();
	var delta = current - this.prevTime;
	this.prevTime =  current;
	
	return delta/1000.0;
}

gbox3d.core.Timer.prototype.getDeltaTick = function() {
    var current = this.getTime();
    var delta = current - this.prevTime;
    this.prevTime =  current;

    return delta;
}



// Vect3D (3D 벡터 )

gbox3d.core.Vect3d = function(a, c, b) {
	if (a == null) {
		this.X = 0;
		this.Y = 0;
		this.Z = 0
	} else {
		this.X = a;
		this.Y = c;
		this.Z = b
	}
};
gbox3d.core.Vect3d.prototype.X = 0;
gbox3d.core.Vect3d.prototype.Y = 0;
gbox3d.core.Vect3d.prototype.Z = 0;
gbox3d.core.Vect3d.prototype.set = function(a, c, b) {
	this.X = a;
	this.Y = c;
	this.Z = b
};
gbox3d.core.Vect3d.prototype.clone = function() {
	return new gbox3d.core.Vect3d(this.X, this.Y, this.Z)
};

gbox3d.core.Vect3d.prototype.copyTo = function(a) {
	a.X = this.X;
	a.Y = this.Y;
	a.Z = this.Z
};

gbox3d.core.Vect3d.prototype.setTo = function(a) {
	this.X = a.X;
	this.Y = a.Y;
	this.Z = a.Z;
	
	return this
};

gbox3d.core.Vect3d.prototype.substract = function(a) {
	return new gbox3d.core.Vect3d(this.X - a.X, this.Y - a.Y, this.Z - a.Z)
};
gbox3d.core.Vect3d.prototype.substractFromThis = function(a) {
	this.X -= a.X;
	this.Y -= a.Y;
	this.Z -= a.Z
};
gbox3d.core.Vect3d.prototype.add = function(a) {
	return new gbox3d.core.Vect3d(this.X + a.X, this.Y + a.Y, this.Z + a.Z)
};
gbox3d.core.Vect3d.prototype.addToThis = function(a) {
	this.X += a.X;
	this.Y += a.Y;
	this.Z += a.Z
};
gbox3d.core.Vect3d.prototype.addToThisReturnMe = function(a) {
	this.X += a.X;
	this.Y += a.Y;
	this.Z += a.Z;
	return this
};
gbox3d.core.Vect3d.prototype.normalize = function() {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return
	}
	a = 1 / Math.sqrt(a);
	this.X *= a;
	this.Y *= a;
	this.Z *= a;
	
	return this;
};
gbox3d.core.Vect3d.prototype.getNormalized = function() {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return new gbox3d.core.Vect3d(0, 0, 0)
	}
	a = 1 / Math.sqrt(a);
	return new gbox3d.core.Vect3d(this.X * a, this.Y * a, this.Z * a)
};
gbox3d.core.Vect3d.prototype.setLength = function(b) {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return
	}
	a = b / Math.sqrt(a);
	this.X *= a;
	this.Y *= a;
	this.Z *= a
};

gbox3d.core.Vect3d.prototype.equals = function(a) {
	return gbox3d.core.equals(this.X, a.X) && gbox3d.core.equals(this.Y, a.Y) && gbox3d.core.equals(this.Z, a.Z)
};
gbox3d.core.Vect3d.prototype.equalsZero = function() {
	return gbox3d.core.iszero(this.X) && gbox3d.core.iszero(this.Y) && gbox3d.core.iszero(this.Z)
};
gbox3d.core.Vect3d.prototype.equalsByNumbers = function(a, c, b) {
	return gbox3d.core.equals(this.X, a) && gbox3d.core.equals(this.Y, c) && gbox3d.core.equals(this.Z, b)
};
gbox3d.core.Vect3d.prototype.isZero = function() {
	return this.X == 0 && this.Y == 0 && this.Z == 0
};
gbox3d.core.Vect3d.prototype.getLength = function() {
	return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z)
};
gbox3d.core.Vect3d.prototype.getDistanceTo = function(b) {
	var a = b.X - this.X;
	var d = b.Y - this.Y;
	var c = b.Z - this.Z;
	return Math.sqrt(a * a + d * d + c * c)
};
gbox3d.core.Vect3d.prototype.getDistanceFromSQ = function(b) {
	var a = b.X - this.X;
	var d = b.Y - this.Y;
	var c = b.Z - this.Z;
	return a * a + d * d + c * c
};
gbox3d.core.Vect3d.prototype.getLengthSQ = function() {
	return this.X * this.X + this.Y * this.Y + this.Z * this.Z
};
gbox3d.core.Vect3d.prototype.multiplyWithScal = function(a) {
	return new gbox3d.core.Vect3d(this.X * a, this.Y * a, this.Z * a)
};
gbox3d.core.Vect3d.prototype.multiplyThisWithScal = function(a) {
	this.X *= a;
	this.Y *= a;
	this.Z *= a
};
gbox3d.core.Vect3d.prototype.multiplyThisWithScalReturnMe = function(a) {
	this.X *= a;
	this.Y *= a;
	this.Z *= a;
	return this
};
gbox3d.core.Vect3d.prototype.multiplyThisWithVect = function(a) {
	this.X *= a.X;
	this.Y *= a.Y;
	this.Z *= a.Z
};
gbox3d.core.Vect3d.prototype.multiplyWithVect = function(a) {
	return new gbox3d.core.Vect3d(this.X * a.X, this.Y * a.Y, this.Z * a.Z)
};
gbox3d.core.Vect3d.prototype.divideThisThroughVect = function(a) {
	this.X /= a.X;
	this.Y /= a.Y;
	this.Z /= a.Z
};
gbox3d.core.Vect3d.prototype.divideThroughVect = function(a) {
	return new gbox3d.core.Vect3d(this.X / a.X, this.Y / a.Y, this.Z / a.Z)
};
gbox3d.core.Vect3d.prototype.crossProduct = function(a) {
	return new gbox3d.core.Vect3d(this.Y * a.Z - this.Z * a.Y, this.Z * a.X - this.X * a.Z, this.X * a.Y - this.Y * a.X)
};
gbox3d.core.Vect3d.prototype.dotProduct = function(a) {
	return this.X * a.X + this.Y * a.Y + this.Z * a.Z;
};

//(0,0,1)을 기준으로 각도를 구한다
gbox3d.core.Vect3d.prototype.getHorizontalAngle = function() {
	var b = new gbox3d.core.Vect3d();
	b.Y = gbox3d.core.radToDeg(Math.atan2(this.X, this.Z));
	if (b.Y < 0) {
		b.Y += 360
	}
	if (b.Y >= 360) {
		b.Y -= 360
	}
	var a = Math.sqrt(this.X * this.X + this.Z * this.Z);
	b.X = gbox3d.core.radToDeg(Math.atan2(a, this.Y)) - 90;
	if (b.X < 0) {
		b.X += 360
	}
	if (b.X >= 360) {
		b.X -= 360
	}
	return b;
};
gbox3d.core.Vect3d.prototype.toString = function() {
	return "(x: " + this.X + " y:" + this.Y + " z:" + this.Z + ")";
};

///////////////////////////////////////////////////////////
//벡터 2D
gbox3d.core.Vect2d = function(a, b) {

	if (a == null) {
		this.X = 0;
		this.Y = 0
	} else {
		if (a.x != null) {
			this.X = a.x;
			this.Y = a.y;
		} else if (a.X != null) {
			this.X = a.X;
			this.Y = a.Y;
		} else {
			this.X = a;
			this.Y = b;
		}
	}
};
gbox3d.core.Vect2d.prototype.X = 0;
gbox3d.core.Vect2d.prototype.Y = 0;

gbox3d.core.Vect2d.prototype.rotate = function(angle, center) {

	var cs = Math.cos(angle);
	var sn = Math.sin(angle);

	var x, y;

	if (center == undefined) {
		center = new gbox3d.core.Vect2d(0, 0);

	}
	this.X -= center.X;
	this.Y -= center.Y;

	this.set((this.X * cs - this.Y * sn), -(this.X * sn + this.Y * cs));

	this.X += center.X;
	this.Y += center.Y;
}

gbox3d.core.Vect2d.prototype.multiply = function(mult) {
	this.X *= mult;
	this.Y *= mult;
}

gbox3d.core.Vect2d.prototype.add = function(a) {
	return new gbox3d.core.Vect2d(this.X + a.X, this.Y + a.Y);
};

gbox3d.core.Vect2d.prototype.addToThis = function(a) {
	this.X += a.X;
	this.Y += a.Y;
}
gbox3d.core.Vect2d.prototype.sub = function(a) {
	return new gbox3d.core.Vect2d(this.X - a.X, this.Y - a.Y);
};
gbox3d.core.Vect2d.prototype.subToThis = function(a) {
	this.X -= a.X;
	this.Y -= a.Y;
}

gbox3d.core.Vect2d.prototype.getDistance = function() {
	return Math.sqrt(this.X * this.X + this.Y * this.Y);
}

gbox3d.core.Vect2d.prototype.normalize = function() {
	dist = this.getDistance();
	// Math.sqrt(this.X * this.X + this.Y * this.Y);
	this.X /= dist;
	this.Y /= dist;
}

gbox3d.core.Vect2d.prototype.set = function(x, y) {
	this.X = x;
	this.Y = y;
}

gbox3d.core.Vect2d.prototype.copy = function(a) {
	this.X = a.X;
	this.Y = a.Y;
}

gbox3d.core.Vect2d.prototype.set_point = function(a) {
	this.X = a.x;
	this.Y = a.y;
}

gbox3d.core.Vect2d.prototype.clone = function() {
	return new gbox3d.core.Vect2d(this.X, this.Y);
}

gbox3d.core.Vect2d.prototype.getAngle = function() {

	var X = this.X;
	var Y = this.Y;

	if (Y == 0)// corrected thanks to a suggestion by Jox
		return X < 0 ? 180 : 0;
	else if (X == 0)
		return Y < 0 ? 90 : 270;

	// don't use getLength here to avoid precision loss with s32 vectors
	var tmp = Y / Math.sqrt((X * X + Y * Y));
	tmp = Math.atan(Math.sqrt(1 - tmp * tmp) / tmp) * gbox3d.core.RADTODEG;

	if (X > 0 && Y > 0)
		return tmp + 270;
	else if (X > 0 && Y < 0)
		return tmp + 90;
	else if (X < 0 && Y < 0)
		return 90 - tmp;
	else if (X < 0 && Y > 0)
		return 270 - tmp;

	return tmp;
}

///////////////////////////////////////////////////////////
//box 2D

gbox3d.core.Box2d = function(param) {

    this.topLeft = param.topleft;
    this.bottomRight = param.bottomright;

};

gbox3d.core.Box2d.prototype.ptInBox = function(x,y) {

    if(this.topLeft.X < x && this.bottomRight.X > x ) {
        if(this.topLeft.Y < y && this.bottomRight.Y > y ) {
            return true;
        }
    }

    return false;

}


///////////////matrix2d
//아래 메트릭스를 위해서는 gl-matrix 가 필요함
mat2d.setRotation = function(a,rad) {

    var st = gbox3d.core.epsilon(Math.sin(rad)),
        ct = gbox3d.core.epsilon(Math.cos(rad));

    a[0] = ct;
    a[1] = st;
    a[2] = -st;
    a[3] = ct;
}


mat2d.setTranslation = function(a,tx,ty) {

    a[4] = tx;
    a[5] = ty;
}

mat2d.setScale = function(a,sx,sy) {

    a[0] *= sx;
    a[1] *= sx;

    a[2] *= sy;
    a[3] *= sy;
}

mat2d.CSSstr = function (a) {
    return 'matrix('
        + gbox3d.core.epsilon(a[0]) + ', '
        + gbox3d.core.epsilon(a[1]) + ', '
        + gbox3d.core.epsilon(a[2]) + ', '
        + gbox3d.core.epsilon(a[3]) + ', '
        + gbox3d.core.epsilon(a[4]) + ', '
        + gbox3d.core.epsilon(a[5]) + ')';
};

/////////////////////////
//애니미에션 프레임 초기화
//타이머 보단 좀 나은듯?
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
        || function(callback) {
        //60 fps.
        window.setTimeout(callback, 1000 / 60);
    };

    window.requestAnimationFrame = requestAnimationFrame;
})();



/////////////////////////







