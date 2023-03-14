class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        return this.items.push(element);
    }

    pop() {
        if (this.items.length > 0) {
            return this.items.pop();
        }
    }

    top() {
        return this.items[this.items.length - 1];
    }
}

export default Stack;
