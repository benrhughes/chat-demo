import { Elements } from "./elements.js";
export class GlobalsVm {
    constructor(model) {
        this.model = model;
    }
    updateUiFromModel() {
        var _a, _b;
        Elements.apiKey.value = this.model.apiKey;
        Elements.contextWindow.value = ((_a = this.model.contextWindow) === null || _a === void 0 ? void 0 : _a.toString()) || "10";
        Elements.temperature.value = ((_b = this.model.temperature) === null || _b === void 0 ? void 0 : _b.toString()) || "0.8";
    }
    updateModelFromUi() {
        this.model.apiKey = Elements.apiKey.value;
        this.model.contextWindow = +Elements.contextWindow.value;
        this.model.temperature = +Elements.temperature.value;
    }
}
