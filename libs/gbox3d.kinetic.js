/**
 * @author 이 석준
 * 
 * kinetic.js extend pulgin
 * 
 * v 0.1
 */

gbox3d.Kinetic = {};

//스프라이트출력
gbox3d.Kinetic.sclicedImageDraw = function(imageObj, cx, cy, width, height,ref_vec) {

	return function() {
		var context = this.getContext();
		
		var x;
		var y;
		
		if(ref_vec == null) {
			x = 0 - (width / 2);
			y = 0 - (height / 2);
		}
		else {
			x = ref_vec.X;
			y = ref_vec.Y;
		}
		
		if(this.sliceinfo == undefined) {
			this.sliceinfo = {
				src_width : width,
				src_height : height,
				src_x : cx,
				src_y : cy,
				center_ref : new gbox3d.core.Vect2d(x, y)
			};
			this.attrs.sliceinfo = this.sliceinfo;
		}
		
		
		
		context.drawImage(imageObj, this.sliceinfo.src_x, this.sliceinfo.src_y, this.sliceinfo.src_width, this.sliceinfo.src_height, 
				this.sliceinfo.center_ref.X, this.sliceinfo.center_ref.Y, width, height);
		
		//충돌처리를 위한 영역 패스 지정.
		context.beginPath();
		context.rect(this.sliceinfo.center_ref.X, this.sliceinfo.center_ref.Y, this.sliceinfo.src_width, this.sliceinfo.src_height);
		context.closePath();
	}
}

//이미지 로더
gbox3d.Kinetic.loadImages = function (sources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	for(var src in sources) {
		numImages++;
	}
	for(var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
				callback(images);
			}
		};
		images[src].src = sources[src];
	}
}

/// 표준 확장함수
Kinetic.Group.prototype.hideall = function() {
	this.hide();
	
	var children = this.getChildren();

	for ( var i = 0; i < children.length; i++) {

		var child = children[i];
		
		child.hide();

	}
}

Kinetic.Group.prototype.showall = function() {
	this.hide();
	
	var children = this.getChildren();

	for ( var i = 0; i < children.length; i++) {

		var child = children[i];
		
		child.show();
	}
}

/////
// Elipse
gbox3d.Kinetic.Ellipse = function(config) {
    // default attrs
    if(this.attrs === undefined) {
        this.attrs = {};
    }
    this.attrs.width = 0;
    this.attrs.height = 0;
    this.shapeType = "Ellipse";

    config.drawFunc = function() {
        var context = this.getContext();
        var kappa = .5522848;
        w = this.attrs.width;
        h = this.attrs.height;
        x = -(w / 2);
        y = -(h / 2);
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

            context.beginPath();
       this.applyLineJoin();
       context.moveTo(x, ym);
       context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
       context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
       context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
       context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
       context.closePath();
            this.fillStroke();
    };
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
};
/*
 * Ellipse methods
 */
gbox3d.Kinetic.Ellipse.prototype = {
    setWidth: function(width) {
        this.attrs.width = width;
    },
    setHeight: function(height) {
        this.attrs.height = height;
    }
};

// extend Shape
Kinetic.GlobalObject.extend(gbox3d.Kinetic.Ellipse, Kinetic.Shape);


///////////////////////////////////////////////////////////////////////
//  Sprite
///////////////////////////////////////////////////////////////////////
/**
 * Sprite constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 *
 *  apply center offset by gbox3d
 *  implemants multi Images frame by gbox3d
 */
gbox3d.Kinetic.Sprite = function(config) {
    this.setDefaultAttrs({
        index: 0,
        frameRate: 17
    });

	//this.is_firstFrame = true;
		
    config.drawFunc = function() {
        if(this.image !== undefined) {
            var context = this.getContext();
            var anim = this.attrs.animation;
            var index = this.attrs.index;
            
            var frame = this.attrs.animations[anim][index];
            
            var that = this;
            //multi images  draw
            //각프레임을 이루는 각 이미지 조각(sprite)들 모두 그리기
            context.beginPath();
            $.each(frame, function(index, f) {
            	context.rect(f.centerOffset.x, f.centerOffset.y, f.width, f.height); //apply center offset
            	
            	context.drawImage(that.image, f.x, f.y, f.width, f.height, f.centerOffset.x, f.centerOffset.y, f.width, f.height);
            });
            context.closePath();

           
        }
    };
    
    // call super constructor
    Kinetic.Shape.apply(this, [config]);
    
    this.setAnimation(this.attrs.animation);
    
};
/*
 * Sprite methods
 */
gbox3d.Kinetic.Sprite.prototype = {
	
	/**
	 * update frame 
	 */
	
	updateFrame: function() {
		
		//console.log(gbox3d.core.CLTimer.getTime() + ',' + this.attrs.index);
		
    	var layer = this.getLayer();
		layer.draw();
		if(this.afterFrameFunc && this.attrs.index === this.afterFrameIndex) {
			this.afterFrameFunc();
		}

	},
	
    /**
     * start sprite animation
     */
    start: function() {
        var that = this;
        var layer = this.getLayer();
        this.interval = setInterval(function() {
            
            that._updateIndex();
            that.updateFrame();
            /*
            layer.draw();
            if(that.afterFrameFunc && that.attrs.index === that.afterFrameIndex) {
                that.afterFrameFunc();
            }
            */
        }, 1000 / this.attrs.frameRate)
    },
    /**
     * stop sprite animation
     */
    stop: function() {
        clearInterval(this.interval);
    },
    
    /**
     * 
     */
    reset : function() {
    	this.updateFrame();
    	this.stop();
    	this.start();
    },
    
    /**
     * set after frame event handler
     * @param {Integer} index frame index
     * @param {Function} func function to be executed after frame has been drawn
     */
    afterFrame: function(index, func) {
        this.afterFrameIndex = index;
        this.afterFrameFunc = func;
    },
    /**
     * set animation key
     * @param {String} anim animation key
     */
    setAnimation: function(anim) {
    	this.attrs.animation = anim;
    },
    
    changeAnimation: function(anim) {
    	if(this.attrs.animation != anim) {
    		this.attrs.animation = anim;
    		this.attrs.index = this.attrs.animations[anim].length-1;
    	}
    },
    /**
     * set animations obect
     * @param {Object} animations
     */
    setAnimations: function(animations) {
        this.attrs.animations = animations;
    },
    /**
     * get animations object
     */
    getAnimations: function() {
        return this.attrs.animations;
    },
    /**
     * get animation key
     */
    getAnimation: function() {
        return this.attrs.animation;
    },
    /**
     * set animation frame index
     * @param {Integer} index frame index
     */
    setIndex: function(index) {
        this.attrs.index = index;
        
    }, 
    setNextIndex: function(index) {
        this.attrs.index = index-1;
        if(this.attrs.index < 0) {
        	//this._updateIndex();
        	this.attrs.index = this.attrs.animations[this.attrs.animation].length-1;
        }
        
    }, 
    
    

    _updateIndex: function() {
        var i = this.attrs.index;
        var a = this.attrs.animation;
        if(i < this.attrs.animations[a].length - 1) {
            this.attrs.index++;
        }
        else {
            this.attrs.index = 0;
        }
    }
};
// extend Shape
Kinetic.GlobalObject.extend(gbox3d.Kinetic.Sprite, Kinetic.Shape);


