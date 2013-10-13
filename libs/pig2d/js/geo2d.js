/**
 * Created by gbox3d on 13. 10. 12..
 */


gbox3d.geo = {}


gbox3d.geo.Intersection = function (status) {
    if ( arguments.length > 0 ) {
        this.init(status);
    }
}


/*****
 *
 *   init
 *
 *****/
gbox3d.geo.Intersection.prototype.init = function(status) {
    this.status = status;
    this.points = new Array();
};


/*****
 *
 *   appendPoint
 *
 *****/
gbox3d.geo.Intersection.prototype.appendPoint = function(point) {
    this.points.push(point);
};


/*****
 *
 *   appendPoints
 *
 *****/
gbox3d.geo.Intersection.prototype.appendPoints = function(points) {
    this.points = this.points.concat(points);
};


//정적함수 정의

/*****
 *
 *   intersectLineLine
 *
 *****/

gbox3d.geo.Intersection.intersectLineLine = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.X - b1.X) * (a1.Y - b1.Y) - (b2.Y - b1.Y) * (a1.X - b1.X);
    var ub_t = (a2.X - a1.X) * (a1.Y - b1.Y) - (a2.Y - a1.Y) * (a1.X - b1.X);
    var u_b  = (b2.Y - b1.Y) * (a2.X - a1.X) - (b2.X - b1.X) * (a2.Y - a1.Y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = new gbox3d.geo.Intersection("Intersection");
            result.points.push(
                new gbox3d.core.Vect2d(
                    a1.X + ua * (a2.X - a1.X),
                    a1.Y + ua * (a2.Y - a1.Y)
                )
            );
        } else {
            result = new gbox3d.geo.Intersection("No Intersection");
        }
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = new gbox3d.geo.Intersection("Coincident");
        } else {
            result = new gbox3d.geo.Intersection("Parallel");
        }
    }

    return result;
};

/*****
 *
 *   intersectLinePolygon
 *
 *****/
gbox3d.geo.Intersection.intersectLinePolygon = function(a1, a2, points) {
    var result = new gbox3d.geo.Intersection("No Intersection");
    var length = points.length;

    for ( var i = 0; i < length; i++ ) {
        var b1 = points[i];
        var b2 = points[(i+1) % length];
        var inter = Intersection.intersectLineLine(a1, a2, b1, b2);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 ) result.status = "Intersection";

    return result;
};


/*****
 *
 *   intersectLineRectangle
 *
 *****/
gbox3d.geo.Intersection.intersectLineRectangle = function(a1, a2, r1, r2) {
    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new gbox3d.core.Vect2d( max.x, min.y );
    var bottomLeft = new gbox3d.core.Vect2d( min.x, max.y );

    var inter1 = Intersection.intersectLineLine(min, topRight, a1, a2);
    var inter2 = Intersection.intersectLineLine(topRight, max, a1, a2);
    var inter3 = Intersection.intersectLineLine(max, bottomLeft, a1, a2);
    var inter4 = Intersection.intersectLineLine(bottomLeft, min, a1, a2);

    var result = new gbox3d.geo.Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};
/*****
 *
 *   intersectPolygonPolygon
 *
 *****/
gbox3d.geo.Intersection.intersectPolygonPolygon = function(points1, points2) {
    var result = new gbox3d.geo.Intersection("No Intersection");
    var length = points1.length;

    for ( var i = 0; i < length; i++ ) {
        var a1 = points1[i];
        var a2 = points1[(i+1) % length];
        var inter = Intersection.intersectLinePolygon(a1, a2, points2);

        result.appendPoints(inter.points);
    }

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;

};


/*****
 *
 *   intersectPolygonRectangle
 *
 *****/
gbox3d.geo.Intersection.intersectPolygonRectangle = function(points, r1, r2) {
    var min        = r1.min(r2);
    var max        = r1.max(r2);
    var topRight   = new gbox3d.core.Vect2d( max.x, min.y );
    var bottomLeft = new gbox3d.core.Vect2d( min.x, max.y );

    var inter1 = Intersection.intersectLinePolygon(min, topRight, points);
    var inter2 = Intersection.intersectLinePolygon(topRight, max, points);
    var inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points);
    var inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points);

    var result = new gbox3d.geo.Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};


/*****
 *
 *   intersectRayRay
 *
 *****/
gbox3d.geo.Intersection.intersectRayRay = function(a1, a2, b1, b2) {
    var result;

    var ua_t = (b2.X - b1.X) * (a1.Y - b1.Y) - (b2.Y - b1.Y) * (a1.X - b1.X);
    var ub_t = (a2.X - a1.X) * (a1.Y - b1.Y) - (a2.Y - a1.Y) * (a1.X - b1.X);
    var u_b  = (b2.Y - b1.Y) * (a2.X - a1.X) - (b2.X - b1.X) * (a2.Y - a1.Y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;

        result = new gbox3d.geo.Intersection("Intersection");
        result.points.push(
            new gbox3d.core.Vect2d(
                a1.X + ua * (a2.X - a1.X),
                a1.Y + ua * (a2.Y - a1.Y)
            )
        );
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = new gbox3d.geo.Intersection("Coincident");
        } else {
            result = new gbox3d.geo.Intersection("Parallel");
        }
    }

    return result;
};


/*****
 *
 *   intersectRectangleRectangle
 *
 *****/
gbox3d.geo.Intersection.intersectRectangleRectangle = function(a1, a2, b1, b2) {
    var min        = a1.min(a2);
    var max        = a1.max(a2);
    var topRight   = new gbox.core.Vect2d( max.x, min.y );
    var bottomLeft = new gbox.core.Vect2d( min.x, max.y );

    var inter1 = Intersection.intersectLineRectangle(min, topRight, b1, b2);
    var inter2 = Intersection.intersectLineRectangle(topRight, max, b1, b2);
    var inter3 = Intersection.intersectLineRectangle(max, bottomLeft, b1, b2);
    var inter4 = Intersection.intersectLineRectangle(bottomLeft, min, b1, b2);

    var result = new Intersection("No Intersection");

    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);

    if ( result.points.length > 0 )
        result.status = "Intersection";

    return result;
};



