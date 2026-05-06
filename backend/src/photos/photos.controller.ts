import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFile, Bind } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('reportId') reportId: string,
    @Body('type') type: string,
  ) {
    return this.photosService.upload(file, reportId, type || 'EVIDENCE');
  }

  @Get('report/:reportId')
  findByReport(@Param('reportId') reportId: string) {
    return this.photosService.findByReport(reportId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.photosService.delete(id);
  }
}