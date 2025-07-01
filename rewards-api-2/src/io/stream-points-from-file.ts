import fs from "fs";
import { Transform, type TransformCallback } from "node:stream";
import AutoDetectDecoderStream from "autodetect-decoder-stream";
import CsvReadableStream from "csv-reader";
import { z } from "zod";
import type { IPointStream } from "../model/i-point-stream";

const pointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export function streamPointsFromFile(
  pathToLocationsFile: string
): IPointStream {
  const inputStream = fs.createReadStream(pathToLocationsFile);

  const decodedInputStream = inputStream.pipe(
    new AutoDetectDecoderStream({
      defaultEncoding: "1255",
    })
  );

  const csvStream = decodedInputStream.pipe(
    new CsvReadableStream({
      skipEmptyLines: true,
      asObject: true,
      parseNumbers: true,
      trim: true,
    })
  );

  const pointStream = csvStream.pipe(new PointTransform());
  return pointStream;
}

class PointTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    chunk: any,
    _encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const { success, data } = pointSchema.safeParse(chunk);
    if (success) {
      this.push(data);
    }
    callback();
  }
}
