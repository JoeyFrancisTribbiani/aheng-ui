import AhengProgress from "./src/progress";

AhengProgress.install = function(Vue) {
    Vue.component(AhengProgress.name, AhengProgress);
};

export default AhengProgress;
