/**
 * Created by gbox3d on 2013. 12. 1..
 */

var BattleLogic = {};

/*
test effect

0~2
3~7
8~12
13~15
16~21
22~25
26~29
 */


BattleLogic.processBattle = function (param) {

    var battle_data = param.battle_data;
    var root_obj = param.root_obj || BattleLogic.root_obj;

    var tick_count = 0;

    function processTickStep() {

        console.log('start tick count : ' + tick_count);

        var tick_data = battle_data[tick_count];

        var tick_action_count = 0; //타이머로 시작 시킨 액션카운트

        var action_length = tick_data.actions.length;
        var action_complete_count = 0; //액션이 완료된 카운트

        function processActionStep(_tick_action_count) {

            var action = tick_data.actions[_tick_action_count];

            var atk_unit = root_obj.findByName('mb' + (parseInt(action.atk_unit)));
            var def_unit = root_obj.findByName('mb' + (parseInt(action.tokens[0].def_unit)));
            var ret_pos = atk_unit.get('origin_pos');

            console.log('start action :' + _tick_action_count);

            //공격위치 구하기
            var target_pos = def_unit.get('model').getDecomposePosition();
            var old_target_pos = target_pos.clone();
            if( atk_unit.node_sprite.get('model').get('flipY') ) {

                target_pos.X += 100;

            }
            else {
                target_pos.X -= 100;

            }
            target_pos.Y += gbox3d.core.randomIntFromTo(-50,50);

            //공격위치로 이동 하기
            atk_unit.get('model').setupTransition({

                TransitionEndCallBack : function() { //공격위치에 도착했음

                    var node_sprite = atk_unit.node_sprite;

                    node_sprite.get('model').setupAnimation({
                        startFrame: 20,
                        endFrame : 39,
                        isAnimationLoop : false,
                        AnimationStatus : 'play',
                        AnimationEndCallback : function() {

                            //적이 그위치에 있는지 검사해서 없으면 다시 적을 추적함

                            var target_error_dist = (def_unit.get('model').getDecomposePosition())
                                .getDistanceTo(old_target_pos);

                            if(target_error_dist > 10) {

                                //console.log('target error in :' + _tick_action_count);
                                console.log('retrace target');
                                processActionStep(_tick_action_count);

                            }
                            else {

                                //스킬에 따른
                                //이펙트 터트리기

                                action.tokens.forEach(function(item,i) {

                                    var target_unit;
                                    var target_pos;

                                    if(item.skill1_no >= 0) {

                                        //console.log('skill item');
                                        //console.log(item);

                                        target_unit = root_obj.findByName('mb' + (parseInt(action.tokens[0].sk1_target)));
                                        target_pos = target_unit.get('model').getDecomposePosition();


                                        switch(item.skill1_no) {

                                            case 0:
                                            case 3:
                                                theApp.projectile_gun.Shot({
                                                    X : target_pos.X + gbox3d.core.randomIntFromTo(-20,20),
                                                    Y : target_pos.Y,
                                                    sprite_data : {
                                                        prefeb :theApp.getPrefeb('test_effect3')
                                                    }
                                                });
                                                break;
                                            default :
                                                theApp.projectile_gun.Shot({
                                                    X : target_pos.X + gbox3d.core.randomIntFromTo(-20,20),
                                                    Y : target_pos.Y + gbox3d.core.randomIntFromTo(-5,5),
                                                    sprite_data : {
                                                        prefeb :theApp.getPrefeb('doom_effect'),
                                                        startFrame:16,
                                                        endFrame: 21
                                                    }
                                                });

                                        }

                                    }
                                    else if(item.skill2_no >= 0) {

                                        target_unit = root_obj.findByName('mb' + (parseInt(action.tokens[0].sk2_target)));
                                        target_pos = target_unit.get('model').getDecomposePosition();

                                        theApp.projectile_gun.Shot({
                                            X : target_pos.X + gbox3d.core.randomIntFromTo(-20,20),
                                            Y : target_pos.Y + gbox3d.core.randomIntFromTo(-5,5),
                                            sprite_data : {

                                                prefeb :theApp.getPrefeb('test_effect3')
                                            }
                                        });

                                    }
                                    else {

                                        //target_unit = root_obj.findByName('mb' + (parseInt(action.tokens[0].sk2_target)));
                                        target_pos = old_target_pos;

                                        theApp.projectile_gun.Shot({
                                            X : target_pos.X + gbox3d.core.randomIntFromTo(-20,20),
                                            Y : target_pos.Y,
                                            sprite_data : {
                                                prefeb :theApp.getPrefeb('test_effect1')
                                            }
                                        });

//                                        //console.log(item);
//                                        theApp.projectile_gun.Shot({
//                                            X : old_target_pos.X + gbox3d.core.randomIntFromTo(-20,20),
//                                            Y : old_target_pos.Y + gbox3d.core.randomIntFromTo(-20,20),
//                                            sprite_data : {
//                                                prefeb :theApp.getPrefeb('doom_effect'),
//                                                startFrame:8,
//                                                endFrame: 12
//                                            }
//                                        });


                                    }
                                });



                                //공격이 끝났으면 원래 위치로 되돌아가기
                                node_sprite.get('model').setupAnimation({
                                    startFrame: 0,
                                    endFrame : 19,
                                    isAnimationLoop : true,
                                    AnimationStatus : 'play'
                                });


                                atk_unit.get('model').setupTransition({
                                    TransitionEndCallBack : function() { //되돌아 가기 종료하면...

                                        action_complete_count++;
                                        console.log('end action complete count :' + action_complete_count);

                                        //틱 상의 모든 액션이 종료 되면.... 다음틱으로 넘어간다.
                                        if(action_complete_count == action_length ) {

                                            console.log('end tick count : ' + tick_count);
                                            theApp.Smgr.updateAll(0);

                                            //다음틱 예약
                                            tick_count++;
                                            if(tick_count < battle_data.length ) {

                                                setTimeout(function() {
                                                    processTickStep();
                                                },100);

                                            }
                                        }
                                    }
                                });


                                //되돌아오기
                                atk_unit.get('model').transition({
                                    position : ret_pos,
                                    time : 0.3
                                });

                            }
                        } //end function
                    });
                }
            });

            //공격 위치로 이동
            atk_unit.get('model').transition({
                position : target_pos,
                time : 0.2
            });

        }

        function action_apply_loop() {

            processActionStep(tick_action_count);
            tick_action_count++;

            if(tick_action_count < tick_data.actions.length) {

                setTimeout(action_apply_loop,300);
            }
        }

        action_apply_loop();


    }

    processTickStep();

}

//배틀시스템을 위한 정보 세팅
BattleLogic.setup = function(param) {

    //전투씬루트
    var bt_root = param.root;//theApp.CameraNode.findByName('bt_root');

    //이펙트 루트
    var effect_root = Pig2d.util.createDummy();
    bt_root.add(effect_root);

    var effect_prefeb = theApp.getPrefeb('doom_effect');

    theApp.projectile_gun = new Pig2d.Particle.ProjectileGun({
        parent : effect_root,
        bullet : {
            prefeb : effect_prefeb
        },
        bullet_size: 10 //총알갯수
    });



    bt_root.get('chiledren').forEach(function(item,i) {

        //원래 자리 세팅
        item.set('origin_pos',item.get('model').getPosition().clone());

        //주스킬 효과
        /*
        var effect = Pig2d.util.createSprite(
            effect_prefeb
        );

        effect.show(false);
        effect_root.add(effect);

        item.set('main_skill',{
            effect : effect,
            start : 0,
            end : 2
        });

        //보조 스킬1 효과
        effect = Pig2d.util.createSprite(
            effect_prefeb
        );

        effect.show(false);
        effect_root.add(effect);

        item.set('sub_skill1',{
            effect : effect,
            start : 0,
            end : 2
        });

        //보조 스킬2 효과
        effect = Pig2d.util.createSprite(
            effect_prefeb
        );

        effect.show(false);
        effect_root.add(effect);

        item.set('sub_skill2',{
            effect : effect,
            start : 0,
            end : 2
        });
        */


    });

    BattleLogic.root_obj = bt_root;
}
