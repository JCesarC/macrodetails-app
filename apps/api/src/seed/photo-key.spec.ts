import { seedPhotoKey } from './photo-key.js';

const photo = new TextEncoder().encode('photo-a');
const otherPhoto = new TextEncoder().encode('photo-b');

describe('seedPhotoKey', () => {
  it('places the photo under the product folder, keeping its name', () => {
    expect(seedPhotoKey('ramo-rosas', '1.webp', photo)).toMatch(
      /^products\/ramo-rosas\/1-[0-9a-f]{12}\.webp$/,
    );
  });

  it('returns the same key for the same contents', () => {
    expect(seedPhotoKey('ramo-rosas', '1.webp', photo)).toBe(
      seedPhotoKey('ramo-rosas', '1.webp', photo),
    );
  });

  it('returns a new key when the contents change', () => {
    expect(seedPhotoKey('ramo-rosas', '1.webp', photo)).not.toBe(
      seedPhotoKey('ramo-rosas', '1.webp', otherPhoto),
    );
  });

  it('lowercases the extension', () => {
    expect(seedPhotoKey('ramo-rosas', '2.JPG', photo)).toMatch(/\/2-[0-9a-f]{12}\.jpg$/);
  });
});
