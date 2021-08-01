import { List } from 'antd';
import { ListItemMetaProps } from 'antd/lib/list';
import React, { useContext, useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { hasError, isFetchingData } from 'src/helpers/validation.helper';

interface InfoMensajeProps {
  id: number;
}

export const InfoMensaje: React.FC<InfoMensajeProps> = (props) => {
  const dispatch = useAppDispatch();

  const { id } = props;

  const infoMensaje = useAppSelector((state: RootState) => state.mensaje.infoMensaje);

  const fetchData = async (id: number) => {
    console.log('asd');
  };

  //#region UseEffects

  useEffect(() => {
    fetchData(id);
  }, [id]);

  //#endregion

  //#region Other functions

  //#endregion

  const isContentLoading = isFetchingData(infoMensaje.info);

  const hasContentError = hasError(infoMensaje.info);

  //#region Renders

  const renderInfo = () => {
    const data = []
      ?.map(
        (d) =>
          ({
            title: 'd.nombre',
            description: 'd.valor',
          } as ListItemMetaProps),
      )
      .sort((a, b) => Number(a.title) - Number(b.title));

    return (
      <List
        dataSource={data}
        style={{ height: '70vh', overflowY: 'scroll' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={'item.title'} description={'item.description'} />
          </List.Item>
        )}
      />
    );
  };

  //#endregion

  return isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderInfo();
};
