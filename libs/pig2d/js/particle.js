/**
 * Created by gbox3d on 2013. 11. 13..
 *
 * pig2d 엔진 파티클 시스템
 *
 */

Pig2d.Particle = {

    OneShot : function (param) {

        var parent = param.parent;


        var node = Pig2d.util.createDummy();

        var node_sprite = Pig2d.util.createSprite(param.sprite_data);

        //인자들은 기본값은으로 세팅
        node_sprite.get('model').setupAnimation({
            isAnimationLoop : false
        });

        node_sprite.get('model').set('AnimationEndCallback',function() {

            parent.removeChild(node);

        });

        node.add(node_sprite);
        node.get('model').setPosition(param.X,param.Y);

        this.rootNode = node;

        parent.add(node);

        node.update(true,0); //바로 위치를 잡아주도록 한다

    }

};