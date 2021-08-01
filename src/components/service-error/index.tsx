import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Wrapper } from 'src/components/wrapper';
import { getRoute, goHome, goTo } from 'src/utils/history.utils';

export const ServiceError: React.FC = (props) => {
  const history = useHistory();

  const renderSubtitle = () => {
    return (
      <div>
        <span>El contenido no pudo ser cargado porque uno o más servicios no están disponibles.</span>
        <br />
        <span>Por favor, intente de vuelta más tarde.</span>
      </div>
    );
  };

  const refresh = () => {
    // goTo(getRoute());
    window.location.reload();
  };

  return (
    <Wrapper horizontal="center" vertical="middle" unselectable>
      <Result
        style={{ minWidth: 400, height: '100%' }}
        status="error"
        title="Error al cargar contenido"
        subTitle={renderSubtitle()}
        extra={
          <Button type="primary" onClick={refresh}>
            Volver a Cargar
          </Button>
        }
      />
    </Wrapper>
  );
};
