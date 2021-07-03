import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { useForm } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { CSSProperties, useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { ColumnTypeEx, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { cleanState } from 'src/features/transferencia/nueva-solicitud/logic';
import { Paginator } from 'src/features/_shared/data/interfaces';
import { getRule } from 'src/features/_shared/ui/utils';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { Rules } from 'src/types/interfaces';
import { getFreshToken } from 'src/utils/auth';
import { formatCurrencyAmount, formatDate } from 'src/utils/formatters';
import { getViewWidth } from 'src/utils/screen';
import { compare } from 'src/utils/string';
import { Mensaje } from '../data/interfaces';
import { fetchMensaje } from '../logic';

import styles from './style.module.less';

interface InfoMensajeProps {
  id: number;
}

export const InfoMensaje: React.FC<InfoMensajeProps> = (props) => {
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const { id } = props;

  const infoMensaje = useAppSelector((state: RootState) => state.mensaje.infoMensaje);

  //#region UseEffects

  useEffect(() => {
    fetchData(id);
  }, []);

  //#endregion

  //#region Other functions

  const fetchData = async (id: number) => {
    const token = await getFreshToken(state.msalInstance!);

    dispatch(
      fetchMensaje({
        headers: {
          Authorization: 'Bearer ' + token,
        },
        placeholders: { id },
      }),
    );

    return () => {
      dispatch(cleanState());
    };
  };

  //#endregion

  const isContentLoading = isFetchingData(infoMensaje.info);

  const hasContentError = hasError(infoMensaje.info);

  //#region Renders

  const renderInfo = () => {
    return (
      <Wrapper contentBody direction="row" horizontal="center">
        <span>MODAL</span>
      </Wrapper>
    );
  };

  //#endregion

  return (
    <Wrapper
      contentWrapper
      unselectable
      direction="column"
      vertical="top"
      horizontal="center"
      style={{ minWidth: getViewWidth(isContentLoading || hasContentError) }}>
      {/*   {isContentLoading ? <LoadingContent /> : renderTable()} */}
      {isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderInfo()}
    </Wrapper>
  );
};
