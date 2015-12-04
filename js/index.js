
var clear = function (ctx) {
	ctx.clearRect(0,0,800,800);
};

var Point = function (x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r || 2;
	this.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fillStyle = '#000';
		ctx.fill();
	};
};

var Line = function (p0, p1) {
	this.beginPoint = p0;
	this.endPoint = p1;
	this.linePoint = new Point(this.beginPoint.x, this.beginPoint.y);
	this.linePointX = this.linePoint.x;
	this.linePointY = this.linePoint.y;
	this.disX = this.endPoint.x - this.linePoint.x;
	this.disY = this.endPoint.y - this.linePoint.y;
	this.hasDrawLine = false;
	this.drawLine = function (ctx) {
		if (this.hasDrawLine) {
			return;
		}
		this.hasDrawLine = true;
		ctx.beginPath();
		ctx.lineCap="round";
		ctx.moveTo(this.beginPoint.x, this.beginPoint.y);
		ctx.lineTo(this.endPoint.x, this.endPoint.y);
		ctx.stroke();
	};
	this.drawPoint = function (ctx) {
		this.beginPoint.draw(ctx);
		this.endPoint.draw(ctx);
	};
	this.draw = function (ctx) {
		this.drawLine(ctx);
		this.drawPoint(ctx);
	};
	this.moveLinePoint = function (percent) {
		this.linePoint = new Point(this.linePointX + this.disX * percent, this.linePointY + this.disY * percent);
	};

};

var getLineList = function (pList) {
	var lList = [];
	for (var i = 0, len = pList.length; i < len - 1; i ++) {
		var l = new Line(pList[i], pList[i + 1]);
		lList.push(l);
	}
	return lList;
};

var bezierPoints = [];

var doDraw = function (pList, ctx, percent) {
	var lList = getLineList(pList);
	var nextPList = [];
	if (lList.length == 1) {
		lList[0].draw(ctx);
		lList[0].moveLinePoint(percent);
		lList[0].linePoint.draw(ctx);
		bezierPoints.push(lList[0].linePoint);
	}
	for (var i = 0, len = lList.length; i < len - 1; i ++) {
		var l0 = lList[i];
		var l1 = lList[i + 1];
		l0.draw(ctx);
		l0.moveLinePoint(percent);
		nextPList.push(l0.linePoint);
		if (i == len - 2) {
			l1.draw(ctx);
			l1.moveLinePoint(percent);
			nextPList.push(l1.linePoint);
		}
	}
	if (nextPList.length > 1) {
		doDraw(nextPList, ctx, percent);
	}
};

var doBezier = function (ctx) {
	for (var i = 0, len = bezierPoints.length; i < len; i ++) {
		bezierPoints[i].draw(ctx);
	}
};

var run = function (pList, ctx, percent) {
	clear(ctx);
	doBezier(ctx);
	doDraw(pList, ctx, percent);
};

var bezier = {
	bi: null,
	start: function (ctx, bctx, pList, bc) {
		var self = this;
		self.stop(ctx, bctx, bc);
		var time = 0;
		self.bi = setInterval(function () {
			if (time == 1000) {
				clearInterval(self.bi);
			};
			run(pList, bctx, time/1000);
			clear(ctx);
			ctx.drawImage(bc,0,0);
			time++;
		},10);
	},
	stop: function (ctx, bctx, bc) {
		var self = this;
		if (!!self.bi) {
			clearInterval(self.bi);
		}
		clear(bctx);
		setTimeout(function(){
			clear(ctx);
		},20);
		bezierPoints = [];
	}
};

var autoRun = function (ctx, bctx, pList, bc) {
	var a = location.href.split("#");
	if (a.length == 2) {
		var p = a[1];
		if (/\d{1,3},\d{1,3}/g.test(p)) {
			var pl = p.split(",");
			for (var i = 0, len = pl.length; i < len - 1; i ++) {
				var point = new Point(pl[i]*1, pl[i+1]*1);
				pList.push(point);
				i ++;
			}
			if (pList.length > 1) {
				bezier.start(ctx, bctx, pList, bc);
			}
		}
	}
};

var init = function () {
	var c = document.getElementById('bezierCanvas');
	var ctx = c.getContext('2d');
	var bc = document.getElementById('bufferCanvas');
	var bctx = bc.getContext('2d');
	
	var pList = [];
	$(c).on('click', function (e) {
		pList.push(new Point(e.offsetX, e.offsetY));
		pList[pList.length - 1].draw(ctx);
		if (pList.length > 1) {
			bezier.start(ctx, bctx, pList, bc);
		}
	});
	
	$('#restart').on('click', function () {
		bezier.stop(ctx, bctx, bc);
		pList = [];
	});

	//400,600,100,400,300,200,500,400,375,475,400,375,425,475,300,400,500,200,700,400,400,600
	autoRun(ctx, bctx, pList, bc);

};


window.onload = function () {
	init();
};