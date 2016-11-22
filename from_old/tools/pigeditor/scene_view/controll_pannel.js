/**
 * Created by gbox3d on 2013. 11. 25..
 */



theApp.UIelements.sceneview_control_pannel = document.querySelector('#scene-view .control-pannel');

(function() {

    theApp.UIelements.sceneview_control_pannel.querySelector('.camera-zoomin span').innerText = theApp.UIelements.sceneview_control_pannel.querySelector('.camera-zoomin input').value;

    theApp.UIelements.sceneview_control_pannel.querySelector('.camera-zoomin input').addEventListener('change',function(evt) {
        //console.log(evt.target.value);

        theApp.UIelements.sceneview_control_pannel.querySelector('.camera-zoomin span').innerText = evt.target.value;

        theApp.CameraNode.get('model').setScale( evt.target.value/100.0,evt.target.value/100.0 )

    });


})();


