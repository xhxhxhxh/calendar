//今日时间
let currentYear = 1;
let currentMonth = 1;
let currentDay = 1;

//月份组件: 从vuex中读取时间参数
Vue.component('cal-now',{
    template: '#cal-now',
    data () {
        return {
            currentMonth: 0,
            currentYear: 0,
            daysOfWeek: 0,
            currentMonthDays: 0,
            chosenDate: 1
        }
    },
    created () {
        this.getDateFromVuex();
        this.updateChosenDate();
    },
    watch: {
        '$store.state.months': function () {
            if (this.$store.getters.isCurrentDate) {
                this.chosenDate = this.$store.state.currentDate[0];
            } else {
                this.chosenDate = 1;
            }
            this.updateChosenDate();
            this.$store.dispatch('getChosenWeek');
        }
    },
    methods: {
        //从vuex中获取当前时间参数
        getDateFromVuex() {
            this.currentMonth = this.$store.state.months;
            this.currentYear = this.$store.state.years;
            this.daysOfWeek = this.$store.state.daysOfWeek;
            this.currentMonthDays = this.$store.state.monthDays;
            this.chosenDate = this.$store.state.chosenDate;
        },

        //选中日期，背景改变
        changeBackgroundColor(e) {
            this.chosenDate = parseInt(e.target.textContent);
            this.updateChosenDate();
            this.$store.dispatch('getChosenWeek');
        },

        //将选中的日期同步到vuex中
        updateChosenDate () {
            this.$store.commit('getChosenDate', this.chosenDate);

            //将选择日期的序号传递给window
            window.index = this.$store.state.daysOfWeek + this.chosenDate;
        }
    }

});

//下个月
Vue.component('cal-next',{
    template: '#cal-next',
    data () {
        return {
            currentMonth: 0,
            currentYear: 0,
            daysOfWeek: 0,
            currentMonthDays: 0,
        }
    },
    created () {
        this.getDateFromVuex();
        this.getDaysOfWeek();
        this.getCurrentMonthDays(this.currentYear,this.currentMonth);
    },
    props: ['left','right'],
    watch: {
        left: function () {
            this.update([this.currentMonth, this.currentYear, this.currentMonthDays, this.daysOfWeek]);
            this.getDateFromVuex();
            this.getDaysOfWeek();
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        },
        '$store.state.months': function () {
            this.getDateFromVuex();
            this.getDaysOfWeek();
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        }
    },
    methods: {
        //从vuex中获取当前时间参数
        getDateFromVuex () {
            let years = this.$store.state.years;
            let months = this.$store.state.months;
            months ++;
            if (months == 13) {
                months = 1;
                years ++;
            }
            this.currentMonth = months;
            this.currentYear = years;
        },

        //计算月初的星期
        getDaysOfWeek () {
            let days = this.$store.state.monthDays;
            let daysOfWeek = this.$store.state.daysOfWeek;
            this.daysOfWeek = (daysOfWeek + days % 7) % 7;
        },
        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            this.currentMonthDays = arr[months - 1];
        },

        //将日期参数传到vuex中
        update (date) {
            this.$store.commit('update', date);
        }
    }

});

//上个月
Vue.component('cal-prev',{
    template: '#cal-next',
    data () {
        return {
            currentMonth: 0,
            currentYear: 0,
            daysOfWeek: 0,
            currentMonthDays: 0,
        }
    },
    created () {
        this.getDateFromVuex();
        this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        this.getDaysOfWeek();
    },
    props: ['right', 'left'],
    watch: {
        right: function () {
            this.update([this.currentMonth, this.currentYear, this.currentMonthDays, this.daysOfWeek]);
            this.getDateFromVuex();
            this.getDaysOfWeek();
        },
        '$store.state.months': function () {
            this.getDateFromVuex();
            this.getDaysOfWeek();
        }

    },
    methods: {
        //从vuex中获取当前时间参数
        getDateFromVuex () {
            let years = this.$store.state.years;
            let months = this.$store.state.months;
            months --;
            if (months == 0) {
                months = 12;
                years --;
            }
            this.currentMonth = months;
            this.currentYear = years;
        },

        //计算月初的星期
        getDaysOfWeek () {
            let days = this.getCurrentMonthDays(this.currentYear,this.currentMonth);
            let daysOfWeek = this.$store.state.daysOfWeek;
            this.daysOfWeek = daysOfWeek - days % 7;
            if (this.daysOfWeek < 0) {
                this.daysOfWeek = daysOfWeek + 7 - days % 7;
            }
        },
        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            return this.currentMonthDays = arr[months - 1];
        },

        //将日期参数传到vuex中
        update (date) {
            this.$store.commit('update', date);
        }
    }

});

//星期组件
Vue.component('cal-week-now',{
    template: '#cal-week-now' ,
    data () {
        return {
            chosenDate: 1,
            prevChosenDay: 1,
            firstChosenDay: 1,
            currentMonth: 1,
            daysOfWeek: 1,
            currentYear: 1,
            weekArr: [],
            MWeekArr: []
        }
    },
    created () {
        this.getChosenDateFromVuex();
    },
    watch: {
        '$store.state.week': function () {
            this.getChosenDateFromVuex();
        }
    },
    methods: {
        //从vuex中获取当前时间参数
        getChosenDateFromVuex() {
            this.currentMonth = this.$store.state.months;
            this.currentYear = this.$store.state.years;
            this.daysOfWeek = this.$store.state.daysOfWeek;
            this.weekArr = this.$store.state.weekArr;
            this.chosenDate = this.$store.state.chosenDate;
            this.firstChosenDay = this.chosenDate;
            this.increaseMonthToWeekArr();
        },

        //将月份添加到weekArr中
        increaseMonthToWeekArr () {
            let MWeekArr = [];
            let month = this.currentMonth;
            month ++;
            if (month > 12) {
                month = 1;
            }
            this.weekArr.forEach(item => {
                let obj = {};
                if (item < this.weekArr[0]) {
                    obj.M = month;
                    obj.D = item;
                    MWeekArr.push(obj);
                } else {
                    obj.M = this.currentMonth;
                    obj.D = item;

                    MWeekArr.push(obj);
                }
            });
            this.MWeekArr = MWeekArr;
        },
        //选中日期，背景改变
        changeBackgroundColor(e) {
            this.prevChosenDay = this.chosenDate;
            this.chosenDate = parseInt(e.target.textContent);
            this.updateChosenDate();
            if ((this.prevChosenDay +7) < this.chosenDate && this.firstChosenDay > 7) {
                this.$store.commit('updateMonth',[this.currentMonth,this.currentYear]);
                this.$store.commit('updateDaysOfWeek',this.daysOfWeek);
            }
            if (this.prevChosenDay > (this.chosenDate + 7) && this.firstChosenDay > 7) {
                if (this.currentMonth + 1 > 12) {
                    this.$store.commit('updateMonth',[1,this.currentYear + 1]);
                } else {
                    this.$store.commit('updateMonth',[this.currentMonth + 1,this.currentYear]);
                }
                let days = this.$store.state.monthDays;
                let daysOfWeek = this.daysOfWeek;
                daysOfWeek = (daysOfWeek + days % 7) % 7;
                this.$store.commit('updateDaysOfWeek',daysOfWeek);
            }
            if ((this.prevChosenDay +7) < this.chosenDate && this.firstChosenDay < 7) {
                if (this.currentMonth - 1 < 1) {
                    this.$store.commit('updateMonth',[12,this.currentYear - 1]);
                } else {
                    this.$store.commit('updateMonth',[this.currentMonth - 1,this.currentYear]);
                }
                this.$store.commit('updateDaysOfWeek',this.getDaysOfWeek());
            }
            if (this.prevChosenDay > (this.chosenDate + 7) && this.firstChosenDay < 7) {
                this.$store.commit('updateMonth',[this.currentMonth,this.currentYear]);
                this.$store.commit('updateDaysOfWeek',this.daysOfWeek);
            }
        },

        //将选中的日期同步到vuex中
        updateChosenDate () {
            this.$store.commit('getChosenDate', this.chosenDate);

            //将选择日期的序号传递给window
            window.index = this.$store.state.daysOfWeek + this.chosenDate;
        },
        //计算月初的星期
        getDaysOfWeek () {
            let year = this.currentYear;
            let month = this.currentMonth;
            month --;
            if (month < 1) {
                month = 12;
                year --;
            }
            let days = this.getCurrentMonthDays(year,month);;
            let daysOfWeek = this.daysOfWeek;
            let newDaysOfWeek = daysOfWeek - days % 7;
            if (newDaysOfWeek < 0) {
                newDaysOfWeek = daysOfWeek + 7 - days % 7;
            }
            return newDaysOfWeek;
        },
        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            return arr[months - 1];
        },
    }
});

//下周
Vue.component('cal-week-next',{
    template: '#cal-week-next' ,
    data () {
        return {
            firstDay: 1,
            currentMonth: 1,
            currentYear: 1,
            currentMonthDays: 1,
            daysOfWeek: 1,
            weekArr: []
        }
    },
    created () {
        //初始化星期
        this.getDateFromVuex();
        this.isFirstDay();
        this.getCurrentMonthDays(this.currentYear,this.currentMonth);
    },
    props: ['left'],
    watch: {
        left: function () {
            this.update([this.currentMonth, this.currentYear, this.currentMonthDays, this.daysOfWeek]);
            this.$store.commit('increaseWeek');
            this.updateChosenDate();
            this.updateWeekArr(this.weekArr);
            this.getDateFromVuex();
            this.isFirstDay();
        },
        '$store.state.week': function () {
            this.getDateFromVuex();
            this.isFirstDay();
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        }
    },
    methods: {
        //从vuex中获取当前时间参数
        getDateFromVuex() {
            this.currentMonth = this.$store.state.months;
            this.currentYear = this.$store.state.years;
            this.daysOfWeek = this.$store.state.daysOfWeek;
            this.currentMonthDays = this.$store.state.monthDays;
            this.firstDay = this.$store.state.weekArr[6] + 1;
        },

        //判断第一天条件
        isFirstDay () {
            let weekArr = [];
            if ((this.firstDay + 6) > this.currentMonthDays) {
                let lastDay = this.firstDay + 6 - this.currentMonthDays;
                for (let n = this.firstDay; n <= this.currentMonthDays; n++) {
                    weekArr.push(n);
                }
                for (let n = 1; n <= lastDay; n++) {
                    weekArr.push(n);
                }
                this.firstDay = weekArr[0];
                if (this.firstDay <= 7 && this.$store.state.chosenDate > 6) {
                    this.currentMonth ++;
                    if (this.currentMonth > 12) {
                        this.currentMonth = 1;
                        this.currentYear ++
                    }
                    this.getDaysOfWeek();
                }
                return this.weekArr = weekArr;
            }
            for (let n = this.firstDay; n <= (this.firstDay + 6); n++) {
                weekArr.push(n);
            }
            this.weekArr = weekArr;
            this.firstDay = weekArr[0];
            if (this.firstDay <= 7 && this.$store.state.chosenDate > 6) {
                this.currentMonth ++;
                if (this.currentMonth > 12) {
                    this.currentMonth = 1;
                    this.currentYear ++
                }
                this.getDaysOfWeek();
            }

        },
        //计算月初的星期
        getDaysOfWeek () {
            let days = this.$store.state.monthDays;
            let daysOfWeek = this.$store.state.daysOfWeek;
            this.daysOfWeek = (daysOfWeek + days % 7) % 7;
        },
        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            this.currentMonthDays = arr[months - 1];
        },

        //将日期参数传到vuex中
        update (date) {
            this.$store.commit('update', date);
        },

        updateWeekArr (date) {
            this.$store.commit('getWeekArr', date);
        },
        //将选中的日期同步到vuex中
        updateChosenDate () {
            this.$store.commit('getChosenDate', this.weekArr[0]);

            //将选择日期的序号传递给window
            window.index = this.$store.state.daysOfWeek + this.weekArr[0];
        }
    }
});

//上周
Vue.component('cal-week-prev',{
    template: '#cal-week-next' ,
    data () {
        return {
            firstDay: 1,
            currentMonth: 1,
            currentYear: 1,
            currentMonthDays: 1,
            daysOfWeek: 1,
            weekArr: []
        }
    },
    created () {
        //初始化星期
        this.getDateFromVuex();
        this.isFirstDay();
        this.getCurrentMonthDays(this.currentYear,this.currentMonth);
    },
    props: ['right'],
    watch: {
        right: function () {
            this.update([this.currentMonth, this.currentYear, this.currentMonthDays, this.daysOfWeek]);
            this.$store.commit('reduceWeek');
            this.updateChosenDate();
            this.updateWeekArr(this.weekArr);
            this.getDateFromVuex();
            this.isFirstDay();
        },
        '$store.state.week': function () {
            this.getDateFromVuex();
            this.isFirstDay();
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        }
    },
    methods: {
        //从vuex中获取当前时间参数
        getDateFromVuex() {
            this.currentMonth = this.$store.state.months;
            this.currentYear = this.$store.state.years;
            this.currentMonthDays = this.$store.state.monthDays;
            this.firstDay = this.$store.state.weekArr[0] -7;
            this.daysOfWeek = this.$store.state.daysOfWeek;
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        },

        //判断第一天条件
        isFirstDay () {
            let weekArr = [];
            if (this.firstDay < 1) {
                this.currentMonth --;
                if (this.currentMonth < 1) {
                    this.currentMonth = 12;
                    this.currentYear --
                }
                this.getDaysOfWeek();
                let firstDay = this.firstDay + this.currentMonthDays;
                for (let n = firstDay; n <= this.currentMonthDays; n++) {
                    weekArr.push(n);
                }
                for (let n = 1; n <= (this.firstDay + 6); n++) {
                    weekArr.push(n);
                }
                this.firstDay = firstDay;
                return this.weekArr = weekArr;
            }
            for (let n = this.firstDay; n <= (this.firstDay + 6); n++) {
                weekArr.push(n);
            }
            if (this.$store.state.chosenDate < this.$store.state.weekArr[0]) {
                this.currentMonth --;
                if (this.currentMonth < 1) {
                    this.currentMonth = 12;
                    this.currentYear --
                }
                this.getDaysOfWeek();
            }
            return this.weekArr = weekArr;
        },
        //计算月初的星期
        getDaysOfWeek () {
            this.getCurrentMonthDays(this.currentYear,this.currentMonth);
            let days = this.currentMonthDays;
            let daysOfWeek = this.$store.state.daysOfWeek;
            this.daysOfWeek = daysOfWeek - days % 7;
            if (this.daysOfWeek < 0) {
                this.daysOfWeek = daysOfWeek + 7 - days % 7;
            }
        },
        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            this.currentMonthDays = arr[months - 1];
        },

        //将日期参数传到vuex中
        update (date) {
            this.$store.commit('update', date);
        },

        updateWeekArr (date) {
            this.$store.commit('getWeekArr', date);
        },
        //将选中的日期同步到vuex中
        updateChosenDate () {
            this.$store.commit('getChosenDate', this.weekArr[0]);

            //将选择日期的序号传递给window
            window.index = this.$store.state.daysOfWeek + this.weekArr[0];
        }
    }
});

//vuex
const store = new Vuex.Store({
    state: {
        currentDate: [],
        months: 1,
        years: 1,
        monthDays: 1,
        daysOfWeek: 1,
        chosenDate: 1,
        weekArr: [],
        week: 0
    },
    mutations: {
        update (state, date) {
            state.months = date[0];
            state.years = date[1];
            state.monthDays = date[2];
            state.daysOfWeek = date[3];
        },
        getCurrentDate (state, date) {
            state.currentDate = date;
        },
        getChosenDate (state, date) {
            state.chosenDate = date;
        },
        getWeekArr (state, date) {
            state.weekArr = date;
        },
        updateMonth (state,date) {
            state.months = date[0];
            state.years = date[1];

        },
        updateDaysOfWeek (state,date) {
            state.daysOfWeek = date;
        },
        increaseWeek (state) {
            state.week ++;
        },
        reduceWeek (state) {
            state.week --;
        }

    },
    getters: {
        isCurrentDate (state) {
            if (state.currentDate[1] == state.months && state.currentDate[2] == state.years) {
                return true;
            } else {
                return false;
            }
        },

        //动态更新头部时间
        updateHeaderDate (state) {
            let chosenDate = state.chosenDate;
            let month = state.months;
            let year = state.years;
            year = year < 10? "0" + year: year;
            month = month < 10? "0" + month: month;
            chosenDate = chosenDate < 10? "0" + chosenDate: chosenDate;
            return year + "-" + month + "-"+ chosenDate;
        },

        //计算window-up的高度
        getWindowUpHeight (state) {
            let rows = Math.floor((state.chosenDate + state.daysOfWeek) / 7);
            (state.chosenDate + state.daysOfWeek) % 7 > 0 ? rows += 1: rows;
            return rows;
        },
        //获取上月天数
        getPrevMonthDays (state) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];
            let years = state.years;
            let months = state.months - 1;
            if (months < 1) {
                months = 12;
                years --;
            }
            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            return arr[months - 1];
        },
        //获取下个月天数
        getNextMonthDays (state) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];
            let years = state.years;
            let months = state.months + 1;
            if (months > 12) {
                months = 1;
                years ++;
            }
            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            return arr[months - 1];
        }
    },
    actions: {
        //计算选中日所在星期的日期数组
        getChosenWeek (context) {
            let currentDay = (context.state.daysOfWeek + context.state.chosenDate) % 7;
            currentDay == 0? currentDay = 7: currentDay;
            let before = context.state.chosenDate - currentDay + 1;
            let prevMonthDay = context.getters.getPrevMonthDays;
            // let nextMonthDay = context.getters.getNextMonthDays;
            let weekArr = [];
            if (before <= 0) {
                for (let n = 0; n <= Math.abs(before); n++) {
                    weekArr.unshift(prevMonthDay - n);
                }
                for (let n = 1; n <= (before + 6); n++) {
                    weekArr.push(n);
                }
                return context.commit('getWeekArr',weekArr);
            }
            if ((before + 6) > context.state.monthDays) {
                for (let n = before; n <= context.state.monthDays; n++) {
                    weekArr.push(n);
                }
                for (let n = 1; n <= (before + 6 - context.state.monthDays); n++) {
                    weekArr.push(n);
                }
                return context.commit('getWeekArr',weekArr);
            }
            for (let n = before; n <= before + 6 ; n++) {
                weekArr.push(n);
            }
            return context.commit('getWeekArr',weekArr);
        }
    }
});


//初始化时间
var vm = new Vue({
    el: '#app',
    data: {
        currentDay: 0,
        currentMonth: 0,
        currentYear: 0,
        daysOfWeek: 0,
        currentMonthDays: 0,
        left: 0,
        right: 0,
        height: 0,
        pattern: true, //true为月模式，false为星期模式,
        weekPattern: false
    },
    created () {
        this.date = this.getDate();
        this.getDaysOfWeek();
        this.getCurrentMonthDays(this.currentYear,this.currentMonth);
        this.update([this.currentMonth, this.currentYear, this.currentMonthDays, this.daysOfWeek], [currentDay, currentMonth, currentYear]);
        //初始化星期
        this.$store.commit('getChosenDate', this.currentDay);
        this.$store.dispatch('getChosenWeek');
    },
    mounted () {
        //绑定切换动画结束事件
        let that = this;
        this.height = this.$refs.calBox.offsetHeight;
        this.$refs.calBox.addEventListener('transitionend',function () {
            that.left = window.left;
            that.right = window.right;
            this.style.transition = 'none';
            this.style.webkitTransition = 'none';
            this.style.transform = 'translateX(-33.33%)';
            this.style.webkitTransform = 'translateX(-33.33%)';
        });
    },
    methods: {
        //获取当前时间
        getDate () {
            let dt = new Date();
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let day = dt.getDate();
            this.currentDay = day;
            this.currentMonth = month;
            this.currentYear = year;

            //记录当前时间
            currentDay = day;
            currentMonth = month;
            currentYear = year;
        },
        // getTotalDays (years, months, days) {
        //     let arr = [31,28,31,30,31,30,31,31,30,31,30,31];
        //     let daysToNow = 0;
        //     for (let n = 1; n < years; n++) {
        //         if((n % 4 == 0 && n % 100 != 0) || n % 400 == 0){
        //             daysToNow += 366;
        //             arr[1] = 29;
        //         } else {
        //             daysToNow += 365;
        //         }
        //     }
        //     if (months == 1) {
        //         console.log(daysToNow + days)
        //         return daysToNow + days;
        //     }
        //     for (let n = 1; n < months; n++) {
        //         daysToNow += arr[n];
        //     }
        //     // return daysToNow + days;
        //     console.log(daysToNow + days)
        // },

        //获取现在距1970-1-1的天数，推算今天星期几
        getDaysOfWeek () {
            let milliSeconds = Date.now() + 28800000;

            //距1970-1-1的天数
            let totalDays = Math.floor(milliSeconds / (1000 * 60 * 60 * 24));

            //本月1号是周几？
            let daysOfWeek = (totalDays - this.currentDay + 1) % 7 + 4;
            this.daysOfWeek = daysOfWeek % 7;
        },

        //当前月天数
        getCurrentMonthDays (years,months) {
            let arr = [31,28,31,30,31,30,31,31,30,31,30,31];

            //判断闰年
            if((years % 4 == 0 && years % 100 != 0) || years % 400 == 0){
                arr[1] = 29;
            }
            this.currentMonthDays = arr[months - 1];
        },

        //回到今天
        backToToday () {
            location.reload()
        },
        //将日期参数传到vuex中
        update (date, currentDate) {
            this.$store.commit('update', date);
            this.$store.commit('getCurrentDate', currentDate);
        }
    },
    store
});