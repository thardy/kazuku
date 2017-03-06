import { KazukuPage } from './app.po';

describe('kazuku App', function() {
  let page: KazukuPage;

  beforeEach(() => {
    page = new KazukuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('kz works!');
  });
});
