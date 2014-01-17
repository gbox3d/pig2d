/**
 * Created by gbox3d on 13. 10. 4..
 */


Pig2d.util.controller = {
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

    },
    //end of joystick

    //transition 이용한 컨트롤러
    MouseSpot : function (param) {

        var listener_element = param.listener_element;
        var node = param.node;
        var speed = param.speed ? param.speed : 100;
        var scroller = param.scroller;

        //console.log(speed);

        if(param.setupCallBack) {

            param.setupCallBack();

        }

        node.get('model').setupTransition({
            TransitionEndCallBack : param.endCallBack
        });

        var onDocumentMouseDown = _onDocumentMouseDown.bind(this);
        var onDocumentTouchStart = _onDocumentTouchStart.bind(this);
        var callbackControl = _callbackControl.bind(this);

        //이벤트처리
        listener_element.addEventListener( 'mousedown', onDocumentMouseDown, false );
        listener_element.addEventListener( 'touchstart', onDocumentTouchStart, false );

        this.setSpeed = function(_speed) {
            speed = _speed;
        }
        this.getSpeed = function() {
            return speed;
        }

        var basePos = new gbox3d.core.Vect2d(0,0);

        this.setBasePos = function(x,y) {
            basePos.set(x,y);
        }

        function _callbackControl(posX,posY) {

            //일단 트랜지션을 종료하고 이동중간 위치에 멈추도록함
            node.get('model').stopTransition();
            node.update(true,0); //정확한 위치를 잡아내기위해서 업데이트를 해줌

            if(scroller) {

                this.setBasePos(-scroller.getCurrentScrollPos().X,-scroller.getCurrentScrollPos().Y);

            }

            var new_pos = new gbox3d.core.Vect2d(posX +basePos.X  ,posY + basePos.Y);

            var element = node.get('model').get('element');
            var cur_position = node.get('model').getPosition();
            var vt = new_pos.clone();
            vt.subToThis(cur_position);
            var dist = vt.getDistance();
            vt.normalize();

            var duration_time = dist/(this.getSpeed()); //1초에 speed 만큼 이동
            var dest_position = new_pos.clone();

            if(param.startCallBack != undefined) {

                param.startCallBack({
                    dest : dest_position,
                    dist : dist,
                    duration_time : duration_time,
                    direction_vector : vt
                });
            }


            //여기서 트랜지션을 하고 다음턴에 업데이트 하면서 실제 트랜스폼이 적용됨
            //하지만 그전에 트랜지션이 끝나버리면 종료콜백이 호출하면서 로직이 꼬일수 있음
            node.get('model').transition({
                position : dest_position,
                time : duration_time
            });
            //그래서 바로 아래에서 강제로 트랜스폼을 업데이트 해줌 , 시간차에 의해서 값이 꼬이는 현상을 막아줌
            node.update(true,0);

        }




        function _onDocumentMouseDown( event ) {

            event.preventDefault();

            callbackControl(event.layerX,event.layerY);
        }



        //터치 디바이스

        function _onDocumentTouchStart( event ) {

            event.preventDefault();

            var touch = event.touches[ 0 ];

            touchX = touch.screenX;
            touchY = touch.screenY;

            callbackControl(touchX,touchY);

        }

    },
    //end of mouse spot controller

    //드래그 컨트롤러
    Drager : function (param) {


        var listener_element = param.listener_element || document.body;
        var node = param.node;
        var OnDragStart = param.OnDragStart;
        var OnDragEnd = param.OnDragEnd;
        var OnDragMove = param.OnDragMove;

        var camera_node = param.camera;

        //기존 이벤트가 있었는지 검사
        if(node.Dragger) {
            node.Dragger.clear();
        }

        node.Dragger = this;

        //이벤트처리
        listener_element.addEventListener( 'mousedown', onDocumentMouseDown, false );
        listener_element.addEventListener( 'touchstart', onDocumentTouchStart, false );
        listener_element.addEventListener( 'touchmove', onDocumentTouchMove, false );

        function callbackControl(movementX,movementY) {

            if(node) {

                if(camera_node) {

                    var scale = camera_node.get('model').getScale().X;

                    //console.log(scale);

                    movementX *= 1/scale;
                    movementY *= 1/scale;

                }

                node.get('model').translate(1,new gbox3d.core.Vect2d(movementX,movementY));
            }
        }


        //기존 이밴트 핸들러 모두 클리어
//        (function clearAllEventHandler (old_element) {
//            var new_element = old_element.cloneNode(true);
//            old_element.parentNode.replaceChild(new_element, old_element);
//
//        })(listener_element);


        function onDocumentMouseDown( event ) {

            event.preventDefault();

            //console.log(event.target);

            function findme() {


                var target = event.target;

                //타겟노드에 전달된 값을 참고 하여 노드를 확인한다.
                if(target.target_node) {
                    if(target.target_node == node) {
                        return true;
                    }
                }


                return false;


                /*
                var target = event.target;
                while(target) {

                    if(node.get('model').get('element') == target) {

                        return true;
                    }

                    target = target.parentElement;

                }
                return false;
                */
            }

            //해당 앨리먼트를 자식으로 가지고 있는 노드가 맞다면...
            if(findme()) {
                if(OnDragStart) {
                    OnDragStart({
                        node : node,
                        originalEvent : event
                    });
                }


                listener_element.addEventListener( 'mousemove', onDocumentMouseMove, false );
                listener_element.addEventListener( 'mouseup', onDocumentMouseUp, false );
            }

            //console.log(node.get('model').get('element'));

        }

        function onDocumentMouseMove( event ) {

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            callbackControl(movementX,-movementY);

            if(OnDragMove) {
                OnDragMove({
                    node : node,
                    originalEvent : event
                });
            }


        }

        function onDocumentMouseUp( event ) {

            listener_element.removeEventListener( 'mousemove', onDocumentMouseMove );
            listener_element.removeEventListener( 'mouseup', onDocumentMouseUp );

            if(OnDragEnd) {
                OnDragEnd({
                    node : node,
                    originalEvent : event
                });
            }
            event.stopPropagation(); //부모로 이밴트 전달 금지

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

        this.setControlNode = function(target_node) {
            node = target_node;
        }
        this.clear = function() {
            //이전 이밴트 리스너 클리어..
            listener_element.removeEventListener( 'mousedown', onDocumentMouseDown );
            listener_element.removeEventListener( 'touchstart', onDocumentTouchStart );
            listener_element.removeEventListener( 'touchmove', onDocumentTouchMove );
        }

    }// end of drag controller
}