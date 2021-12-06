import { webmapBaseService } from './WebMapBaseService';
describe('WebMapBaseService', () => {
  test('test', () => {
    expect(webmapBaseService.findLayerInWebmap('LayerNotPresentInWebmap')).toBeNull();
  });
});
