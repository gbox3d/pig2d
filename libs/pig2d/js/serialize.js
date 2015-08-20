/**
 * Created by gbox3d on 2013. 11. 22..
 */



//씬노드 내보내기( serialize)
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

        if(node.html) {
            obj.html = node.html;
        }


        obj.tag =  node.attributes.tag;


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

 */
Pig2d.SceneManager.prototype.deserialize = function(param) {

    var asset_data = param.asset_data;
    //재귀 순회
    param.data.children.forEach(function(item,i) {
        traverse(item,param.parent);
    });

    function traverse(_node,parent) {

        //console.log(_node);

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

                    //var child_node = _node.children[0].children[0];

                    var node_sprite = Pig2d.util.createSprite(
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


                })();

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
                    traverse(item,node);
                });

                break;
        }

        return node;

    }


};
