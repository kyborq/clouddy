import { Upload } from '../schemas/file.schema';

export class UploadDto {
  public alias: string;
  public fileName: string;
  public uploadDate: Date;

  constructor(upload: Upload) {
    this.alias = upload.alias;
    this.fileName = upload.fileName;
    this.uploadDate = upload.uploadDate;
  }
}
