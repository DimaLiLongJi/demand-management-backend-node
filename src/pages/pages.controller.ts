import { Controller, Get, Render } from '@nestjs/common';

@Controller('/pages')
export class PagesController {

  @Get('/*')
  @Render('index')
  public pageGet(): void {
    console.log('pages init');
  }

  @Get()
  @Render('index')
  public pageGetNull(): void {
    console.log('pages init');
  }
}
