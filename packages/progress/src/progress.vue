<template>
    <div
        class="aheng-progress"
        :class="[
            'aheng-progress--' + type,
            status ? 'is-' + status : '',
            {
                'aheng-progress--without-text': !showText,
                'aheng-progress--text-inside' : textInside,
            } 
        ]"
        role="progressbar"
        :aria-valuenow="percentage"
        aria-valuemin="0"
        aria-valuemax="100"
    >
        <div class="aheng-progress-bar" v-if="type==='line'">
            <div class="aheng-progress-bar__outer" :style="{height:strokeWidth + 'px'}">
                <div class="aheng-progress-bar__inner" :style="barStyle">
                    <div
                        class="aheng-progress-bar__innerText"
                        v-if="showText && textInside"
                    >{{content}}</div>
                </div>
            </div>
        </div>
        <div class="aheng-progress-circle" :style="{height:width+'px',width:width+'px'}" v-else>
            <svg viewBox="0 0 100 100">
                <path
                    class="aheng-progress-circle__track"
                    :d="trackPath"
                    stroke="#e5e9f2"
                    :stroke-width="relativeStrokeWidth"
                    fill="none"
                    :style="trailPathStyle"
                />
                <path
                    class="aheng-progress-circle__path"
                    :d="trackPath"
                    :stroke="stroke"
                    fill="none"
                    stroke-linecap="round"
                    :stroke-width="percentage ? relativeStrokeWidth : 0"
                    :style="circlePathStyle"
                />
            </svg>
        </div>
        <div
            class="aheng-progress__text"
            v-if="showText&&!textInside"
            :style="{fontSize:progressTextSize + 'px'}"
        >
            <template v-if="!status">{{content}}</template>
            <i v-else :class="iconClass"></i>
        </div>
    </div>
</template>


<script>
import _const from "./const.js";
import { STATUS_CODES } from "http";
export default {
    name: "AhengProgress",
    props: {
        type: {
            type: String,
            default: "line",
            validator: val =>
                [TYPE_LINE, TYPE_CIRCLE, TYPE_DASHBOARD].indexOf(val) > -1
        },
        percentage: {
            type: Number,
            default: 0,
            required: true,
            validator: val => val >= 0 && val <= 100
        },
        status: {
            type: String,
            validator: val =>
                [STATUS_SUCCESS, STATUS_EXCEPTION, STATUS_WARNING].indexOf(
                    val
                ) > -1
        },
        strokeWidth: {
            type: Number,
            default: 6
        },
        textInside: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 126
        },
        showText: {
            type: Boolean,
            default: true
        },
        color: {
            type: [String, Array, Function],
            default: ""
        },
        format: Function
    },

    computed: {
        barStyle() {
            const style = {};
            style.width = this.percentage + "%";
            style.backgroundColor = this.getCurrentColor(this.percentage);
            return style;
        },
        relativeStrokeWidth() {
            return ((this.strokeWidth / this.width) * 100).toFixed(1);
        },
        radius() {
            if (this.type === TYPE_CIRCLE || this.type === TYPE_DASHBOARD) {
                return parseInt(
                    50 - parseFloat(this.relativeStrokeWidth) / 2,
                    10
                );
            } else {
                return 0;
            }
        },
        trackPath() {
            const radius = this.radius;
            const isDashboard = this.type === TYPE_DASHBOARD;
            return `
            M 50 50
            m 0 ${isDashboard ? "" : "-"}${radius}
            a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
            a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
            `;
        },
        perimeter() {
            return 2 * Math.PI * this.radius;
        },
        rate() {
            return this.type === TYPE_DASHBOARD ? 0.75 : 1;
        },
        strokeDashoffset() {
            const offset = (-1 * this.perimeter * (1 - this.rate)) / 2;
            return `${offset}px`;
        },
        trailPathStyle() {
            return {
                strokeDasharray: `${this.perimeter * this.rate}px,${
                    this.perimeter
                }px`,
                strokeDashoffset: this.strokeDashoffset
            };
        },
        circlePathStyle() {
            return {
                strokeDasharray: `${this.perimeter *
                    this.rate *
                    (this.percentage / 100)}px,${this.perimeter}px`,
                strokeDashoffset: this.strokeDashoffset,
                transition: `stroke-dasharray 0.6s ease 0s,stroke 0.6s ease`
            };
        },
        stroke() {
            let ret;
            if (this.color) {
                ret = this.getCurrentColor(this.percentage);
            } else {
                switch (this.status) {
                    case STATUS_SUCCESS:
                        ret = "#13ce66";
                        break;
                    case STATUS_EXCEPTION:
                        ret = "#ff4949";
                        break;
                    case STATUS_WARNING:
                        ret = "#e6a23c";
                        break;
                    default:
                        ret = "#20a0ff";
                }
            }
            return ret;
        },
        iconClass() {
            if (this.status === STATUS_WARNING) {
                return "aheng-icon-warning";
            }
            if (this.type === TYPE_LINE) {
                return this.status === STATUS_SUCCESS
                    ? "aheng-icon-circle-check"
                    : "aheng-icon-circle-close";
            } else {
                return this.status === STATUS_SUCCESS
                    ? "aheng-icon-check"
                    : "aheng-icon-close";
            }
        },
        progressTextSize() {
            return this.type === TYPE_LINE
                ? 12 + this.stroke * 0.4
                : this.width * 0.111111 + 2;
        },
        content() {
            if (typeof this.format === "function") {
                return this.format(this.percentage) || "";
            } else {
                return `${this.percentage}%`;
            }
        }
    },
    methods: {
        getCurrentColor(percentage) {
            if (typeof this.color === "function") {
                return this.color(percentage);
            } else if (typeof this.color === "string") {
                return this.color;
            } else {
                return this.getLevelColor(percentage);
            }
        },
        getLevelColor(percentage) {
            const colorArray = this.getColorArray().sort(
                (a, b) => a.perceantage - b.percentage
            );

            for (let i = 0; i < colorArray.length; i++) {
                if (colorArray[i].percentage > percentage) {
                    return colorArray[i].color;
                }
            }
            return colorArray[colorArray.length - 1].color;
        },
        getColorArray() {
            const color = this.color;
            const span = 100 / color.length;
            return color.map((seriesColor, index) => {
                if (typeof seriesColor === "string") {
                    return {
                        color: seriesColor,
                        progress: (index + 1) * span
                    };
                }
                return seriesColor;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>