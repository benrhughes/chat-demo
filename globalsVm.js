import { Elements } from "./elements.js";
export class GlobalsVm {
    constructor(model) {
        this.model = model;
    }
    updateUiFromModel() {
        Elements.apiKey.value = this.model.apiKey;
    }
    updateModelFromUi() {
        this.model.apiKey = Elements.apiKey.value;
    }
}
