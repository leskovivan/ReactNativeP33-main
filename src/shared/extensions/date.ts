export {};

declare global {
  interface Date {
    toDotted(): string;
    toYMD(): string;
  }
}

// Потрібно також підключити розширення Number для pad0
import "./number";

Date.prototype.toDotted = function():string {
    return `${this.getDate().pad0()}.${(this.getMonth() + 1).pad0()}.${this.getFullYear()}`;
}

Date.prototype.toYMD = function():string {
    return `${this.getFullYear()}${(this.getMonth() + 1).pad0()}${this.getDate().pad0()}`;
}
