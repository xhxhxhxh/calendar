window.onload = function () {
    let swipe = document.querySelector('.cal-swipe');
    let swipeBox = document.querySelector('.cal-window');
    let mainContent = document.querySelector('#cal-main');
    let calContent = document.querySelector('#cal-content');
    let calWindowUp = document.querySelector('.cal-window-up');
    let calWindowDown = document.querySelector('.cal-window-down');
    let arrow = document.querySelector('.arrow');
    let startX = 0;
    let startY = 0;
    let distance = 0;
    let distanceY = 0;
    let ismove = false;
    let isTransition = false;
    //计算最大滑动距离
    let rows = Math.floor(window.index / 7);
    window.index % 7 > 0 ? rows += 1: rows;
    //滑动方向，左右为true，上下为false
    let direction = true;
    window.left = 0;
    window.right = 0;

    swipe.addEventListener('touchmove',function (e) {
        e.preventDefault();
    });

//获取单页日历宽度、高度
    let singleSwipe = swipe.offsetWidth / 3;
    let swipeHeight = swipe.offsetHeight;
    let mainContentHeight = mainContent.offsetHeight;
    let changedMainHeight = mainContent.offsetHeight;
    let calTranslate = document.defaultView.getComputedStyle(swipeBox,null)['transform'].substr(7).split(',')[5].split(')')[0];

    //获取初始透明度
    let firstOpacity = document.defaultView.getComputedStyle(calWindowUp,null)['opacity'];
    let currentOpacity = document.defaultView.getComputedStyle(calWindowUp,null)['opacity'];

    //添加过渡效果
    var addTranstion = function (dom) {
        dom.style.transition = 'all .4s';
        dom.style.webkitTransition = 'all .4s';
    };
//移除过渡
    var removeTranstion = function (dom) {
        dom.style.transition = 'none';
        dom.style.webkitTransition = 'none';
    };
//设置位移距离
    var setTranslateX = function (translateX) {
        swipe.style.transform = 'translateX('+translateX+'px)';
        swipe.style.webkitTransform = 'translateX('+translateX+'px)';
    };

    var setTranslateY = function (translateY) {
        swipeBox.style.transform = 'translateY('+translateY+'px)';
        swipeBox.style.webkitTransform = 'translateY('+translateY+'px)';
    };
    var setMainContentHeight = function (height) {
        mainContent.style.height = height + 'px';
    };
//设置透明度
    var setOpacity = function (dom,opacity) {
        dom.style.opacity = opacity;
    };

    //左右滑动触摸事件
    swipeBox.addEventListener('touchstart',function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

    });
    swipeBox.addEventListener('touchmove',function (e) {
        let endX = e.touches[0].clientX;
        let endY = e.touches[0].clientY;
        distance = endX - startX;
        distanceY = endY - startY;
        // console.log(distance);
        if (!ismove)  {
            Math.abs(distance) >= Math.abs(distanceY) ? direction = true: direction = false;
        }
        ismove = true;
        removeTranstion(swipe);
        if (direction) {
            setTranslateX(-singleSwipe + distance);
        }
    });
    swipeBox.addEventListener('touchend',function (e) {
        if (ismove && direction) {
            //左右滑动
            if (Math.abs(distance) < singleSwipe/3) {
                addTranstion(swipe);
                setTranslateX(-singleSwipe);
            } else {
                if (distance >= 0) {
                    setTranslateX(0);
                    window.right --;
                } else {
                    setTranslateX(-2 * singleSwipe);
                    window.left ++;
                }
                addTranstion(swipe);
            }
            startX = 0;
            startY = 0;
            distance = 0;
            distanceY = 0;
            ismove = false;
        }

    });

    //上下滑动触摸事件
    calContent.addEventListener('touchstart',function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        //计算最大滑动距离
        rows = Math.floor(window.index / 7);
        window.index % 7 > 0 ? rows += 1: rows;
        currentOpacity = document.defaultView.getComputedStyle(calWindowUp,null)['opacity'];
    });
    calContent.addEventListener('touchmove',function (e) {
        let endX = e.touches[0].clientX;
        let endY = e.touches[0].clientY;
        distance = endX - startX;
        distanceY = endY - startY;
        // console.log(distance);
        if (!ismove)  {
            Math.abs(distance) >= Math.abs(distanceY) ? direction = true: direction = false;
        }
        ismove = true;

        if (!direction) {
            //月和星期模式切换
            if (changedMainHeight >= (mainContentHeight - swipeHeight * 5 / 6) && !vm.pattern) {
                vm.pattern = true;
                setTranslateY( -swipeHeight * (rows -1) / 6);
                calTranslate = document.defaultView.getComputedStyle(swipeBox,null)['transform'].substr(7).split(',')[5].split(')')[0];
            }
            removeTranstion(swipeBox);
            removeTranstion(mainContent);
            removeTranstion(calWindowUp);
            removeTranstion(calWindowDown);
            let scrollOn = swipeHeight * (rows -1) / 6;
            let changedMainHeightTo = mainContent.offsetHeight;
            calWindowUp.style.display = 'block';
            calWindowDown.style.display = 'block';
            //透明度改变
            if (changedMainHeightTo >= mainContentHeight) {
                setOpacity(calWindowUp,0);
                setOpacity(calWindowDown,0);
                calWindowUp.style.display = 'none';
                calWindowDown.style.display = 'none';
            }
            if (changedMainHeightTo <= (mainContentHeight - swipeHeight * 5 / 6)) {
                setOpacity(calWindowUp,1);
                setOpacity(calWindowDown,1);
                calWindowUp.style.display = 'none';
                calWindowDown.style.display = 'none';
            }
            if (distanceY <= 0) {
                setOpacity(calWindowUp,-distanceY / swipeHeight * 5 / 6);
                setOpacity(calWindowDown,-distanceY / swipeHeight * 5 / 6);
            } else {
                setOpacity(calWindowUp,currentOpacity - distanceY / swipeHeight * 5 / 6);
                setOpacity(calWindowDown,currentOpacity - distanceY / swipeHeight * 5 / 6);
            }

            //main高度改变
            let currentMainHeight = changedMainHeight + distanceY;
            currentMainHeight > mainContentHeight ? currentMainHeight = mainContentHeight: currentMainHeight;
            currentMainHeight < (mainContentHeight - swipeHeight * 5 / 6) ? currentMainHeight = mainContentHeight - swipeHeight * 5 / 6: currentMainHeight;
            setMainContentHeight(currentMainHeight);

            //日历位移
            let calTranslateY = parseInt(calTranslate) + distanceY * (rows -1) / 5;
            calTranslateY < -scrollOn ? calTranslateY = -scrollOn: calTranslateY;
            calTranslateY > 0 ? calTranslateY = 0: calTranslateY;
            setTranslateY(calTranslateY);
        }
    });
    calContent.addEventListener('touchend',function (e) {
        if (ismove && !direction) {
            addTranstion(swipeBox);
            addTranstion(mainContent);
            addTranstion(calWindowUp);
            addTranstion(calWindowDown);
            //上下滑动
            if (Math.abs(distanceY) < mainContentHeight/3) {
                setMainContentHeight(changedMainHeight);
                setTranslateY(parseInt(calTranslate));
                setOpacity(calWindowUp,firstOpacity);
                setOpacity(calWindowDown,firstOpacity);
            } else {
                if (distanceY >= 0) {
                    setMainContentHeight(mainContentHeight);
                    setTranslateY(0);
                    changedMainHeight = mainContentHeight;
                    calTranslate = 0;
                    setOpacity(calWindowUp,0);
                    setOpacity(calWindowDown,0);
                    firstOpacity = 0;
                } else {
                    setMainContentHeight(mainContentHeight - swipeHeight * 5 / 6);
                    setTranslateY(-swipeHeight * (rows -1) / 6);
                    changedMainHeight = mainContentHeight - swipeHeight * 5 / 6;
                    calTranslate = -swipeHeight * (rows -1) / 6;
                    setOpacity(calWindowUp,1);
                    setOpacity(calWindowDown,1);
                    firstOpacity = 1;
                }
            }
            if (Math.abs(distanceY) >= swipeHeight * 5 / 6) {
                calWindowUp.style.display = 'none';
                calWindowDown.style.display = 'none';
                changedMainHeight = mainContent.offsetHeight;
                if (changedMainHeight >= mainContentHeight) {
                    //上拉
                    arrow.style.transform = 'translateX(-50%) rotateZ(180deg)';
                    vm.weekPattern = false;

                } else if (changedMainHeight <= (mainContentHeight - swipeHeight * 5 / 6)) {
                    //下滑
                    arrow.style.transform = 'translateX(-50%) rotateZ(0)';
                    setTranslateY(0);
                    removeTranstion(swipeBox);
                    vm.weekPattern = true;
                    vm.pattern = false;
                }
            }
            startX = 0;
            startY = 0;
            distance = 0;
            distanceY = 0;
            ismove = false;
            isTransition = true;
        }

    });

    //动画结束后事件
    mainContent.addEventListener('transitionend',function () {
        if (!isTransition) return false;
        isTransition = false;
        calWindowUp.style.display = 'none';
        calWindowDown.style.display = 'none';
        if (changedMainHeight >= mainContentHeight) {
            //上拉
            arrow.style.transform = 'translateX(-50%) rotateZ(180deg)';
            vm.weekPattern = false;

        } else if (changedMainHeight <= (mainContentHeight - swipeHeight * 5 / 6)) {
            //下滑
            arrow.style.transform = 'translateX(-50%) rotateZ(0)';
            setTranslateY(0);
            removeTranstion(swipeBox);
            vm.weekPattern = true;
            vm.pattern = false;
        }

    });

    //点击箭头事件
    // arrow.addEventListener('click',function () {
    //     calWindowUp.style.display = 'block';
    //     calWindowDown.style.display = 'block';
    //     addTranstion(swipeBox);
    //     addTranstion(mainContent);
    //     addTranstion(calWindowUp);
    //     addTranstion(calWindowDown);
    //     rows = Math.floor(window.index / 7);
    //     window.index % 7 > 0 ? rows += 1: rows;
    //     //上拉
    //     if (changedMainHeight >= mainContentHeight) {
    //         setMainContentHeight(mainContentHeight - swipeHeight * 5 / 6);
    //         setTranslateY(-swipeHeight * (rows -1) / 6);
    //         changedMainHeight = mainContentHeight - swipeHeight * 5 / 6;
    //         calTranslate = -swipeHeight * (rows -1) / 6;
    //         setOpacity(calWindowUp,1);
    //         setOpacity(calWindowDown,1);
    //         firstOpacity = 1;
    //     } else if (changedMainHeight <= (mainContentHeight - swipeHeight * 5 / 6)) {
    //         //下滑
    //         setMainContentHeight(mainContentHeight);
    //         setTranslateY(0);
    //         changedMainHeight = mainContentHeight;
    //         calTranslate = 0;
    //         setOpacity(calWindowUp,0);
    //         setOpacity(calWindowDown,0);
    //         firstOpacity = 0;
    //     }
    // })
};


