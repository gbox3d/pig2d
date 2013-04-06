// matrix4
gbox3d.core.Matrix4 = function(a) {
	if (a == null) {
		a = true
	}
	this.m00 = 0;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = 0;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = 0;
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = 0;
	this.m15 = 0;
	this.bIsIdentity = false;
	if (a) {
		this.m00 = 1;
		this.m05 = 1;
		this.m10 = 1;
		this.m15 = 1;
		this.bIsIdentity = true
	}
};
gbox3d.core.Matrix4.prototype.makeIdentity = function() {
	this.m00 = 1;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = 1;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = 1;
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = 0;
	this.m15 = 1;
	this.bIsIdentity = true
};
gbox3d.core.Matrix4.prototype.isIdentity = function() {
	if (this.bIsIdentity) {
		return true
	}
	this.bIsIdentity = (gbox3d.core.isone(this.m00) && gbox3d.core.iszero(this.m01) && gbox3d.core.iszero(this.m02) && gbox3d.core.iszero(this.m03) && gbox3d.core.iszero(this.m04) && gbox3d.core.isone(this.m05) && gbox3d.core.iszero(this.m06) && gbox3d.core.iszero(this.m07) && gbox3d.core.iszero(this.m08) && gbox3d.core.iszero(this.m09) && gbox3d.core.isone(this.m10) && gbox3d.core.iszero(this.m11) && gbox3d.core.iszero(this.m12) && gbox3d.core.iszero(this.m13) && gbox3d.core.iszero(this.m14) && gbox3d.core.isone(this.m15));
	return this.bIsIdentity
};
gbox3d.core.Matrix4.prototype.isTranslateOnly = function() {
	if (this.bIsIdentity) {
		return true
	}
	return (gbox3d.core.isone(this.m00) && gbox3d.core.iszero(this.m01) && gbox3d.core.iszero(this.m02) && gbox3d.core.iszero(this.m03) && gbox3d.core.iszero(this.m04) && gbox3d.core.isone(this.m05) && gbox3d.core.iszero(this.m06) && gbox3d.core.iszero(this.m07) && gbox3d.core.iszero(this.m08) && gbox3d.core.iszero(this.m09) && gbox3d.core.isone(this.m10) && gbox3d.core.iszero(this.m11) && gbox3d.core.isone(this.m15))
};
gbox3d.core.Matrix4.prototype.equals = function(a) {
	return gbox3d.core.equals(this.m00, a.m00) && gbox3d.core.equals(this.m01, a.m01) && gbox3d.core.equals(this.m02, a.m02) && gbox3d.core.equals(this.m03, a.m03) && gbox3d.core.equals(this.m04, a.m04) && gbox3d.core.equals(this.m05, a.m05) && gbox3d.core.equals(this.m06, a.m06) && gbox3d.core.equals(this.m07, a.m07) && gbox3d.core.equals(this.m08, a.m08) && gbox3d.core.equals(this.m09, a.m09) && gbox3d.core.equals(this.m10, a.m10) && gbox3d.core.equals(this.m11, a.m11) && gbox3d.core.equals(this.m12, a.m12) && gbox3d.core.equals(this.m13, a.m13) && gbox3d.core.equals(this.m14, a.m14) && gbox3d.core.equals(this.m15, a.m15)
};


//기저 X 축 방향 벡터 구하기
gbox3d.core.Matrix4.prototype.getXBaseAxies = function() {
	return new gbox3d.core.Vect3d(this.m00, this.m04, this.m08);
}

//기저 Y 축 방향 벡터 구하기
gbox3d.core.Matrix4.prototype.getYBaseAxies = function() {
	return new gbox3d.core.Vect3d(this.m01, this.m05, this.m09);
}

//기저 Z 축 방향 벡터 구하기
gbox3d.core.Matrix4.prototype.getZBaseAxies = function() {
	return new gbox3d.core.Vect3d(this.m02, this.m06, this.m10);
}

//변위요소값 구하기
gbox3d.core.Matrix4.prototype.getTranslation = function() {
	return new gbox3d.core.Vect3d(this.m12, this.m13, this.m14)
};
gbox3d.core.Matrix4.prototype.getScale = function() {
	return new gbox3d.core.Vect3d(this.m00, this.m05, this.m10)
};
gbox3d.core.Matrix4.prototype.rotateVect = function(a) {
	var b = a.clone();
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10;
	
	return a;
};
gbox3d.core.Matrix4.prototype.rotateVect2 = function(a, b) {
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10;
	
	return a;
};

//회전만 적용시킨다.
//a * mat
gbox3d.core.Matrix4.prototype.getRotatedVect = function(a) {
	return new gbox3d.core.Vect3d(a.X * this.m00 + a.Y * this.m04 + a.Z * this.m08, a.X * this.m01 + a.Y * this.m05 + a.Z * this.m09, a.X * this.m02 + a.Y * this.m06 + a.Z * this.m10)
};


gbox3d.core.Matrix4.prototype.getTransformedVect = function(a) {
	return new gbox3d.core.Vect3d(a.X * this.m00 + a.Y * this.m04 + a.Z * this.m08 + this.m12, a.X * this.m01 + a.Y * this.m05 + a.Z * this.m09 + this.m13, a.X * this.m02 + a.Y * this.m06 + a.Z * this.m10 + this.m14)
};
gbox3d.core.Matrix4.prototype.transformVect = function(c) {
	var b = c.X * this.m00 + c.Y * this.m04 + c.Z * this.m08 + this.m12;
	var a = c.X * this.m01 + c.Y * this.m05 + c.Z * this.m09 + this.m13;
	var d = c.X * this.m02 + c.Y * this.m06 + c.Z * this.m10 + this.m14;
	c.X = b;
	c.Y = a;
	c.Z = d
};
gbox3d.core.Matrix4.prototype.transformVect2 = function(a, b) {
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08 + this.m12;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09 + this.m13;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10 + this.m14
};

//이동만 적용한다.
// a * mat
gbox3d.core.Matrix4.prototype.getTranslatedVect = function(a) {
	return new gbox3d.core.Vect3d(a.X + this.m12, a.Y + this.m13, a.Z + this.m14)
};


gbox3d.core.Matrix4.prototype.translateVect = function(a) {
	a.X = a.X + this.m12;
	a.Y = a.Y + this.m13;
	a.Z = a.Z + this.m14
};
gbox3d.core.Matrix4.prototype.transformPlane = function(a) {
	var d = a.getMemberPoint();
	this.transformVect(d);
	var b = a.Normal.clone();
	b.normalize();
	var c = this.getScale();
	if (!gbox3d.core.equals(c.X, 0) && !gbox3d.core.equals(c.Y, 0) && !gbox3d.core.equals(c.Z, 0) && (!gbox3d.core.equals(c.X, 1) || !gbox3d.core.equals(c.Y, 1) || !gbox3d.core.equals(c.Z, 1))) {
		b.X *= 1 / (c.X * c.X);
		b.Y *= 1 / (c.Y * c.Y);
		b.Z *= 1 / (c.Z * c.Z)
	}
	this.rotateVect(b);
	b.normalize();
	a.setPlane(d, b)
};


// b.multiply(a)   -->  a*b
gbox3d.core.Matrix4.prototype.multiply = function(a) {
	var b = new gbox3d.core.Matrix4(false);
	if (this.bIsIdentity) {
		a.copyTo(b);
		return b
	}
	if (a.bIsIdentity) {
		this.copyTo(b);
		return b
	}
	b.m00 = this.m00 * a.m00 + this.m04 * a.m01 + this.m08 * a.m02 + this.m12 * a.m03;
	b.m01 = this.m01 * a.m00 + this.m05 * a.m01 + this.m09 * a.m02 + this.m13 * a.m03;
	b.m02 = this.m02 * a.m00 + this.m06 * a.m01 + this.m10 * a.m02 + this.m14 * a.m03;
	b.m03 = this.m03 * a.m00 + this.m07 * a.m01 + this.m11 * a.m02 + this.m15 * a.m03;
	b.m04 = this.m00 * a.m04 + this.m04 * a.m05 + this.m08 * a.m06 + this.m12 * a.m07;
	b.m05 = this.m01 * a.m04 + this.m05 * a.m05 + this.m09 * a.m06 + this.m13 * a.m07;
	b.m06 = this.m02 * a.m04 + this.m06 * a.m05 + this.m10 * a.m06 + this.m14 * a.m07;
	b.m07 = this.m03 * a.m04 + this.m07 * a.m05 + this.m11 * a.m06 + this.m15 * a.m07;
	b.m08 = this.m00 * a.m08 + this.m04 * a.m09 + this.m08 * a.m10 + this.m12 * a.m11;
	b.m09 = this.m01 * a.m08 + this.m05 * a.m09 + this.m09 * a.m10 + this.m13 * a.m11;
	b.m10 = this.m02 * a.m08 + this.m06 * a.m09 + this.m10 * a.m10 + this.m14 * a.m11;
	b.m11 = this.m03 * a.m08 + this.m07 * a.m09 + this.m11 * a.m10 + this.m15 * a.m11;
	b.m12 = this.m00 * a.m12 + this.m04 * a.m13 + this.m08 * a.m14 + this.m12 * a.m15;
	b.m13 = this.m01 * a.m12 + this.m05 * a.m13 + this.m09 * a.m14 + this.m13 * a.m15;
	b.m14 = this.m02 * a.m12 + this.m06 * a.m13 + this.m10 * a.m14 + this.m14 * a.m15;
	b.m15 = this.m03 * a.m12 + this.m07 * a.m13 + this.m11 * a.m14 + this.m15 * a.m15;
	return b
};
gbox3d.core.Matrix4.prototype.multiplyWith1x4Matrix = function(a) {
	var b = a.clone();
	b.W = a.W;
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08 + b.W * this.m12;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09 + b.W * this.m13;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10 + b.W * this.m14;
	a.W = b.X * this.m03 + b.Y * this.m07 + b.Z * this.m11 + b.W * this.m15
};
gbox3d.core.Matrix4.prototype.getInverse = function(a) {
	if (this.bIsIdentity) {
		this.copyTo(a);
		return true
	}
	var b = (this.m00 * this.m05 - this.m01 * this.m04) * (this.m10 * this.m15 - this.m11 * this.m14) - (this.m00 * this.m06 - this.m02 * this.m04) * (this.m09 * this.m15 - this.m11 * this.m13) + (this.m00 * this.m07 - this.m03 * this.m04) * (this.m09 * this.m14 - this.m10 * this.m13) + (this.m01 * this.m06 - this.m02 * this.m05) * (this.m08 * this.m15 - this.m11 * this.m12) - (this.m01 * this.m07 - this.m03 * this.m05) * (this.m08 * this.m14 - this.m10 * this.m12) + (this.m02 * this.m07 - this.m03 * this.m06) * (this.m08 * this.m13 - this.m09 * this.m12);
	if (b > -1e-7 && b < 1e-7) {
		return false
	}
	b = 1 / b;
	a.m00 = b * (this.m05 * (this.m10 * this.m15 - this.m11 * this.m14) + this.m06 * (this.m11 * this.m13 - this.m09 * this.m15) + this.m07 * (this.m09 * this.m14 - this.m10 * this.m13));
	a.m01 = b * (this.m09 * (this.m02 * this.m15 - this.m03 * this.m14) + this.m10 * (this.m03 * this.m13 - this.m01 * this.m15) + this.m11 * (this.m01 * this.m14 - this.m02 * this.m13));
	a.m02 = b * (this.m13 * (this.m02 * this.m07 - this.m03 * this.m06) + this.m14 * (this.m03 * this.m05 - this.m01 * this.m07) + this.m15 * (this.m01 * this.m06 - this.m02 * this.m05));
	a.m03 = b * (this.m01 * (this.m07 * this.m10 - this.m06 * this.m11) + this.m02 * (this.m05 * this.m11 - this.m07 * this.m09) + this.m03 * (this.m06 * this.m09 - this.m05 * this.m10));
	a.m04 = b * (this.m06 * (this.m08 * this.m15 - this.m11 * this.m12) + this.m07 * (this.m10 * this.m12 - this.m08 * this.m14) + this.m04 * (this.m11 * this.m14 - this.m10 * this.m15));
	a.m05 = b * (this.m10 * (this.m00 * this.m15 - this.m03 * this.m12) + this.m11 * (this.m02 * this.m12 - this.m00 * this.m14) + this.m08 * (this.m03 * this.m14 - this.m02 * this.m15));
	a.m06 = b * (this.m14 * (this.m00 * this.m07 - this.m03 * this.m04) + this.m15 * (this.m02 * this.m04 - this.m00 * this.m06) + this.m12 * (this.m03 * this.m06 - this.m02 * this.m07));
	a.m07 = b * (this.m02 * (this.m07 * this.m08 - this.m04 * this.m11) + this.m03 * (this.m04 * this.m10 - this.m06 * this.m08) + this.m00 * (this.m06 * this.m11 - this.m07 * this.m10));
	a.m08 = b * (this.m07 * (this.m08 * this.m13 - this.m09 * this.m12) + this.m04 * (this.m09 * this.m15 - this.m11 * this.m13) + this.m05 * (this.m11 * this.m12 - this.m08 * this.m15));
	a.m09 = b * (this.m11 * (this.m00 * this.m13 - this.m01 * this.m12) + this.m08 * (this.m01 * this.m15 - this.m03 * this.m13) + this.m09 * (this.m03 * this.m12 - this.m00 * this.m15));
	a.m10 = b * (this.m15 * (this.m00 * this.m05 - this.m01 * this.m04) + this.m12 * (this.m01 * this.m07 - this.m03 * this.m05) + this.m13 * (this.m03 * this.m04 - this.m00 * this.m07));
	a.m11 = b * (this.m03 * (this.m05 * this.m08 - this.m04 * this.m09) + this.m00 * (this.m07 * this.m09 - this.m05 * this.m11) + this.m01 * (this.m04 * this.m11 - this.m07 * this.m08));
	a.m12 = b * (this.m04 * (this.m10 * this.m13 - this.m09 * this.m14) + this.m05 * (this.m08 * this.m14 - this.m10 * this.m12) + this.m06 * (this.m09 * this.m12 - this.m08 * this.m13));
	a.m13 = b * (this.m08 * (this.m02 * this.m13 - this.m01 * this.m14) + this.m09 * (this.m00 * this.m14 - this.m02 * this.m12) + this.m10 * (this.m01 * this.m12 - this.m00 * this.m13));
	a.m14 = b * (this.m12 * (this.m02 * this.m05 - this.m01 * this.m06) + this.m13 * (this.m00 * this.m06 - this.m02 * this.m04) + this.m14 * (this.m01 * this.m04 - this.m00 * this.m05));
	a.m15 = b * (this.m00 * (this.m05 * this.m10 - this.m06 * this.m09) + this.m01 * (this.m06 * this.m08 - this.m04 * this.m10) + this.m02 * (this.m04 * this.m09 - this.m05 * this.m08));
	a.bIsIdentity = this.bIsIdentity;
	return true
};
gbox3d.core.Matrix4.prototype.makeInverse = function() {
	var a = new gbox3d.core.Matrix4(false);
	if (this.getInverse(a)) {
		a.copyTo(this);
		return true
	}
	return false
};
gbox3d.core.Matrix4.prototype.getTransposed = function() {
	var a = new gbox3d.core.Matrix4(false);
	a.m00 = this.m00;
	a.m01 = this.m04;
	a.m02 = this.m08;
	a.m03 = this.m12;
	a.m04 = this.m01;
	a.m05 = this.m05;
	a.m06 = this.m09;
	a.m07 = this.m13;
	a.m08 = this.m02;
	a.m09 = this.m06;
	a.m10 = this.m10;
	a.m11 = this.m14;
	a.m12 = this.m03;
	a.m13 = this.m07;
	a.m14 = this.m11;
	a.m15 = this.m15;
	a.bIsIdentity = this.bIsIdentity;
	return a
};

gbox3d.core.Matrix4.prototype.asArray = function() {
	return [this.m00, this.m01, this.m02, this.m03, this.m04, this.m05, this.m06, this.m07, this.m08, this.m09, this.m10, this.m11, this.m12, this.m13, this.m14, this.m15]
};
/* 어레이를 행렬로 만들기 */
gbox3d.core.Matrix4.prototype.byArray = function(a) {
	this.bIsIdentity = false;
	
	if(a.length == 6) {
		//console.log(a);
		this.m00 = a[0];
		this.m01 = a[1];
		this.m02 = 0;
		this.m03 = 0;
		this.m04 = a[2];
		this.m05 = a[3];
		this.m06 = 0;
		this.m07 = 0;
		this.m08 = 0;
		this.m09 = 0;
		this.m10 = 1;
		this.m11 = 0;
		this.m12 = a[4];
		this.m13 = a[5];
		this.m14 = 0;
		this.m15 = 1;
	}
	else {
		this.m00 = a[0];
		this.m01 = a[1];
		this.m02 = a[2];
		this.m03 = a[3];
		this.m04 = a[4];
		this.m05 = a[5];
		this.m06 = a[6];
		this.m07 = a[7];
		this.m08 = a[8];
		this.m09 = a[9];
		this.m10 = a[10];
		this.m11 = a[11];
		this.m12 = a[12];
		this.m13 = a[13];
		this.m14 = a[14];
		this.m15 = a[15];
		
	}
}

gbox3d.core.Matrix4.prototype.fromCss3String = function(css3_str) {
	//console.log(prevTrn);

	var prevTrn = css3_str.slice(css3_str.indexOf('('));
	prevTrn = prevTrn.replace('(', '');
	prevTrn = prevTrn.replace(')', '');
	//console.log(prevTrn);

	var trn_array = prevTrn.split(',');

	//var prev_mat = new gbox3d.core.Matrix4(true);
	//prev_mat.byArray(trn_array);
	
	this.byArray(trn_array);
	
	return this;
}


gbox3d.core.Matrix4.prototype.setByIndex = function(a, b) {
	this.bIsIdentity = false;
	switch(a) {
		case 0:
			this.m00 = b;
			break;
		case 1:
			this.m01 = b;
			break;
		case 2:
			this.m02 = b;
			break;
		case 3:
			this.m03 = b;
			break;
		case 4:
			this.m04 = b;
			break;
		case 5:
			this.m05 = b;
			break;
		case 6:
			this.m06 = b;
			break;
		case 7:
			this.m07 = b;
			break;
		case 8:
			this.m08 = b;
			break;
		case 9:
			this.m09 = b;
			break;
		case 10:
			this.m10 = b;
			break;
		case 11:
			this.m11 = b;
			break;
		case 12:
			this.m12 = b;
			break;
		case 13:
			this.m13 = b;
			break;
		case 14:
			this.m14 = b;
			break;
		case 15:
			this.m15 = b;
			break
	}
};
gbox3d.core.Matrix4.prototype.clone = function() {
	var a = new gbox3d.core.Matrix4(false);
	this.copyTo(a);
	return a
};
gbox3d.core.Matrix4.prototype.copyTo = function(a) {
	a.m00 = this.m00;
	a.m01 = this.m01;
	a.m02 = this.m02;
	a.m03 = this.m03;
	a.m04 = this.m04;
	a.m05 = this.m05;
	a.m06 = this.m06;
	a.m07 = this.m07;
	a.m08 = this.m08;
	a.m09 = this.m09;
	a.m10 = this.m10;
	a.m11 = this.m11;
	a.m12 = this.m12;
	a.m13 = this.m13;
	a.m14 = this.m14;
	a.m15 = this.m15;
	a.bIsIdentity = this.bIsIdentity
};

gbox3d.core.Matrix4.prototype.setTo = function(a) {
	a.copyTo(this);
};

gbox3d.core.Matrix4.prototype.buildProjectionMatrixPerspectiveFovLH = function(e, d, f, c) {
	var b = 1 / Math.tan(e / 2);
	var a = (b / d);
	this.m00 = a;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = b;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = (c / (c - f));
	this.m11 = 1;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = (-f * c / (c - f));
	this.m15 = 0;
	this.bIsIdentity = false
};

//b 가 눈의 위치(포지션) e가 바라보는 위치(타겟)임 도큐먼트 내용과는 다름
//d 는 업벡터
gbox3d.core.Matrix4.prototype.buildCameraLookAtMatrixLH = function(b, e, d) {
	var a = e.substract(b);
	a.normalize();
	var f = d.crossProduct(a);
	f.normalize();
	var c = a.crossProduct(f);
	this.m00 = f.X;
	this.m01 = c.X;
	this.m02 = a.X;
	this.m03 = 0;
	this.m04 = f.Y;
	this.m05 = c.Y;
	this.m06 = a.Y;
	this.m07 = 0;
	this.m08 = f.Z;
	this.m09 = c.Z;
	this.m10 = a.Z;
	this.m11 = 0;
	this.m12 = -f.dotProduct(b);
	this.m13 = -c.dotProduct(b);
	this.m14 = -a.dotProduct(b);
	this.m15 = 1;
	this.bIsIdentity = false
};

//왼손좌표계를 따르는 원근뷰행렬만들기
gbox3d.core.Matrix4.prototype.buildCameraLookAtMatrixLH_CSS3 = function(vEye, vTarget, vUp) {
	
	var vFront = vEye.substract(vTarget); //z axies front
	
	vFront.normalize();
	var vSide = vUp.crossProduct(vFront);//vUp.crossProduct(vFront); //x axies ,side
	vSide.normalize();
	var c = vFront.crossProduct(vSide); // y axies, up
	this.m00 = vSide.X;
	this.m01 = c.X;
	this.m02 = vFront.X;
	this.m03 = 0;
	this.m04 = vSide.Y;
	this.m05 = c.Y;
	this.m06 = vFront.Y;
	this.m07 = 0;
	this.m08 = vSide.Z;
	this.m09 = c.Z;
	this.m10 = vFront.Z;
	this.m11 = 0;
	this.m12 = -vSide.dotProduct(vEye);
	this.m13 = -c.dotProduct(vEye);
	this.m14 = -vFront.dotProduct(vEye);
	
	this.m15 = 1;
	this.bIsIdentity = false;
	
	return this;
};

//우수 좌표
// gbox3d.core.Matrix4.prototype.buildCameraLookAtMatrixRH_CSS3 = function(vEye, vTarget, vUp) {
// 	
// 	
	// var a = vTarget.substract(vEye); //z axies front
	// a.normalize();
	// var f = vUp.crossProduct(a); //x axies ,side
	// f.normalize();
	// var c = a.crossProduct(f); // y axies, up
	// this.m00 = -f.X;
	// this.m01 = c.X;
	// this.m02 = a.X;
	// this.m03 = 0;
	// this.m04 = -f.Y;
	// this.m05 = c.Y;
	// this.m06 = a.Y;
	// this.m07 = 0;
	// this.m08 = -f.Z;
	// this.m09 = c.Z;
	// this.m10 = a.Z;
	// this.m11 = 0;
	// this.m12 = -f.dotProduct(vEye);
	// this.m13 = -c.dotProduct(vEye);
	// this.m14 = -a.dotProduct(vEye);
	// this.m15 = 1;
	// this.bIsIdentity = false;
// 	
	// return this;
// };


gbox3d.core.Matrix4.prototype.setRotationDegrees = function(a) {
	this.setRotationRadians(a.multiplyWithScal(gbox3d.core.DEGTORAD));
	return this;
};
gbox3d.core.Matrix4.prototype.setRotationRadians = function(i) {
	var e = Math.cos(i.X);
	var a = Math.sin(i.X);
	var f = Math.cos(i.Y);
	var c = Math.sin(i.Y);
	var d = Math.cos(i.Z);
	var g = Math.sin(i.Z);
	this.m00 = (f * d);
	this.m01 = (f * g);
	this.m02 = (-c);
	var h = a * c;
	var b = e * c;
	this.m04 = (h * d - e * g);
	this.m05 = (h * g + e * d);
	this.m06 = (a * f);
	this.m08 = (b * d + a * g);
	this.m09 = (b * g - a * d);
	this.m10 = (e * f);
	this.bIsIdentity = false;
	return this;
};
gbox3d.core.Matrix4.prototype.getRotationDegrees = function() {
	var f = -Math.asin(this.m02);
	var e = Math.cos(f);
	f *= gbox3d.core.RADTODEG;
	var c;
	var a;
	var g;
	var d;
	if (Math.abs(e) > 1e-8) {
		var b = (1 / e);
		c = this.m10 * b;
		a = this.m06 * b;
		g = Math.atan2(a, c) * gbox3d.core.RADTODEG;
		c = this.m00 * b;
		a = this.m01 * b;
		d = Math.atan2(a, c) * gbox3d.core.RADTODEG
	} else {
		g = 0;
		c = this.m05;
		a = -this.m04;
		d = Math.atan2(a, c) * gbox3d.core.RADTODEG
	}
	if (g < 0) {
		g += 360
	}
	if (f < 0) {
		f += 360
	}
	if (d < 0) {
		d += 360
	}
	return new gbox3d.core.Vect3d(g, f, d)
};
gbox3d.core.Matrix4.prototype.setTranslation = function(a) {
	this.m12 = a.X;
	this.m13 = a.Y;
	this.m14 = a.Z;
	this.bIsIdentity = false;
	return this;
};
gbox3d.core.Matrix4.prototype.setScale = function(a) {
	this.m00 = a.X;
	this.m05 = a.Y;
	this.m10 = a.Z;
	this.bIsIdentity = false;
	return this;
};
gbox3d.core.Matrix4.prototype.setScaleXYZ = function(a, c, b) {
	this.m00 = a;
	this.m05 = c;
	this.m10 = b;
	this.bIsIdentity = false;
	return this;
};
gbox3d.core.Matrix4.prototype.transformBoxEx = function(d) {
	var b = d.getEdges();
	var c;
	for ( c = 0; c < 8; ++c) {
		this.transformVect(b[c])
	}
	var a = b[0];
	d.MinEdge = a.clone();
	d.MaxEdge = a.clone();
	for ( c = 1; c < 8; ++c) {
		d.addInternalPointByVector(b[c])
	}
};
gbox3d.core.Matrix4.prototype.toString = function() {
	return this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "\n" + this.m04 + " " + this.m05 + " " + this.m06 + " " + this.m07 + "\n" + this.m08 + " " + this.m09 + " " + this.m10 + " " + this.m11 + "\n" + this.m12 + " " + this.m13 + " " + this.m14 + " " + this.m15
};
gbox3d.core.Matrix4.prototype.toHTMLString = function() {
	return "<p>" + this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "<br>" + 
					this.m04 + " " + this.m05 + " " + this.m06 + " " + this.m07 + "<br>" + 
					this.m08 + " " + this.m09 + " " + this.m10 + " " + this.m11 + "<br>" + 
					this.m12 + " " + this.m13 + " " + this.m14 + " " + this.m15 + "</p>"
};

// css3에 메트릭스 값을 직접넣거나 변환값을 넣을때 지수 표기법(e)이 안먹히는거같다.
gbox3d.core.Matrix4.prototype.toCss3String = function() {
	//소수점 3자리까지만 계산하도록함
	// function round3(num) {
		// num *= 1000;
		// return Math.round(num)/1000;
	// }
	return "matrix3d(" + gbox3d.core.round(this.m00,3) + "," + gbox3d.core.round(this.m01,3) + "," + gbox3d.core.round(this.m02,3) + "," + gbox3d.core.round(this.m03,3) + "," + 
	gbox3d.core.round(this.m04,3) + "," + gbox3d.core.round(this.m05,3) + "," + gbox3d.core.round(this.m06,3) + "," + gbox3d.core.round(this.m07,3) + "," + 
	gbox3d.core.round(this.m08,3) + "," + gbox3d.core.round(this.m09,3) + "," + gbox3d.core.round(this.m10,3) + "," + gbox3d.core.round(this.m11,3) + "," + 
	gbox3d.core.round(this.m12,3) + "," + gbox3d.core.round(this.m13,3) + "," + gbox3d.core.round(this.m14,3) + "," + gbox3d.core.round(this.m15,3) + ")"
}