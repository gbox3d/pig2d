/**
 * Created by gbox3d on 2014. 6. 15..
 */

Pig2d.SampleHelper = {

    addScreenGrid : function(smgr) {

        var xmlns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(xmlns,'svg');

        svg.classList.add('helper-grid');

        var window_size = smgr.get('window_size');

        var line = document.createElementNS(xmlns,'line');
        line.setAttribute('x1',0);
        line.setAttribute('y1',window_size.height/2);
        line.setAttribute('x2',window_size.width);
        line.setAttribute('y2',window_size.height/2);
        line.setAttribute('stroke','#000000');

        svg.appendChild(line);

        line = document.createElementNS(xmlns,'line');
        line.setAttribute('x1',window_size.width/2);
        line.setAttribute('y1',0);
        line.setAttribute('x2',window_size.width/2);
        line.setAttribute('y2',window_size.height);
        line.setAttribute('stroke','#000000');
        svg.appendChild(line);

        smgr.get('container').appendChild(svg);

    }

};