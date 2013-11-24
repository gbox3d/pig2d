/**
 * Created by gbox3d on 2013. 11. 22..
 */



//씬노드 내보내기( serialize)
Pig2d.SceneManager.prototype.serialize = function ( target_node ) {

    //var strSerial = "";

    function _serialize(node) {

        var obj = {}

        if(node.type) {
            obj.type = node.type;
        }

        if(node.name) {
            obj.name = node.name;
        }
        if(node.prefeb) {
            obj.prefeb = node.prefeb.name;
        }


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

        console.log(_node);

        switch (_node.type)
        {
            case 'sprite_dummy':
                (function() {
                    var node = Pig2d.util.createDummy();
                    node.type = _node.type;
                    node.get('model')
                        .setPosition(_node.model.translation.X,_node.model.translation.Y)
                        .setRotation(_node.model.rotation)
                        .setScale(_node.model.scale.X,_node.model.scale.Y);
                    parent.add(node);

                    var sprite_tmpl = _node.children[0];

                    var prefeb = {};
                    prefeb.texture =  asset_data.resData.textures[asset_data.img_files[asset_data.objects[sprite_tmpl.prefeb].texture]];
                    prefeb.animation =  asset_data.resData.animations[asset_data.animation_files[asset_data.objects[sprite_tmpl.prefeb].animation]];

                    var node_sprite = Pig2d.util.createSprite(
                        prefeb
                    );
                    node_sprite.type = 'sprite';
                    node_sprite.prefeb = prefeb;
                    node.add(node_sprite);

                    //인자들은 기본값은으로 세팅
                    node_sprite.get('model').setupAnimation({
                        isAnimationLoop: false,
                        AnimationStatus : 'stop'
                    });

                    node.node_sprite = node_sprite;

                    /*
                     node.Dragger = new Pig2d.util.controller.Drager({

                     listener_element: document.querySelector('#main-window'),
                     node : node,
                     OnDragStart : function(evt) {

                     //console.log(evt.node);
                     theApp.updateCurrentNode(evt.node);

                     },
                     OnDragMove : function(evt) {

                     document.querySelector('#main-control-panel .object-info .position').value =
                     JSON.stringify(node.get('model').getPosition());
                     }
                     });
                     */


                })();
                break;

            default :
                _node.children.forEach(function(item,i) {
                    traverse(item,node);
                });
                break;
        }


    }


};
