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

    //transition 이용한 컨트롤러
    MouseSpot : function (param) {

        var listener_element = param.listener_element;
        var node = param.node;
        var speed = param.speed ? param.speed : 100;

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


        function _callbackControl(posX,posY) {

            node.get('model').stopTransition();
            node.update(true,0);

            var element = node.get('model').get('element');
            var cur_position = node.get('model').getPosition();
            var vt = new gbox3d.core.Vect2d(posX,posY);
            vt.subToThis(cur_position);
            var dist = vt.getDistance();
            vt.normalize();

            var duration_time = dist/(this.getSpeed()); //1초에 speed 만큼 이동

            //if(duration_time > 0) {
            var dest_position = new gbox3d.core.Vect2d(posX,posY);

            if(param.startCallBack != undefined) {

                param.startCallBack({
                    dest : dest_position,
                    dist : dist,
                    duration_time : duration_time,
                    direction_vector : vt
                });

            }

            node.get('model').transition({
                position : dest_position,
                time : duration_time
            });

            //}


        }




        function _onDocumentMouseDown( event ) {

            event.preventDefault();

            callbackControl(event.clientX,event.clientY);
        }



        //터치 디바이스

        function _onDocumentTouchStart( event ) {

            event.preventDefault();

            var touch = event.touches[ 0 ];

            touchX = touch.screenX;
            touchY = touch.screenY;

            callbackControl(touchX,touchY);

        }

    }
}