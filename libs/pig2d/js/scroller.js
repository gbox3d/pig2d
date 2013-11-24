/**
 * Created by gbox3d on 2013. 11. 12..
 */


Pig2d.util.scroller = {

    type_finalfight : function(param) {

        var scroll_center = param.scroll_center;
        var speed = param.speed;
        var backlayer_rate = param.backlayer_rate;

        var scroll_root = Pig2d.util.createDummy();

        var front_node = Pig2d.util.createSlicedImage({
            imgObj: param.front_layer
        });

        var back_node = Pig2d.util.createSlicedImage({
            imgObj: param.back_layer
        });

        scroll_root.add(back_node);
        scroll_root.add(front_node);

        //트랜지션 세팅
        scroll_root.get('model').setupTransition({
            TransitionEndCallBack : function() {
            }
        });

        back_node.get('model').setupTransition({
            TransitionEndCallBack : (function() {
            })
        });

        this.setScrollPosDirect = function(posx) {
            scroll_root.get('model').setPosition(posx,0);

            back_node.get('model').setPosition(-posx * backlayer_rate,0);
            //scroll_root.update(true,0);
        }

        this.setScrollPos = function(posx) {
            //먼저 트랜지션을 취소한다.
            scroll_root.get('model').stopTransition();
            back_node.get('model').stopTransition();
            scroll_root.update(true,0); //상위노드하나만 업데이트 하면 된다.

            var targetX = scroll_center - (posx - scroll_root.get('model').getPosition().X);

            var dist = Math.abs(scroll_root.get('model').getPosition().X - targetX);
            var duration = (dist / speed); //초당 speed 만큼 간다.


            scroll_root.get('model').transition({
                position : new gbox3d.core.Vect2d(targetX,0),
                time : duration
            });

            back_node.get('model').transition({
                position : new gbox3d.core.Vect2d(-targetX * backlayer_rate,0),
                time : duration
            });

            return this;

        }

        //마우스로 찍은 위치가 스크롤 화면 중앙으로 오도록 하려면 스크롤 포인트가 몇인지 계산해준다.
        this.setAbsoluteScrollPos = function(posx) {
            //먼저 트랜지션을 취소한다.
            scroll_root.get('model').stopTransition();
            back_node.get('model').stopTransition();
            scroll_root.update(true,0); //상위노드하나만 업데이트 하면 된다.

            var targetX = posx;

            var dist = Math.abs(scroll_root.get('model').getPosition().X - targetX);
            var duration = (dist / speed); //초당 speed 만큼 간다.


            scroll_root.get('model').transition({
                position : new gbox3d.core.Vect2d(targetX,0),
                time : duration
            });

            back_node.get('model').transition({
                position : new gbox3d.core.Vect2d(-targetX * backlayer_rate,0),
                time : duration
            });

            return this;

        }


        this.getRoot = function() {
            return scroll_root;
        }

        this.getCurrentScrollPos = function() {

            return scroll_root.get('model').getDecomposePosition();

        }


    }

}
///////////////////////////////////////////////////////////////
//파이널파이트식 스크롤러



