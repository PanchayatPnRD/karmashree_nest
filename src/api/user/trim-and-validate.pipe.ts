import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimAndValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      value = value.trim();
      const regex = /^[a-zA-Z0-9]*$/;
      if (!regex.test(value)) {
        throw new BadRequestException(`Validation failed: "${metadata.data}" contains special characters`);
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
          const regex = /^[a-zA-Z0-9]*$/;
          if (!regex.test(value[key])) {
            throw new BadRequestException(`Validation failed: "${key}" contains special characters`);
          }
        }
      }
    }
    return value;
  }
}
