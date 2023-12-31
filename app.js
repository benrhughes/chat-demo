var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatVm } from "./chatVm.js";
import { Elements } from "./elements.js";
import { GlobalsVm } from "./globalsVm.js";
import { ChatModel, DB, DB as Database } from "./models.js";
export class App {
    constructor() {
        this.localStorageKey = "chat-db";
        this.db = new Database();
        this.load();
    }
    load() {
        this.loadDb();
        this.globals = new GlobalsVm(this.db.global);
        this.globals.updateUiFromModel();
        for (const chat of this.db.models) {
            this.addChatOptionToUi(chat);
        }
        let chat;
        if (this.db.models.length > 0) {
            chat = this.db.models[0];
        }
        else {
            chat = new ChatModel();
            this.db.models.push(chat);
        }
        this.currentChat = new ChatVm(chat);
        Elements.selectedChat.value = chat.id.toString();
        this.bindUiEventHandlers();
    }
    loadDb() {
        const raw = localStorage.getItem(this.localStorageKey);
        if (!raw)
            return;
        this.db = JSON.parse(raw);
    }
    saveDb() {
        if (this.currentChat) {
            this.currentChat.updateModelFromUi();
            this.currentChat.model.lastSaved = new Date();
        }
        //reverse-chron sort on last saved
        this.db.models.sort((a, b) => new Date(b.lastSaved).valueOf() - new Date(a.lastSaved).valueOf());
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.db));
    }
    addChatOptionToUi(model) {
        const option = document.createElement("option");
        option.value = model.id.toString();
        option.text = model.name;
        Elements.selectedChat.appendChild(option);
    }
    clearDb() {
        const proceed = confirm("This will delete all of your current data. Do you wish to proceed?");
        if (!proceed)
            return;
        this.db = new DB();
        this.saveDb();
        this.load();
    }
    chatSelected(e) {
        const selectedValue = e.target.value;
        if (!selectedValue)
            return;
        if (selectedValue.toLocaleLowerCase() === "new") {
            this.currentChat = new ChatVm(new ChatModel());
            this.db.models.push(this.currentChat.model);
            this.addChatOptionToUi(this.currentChat.model);
        }
        else {
            const found = this.db.models.find(x => x.id === +selectedValue);
            if (!found) {
                alert(`Model with id ${selectedValue} couldn't be loaded`);
                return;
            }
            this.currentChat = new ChatVm(found);
        }
    }
    export() {
        const blob = new Blob([localStorage.getItem(this.localStorageKey) || ''], { type: 'text/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat export ${new Date().toISOString()}.json`;
        a.click();
    }
    import() {
        const app = this;
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (event) => {
            const proceed = confirm("This will override all of your current data. Do you wish to proceed?");
            if (!proceed)
                return;
            let target = event.target;
            let file = target.files ? target.files[0] : null;
            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    var _a;
                    const text = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || '';
                    localStorage.setItem(app.localStorageKey, text);
                    app.load();
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    toggleSettings(e) {
        const settings = Elements.settings;
        if (settings === null || settings === void 0 ? void 0 : settings.classList.contains("hidden")) {
            settings === null || settings === void 0 ? void 0 : settings.classList.remove("hidden");
            settings === null || settings === void 0 ? void 0 : settings.classList.add("flex");
        }
        else {
            settings === null || settings === void 0 ? void 0 : settings.classList.add("hidden");
            settings === null || settings === void 0 ? void 0 : settings.classList.remove("flex");
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    deleteChat() {
        if (!confirm("Delete the current chat?")) {
            return;
        }
        this.db.models = this.db.models.filter(x => { var _a; return x.id !== ((_a = this.currentChat) === null || _a === void 0 ? void 0 : _a.model.id); });
        this.currentChat = new ChatVm(this.db.models[0]);
        this.saveDb();
    }
    promptEnter(event) {
        if (event.shiftKey)
            return;
        if (event.key === "Enter") {
            event.preventDefault();
            this.sendMessage();
            Elements.prompt.value = "";
        }
    }
    sendMessage() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.globals) === null || _a === void 0 ? void 0 : _a.model.apiKey)) {
                alert('You need to enter an API Key');
                return;
            }
            yield ((_b = this.currentChat) === null || _b === void 0 ? void 0 : _b.sendMessage(this.globals.model));
            this.saveDb();
        });
    }
    saveSettings() {
        var _a;
        (_a = this.globals) === null || _a === void 0 ? void 0 : _a.updateModelFromUi();
        this.saveDb();
        alert("Settings saved");
    }
    // clone and replace the element to remove any event handlers
    unbind(element) {
        var _a;
        var clone = element.cloneNode(true);
        (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(clone, element);
    }
    bindUiEventHandlers() {
        this.unbind(Elements.saveSettingsBtn);
        Elements.saveSettingsBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.saveSettings();
        }));
        this.unbind(Elements.exportBtn);
        Elements.exportBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.export();
        }));
        this.unbind(Elements.importBtn);
        Elements.importBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.import();
        }));
        this.unbind(Elements.clearPersistanceBtn);
        Elements.clearPersistanceBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            this.clearDb();
        }));
        this.unbind(Elements.deleteChatBtn);
        Elements.deleteChatBtn.addEventListener("click", e => {
            this.deleteChat();
        });
        this.unbind(Elements.clearMessagesBtn);
        Elements.clearMessagesBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!confirm("Delete all messages for this chat?")) {
                return;
            }
            (_a = this.currentChat) === null || _a === void 0 ? void 0 : _a.clearMessages();
        }));
        this.unbind(Elements.summarizeMessagesBtn);
        Elements.summarizeMessagesBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            if (!confirm('This will replace all of your chat history with a summary of the conversation. Are you sure?')) {
                return;
            }
            if (!((_b = this.globals) === null || _b === void 0 ? void 0 : _b.model.apiKey)) {
                alert('You need to enter an API Key');
                return;
            }
            yield ((_c = this.currentChat) === null || _c === void 0 ? void 0 : _c.summarizeHistory(this.globals.model));
            this.saveDb();
            this.load();
        }));
        this.unbind(Elements.selectedChat);
        Elements.selectedChat.addEventListener("change", (e) => __awaiter(this, void 0, void 0, function* () {
            this.chatSelected(e);
        }));
        this.unbind(Elements.settingsToggleBtn);
        Elements.settingsToggleBtn.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            return this.toggleSettings(e);
        }));
        this.unbind(Elements.prompt);
        Elements.prompt.addEventListener("keydown", (event) => __awaiter(this, void 0, void 0, function* () {
            this.promptEnter(event);
        }));
    }
}
