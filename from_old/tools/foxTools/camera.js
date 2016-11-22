/**
 * Created by gbox3d on 2013. 11. 13..
 */



camera = function (param) {

    var listener_element = param.listener_element || document.body;
    var target_element = param.target_element;

    this.active = false;

    function callbackControl(movementX,movementY) {

        //console.log(this.active);

        //이동이 활성화 되었으면 이동시킨다.
        if(this.active) {
            var mat = new gbox3d.core.matrix2d();

            mat.setupFromElement(target_element);

            mat.translate(movementX,-movementY);

            target_element.style.webkitTransform = mat.toString();

        }

    }

    var _onDocumentMouseMove = onDocumentMouseMove.bind(this)


//이벤트처리
    listener_element.addEventListener( 'mousedown', onDocumentMouseDown, false );


    function onDocumentMouseDown( event ) {

        event.preventDefault();

        listener_element.addEventListener( 'mousemove',_onDocumentMouseMove , false );
        listener_element.addEventListener( 'mouseup', onDocumentMouseUp, false );

    }

    function onDocumentMouseMove( event ) {

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        (callbackControl.bind(this))(movementX,-movementY);

    }

    function onDocumentMouseUp( event ) {

        listener_element.removeEventListener( 'mousemove', _onDocumentMouseMove );
        listener_element.removeEventListener( 'mouseup', onDocumentMouseUp );

    }

}

