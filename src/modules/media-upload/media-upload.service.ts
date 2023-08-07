import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jimp = require('jimp');

@Injectable()
export class MediaUploadService {
  async compressImageTo300(file) {
    const img = await jimp.read(file['path']);

    const height = img.bitmap.height;
    const width = img.bitmap.width;

    if ((height < 200 && width < 300) || file.size <= 300 * 1000) {
      return '';
    }
    const widthRatio = width / height;
    file['path'] = file['path'].replace('compressed', `300`);
    img.resize(300 * widthRatio, jimp.AUTO).write(file['path']);
  }
}
