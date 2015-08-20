/**
 * Created by gbox3d on 15. 1. 17..
 */

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
    /*
     인자 리스트
     startFrame
     endFrame
     animation
     texture
     */
    createSprite : function(param) {


        var startFrame = param.startFrame || 0;
        var endFrame = param.endFrame || (param.animation.frames.length-1);

        //노드생성
        var node = new Pig2d.node();

        var model;
        if(param.canvas_size) {
            model =  new Pig2d.SpriteModel.fixedCanvas( {
                    data : param.animation,
                    imgObj : param.texture,
                    canvas_size : param.canvas_size
                }
            );

        }
        else {
            model =  new Pig2d.SpriteModel( {
                    data : param.animation,
                    imgObj : param.texture
                }
            );

        }


        node.set(
            { model : model }
        );

        node.get('model').setupAnimation({
            startFrame:startFrame,
            endFrame:endFrame
        });

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

        console.log('create image');

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
    SetupAsset : function(param) {

        var asset_path = param.asset_path;
        var img_files = param.img_files;
        var animation_files = param.animation_files;
        var OnLoadComplete = param.OnLoadComplete;
        var OnLoadProgress = param.OnLoadProgress;
        var textures = {};
        var animations = {};
        var i=0;


        function preLoadAnimation(filename,data) {

            if(data) {
                //console.log(filename);
                animations[filename] = data;
            }

            if(animation_files.length <= i) {

                var result = {};
                result.textures = textures;
                result.animations = animations;
                if(OnLoadComplete != undefined)
                    OnLoadComplete(result);

            }
            else {
                var url = asset_path + animation_files[i];
                var file_name = animation_files[i];
                i++;
                $.ajax({
                    type : "GET",
                    url : url,
                    dataType : "json",
                    success : preLoadAnimation.bind(this,file_name),
                    error : function(evt,status,xhr) {

                        console.log(status);

                    }
                });
            }

        }


        if(img_files.length > 0 ) {
            (function preLoadImg() {

                var imgObj = new Image();
                imgObj.onload = function() {

                    var evt = {};
                    textures[img_files[i]] = imgObj;

                    evt.percent = (i/img_files.length) * 100;
                    evt.currentIndex = i;

                    if(OnLoadProgress != undefined)
                        OnLoadProgress(evt);

                    i++;

                    if(i < img_files.length) {
                        preLoadImg(); //다음 이미지 로딩
                    }
                    else {

                        if(animation_files) {
                            i=0;
                            preLoadAnimation();
                        }
                        else {
                            var result = {};
                            result.textures = textures;
                            if(OnLoadComplete != undefined)
                                OnLoadComplete(result);

                        }


                    }

                }

                //imgObj.src =  asset_path + img_files[i];

                if(img_files[i].indexOf('https://') == 0 || img_files[i].indexOf('http://') == 0 ) { //맨처음에 웹서버 주소가 있으면...

                    imgObj.src =  img_files[i];

                }
                else {
                    imgObj.src =  asset_path + img_files[i];
                }



            })();

        }
        else {
            OnLoadComplete({});
        }


    },


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

    }, // end of setup_pig2dTestController

    createDynamicTextureNode :function (fit_size) {

        var node = Pig2d.util.createDummy();

        var element = document.createElement('div');
        node.get('model').get('element').appendChild(element);
        node.textureElement = element;

        node.setTexture = function (url,callback) {

            //var element =  node.textureElement;

            var imgObj = new Image();
            imgObj.onload = function() {

                element.style.backgroundImage = 'url('+ imgObj.src +')';

                //var fit_size = 200;
                if(imgObj.width > imgObj.height) {

                    var ratio = imgObj.width / imgObj.height;
                    var width = (fit_size * ratio);
                    var height = fit_size;

                    element.style.width = width + 'px';
                    element.style.height = height + 'px';
                    element.style.webkitTransform = 'translate('+ -width/2 + 'px,' + -height/2 + 'px)';
                    //node.get('model').setRotation(90);
                }
                else {
                    var ratio = 1 / (imgObj.width / imgObj.height);
                    var width = (fit_size);
                    var height = fit_size * ratio;

                    element.style.width = width + 'px';
                    element.style.height = height + 'px';

                    element.style.webkitTransform = 'translate('+ -width/2 + 'px,' + -height/2 + 'px)';


                }
                //node.get('model').setRotation(90);

                element.style.backgroundSize = "100% 100%";
                element.style.backgroundRepeat = "no-repeat";

                callback(node);

            }

            imgObj.src = url;

        }

        return node;
        //changeTexture('http://gunpower01.iptime.org/uploads/_1421393532350_1421393524397.jpg',200,node);

    },

    createDomElement : function(option) {

        var node = Pig2d.util.createDummy();

        $.ajax(
            {
                url : option.url,
                success : function(data) {

                    //console.log(data);
                    node.get('model').get('element').innerHTML = data;
                    //var child_elm = node.get('model').get('element').querySelector(option.rootName);
                    var child_elm = node.get('model').get('element').firstElementChild;//||elem.firstChild)

                    if(option.center) {

                        child_elm.style.webkitTransform = 'translate('+
                            option.center.x +'px,'+
                            option.center.y + 'px)';

                    }
                    else {
                        child_elm.style.webkitTransform = 'translate('+ -child_elm.offsetWidth/2 +'px,'+ -child_elm.offsetHeight/2 + 'px)';
                    }

                    node.get('model').get('element').appendChild(
                        child_elm
                    );

                    option.callback();

                }
            }
        )


        return node;

    },

    addSprite : function(param) {

        /*

         내부적인 종속 관계

         node -> node_control-> node_sprite

         node 는 실제 연결된 객체의 위치,회전,크기 변환시에 사용한다.

         node_control 에는 css 애니메이션 효과를 붙인다.

         node_sprite 에는 좌우 반전 또는 프레임애니메이션 효과를 제어 할때 사용한다.

         */

        var parent = param.parent;// || this.CameraNode;
        var prefeb = param.prefeb;// || this.current_select_prefeb;

        if(!prefeb) {
            alert('오브잭트 프리펩을 먼저 선택해주세요')
            return null;
        }

        var node = Pig2d.util.createDummy();
        node.type = 'sprite_dummy';
        if(param.name) {
            node.set('name',param.name);
        }

        /*
         //초기위치를 카메라 스케일에 맞추어 보정해준다.
         var cam_scale = this.CameraNode.get('model').getScale();

         node.get('model').setPosition(
         param.x * (1.0 / cam_scale.X) ,
         param.y * (1.0 / cam_scale.Y) );
         */

        parent.add(node);

        //css 이펙트를 적용 시키기위한 더미 노드 ,
        var node_control = Pig2d.util.createDummy();
        node_control.type = 'control_dummy';

        //루트 노드에 추가 시키기
        node.add(node_control);
        node.node_control = node_control; //쉽게 찾을수 있도록 참조값 만들기

        if(prefeb.data.animation) {
            //스프라이트 노드 (반전,애니메이션 기능을 수행한다)
            var node_sprite = Pig2d.util.createSprite(
                prefeb.data
            );
            node_sprite.type = 'sprite';
            node_sprite.prefeb = prefeb;

            //인자들은 기본값은으로 세팅
            node_sprite.get('model').setupAnimation({
                isAnimationLoop: false,
                AnimationStatus : 'stop'

            });
            node_control.add(node_sprite);

            node.node_sprite = node_sprite; //쉽게 찾을수 있도록 참조값 만들기

            //툴에서 해당 노드의 캔버스 앨리먼트 클릭시 노드를 쉽게 찾을수 있도록 참조값 만들어준다.
            node_sprite.get('model').get('sheet').target_node = node;


        }
        else { //통이미지 스프라이트
            var node_sprite = Pig2d.util.createSlicedImage({
                imgObj: prefeb.data.texture
            });

            node_sprite.type = 'image';
            node_sprite.prefeb = prefeb;

            node_control.add(node_sprite);

            node.node_sprite = node_sprite; //쉽게 찾을수 있도록 참조값 만들기

        }

        //this.toolSetup(node);

        return node;
    }


}
