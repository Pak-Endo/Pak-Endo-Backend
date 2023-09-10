/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  HttpException,
  HttpStatus,
  Req,
  Res,
  Query,
  Get,
} from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiTags, ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';
// import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jimp = require('jimp');
import config from 'src/config';

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (!config.whiteListedExtensions.includes(ext.toLowerCase())) {
    req.fileValidationError = 'Invalid file type';
    return callback(
      new HttpException('Invalid file type', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  return callback(null, true);
};

@ApiTags('media-upload')
@Controller('media-upload')
@ApiBearerAuth()
export class MediaUploadController {

  // @UseGuards(JwtAuthGuard)
  @Post('mediaFiles/:folderName')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: function (req, file, cb) {
          const dir = 'mediaFiles/' + req.params.folderName.toLowerCase();

          fs.exists(dir, (exist) => {
            if (!exist) {
              return fs.mkdir(dir, { recursive: true }, (error) =>
                cb(error, dir),
              );
            }
            return cb(null, dir);
          });
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadMedia(
    @UploadedFile() file,
    @Param('folderName') folderName: string,
    @Req() req,
  ) {
    req.setTimeout(10 * 60 * 1000);
    file['url'] = config.URL + '/media-upload/mediaFiles/' + folderName.toLowerCase() + '/' + file.filename;
    let type = '';
    const nameSplit = file['filename'].split('.');
    if (nameSplit.length > 1) {
      type = nameSplit[1];
    }

    const allowTypes = ['.jpg', '.jpeg', '.png'];

    if (type && allowTypes.includes(`.${type}`)) {
      const img = await jimp.read(file['path']);
      const height = img.bitmap.height;
      const width = img.bitmap.width;
      const widthRatio = width / height;
      img.resize(500 * widthRatio, jimp.AUTO).write(file['path']);
    }
    return file;
  }

  @Get('mediaFiles/:folderName/:fileName')
    async mediaFiles(
      @Param('folderName') folderName: string,
      @Param('fileName') fileName: string,
      @Res() res,
      @Req() req,
      @Query('size') size = 'original',
    ): Promise<any> {
      req.setTimeout(10 * 60 * 1000);
      const sizeArray = ['original', 'compressed'];
      size = sizeArray.includes(size) ? size : 'original';
      folderName = folderName.toLowerCase();
      if (size == 'original') {
        res.sendFile(fileName, {
          root: 'mediaFiles/' + folderName,
        });
      } else {
        const dir = 'mediaFiles/' + folderName + '/' + size + '/' + fileName;
        const exists = fs.existsSync(dir);
        if (!exists) {
          res.sendFile(fileName, {
            root: 'mediaFiles/' + folderName,
          });
          return;
        }
  
        res.sendFile(fileName, {
          root: 'mediaFiles/' + folderName + '/' + size,
        });
      }
    }
}
