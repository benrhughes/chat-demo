export class DB {
    constructor() {
        this.models = [];
        this.global = new GlobalModel();
    }
}
export class GlobalModel {
    constructor() {
        this.apiKey = '';
    }
}
GlobalModel.apiUrl = 'https://api.openai.com/v1/chat/completions';
export class ChatModel {
    constructor() {
        this.messages = [];
        this.gptModel = "gpt-3.5-turbo";
        this.systemPrompt = "You are a helpful assistant";
        this.contextWindow = 10;
        this.temperature = 0.8;
        this.id = (new Date()).valueOf();
        this.name = "New chat";
    }
}
export class ChatMessage {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
}
