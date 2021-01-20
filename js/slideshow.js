(function(){
  
function slideShow(argumentObject, wrapper) {
  this.content = argumentObject.content || [];
  this.len = argumentObject.content.length;
  this.height = argumentObject.height || wrapper.height();
  this.width = argumentObject.width || wrapper.width();
  this.type = argumentObject.type || 'fade';
  this.autoSlide = argumentObject.autoSlide || 'auto';
  this.showBtn = argumentObject.showBtn = undefined ? 'always' : argumentObject.showBtn;
  this.changeTime = argumentObject.changeTime || 2000;
  this.showSpots = argumentObject.showSpots;
  this.wrapper = wrapper;
  this.currentIndex = 0;
  this.autoChangeTime = argumentObject.autoChangeTime || 3000;
  this.spotsPosition = argumentObject.spotsPosition || "left";
  //  判断当前动画是否完成
  this.lock = true;
  //   自动轮播计时器
  this.timer = null;
  this.isAuto = argumentObject.isAuto === undefined ? true : argumentObject.isAuto;
}

slideShow.prototype.createDom = function () {
  let slideWrapper = $('<div class="slideWrapper"></div>');
  let slideContent = $('<ul class = "slideContent"></ul>');
  let leftBtn = $('<div class="Btn leftBtn"> &nbsp< </div>');
  let rightBtn = $('<div class="Btn rightBtn"> &nbsp&nbsp> </div>');
  let spotsWrapper = $('<div class="spotsWrapper"></div>');
  for (let i = 0; i < this.len; i++) {
      $('<li></li>').html(this.content[i]).appendTo(slideContent);
      $('<span class = "spot"></span>').appendTo(spotsWrapper);
  }
  if (this.type === 'animate') {
      $('<li></li>').html($(this.content[0]).clone(true)).appendTo(slideContent);
  }
  $(slideWrapper).append(slideContent)
                 .append(leftBtn)
                 .append(rightBtn)
                 .append(spotsWrapper)
                 .appendTo(this.wrapper)
                 .addClass("my-swiper-" + this.type);
}

slideShow.prototype.initStyle = function () {
  let self = this;
  $(this.wrapper).find(".slideWrapper").css({
      width: this.width,
      height: this.height
  });
  if (this.type === "animate") {
      $(this.wrapper)
          .find(".slideWrapper .slideContent")
          .css({
              width: (this.len + 1) * this.width,
              left: '0',
          });
  } else {
      // 淡入淡出效果
      // 找到当前轮播图的内容 将其全部隐藏并将当前展示的区域显示出来
      $(this.wrapper)
          .find(".slideContent li")
          .hide()
          .eq(this.currentIndex)
          .show();
  };
  // 给小圆点添加默认选中
$(this.wrapper)
.find(".spotsWrapper .spot")
.eq(this.currentIndex)
.addClass("spot-active");
// 为不同状态的左右按钮添加样式
if (this.showBtn === "always") {
$(this.wrapper).find(".Btn").show();
} else if (this.showBtn === "hide") {
$(this.wrapper).find(".Btn").hide();
} else {
$(this.wrapper).find(".Btn").hide();
//   如果显示状态是hover  则移入的时候展示
$(this.wrapper).hover(
  function () {
    console.log(self.len)
    $(this).find(".Btn").fadeIn();
  },
  function () {
    $(this).find(".Btn").fadeOut();
  }
);
}
}

// 轮播图区域的行为绑定
slideShow.prototype.bindEvent = function () {
// 保存当前的实例对象
var self = this;
$(this.wrapper)
  .find(".leftBtn")
  .click(function () {
    // 如果当前动画没有完成  那么不进行下面的动画效果
    if (!self.lock) {
      return false;
    }
    self.lock = false;
    if (self.currentIndex === 0) {
      if (self.type === "animate") {
        $(self.wrapper)
          .find(".slideWrapper .slideContent")
          .css({
            left: -self.len * self.width,
          });
      }
      self.currentIndex = self.len - 1;
    } else {
      self.currentIndex--;
    }
    self.change();
  })
  .end()
  .find(".rightBtn")
  .click(function () {
    // 如果当前动画没有完成  那么不进行下面的动画效果
    if (!self.lock) {
      return false;
    }
    self.lock = false;
    // 淡入淡出效果的轮播 判断当前图片是不是最后一张图片如果是的话那么下一次轮播的图片索引值将为0
    if (self.type === "fade" && self.currentIndex == self.len - 1) {
      self.currentIndex = 1;
      // 从左到右的轮播， 判断当前图片是不是后面的第一张图片
      // 如果是的话 那么让当前的轮播图瞬间变化到前面的轮播图的位置 继续轮播
    } else if (self.type === "animate" && self.currentIndex == self.len) {
     
      $(self.wrapper).find(".slideWrapper .slideContent").css({
        left: 0,
      });
      // 接下来要轮播图片的索引值
      self.currentIndex = 0;
    } else {
      self.currentIndex++;
    }
    self.change();
  });

$(this.wrapper)
  .find(".spotsWrapper .spot")
  .mouseenter(function () {
    self.currentIndex = $(this).index();
    self.change();
  })
  // 回退到上一级this.wrap对象
  .end()
  // 当鼠标移入到轮播图区域的时候清除自动轮播
  .mouseenter(function () {
    clearInterval(self.timer);
  })
  // 鼠标移出轮播图区域的时候判断是否自动轮播
  .mouseleave(function () {
    if (self.isAuto) {
      self.autoChange();
    }
  });
};

// 小圆点是否显示
if (!this.showSpots) {
$(this.wrapper).find(".spot").hide();
}
// 切换效果功能
slideShow.prototype.change = function () {
  var self = this;
  // 淡入淡出效果动画
  if (this.type === "fade") {
    $(this.wrapper)
      .find(".slideContent  li")
      .fadeOut()
      .eq(this.currentIndex)
      .fadeIn(function () {
        // 当前动画已经完成
        self.lock = true;
      });
  } else {
    // 从左到右轮播效果动画
    $(this.wrapper)
      .find(".slideContent")
      .animate(
        {
          left: -this.currentIndex * this.width,
        },
        function () {
          // 当前动画已经完成
          self.lock = true;
        }
      );
  }
  //  小圆点的切换
  $(this.wrapper)
    .find(".spotsWrapper .spot")
    .removeClass("spot-active")
    .eq(this.currentIndex)
    .addClass("spot-active");
};

 // 自动轮播效果
slideShow.prototype.autoChange = function () {
  var self = this;
  this.timer = setInterval(function () {
    $(self.wrapper).find(".rightBtn").trigger("click");
  }, this.autoChangeTime);
};

$.fn.extend({
  slideshow: function (argumentObject) {
      var obj = new slideShow(argumentObject, this);
      obj.createDom();
      obj.initStyle();
      obj.change();
      obj.bindEvent();
      obj.autoChange();
  }
})
})()