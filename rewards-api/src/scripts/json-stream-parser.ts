import { Transform } from "node:stream";
import { TransformCallback } from "stream";

export class JSONStreamParser extends Transform {
  buffer: string = "";
  tokenStack: string[] = [];

  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.parse(chunk.toString());
    callback();
  }

  parse(chunk: string) {
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      this.buffer += char;
      const previousToken = this.tokenStack.at(-1);
      if (previousToken === "\\") {
        this.tokenStack.pop();
      } else {
        switch (char) {
          case "{":
            if (
              !previousToken ||
              previousToken === "{" ||
              previousToken === "["
            ) {
              this.tokenStack.push(char);
            }
            break;
          case "}":
            if (previousToken === "{") {
              this.tokenStack.pop();
            }
            break;
          case "[":
            if (
              !previousToken ||
              previousToken === "{" ||
              previousToken === "["
            ) {
              this.tokenStack.push(char);
            }
            break;
          case "]":
            if (previousToken === "[") {
              this.tokenStack.pop();
            }
            break;
          case '"':
            if (previousToken === '"') {
              this.tokenStack.pop();
            } else {
              this.tokenStack.push(char);
            }
            break;
          case "\\":
            this.tokenStack.push();
            break;
        }
      }

      if (this.parsedCompleteJSONObject()) {
        this.pushJSON();
      }
    }
  }

  parsedCompleteJSONObject() {
    return this.tokenStack.length === 0;
  }

  pushJSON() {
    const data = JSON.parse(this.buffer);
    this.buffer = "";
    this.push(data);
  }
}
