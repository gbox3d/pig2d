/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 3. 30.
 * Time: 오후 3:35
 *
 * it is parts of pig2d engine
 * this engine is base on html5 css3
 *
 *
 * changes..

 -13.8.27
 node.removeChild 기능추가
 node.show


 * -13. 8.14
 * SlotSpriteModel
 * animation
 * cloning
 *
 * -13.6.7
 * 미러링 기능추가 (flipX,flipY 속성)
 *
 *
 *
 * todos..
 *
 * - 씬 오더링 문재 해결
 *
 *
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

        element.classList.add('pig2d-node');

        this.attributes.element = element;

        this.attributes.translation = new gbox3d.core.Vect2d(0,0);
        this.attributes.scale = new gbox3d.core.Vect2d(1,1);
        this.attributes.matrix = mat2d.create();
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

    /*
    getTransform : function() {

        return this.attributes.matrix;

    },
    setTransform : function(mat) {

        this.attributes.matrix.clone(mat);

    },
    */

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

    ////////////// animator

    setupTransition : function(param) {
        var element = this.get('element');

        element.style.WebkitTransition = '';
        this.attributes.TransitionEndCallBack = param.TransitionEndCallBack;

        element.addEventListener('webkitTransitionEnd',function() {

            element.style.WebkitTransition = '';
            this.attributes.cssupdate = true;

            if(this.attributes.TransitionEndCallBack != undefined) {

                this.attributes.TransitionEndCallBack.apply(this);

            }

        }.bind(this),false);

    },
    transition : function(param) {

        var element = this.get('element');

        if(element.style.WebkitTransition !== '')
            return;

        if(param.position != undefined) {

            if(param.position.X == this.attributes.translation.X && param.position.Y == this.attributes.translation.Y ) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's';
                    this.setPosition(param.position.X,param.position.Y);
                }
            }
        }

        if(param.rotation != undefined) {
            if(param.rotation == this.attributes.rotation) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's';

                }
                this.setRotation(param.rotation);

            }
        }
        if(param.scale != undefined) {
            if(param.scale.X == this.attributes.scale.X && param.scale.Y == this.attributes.scale.Y) {

            }
            else {
                if(element.style.WebkitTransition === '') {
                    element.style.WebkitTransition = '-webkit-transform ' + param.time + 's';

                }
                this.setScale(param.scale.X,param.scale.Y);

            }
        }

    },
    clearTransition : function() {

        var el = this.get('element');
        el.removeEventListener('webkitTransitionEnd');
        el.style.WebkitTransition = '';
        this.attributes.cssupdate = true;

        console.log(el.style.WebkitTransform);


    },
    ///////////////
    setTexture : function(param) {

        var el = this.get('element');

        if(param.texture_size != undefined) {
            $(el).css('width',  param.texture_size.width + 'px' );
            $(el).css('height',  param.texture_size.height + 'px' );
        }
        if(param.texture != undefined) {

            $(el).css('background-image','url('+ param.texture +')');
        }

        return this;

    },
    updateCSS : function() {

        if(this.attributes.cssupdate == false) return;

        var trans = this.attributes.translation;
        var rot = this.attributes.rotation;
        var scale = this.attributes.scale;

        mat2d.setRotation(this.attributes.matrix,gbox3d.core.degToRad(rot));

        mat2d.setTranslation(this.attributes.matrix,
            this.attributes.offset.x + trans.X,
            this.attributes.offset.y + trans.Y);

        mat2d.setScale(this.attributes.matrix,scale.X,scale.Y);

        var mat = this.attributes.matrix;

        if(this.attributes.flipX) {
            mat[0] *= -1;
            mat[2] *= -1;
        }

        if(this.attributes.flipY) {
            mat[3] *= -1;
            mat[1] *= -1;
        }

        var css_val =  'matrix('
            + mat[0] + ','
            + mat[1] + ','
            + mat[2] + ','
            + mat[3] + ','
            + mat[4] + ','
            + mat[5] + ')';

        var el = this.get('element');

        el.style.WebkitTransform = css_val;
        el.style.MozTransform = css_val;
        el.style.oTransform = css_val;
        el.style.transform = css_val;

        //트랜지션 상태이면 css를 더이상 업데이트 못하게 한다
        if(el.style.WebkitTransition !== '') {
            this.attributes.cssupdate = false;
        }


        return this;
        //브라우져 호환성을 위한 코드

    },
    //노드에서 완전히 제거할때 사용됨
    destroy : function() {

        var el = this.get('element');

        el.removeEventListener('webkitTransitionEnd');

        el.parentNode.removeChild(el);

    },
    clone : function() {
        var model  = Backbone.Model.prototype.clone.call(this);

        //console.log(model);

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

        var element = document.createElement('div');

        element.classList.add('pig2d-sheet');

        this.get('element').appendChild(element);

        var frame = this.attributes.data.frames[0];
        var sheet = frame.sheets[0];

        var sheet_el = document.createElement('div');

        //텍스춰가 바뀌려면 먼저 공백 문자열을 넣어 줘야한다.
        //backgroundImage 가 공백이 아니면 텍스춰를 바꾸지 않는다.
        sheet_el.style.backgroundImage = '';
        sheet_el.style.backgroundImage = 'url('+ sheet.texture +')';
        element.appendChild(sheet_el);


    },
    updateCSS : function () {

        var frame = this.attributes.data.frames[this.attributes.currentFrame];

        if(frame.sheets.length <= 0)
            return;

        var sheet = frame.sheets[0];

        if(sheet.centerOffset != undefined) {
            this.attributes.offset.x = sheet.centerOffset.x;
            this.attributes.offset.y = sheet.centerOffset.y;
        }
        else {
            this.attributes.offset.x = (sheet.width/2);
            this.attributes.offset.y = -(sheet.height/2);

        }

        var el_sheet_root = this.get('element').querySelector('.pig2d-sheet');

        for(var i=0;i< el_sheet_root.childNodes.length;i++ ) {
            var sheet_el = el_sheet_root.childNodes[i];

            sheet_el.style.backgroundPosition = sheet.bp_x+"px " + sheet.bp_y +"px";
            sheet_el.style.width = sheet.width + 'px';
            sheet_el.style.height = sheet.height + 'px';

        }


        return Pig2d.model.prototype.updateCSS.call(this);

    },
    //////////////////////////////////////////////
    //애니메이션 관련 기능
    //////////////////////////////////////////////
    setFrame : function(index)  {

        //프레임 노드 얻기
        this.set('currentFrame',0);
        this.updateCSS();
        return this;
    },
    start_animate : function(param) {

        var delay = this.get('data').frames[0].delay;
        this.setFrame(0);

        setTimeout(this.animate(param).bind(this),delay);


    },
    animate : function(param) {

//        var element =  this.get('node').get('el');
        var frameindex =  this.get('currentFrame');
        var data = this.get('data');
        var delay = data.frames[frameindex].delay;
        //var that = this;


        return function() {

            if(frameindex >= data.frames.length-1) {
                param.endCallBack ? param.endCallBack() : (function(){})();
            }
            else {
                this.set('currentFrame', ++frameindex);
                setTimeout(this.animate(param).bind(this),delay);
            }
            this.updateCSS();

        }

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
        element.appendChild( imglist[this.get('data').animation[index].name] );

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


            var nextframe = (cuurentframe + 1);

            if(nextframe >= endFrame) {  //마지막프레임까지 진행되면...
                nextframe = startFrame;
//                console.log( nextframe + ',' +accTick);
                accTick = 0
                model.setFrame(startFrame);
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
        _.bindAll(this);
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

    initialize: function() {

        var rootNode = new Pig2d.node(
            {
                model : new Pig2d.model({
                    name : 'root_' + (new Date()).getTime() + '_'
                })

            }
        );
        rootNode.get('model').setPosition(0,0);
        //this.attributes.container.append(rootNode.get('model').get('element'));
        this.attributes.container.appendChild(rootNode.get('model').get('element'));

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
        var node = Pig2d.util.createImage(param.img_info);
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

    ////////////////
    createSlotSprite : function(param) {

        var ani_obj =  Pig2d.util.spine.extractAnimation({
            spine_data : param.spine_data,
            slot_name  : param.slot_name,
            base_url   : param.base_url,
            img_type   : param.img_type

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
        //

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

        node.get('model').setTexture(param);

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

    },// end of setup_pig2dTestController

//////////////////////
    spine : {
        /*

         반환 형식
         {
         img_list :{}
         animation :{}
         }
         */
        extractAnimation : function (param) {

            var imagelist = param.spine_data.skins.default[param.slot_name];

            var result_obj = {
                img_list : {}
            };

            for(var key in imagelist ) {

                //이미지 객체 만들기
                var imgobj = new Image();
                imgobj.src = param.base_url + '/' + key + '.' + param.img_type;
                imgobj.style.position = 'absolute';

                //imgobj.style.border = '1px solid'

                var dx = imagelist[key].x - (imagelist[key].width/2);
                var dy = -((imagelist[key].height/2) + imagelist[key].y  );

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


    }

}





