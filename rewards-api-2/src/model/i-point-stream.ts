import type { Stream } from "node:stream";
import type { IPoint } from "./i-point";

export interface IPointStream extends Stream {
  on<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  off<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  addListener<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  removeListener<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  once<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  prependListener<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;

  prependOnceListener<T extends string | symbol>(
    event: T,
    listener: T extends "data"
      ? (data: IPoint) => void
      : (...args: any[]) => void
  ): this;
}
