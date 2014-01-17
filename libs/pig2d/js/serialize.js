/**
 * Created by gbox3d on 2013. 11. 22..
 */



//씬노드 내보내기( serialize), 파일로 저장하기
Pig2d.SceneManager.prototype.serialize = function ( target_node ) {

    //var strSerial = "";

    function _serialize(node) {

        //console.log(node);

        var obj = {}

        if(node.type) {
            obj.type = node.type;
        }

        var name = node.get('name');
        if(name) {
            obj.name = name;
        }
        if(node.prefeb) {
            obj.prefeb = node.prefeb.name;
        }

        switch (node.type) {
            case 'html':

                var cssobj = node.get('model').get('element').style;

                var result_obj = {};

                for(var i=0; i< cssobj.length;i++) {

                    if(cssobj[i] != '-webkit-transform' &&
                        cssobj[i] != 'visibility')
                    {
                        result_obj[cssobj[i]] = cssobj[cssobj[i]];
                    }
                }
                //css 저장
                obj.css = JSON.stringify(result_obj);
                //html 저장
                obj.html = node.get('model').get('element').querySelector(".pig2d-inner-html").outerHTML;

                break;

            case 'custom_html':
                if(node.html) {
                    obj.html = node.html;

                    var cssobj = node.get('model').get('element').style;

                    var result_obj = {};

                    for(var i=0; i< cssobj.length;i++) {

                        if(cssobj[i] != '-webkit-transform' &&
                            cssobj[i] != 'visibility')
                        {
                            result_obj[cssobj[i]] = cssobj[cssobj[i]];
                        }
                    }

                    obj.css = JSON.stringify(result_obj);
                }
                break;

            default :
                break;

        }


        //태그저장
        obj.tag =  node.attributes.tag;

        //보이기 여부 저장
        obj.show = node.isVisible();

        obj.model = {
            translation : node.attributes.model.attributes.translation,
            rotation : node.attributes.model.attributes.rotation,
            scale : node.attributes.model.attributes.scale,
            flipX : node.attributes.model.attributes.flipX,
            flipY : node.attributes.model.attributes.flipY
        };

        obj.children = [];

        for(var index = 0;index < node.attributes.chiledren.length;index++ ) {

            var child = node.attributes.chiledren[index];

            obj.children.push(_serialize(child));
        }

        return obj;
    }

    console.log('start serialize');

    return _serialize(target_node);
    //return strSerial;
};

/*

 asset_data : 어셋데이터
 parent : 씬들이 붙을 부모 노드
 data : 시리얼라이즈 데이터

파일에서 읽어 들이기
 */
Pig2d.SceneManager.prototype.deserialize = function(param) {

    var asset_data = param.asset_data;

    //실제로 씬노드에 추가될 노드를 탐색하기
    var root  = param.data.children[0];// 카메라 노드 바로밑 노드

    if(param.root_name) {

        (function findRoot(node) {

            node.children.forEach(function(item,i) {
                if(item.name == param.root_name)
                {
                    root = item;
                }
                else {
                    findRoot(item);
                }

            });
        })(param.data);

    }


    //재귀 순회
    return traverse(root,param.parent);
    /*
    root.children.forEach(function(item,i) {

    });
    */

//    return param.parent;

    function traverse(_node,parent) {

        var node;

        switch (_node.type)
        {
            case 'sprite_dummy':
                (function() {
                    node = Pig2d.util.createDummy();
                    node.type = _node.type;

                    if(_node.name) {
                        node.set('name',_node.name);
                    }

                    node.set('tag',_node.tag);
                    node.get('model')
                        .setPosition(_node.model.translation.X,_node.model.translation.Y)
                        .setRotation(_node.model.rotation)
                        .setScale(_node.model.scale.X,_node.model.scale.Y);

                    parent.add(node);

                    //컨트롤 더미 만들기
                    //css 이펙트를 적용 시키기위한 더미 노드 ,
                    var node_control = Pig2d.util.createDummy();
                    node_control.type = 'control_dummy';
                    node.add(node_control);
                    node.node_control = node_control; //쉽게 찾을수 있도록 참조값 만들기

                    var sprite_tmpl = _node.children[0].children[0];

                    var prefeb = {};
                    prefeb.name = sprite_tmpl.prefeb;
                    prefeb.data = {};
                    prefeb.data.texture =  asset_data.resData.textures[asset_data.img_files[asset_data.objects[sprite_tmpl.prefeb].texture]];
                    prefeb.data.animation =  asset_data.resData.animations[asset_data.animation_files[asset_data.objects[sprite_tmpl.prefeb].animation]];

                    var node_sprite;

                    if(prefeb.data.animation == undefined) { //프레임 없는 단순이미지
                        var node_sprite = Pig2d.util.createSlicedImage({
                            imgObj: prefeb.data.texture
                        });
                        node_sprite.type = 'image';
                        node_sprite.prefeb = prefeb;
                    }
                    else { //프레임을 가지는 스프라이트
                        node_sprite = Pig2d.util.createSprite(
                            prefeb.data
                        );
                        node_sprite.type = 'sprite';
                        node_sprite.prefeb = prefeb;
                        node_sprite.get('model')
                            .set('flipY',sprite_tmpl.model.flipY)
                            .set('flipX',sprite_tmpl.model.flipX);
                        //인자들은 기본값은으로 세팅
                        node_sprite.get('model').setupAnimation({
                            isAnimationLoop: false,
                            AnimationStatus : 'stop'
                        });

                    }



                    node_control.add(node_sprite);
                    node.node_sprite = node_sprite;

                })();
                break;
            case 'custom_html':
                (function() {
                    node = Pig2d.util.createDummy();
                    node.type = _node.type;
                    node.set('tag',_node.tag);

                    if(_node.name) {
                        node.set('name',_node.name);
                    }

                    node.get('model')
                        .setPosition(_node.model.translation.X,_node.model.translation.Y)
                        .setRotation(_node.model.rotation)
                        .setScale(_node.model.scale.X,_node.model.scale.Y);
                    parent.add(node);

                    var node_html = Pig2d.util.createDummy();

                    node.add(node_html);
                    node.node_html = node_html;

                    node.html = node_html.get('model').get('element').innerHTML = _node.html;

                    if(_node.css) {
                        var cssObj =  JSON.parse(_node.css);

                        for(var item in cssObj) {
                            node.get('model').get('element').style[item] = cssObj[item];
                        }
                    }

                })();
                break;
            case 'html':
                (function() {
                    node = Pig2d.util.createDummy();
                    node.type = _node.type;
                    node.set('tag',_node.tag);

                    if(_node.name) {
                        node.set('name',_node.name);
                    }

                    node.get('model')
                        .setPosition(_node.model.translation.X,_node.model.translation.Y)
                        .setRotation(_node.model.rotation)
                        .setScale(_node.model.scale.X,_node.model.scale.Y);

                    parent.add(node);

                    node.get('model').get('element').innerHTML = _node.html;

                    var cssObj =  JSON.parse(_node.css);

                    for(var item in cssObj) {
                        node.get('model').get('element').style[item] = cssObj[item];
                    }

                })();

                //다음 자식노드 읽기
                _node.children.forEach(function(item,i) {
                    return traverse(item,node);
                });

                break;
            //디폴트로 더미 노드 생성한다..
            case 'dummy':
            default :
                (function() {
                    node = Pig2d.util.createDummy();
                    node.type = _node.type;
                    node.set('tag',_node.tag);

                    if(_node.name) {
                        node.set('name',_node.name);
                    }

                    node.get('model')
                        .setPosition(_node.model.translation.X,_node.model.translation.Y)
                        .setRotation(_node.model.rotation)
                        .setScale(_node.model.scale.X,_node.model.scale.Y);
                    parent.add(node);

                })();

                _node.children.forEach(function(item,i) {
                    return traverse(item,node);
                });

                break;
        }

        //공통처리
        if(_node.show !== undefined) {
            node.show(_node.show);
        }

        return node;

    }

};
