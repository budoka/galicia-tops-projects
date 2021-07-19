import { List } from 'antd';
import { ListItemMetaProps } from 'antd/lib/list';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { cleanState } from 'src/features/transferencia/nueva-solicitud/logic';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { getFreshToken } from 'src/utils/auth';
import { fetchMensaje } from '../logic';

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
    if (!getMensaje(id)) fetchData(id);
  }, [id]);

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

  const getMensaje = (id: number) => {
    return Object.values(infoMensaje.info.mensajes?.value || {}).find((m) => m.id === id);
  };

  //#endregion

  const isContentLoading = isFetchingData(infoMensaje.info);

  const hasContentError = hasError(infoMensaje.info);

  //#region Renders

  const renderInfo = () => {
    const { canal, codigo, estados, detalles, fechaRecepcion, mensaje, tipo, uetr } = getMensaje(id) || {};

    const data = detalles
      ?.map(
        (d) =>
          ({
            title: d.nombre,
            description: d.valor,
          } as ListItemMetaProps),
      )
      .sort((a, b) => Number(a.title) - Number(b.title));

    return (
      <List
        dataSource={data}
        style={{ height: '70vh', overflowY: 'scroll' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    );
  };

  //#endregion

  return isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderInfo();
};
