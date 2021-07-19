import { VIEW } from 'src/constants';
import { Size } from './hooks';

export type ScreenOrientation = 'portrait' | 'landscape';

export function getScreenOrientation(size: Size) {
  let orientation: ScreenOrientation = 'portrait';
  if (size.width > size.height) orientation = 'landscape';
  return orientation;
}

export function getViewWidth(loadingOrError: boolean) {
  return loadingOrError ? '100%' : VIEW.MAX_WIDTH;
}
