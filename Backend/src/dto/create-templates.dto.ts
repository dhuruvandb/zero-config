import { IsArray, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateTemplatesDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true, message: 'Each template name must be at least 1 character' })
  @MaxLength(50, { each: true, message: 'Each template name must be at most 50 characters' })
  @Matches(/^[a-z0-9\-]+$/, {
    each: true,
    message: 'Template names must only contain lowercase letters, numbers, and hyphens',
  })
  templates: string[];
}
