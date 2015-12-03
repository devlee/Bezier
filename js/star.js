function Rectangle(w, h) {
	this.width = w;
	this.height = h;
}

function randomVariables(s) {
	s.count ++;
	var xflag = (Math.random() * s.count) > (s.count/90) ? 1 : -1;
	var yflag = (Math.random() * s.count) > (s.count/90) ? 1 : -1;
	s.x = s.x + xflag * .5 * s.xf;
	s.y = s.y + yflag * s.ys * s.yf;
	if (s.y > s.rect.height) {
		s.yf = -1;
		s.ys = Math.random() + .8;
		s.rys = s.ys;
		s.cl = Math.random() > .9;
	}
	if (s.y < 0) {
		s.yf = 1;
		s.ys = Math.random() + .8;
		s.rys = s.ys;
		s.cl = Math.random() > .9;
	}
	if (s.x > s.rect.width) {
		s.xf = -1;
		s.cl = Math.random() > .9;
	}
	if (s.x < 0) {
		s.xf = 1;
		s.cl = Math.random() > .9;
	}
	s.ys = s.rys + Math.random() * .2;
	return s;
}

function Star(rect, ctx, img) {
	//绘画次数
	this.count = 0;
	//区域对象
	this.rect = rect;
	//横向移动方向
	this.xf = Math.random() > .5 ? 1 : -1;
	//纵向移动方向
	this.yf = Math.random() > .5 ? 1 : -1;
	//纵向移动速度
	this.ys = Math.random() + .8;
	//x坐标
	this.x = Math.floor(Math.random() * rect.width);
	//y坐标
	this.y = Math.floor(Math.random() * rect.height);
	//原始值
	this.rys = this.ys;
	this.rx = this.x;
	this.ry = this.y;
	//亮度：暗
	this.l = false;
	//能否点亮
	this.cl = Math.random() > .9;

	this.drawImg = function () {
		//随机设置变量
		randomVariables(this);
		//透明度a
		var a = (Math.random() * 0.2 + 0.45) + (this.cl ? (this.l ? .3 : 0) : 0);
		ctx.globalAlpha = this.cl ? a : a*.5;
		this.l = a > .5;
		//大小r
		var r = (Math.random() * 0.5 + 0.95)*(!this.l ? 4 : 8);
		ctx.drawImage(img, this.x - r/2, this.y - r/2, r, r);
	}
}

window.onload = function () {
	var c = $('#starCanvas');
	var ctx = c[0].getContext('2d');
	
	var r = new Rectangle(142, 72);

	var stars = [];

	var addInterval;

	var img = new Image();
	img.src = "./img/star.png";

	function addStar () {
		stars.push(new Star(r, ctx, img));
		if (stars.length > 40) {
			clearInterval(addInterval);
		}
	}

	addInterval = setInterval(addStar, 10);

	function draw() {
		ctx.clearRect(0,0,142,72);
		for (var i = 0; i < stars.length; i ++) {
			stars[i].drawImg();
		}
		setTimeout(draw,50);
	}
	draw();
};