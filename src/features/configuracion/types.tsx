import { Device } from 'src/utils/mobile.utils';
import { ScreenOrientation } from 'src/utils/screen.utils';

export interface ConfiguracionSliceState {
  environment: string;
  device: Device;
  orientation: ScreenOrientation;
}

export type { Device, ScreenOrientation };
