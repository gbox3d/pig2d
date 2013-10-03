/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 3. 30.
 * Time: 오후 3:35
 * version : 0.8
 * it is parts of pig2d engine
 * this engine is base on html5 css3
 */


Pig2d = {
};

/////////////////////
///model

Pig2d.model = Backbone.Model.extend({
    initialize: function() {

        var element = document.createElement('div');

        var name = this.get('name');
        if(name != undefined) {

            element.setAttribute('id',name);
        }


        //2.3 이전 버전을 위한
        if(element.classList != undefined) {
            element.classList.add('pig2d-node');
        }
        else {
            $(element).addClass('pig2d-node');
        }


        this.attributes.element = element;

        this.attributes.update_signal = 'none';

        this.attributes.translation = new gbox3d.core.Vect2d(0,0);
        this.attributes.scale = new gbox3d.core.Vect2d(1,1);

        //this.attributes.matrix = mat2d.create();
        //this.attributes.matrix = new WebKitCSSMatrix();

        this.attributes.flipX = false;
        this.attributes.flipY = false;

        this.attributes.cssupdate = true;

        this.attributes.offset = {
            x:0,
            y:0
        };
    },
    defaults: {
        rotation : 0
    },
    getPosition : function() {
        return this.attributes.translation;
    },
    getRotation : function() {
        return this.attributes.rotation;
    },
    setPosition : function(x,y) {

        this.attributes.translation.set(x,y);
        return this;
    },
    setRotation : function(angle) {
        this.attributes.rotation = angle;
        return this;
    },
    rotate : function(angle_delata) {
        this.attributes.rotation += angle_delata;
        return this;
    },
    setScale : function(x,y) {

        this.attributes.scale.set(x,y);

        return this;

    },
    getScale : function() {

        return this.attributes.scale;

    },
    translate: function () {

        var v1 = new gbox3d.core.Vect2d();
        var center = new gbox3d.core.Vect2d(0,0);

        return function ( distance, axis ) {

            // axis is assumed to be normalized

            v1.copy( axis );
            v1.multiply( distance );

            v1.rotate( gbox3d.core.degToRad(-this.attributes.rotation),center);

            if(this.attributes.flipX) {
                v1.X *= -1;
            }

            if(this.attributes.flipY) {
                v1.Y *= -1;
            }

            this.attributes.translation.addToThis( v1 );

            return this;

        };

    }(),

    /////////////////////
    ////행렬관련
    //////////////////
    getCssMatrix : function() {

        var el = this.get('element');
        var computedStyle = window.getComputedStyle(el);
        var trans = computedStyle.getPropertyValue('-webkit-transform');

        var cssmat = new WebKitCSSMatrix(trans);

        return cssmat;

    },
    //주어진 행렬을 분해하여 노드변환값에 역적용하기
    decomposeCssMatrix : function(cssmat) {
        //var cssmat = this.getCssMatrix();

        //이동변환 얻기
        this.attributes.translation.X = cssmat.e;
        this.attributes.translation.Y = cssmat.f;

        //스케일 얻기
        var scalex = Math.sqrt(cssmat.a*cssmat.a + cssmat.b*cssmat.b);
        var scaley = Math.sqrt(cssmat.c*cssmat.c + cssmat.d*cssmat.d);

        this.attributes.scale.X = scalex;
        this.attributes.scale.Y = scaley;

        //회전 얻기
        var angle = Math.round(Math.atan2(cssmat.b/scalex, cssmat.a/scalex) * (180/Math.PI));
        this.attributes.rotation = angle;

    },

    ////////////// animator
    setupTransition : function(param) {
        var element = this.get('element');

        element.style.WebkitTransition = '';
        this.attributes.TransitionEndCallBack = param.TransitionEndCallBack;

        this.attributes._TransitionEndCallBack = function() {

            element.style.WebkitTransition = '';
            this.attributes.cssupdate = true;

            if(this.attributes.TransitionEndCallBack != undefined) {

                this.attributes.TransitionEndCallBack.apply(this);

            }

        }.bind(this);



        element.addEventListener('webkitTransitionEnd',this.attributes._TransitionEndCallBack,false);




//        if(param.timing_function != undefined) {
//            element.style.webkitTransitionTimingFunction = 'linear';
//        }
        return this;

    },
    transition : function(param) {

        var element = this.get('element');

        param.timing_function = param.timing_function ? param.timing_function : 'linear';

        if(element.style.WebkitTransition !== '')
            return;

        if(param.position != undefined) {

            if(param.position.X == this.attributes.translation.X && param.position.Y == this.attributes.translation.Y ) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's ' + param.timing_function;
                    this.setPosition(param.position.X,param.position.Y);
                }
            }
        }

        if(param.rotation != undefined) {
            if(param.rotation == this.attributes.rotation) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's '+ param.timing_function;

                }
                this.setRotation(param.rotation);

            }
        }
        if(param.scale != undefined) {
            if(param.scale.X == this.attributes.scale.X && param.scale.Y == this.attributes.scale.Y) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's ' + param.timing_function;

                }
                this.setScale(param.scale.X,param.scale.Y);

            }
        }

    },
    stopTransition : function(param) {

        this.attributes.update_signal = 'stop_transition';

        return this;

    },
    clearTransition : function() {

        var el = this.get('element');
        el.removeEventListener('webkitTransitionEnd',this.attributes._TransitionEndCallBack);
        this.attributes.update_signal = 'stop_transition';


    },
    ////////////////////

    updateCSS : function() {

        //if(this.attributes.cssupdate == false) return;

        var el = this.get('element');

        switch (this.attributes.update_signal) {

            case 'none':
                (function() {
                    //오브잭트변환값을 앨리먼트쪽으로 갱신해주기
                    if(this.attributes.cssupdate == true) {

                        var trans = this.attributes.translation;
                        var rot = this.attributes.rotation;
                        var scalex = this.attributes.scale.X;
                        var scaley = this.attributes.scale.Y;

                        //반전 적용
                        if(this.attributes.flipX) {
                            scaley = -scaley;
                        }
                        if(this.attributes.flipY) {
                            scalex = -scalex;
                        }

                        var css_val = 'translate(' + trans.X + 'px,' + trans.Y +'px) ' +
                            'rotate(' + rot + 'deg) ' +
                            'scale(' + scalex + ',' + scaley + ')';

                        //브라우져 호환성을 위한 코드
                        el.style.WebkitTransform = css_val;
                        el.style.MozTransform = css_val;
                        el.style.oTransform = css_val;
                        el.style.transform = css_val;

                        //트랜지션 상태이면 css를 더이상 업데이트 못하게 한다
                        if(el.style.WebkitTransition !== '') {
                            this.attributes.cssupdate = false;
                        }

                    }
                    else {

                    }

                }).bind(this)();
                break;
            case 'stop_transition':
                (function() {

                    //행렬분해후 적용
                    this.decomposeCssMatrix(this.getCssMatrix());


                    el.style.WebkitTransition = '';
                    this.attributes.update_signal = 'none';
                    this.attributes.cssupdate = true;

                    this.updateCSS();

                }).bind(this)();
                break;

        }

        return this;


    },

    //////////////////////////
    //노드에서 완전히 제거할때 사용됨
    destroy : function() {

        var el = this.get('element');
        //el.removeEventListener('webkitTransitionEnd');
        this.clearTransition();
        el.parentNode.removeChild(el);

    },
    clone : function() {
        var model  = Backbone.Model.prototype.clone.call(this);
//        console.log(model);
        model.set("element",this.get('element').cloneNode(true));
        return model;

    }

});
//end of base model
//////////////////////

Pig2d.SpriteModel = Pig2d.model.extend({
    initialize: function(param) {
        Pig2d.model.prototype.initialize.call(this);

        this.attributes.currentFrame = 0;

        //애니메이션 타이머 핸들
        this.attributes.animationHID = null;

        var sheet = document.createElement('canvas');

        sheet.classList.add('pig2d-sheet');
        sheet.style.position = 'absolute';

        this.get('element').appendChild(sheet);
        this.set('sheet',sheet);

        this.setFrame(0);
    },
    clone : function() {

        var model  = Backbone.Model.prototype.clone.call(this);
        console.log('SpriteModel clone');
        //model.set("element",this.get('element').cloneNode(true));

        return model;

    },
    updateCSS : function () {

        return Pig2d.model.prototype.updateCSS.call(this);

    },
    //////////////////////////////////////////////
    //애니메이션 관련 기능
    //////////////////////////////////////////////
    setFrame : function(index)  {
        //프레임 노드 얻기
        this.set('currentFrame',index);

        var sheet = this.get('sheet');
        var frame = this.attributes.data.frames[this.attributes.currentFrame];
        var sheet_data = frame.sheets[0];

        sheet.width = sheet_data.width;
        sheet.height = sheet_data.height;

        sheet.style.left =  sheet_data.centerOffset.x + 'px';
        sheet.style.top = sheet_data.centerOffset.y + 'px';

        var ctx		= sheet.getContext('2d');
        ctx.drawImage(
            this.get('imgObj'),
            -sheet_data.bp_x,-sheet_data.bp_y,sheet.width,sheet.height,
            0,0,sheet.width,sheet.height
        );

        return this;
    },
    start_animate : function(param) {

        var delay = this.get('data').frames[0].delay;
        this.setFrame(0);

        setTimeout(this.animate(param).bind(this),delay);


    },
    stop_animate : function() {

        if(this.attributes.animationHID != null) {
            clearTimeout(this.attributes.animationHID);
            this.attributes.animationHID = null;
        }
    },
    animate : function(param) {

        param = param || {};

        var loop = param.loop || false;

        var frameindex =  this.get('currentFrame');

        var data = this.get('data');


        return (function() {

            var endFrame = param.endFrame || data.frames.length - 1;



            if(frameindex >= endFrame) {//마지막 프레임이면

                //console.log(frameindex +'/' +  param.endFrame );
                console.log(endFrame);

                param.endCallBack ? param.endCallBack(this) : (function(){})();

                if(loop == true) {

                    if(param.startFrame != undefined ) {
                        if(!param.startFrame)
                        {
                            frameindex = 0;
                        }
                        else {
                            frameindex = param.startFrame - 1;
                        }

                    }else {
                        frameindex = 0;
                    }
                    this.setFrame(frameindex);
                    var delay = data.frames[frameindex].delay;

                    this.attributes.animationHID = setTimeout(this.animate(param).bind(this),delay);
                }

            }
            else {

                ++frameindex;

                this.setFrame(frameindex);
                var delay = data.frames[frameindex].delay;
                this.attributes.animationHID =setTimeout(this.animate(param).bind(this),delay);
            }

        }).bind(this);

    },

    /////////////////////////

    destroy : function() {

        this.stop_animate();

        //슈퍼 클래싱
        Pig2d.model.prototype.destroy.call(this);
    }


});
//end of sprite model
///////////////////////

//스파인 슬롯을 이용한 애니메이션
Pig2d.SlotSpriteModel = Pig2d.model.extend( {
    initialize: function(param) {

        Pig2d.model.prototype.initialize.call(this);
        this.attributes.currentFrame = 0;

        var element = document.createElement('div');

        element.classList.add('pig2d-sprite-frame');

        this.get('element').appendChild(element);



    } ,
    updateCSS : function () {
        return Pig2d.model.prototype.updateCSS.call(this);
    },
    setFrame : function(index)  {

        //프레임 노드 얻기
        var element = this.get('element').querySelector('.pig2d-sprite-frame');
        var imglist = this.get('data').img_list;

        //프레인 노드 내의 자식노드 모두 없애기
        //이 방법이 가장 빠르다.
        //출처 : http://jsperf.com/innerhtml-vs-removechild
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        var imgElem = imglist[this.get('data').animation[index].name];

        element.appendChild( imgElem);

        this.attributes.currentFrame = index;

        return this;
    },
    nextFrame : function() {

        this.attributes.currentFrame++;

        this.attributes.currentFrame %= this.get('data').animation.length;

        this.setFrame(this.attributes.currentFrame);

        return this;

    },
    getAnimation_applier : function(param) {

        var accTick = 0;
        var startFrame = param.startFrame ? param.startFrame:0 ;
        var endFrame = param.endFrame ? param.endFrame : this.get('data').animation.length -1;

        var model = this;

        return function(deltaTime) {

            //var deltaTime = mytimer.getDeltaTime();
//            framerate_info.innerText = 1.0 / deltaTime;

            accTick += deltaTime;

            var ani = model.get('data').animation;

            var cuurentframe = model.get('currentFrame');

            if(param.keyFrame) {
                if(cuurentframe == param.keyFrame) {
                    param.callbackKeyFrame(model);
                }
            }

            var nextframe = (cuurentframe + 1);

            if(nextframe >= endFrame) {  //마지막프레임까지 진행되면...

//                console.log( nextframe + ',' +accTick);
                if( ani[nextframe].time < accTick) {
                    accTick = 0
                    model.setFrame(startFrame);
                    nextframe = startFrame;
                }
            }
            else {
                if( ani[nextframe].time < accTick) {

//                    console.log(nextframe);

                    model.nextFrame();
                }
            }

        }

    },
    clone : function() {

        var clone_model  = Backbone.Model.prototype.clone.call(this);

        //딥 클로닝

        var result_obj = {
            img_list : {}
        };

        var ani_obj = clone_model.get('data');

        for(var key in ani_obj.img_list) {

            result_obj.img_list[key] = ani_obj.img_list[key].cloneNode(true);

        }

        result_obj.animation = ani_obj.animation;

        clone_model.set({
            data : result_obj
        });


        return clone_model;
    }


});
//end of slot sprite model
///


//////////////////node//
/////////////////////////

Pig2d.node = Backbone.Model.extend({
    initialize: function() {
        this.attributes.chiledren = new Array();

//        _.bindAll(this,"update","clone");

    },
    update: function(applyChild) {

        this.get('model').updateCSS();

        if( applyChild == true) {

//            for(var index in this.attributes.chiledren) {
            for(var index = 0;index < this.attributes.chiledren.length;index++ ) {
                this.attributes.chiledren[index].update(applyChild);
            }
        }

        return this;

    },
    clone : function() {

        //딥 클로닝

        var node  = Backbone.Model.prototype.clone.call(this);

        if(node.get('model')) {

            var model = node.get('model').clone();
            node.set({model:model});
        }


        var chiledren = this.get('chiledren');

        for(var i=0;i<chiledren.length;i++) {

            node.add(chiledren[i].clone());
        }

        return node;
    },
    findByName : function(name) {

        if(name == this.attributes.name) return this;

        for(var index in this.attributes.chiledren ) {
            var obj = this.attributes.chiledren[index].findByName(name);
            if(obj != null)
                return obj;
        }
        return null;
    },
    add : function(child_node,parents) {

        if(parents == undefined || parents == null) {
            parents = this;
        }

        parents.get('chiledren').push(child_node);

        //모델이 존재하면
        if(parents.get('model')) {
            var par_el = parents.get('model').get('element');
            var child_el = child_node.get('model').get('element');
        }
        par_el.appendChild(child_el);

        child_node.attributes.parent = parents;

        return this;
    },
    //부모노드 바꾸기
    setParent : function(parent) {

        var old_parent = this.get('parent');

        var chiledren = old_parent.get('chiledren');


        for(var i= chiledren.length-1;i >= 0;i--) {

            if(chiledren[i] === this) {
                chiledren.splice(i,1);
                parent.add(this);
            }
        }

    },
    removeChild : function(node) {

        for(var i= this.attributes.chiledren.length-1;i >= 0;i--) {

            var _node = this.attributes.chiledren[i];

            if(_node === node) {

                this.attributes.chiledren.splice(i,1);

                node.get('model').destroy();

                return true;
            }
            else {
                _node.removeChild(node); //자식노드까지 검사
            }
        }

        return false;

    },
    removeChildAll : function() {

        for(var i= this.attributes.chiledren.length-1;i >= 0;i--) {
            this.removeChild(this.attributes.chiledren[i]);
        }

        return false;

    },
    show : function(visible) {

        console.log(this.get('model').get('element'));

        this.get('model').get('element').style.visibility = visible ? 'visible' : 'hidden';
    }

});
//end of node
///////////////
///
Pig2d.SceneManager = Backbone.Model.extend({

    initialize: function(param) {


       // param.window_size = param.window_size ? param.window_size : {};

        var rootNode = new Pig2d.node(
            {
                model : new Pig2d.model({
                    name : 'root_' + (new Date()).getTime() + '_'
                })

            }
        );
        rootNode.get('model').setPosition(0,0);
        //this.attributes.container.append(rootNode.get('model').get('element'));

        var rootElement = rootNode.get('model').get('element');


        if(param.window_size != undefined) {
            rootElement.style.overflow = 'hidden';
            rootElement.style.width = param.window_size.width + 'px' ;
            rootElement.style.height = param.window_size.height + 'px' ;
        }



        this.attributes.container.appendChild(rootElement);
        this.attributes.rootNode = rootNode;
    },
    updateAll : function() {

        this.attributes.rootNode.update(true);

    },
    add : function(node,parent) {

        if(parent == undefined) {
            this.attributes.rootNode.add(node);
        }
        else {
            parent.add(node);
        }

    },
    addImageNode : function(param) {

        //var node = Pig2d.util.createImage(param.img_info);
        //this.add(node,param.parent);

        var center_x = param.center ? param.center.x : 0;
        var center_y = param.center ? param.center.y : 0;

        var node = Pig2d.util.createDummy();

        var imgObj = new Image();
        imgObj.onload = function(evt) {

            //console.log(this.width);

            imgObj.style.position = 'absolute';
            imgObj.style.left = -this.width/2 + parseInt(center_x) + 'px';
            imgObj.style.top = -this.height/2 + parseInt(center_y) + 'px';

            var element = node.get('model').get('element');

            element.appendChild(imgObj);

            node.get('model').set('imgObj', imgObj);

            if(param.onload) {
                param.onload(node);
            }

        }
        imgObj.src = param.src;

        this.add(node,param.parent);

        return node;
    },
    addSpriteSceneNode : function(param) {

        var node = Pig2d.util.createSprite(param.spr_info);

        node.show(true);
        this.add(node,param.parent);
        return node;

    }


});
//end of scene manager

////////////////////////
///util

Pig2d.util = {

    ///////////////
    createDummy : function() {

        return new Pig2d.node({
            model:new Pig2d.model()
        });

    },
    //////////////////
    //캔버스 기반의 스프라이트 생성
    createSlicedImage : function(param) {

        var model = new Pig2d.model();
        var element = model.get('element');

        var cutx = param.cutx || 0;
        var cuty = param.cuty || 0;
        var basex = param.basex || 0;
        var basey = param.basey || 0;

        var canvas	= document.createElement( 'canvas' );
        canvas.width	= param.width || param.imgObj.width;
        canvas.height	= param.height || param.imgObj.height;

        canvas.style.position = 'absolute';
        //canvas.style.left =  basex + 'px';
        //canvas.style.top = basey + 'px';

        canvas.style.WebkitTransform = 'translate(' + basex +'px,' + basey + 'px)';

        element.appendChild(canvas);

        var ctx		= canvas.getContext('2d');
        ctx.drawImage(param.imgObj,cutx,cuty,canvas.width,canvas.height,0,0,canvas.width,canvas.height);

        var node = new Pig2d.node();
        node.set({model : model});

        return node;
    },

    ////////////////
    createSlotSprite : function(param) {

        var ani_obj =  Pig2d.util.spine.extractAnimation({
            spine_data : param.spine_data,
            slot_name  : param.slot_name,
            base_url   : param.base_url,
            img_type   : param.img_type,
            loadComplete : param.loadComplete
        });

        //console.log(ani_obj);

        var node = new Pig2d.node();

        var model = new Pig2d.SlotSpriteModel({
            data : ani_obj
        });

//        model.set({node:node});
        node.set({ model : model});

        return node;
    },

    ////////////////
    createSprite : function(param) {
        //노드생성

        var  element = $('<div></div>');

        var node = new Pig2d.node(
            {
                el : element// $('.pig2d-templet .pig2d-sprite-templ ').clone(),
            }
        );

        node.set(
            {
                model : new Pig2d.SpriteModel( {
                        data : param.SpriteData,
                        editor_info : param.editor_info ? param.editor_info :  {
                            width : 320,
                            height : 240
                        },
                        node :node
                    }
                )}
        );

        return node;

    },
    //////////////////

    createImage : function(param) {
        //노드생성

        var node = new Pig2d.node(
            {
                model : new Pig2d.model()
            }
        );

        console.log('create img');

        if(param.center) {

            var element = document.createElement('div');

            element.style.backgroundImage = 'url('+ param.texture +')';
            element.style.width = param.texture_size.width + 'px';
            element.style.height = param.texture_size.height + 'px';

            var cssval = 'translate('+ -param.center.x +'px,' + -param.center.y + 'px)'
            element.style.WebkitTransform = cssval ;

            node.get('model').get('element').appendChild(element);

        }
        else {
            node.get('model').setTexture(param);
        }


        return node;

    },
    //////////////////////////////
    ///테스트용 컨트롤러
    setup_pig2dTestController : function (listener_element,node) {
        function callbackControl(movementX,movementY) {

            node.get('model').rotate(movementX);
            node.get('model').translate(movementY,new gbox3d.core.Vect2d(0,1));
//                Smgr.updateAll();
        }


        //이벤트처리
        listener_element.addEventListener( 'mousedown', onDocumentMouseDown, false );
        listener_element.addEventListener( 'touchstart', onDocumentTouchStart, false );
        listener_element.addEventListener( 'touchmove', onDocumentTouchMove, false );


        function onDocumentMouseDown( event ) {

            event.preventDefault();

            listener_element.addEventListener( 'mousemove', onDocumentMouseMove, false );
            listener_element.addEventListener( 'mouseup', onDocumentMouseUp, false );

        }

        function onDocumentMouseMove( event ) {

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            callbackControl(movementX,-movementY);

        }

        function onDocumentMouseUp( event ) {

            listener_element.removeEventListener( 'mousemove', onDocumentMouseMove );
            listener_element.removeEventListener( 'mouseup', onDocumentMouseUp );

        }

        //터치 디바이스
        var touchX,  touchY;

        function onDocumentTouchStart( event ) {

            event.preventDefault();

            var touch = event.touches[ 0 ];

            touchX = touch.screenX;
            touchY = touch.screenY;

        }

        function onDocumentTouchMove( event ) {

            event.preventDefault();

            var touch = event.touches[ 0 ];

            var movementX =  (touchX - touch.screenX);
            var movementY =  (touchY - touch.screenY);
            touchX = touch.screenX;
            touchY = touch.screenY;

            callbackControl(movementX,movementY);
        }

    }// end of setup_pig2dTestController
    //,setup_pig2dMoveController : function(listener_element,node) {

    //},

//////////////////////
    ,spine : {
        /*

         반환 형식
         {
         img_list :{}
         animation :{}
         }
         */
        extractAnimation : function (param) {

            //default 를 키워드로 인식하는 번역기가 종종 있음
            var imagelist = param.spine_data.skins.default[param.slot_name];

            var result_obj = {
                img_list : {}
            };


            var imagelist_count = 0;
            for(var key in imagelist ) {
                imagelist_count++;
            }

            var counter = 0;
            for(var key in imagelist ) {

                //이미지 객체 만들기
                var imgobj = new Image();

                imgobj.onload = function() {

                    counter++;
                    //console.log(imagelist);

                    if(counter == imagelist_count) {
                        if(param.loadComplete) {
                            param.loadComplete(result_obj);
                        }
                    }
                    else {
                        if(param.loadProgress) {
                            var evt = {
                                img : imgobj,
                                count : counter,
                                total_count : imagelist_count
                            }
                            param.loadProgress(evt);
                        }
                    }
                };

                imgobj.src = param.base_url + '/' + key + '.' + param.img_type;
                imgobj.style.position = 'absolute';

                //console.log(imagelist[key].x);

                var cx = imagelist[key].x || 0;
                var cy = imagelist[key].y || 0;

                var dx = cx - (imagelist[key].width/2);
                var dy = -((imagelist[key].height/2) + cy );

                var cssstr =  'translate('+ dx  + 'px,'+ dy +'px)';

                //크로스 브라우져를 위해서
                imgobj.style.WebkitTransform = cssstr;
                imgobj.style.MozTransform = cssstr;
                imgobj.style.oTransform = cssstr;
                imgobj.style.Transform = cssstr;

                result_obj.img_list[key] = imgobj;

            }

            result_obj.animation = param.spine_data.animations.animation.slots[param.slot_name].attachment;

            return result_obj;

        }


    },

    controller : {
        /*

        parameter

        lisnter_element : 조이스틱효과용 컨테이너 앨리먼드
         radius_control : 조이스틱의 컨트롤 공간의 둘레크기

         */
        Joystick  : function(param){

            this.start_spot = new gbox3d.core.Vect2d();
            this.vDirection = new gbox3d.core.Vect2d();
            this.Distance =0;
            this.Angle = 0;


            var listener_element = param.listener_element;
            var radius_control = param.radius_control;



            function _callBackMoveControl(mx,my) {

                //console.log(movementX + ',' + movementY);

                var vDir =  this.start_spot.sub(mx,my);

                var dist = vDir.getDistance();

                //제로디스턴스 예외처리
                if(dist > 0) {
                    vDir.normalize();
                    this.vDirection.X = -vDir.X;
                    this.vDirection.Y = vDir.Y;

                    //console.log(this.vDirection);

                    this.Angle = vDir.getAngle();

                    if(dist > radius_control) {
                        dist = radius_control;
                    }

                    this.Distance = dist / radius_control;

                }
                else {
                    //console.log('zero distance');
                }
            };


            function _onDocumentMouseDown( event ) {

                event.preventDefault();

                listener_element.addEventListener( 'mousemove',onDocumentMouseMove , false );
                listener_element.addEventListener( 'mouseup', onDocumentMouseUp, false );

                this.start_spot.set(event.pageX,event.pageY);

            }

            function _onDocumentMouseMove( event ) {
                callBackMoveControl(event.pageX,event.pageY);
            }

            function _onDocumentMouseUp( event ) {

                this.vDirection.set(0,0);
                this.Distance = 0;

                listener_element.removeEventListener( 'mousemove', onDocumentMouseMove );
                listener_element.removeEventListener( 'mouseup', onDocumentMouseUp );

            }

            var onDocumentMouseDown = _onDocumentMouseDown.bind(this);
            var callBackMoveControl = _callBackMoveControl.bind(this);
            var onDocumentMouseMove = _onDocumentMouseMove.bind(this);
            var onDocumentMouseUp = _onDocumentMouseUp.bind(this);

            var onDocumentTouchStart = _onDocumentTouchStart.bind(this);
            var onDocumentTouchMove = _onDocumentTouchMove.bind(this);
            var onDocumentTouchEnd = _onDocumentTouchEnd.bind(this);

            //이벤트처리
            listener_element.addEventListener( 'mousedown', onDocumentMouseDown, false );
            listener_element.addEventListener( 'touchstart', onDocumentTouchStart, false );
            listener_element.addEventListener( 'touchmove', onDocumentTouchMove, false );
            listener_element.addEventListener('touchend',onDocumentTouchEnd,false);




            //터치 디바이스
            //var touchX,  touchY;

            function _onDocumentTouchStart( event ) {

                event.preventDefault();

                var touch = event.touches[ 0 ];

                this.start_spot.set(touch.pageX,touch.pageY);

                //touchX = touch.screenX;
                //touchY = touch.screenY;

            }

            function _onDocumentTouchEnd(event) {

                this.vDirection.set(0,0);
                this.Distance = 0;


            }

            function _onDocumentTouchMove( event ) {

                event.preventDefault();

                var touch = event.touches[ 0 ];

//            var movementX =  (touchX - touch.screenX);
//            var movementY =  (touchY - touch.screenY);
//            touchX = touch.screenX;
//            touchY = touch.screenY;

                callBackMoveControl(touch.pageX,touch.pageY);
            }

        }
    }

}





