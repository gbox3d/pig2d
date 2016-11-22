/**
 * Created by gbox3d on 2013. 11. 25..
 */



///////////////////////////////////////////////
//노드 - > 툴
function updateNodeInfo(node) {

    var info_em = document.querySelector('#main-control-panel .object-info');

    var model = node.get('model');

    info_em.querySelector('.id').value = node.cid;

    if(node.get('name')) {
        info_em.querySelector('.name').value = node.get('name');
    }
    else {
        info_em.querySelector('.name').value = '';

    }

    info_em.querySelector('.position').value = JSON.stringify(node.get('model').getPosition());
    info_em.querySelector('.angle').value = model.getRotation();
    info_em.querySelector('.scale').value = model.getScale();
    info_em.querySelector('.zindex').value = model.get('element').style.zIndex || '0';

    info_em.querySelector('.show').checked = node.isVisible();

    if(node.get('tag')) {
        info_em.querySelector('.tag').value = node.get('tag');
    }

    info_em.querySelector('.innerhtml').value = '';


    info_em.querySelector('.flipY').checked = false;
    info_em.querySelector('.flipX').checked = false;

    info_em.querySelector('.flipX').disabled = true;
    info_em.querySelector('.flipY').disabled = true;

    switch (node.type) {
        case 'custom_html':
            info_em.querySelector('.innerhtml').value = node.node_html.get('model').get('element').innerHTML;
            var cssobj = node.get('model').get('element').style;

            var obj = {};

            for(var i=0; i< cssobj.length;i++) {

                if(cssobj[i] != '-webkit-transform' &&
                    cssobj[i] != 'visibility')
                {
                    obj[cssobj[i]] = cssobj[cssobj[i]];
                }
            }
            info_em.querySelector('.cssobject').value = JSON.stringify(obj);
            break;
        case 'html':
            //custom html과는 다르게 하나더 들어가지 않는다.

            info_em.querySelector('.innerhtml').value = node.get('model').get('element').querySelector('.pig2d-inner-html').outerHTML;

            var cssobj = node.get('model').get('element').style;

            var obj = {};

            for(var i=0; i< cssobj.length;i++) {

                if(cssobj[i] != '-webkit-transform' &&
                    cssobj[i] != 'visibility')
                {
                    obj[cssobj[i]] = cssobj[cssobj[i]];
                }
            }

            info_em.querySelector('.cssobject').value = JSON.stringify(obj);

            break;
        case 'sprite_dummy':
            if(node.node_sprite) {
                var sprite_model = node.node_sprite.get('model');

                info_em.querySelector('.flipX').disabled = false;
                info_em.querySelector('.flipY').disabled = false;

                info_em.querySelector('.flipX').checked = sprite_model.get('flipX');
                info_em.querySelector('.flipY').checked = sprite_model.get('flipY');

                if(node.node_sprite.type == 'sprite') {
                    info_em.querySelector('.frame-range').value = JSON.stringify({
                        startFrame : sprite_model.get('startFrame'),
                        endFrame : sprite_model.get('endFrame')
                    });

                    //스프라이트 영역 크기
                    var sheet = sprite_model.get('sheet');

                    if(sheet) {
                        info_em.querySelector('.canvas-size').value = JSON.stringify({
                            width : sheet.width,
                            height: sheet.height
                        });
                    }

                    info_em.querySelector('.play-status').value = sprite_model.get('AnimationStatus');
                    info_em.querySelector('.animation-loop').checked = sprite_model.get('isAnimationLoop');

                }




            }
            break;

    }

}

//툴 -> 노드
function applyNodeInfo(node) {

    var info_em = document.querySelector('#main-control-panel .object-info');

    if(!node) {
        node = theApp.CurrentNode;
    }
    //var node = theApp.CurrentNode;

    var model = node.get('model');

    node.show(info_em.querySelector('.show').checked);
    node.set('name',info_em.querySelector('.name').value);

    //위치값
    var position = JSON.parse(info_em.querySelector('.position').value);
    node.get('model').setPosition(position.X,position.Y);
    var scale = JSON.parse(info_em.querySelector('.scale').value);
    node.get('model').setScale(scale.X,scale.Y);

    node.get('model').setRotation(info_em.querySelector('.angle').value);


    var tag = info_em.querySelector('.tag').value;
    if(tag) {
        node.set('tag',JSON.parse(tag));
    }


    //z 우선순위
    node.get('model').get('element').style.zIndex = info_em.querySelector('.zindex').value;

    switch (node.type) {
        case 'html':

            //console.log(info_em.querySelector('.cssobject').value);
            node.get('model').get('element').querySelector('.pig2d-inner-html').outerHTML = info_em.querySelector('.innerhtml').value;

            if(info_em.querySelector('.cssobject').value) {
                var cssObj =  JSON.parse(info_em.querySelector('.cssobject').value);

                for(var item in cssObj) {
                    node.get('model').get('element').style[item] = cssObj[item];
                }
            }

            break;

        case 'custom_html':

            node.html = node.node_html.get('model').get('element').innerHTML = info_em.querySelector('.innerhtml').value;
            if(info_em.querySelector('.cssobject').value) {
                var cssObj =  JSON.parse(info_em.querySelector('.cssobject').value);

                for(var item in cssObj) {
                    node.get('model').get('element').style[item] = cssObj[item];
                }
            }


            break;
        case 'sprite_dummy':

            var sprite_model = node.node_sprite.get('model');
            sprite_model.set('flipY',info_em.querySelector('.flipY').checked);
            sprite_model.set('flipX',info_em.querySelector('.flipX').checked);

            if(node.sprite_node == 'sprite') {
                var frame_range = JSON.parse(info_em.querySelector('.frame-range').value);
                sprite_model.set('startFrame',frame_range.startFrame);
                sprite_model.set('endFrame',frame_range.endFrame);

                sprite_model.set('AnimationStatus',info_em.querySelector('.play-status').value);
                sprite_model.setFrame(info_em.querySelector('.frame-index').value);
                sprite_model.set('isAnimationLoop',info_em.querySelector('.animation-loop').checked);
            }
            break;
        case 'dummy':
            break;

    }

}



//오브잭트 속성 적용 버튼 이밴트 처리
document.querySelector('#main-control-panel .object-info .btn-apply').addEventListener('click',function() {

    applyNodeInfo()


});

document.querySelector('#main-control-panel .object-info').addEventListener('change',function(evt) {

    applyNodeInfo();

});

