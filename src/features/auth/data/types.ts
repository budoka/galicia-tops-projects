import { RequestState } from 'src/features/_shared/data/interfaces';
import { LoginDto, RegisterDto, SessionDto } from './dto';

export interface AuthState {
  data: Partial<DataState>;
  ui: Partial<UIState>;
}
export interface DataState {
  login: RequestState<LoginDto, SessionDto>;
  register: RequestState<RegisterDto, SessionDto>;
  getAccessToken: RequestState<RegisterDto, Pick<SessionDto, 'accessToken'>>;
  session: Session;
}

export interface UIState {
  modal: boolean;
}

export interface Session {
  username: string;
  accessToken: string;
  refreshToken: string;
}
