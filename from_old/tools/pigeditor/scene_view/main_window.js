/**
 * Created by gbox3d on 2013. 11. 25..
 */



//씬 편집 화면이 클릭 되면
document.querySelector('#main-window').addEventListener('click',function(evt) {

    //console.log(evt.target);

    if(
        theApp.Smgr.getRootNode().get('model').get('element') == evt.target ||
        document.querySelector('#main-window .grid-sprite') == evt.target

        ) {

        var obj = theApp.addSprite({

            x : evt.layerX - theApp.CameraNode.get('model').getPosition().X,
            y : evt.layerY - theApp.CameraNode.get('model').getPosition().Y

        });

        if(obj) {
            updateNodeInfo(obj);

            //이전 노드 내용은 저장..
            applyNodeInfo(theApp.CurrentNode);

            //새로운 노드로 교체
            theApp.CurrentNode = obj;
        }

    }
    else {
    }
});


//지우기 버튼
document.querySelector('#selection_hud .btn-del').addEventListener('click',function() {

    theApp.Smgr.get('rootNode').removeChild(theApp.CurrentNode);

    //console.log($('#main-control-panel .object-list ul li[cid="' + theApp.CurrentNode.cid + '"]'));

    $('#main-control-panel .object-list ul li[cid="' + theApp.CurrentNode.cid + '"]').remove();

    theApp.CurrentNode = null;

});