/**
 * Created by gbox3d on 2013. 11. 13..
 *
 * pig2d 엔진 파티클 시스템
 *
 */

Pig2d.Particle = {

    //프로잭타일 총
    ProjectileGun : function(param) {

        var bullets = [];
        var magazine_node = Pig2d.util.createDummy();

        for(var i=0;i<param.bullet_size;i++) {

            var projt = new Pig2d.Particle.Projectile({
                sprite_data: param.bullet.prefeb,
                startFrame : param.bullet.startFrame,
                endFrame : param.bullet.endFrame,
                parent : magazine_node
            });

            bullets.push(projt);
        }

        param.parent.add(magazine_node);

        this.magazine_node = magazine_node;

        //파티클 총알 발사
        this.Shot = function(shot_param) {

            //var bullets = magazine_node.attributes.chiledren;
            var bullets_length = bullets.length;
            for(var i=0; i < bullets_length ;i++) {

                var bullet = bullets[i];

                if( !bullet.isBusy() ) {

                    return bullets[i].shot(shot_param);
                }
            }

            console.log('not find sleep');
            return false;
        }
    },
    Projectile : function(param) {

        var parent = param.parent;

        var startFrame = param.startFrame ? param.startFrame : 0;
        var endFrame = param.endFrame;


        var node = Pig2d.util.createDummy();

        var node_sprite = Pig2d.util.createSprite(param.sprite_data);

        //인자들은 기본값은으로 세팅

        node_sprite.get('model').setupAnimation({
            startFrame : startFrame,
            endFrame : endFrame,
            isAnimationLoop : false,
            AnimationStatus : 'stop'

        });

        //삼성폰들을 위한 초기화
        //공백프레임으로 안보이는거나 마찬가지임...
        //node.show(false);
        node_sprite.get('model').set('AnimationStatus','stop');
        node_sprite.get('model').setFrame(-1);


        node_sprite.get('model').set('AnimationEndCallback',function() {

            //node.show(false);
            node_sprite.get('model').set('AnimationStatus','stop');
            node_sprite.get('model').setFrame(-1);

        });

        node.get('model').get('element').style.zIndex = 10;
        node.add(node_sprite);
        parent.add(node);

        //node.update(true,0); //바로 위치를 잡아주도록 한다

        this.rootNode = node;

        this.shot = function(param) {

            var x = param.X;
            var y = param.Y;
            var sprite_data = param.sprite_data;

            if(sprite_data) {

                //드래스체인지샷
                if(sprite_data.prefeb) {

                    node_sprite.get('model').setFrame(0);
                    node_sprite.get('model').changeDress(
                        sprite_data.prefeb
                    );

                    startFrame = sprite_data.startFrame ? sprite_data.startFrame : 0 ;
                    endFrame = sprite_data.endFrame ? sprite_data.endFrame : (node_sprite.get('model').get('data').frames.length-1);


                }
                else {
                    if(sprite_data.startFrame != undefined)
                        startFrame = sprite_data.startFrame;
                    if(sprite_data.endFrame != undefined)
                        endFrame = sprite_data.endFrame;

                }

                node_sprite.get('model').set('AnimationStatus','ready');

            }
            else { //드래스 체인지 없음
                startFrame = param.startFrame;
                endFrame = param.endFrame;

                node_sprite.get('model').set('AnimationStatus','play');
            }

            node_sprite.get('model').set('startFrame',startFrame);
            node_sprite.get('model').set('endFrame',endFrame);
            node_sprite.get('model').setFrame(startFrame);

            node.get('model').setPosition(x,y);
            node.show(true);

            return node;

        }

        this.isBusy = function() {

            if(node_sprite.get('model').get('AnimationStatus') == 'stop') {

                return false;

            }

            return true;

            //return node.isVisible();
        }




    },
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