import { Button, Result } from 'antd';
import React from 'react';
import { Wrapper } from 'src/components/wrapper';
import { goHome } from 'src/utils/history';

export const ServiceError: React.FC = (props) => {
  const renderSubtitle = () => {
    return (
      <div>
        <span>El contenido no pudo ser cargado porque uno o más servicios no están disponibles.</span>
        <br />
        <span>Por favor, intente de vuelta más tarde.</span>
      </div>
    );
  };

  return (
    <Wrapper horizontal="center" vertical="middle" unselectable>
      <Result
        style={{ minWidth: 400, height: '100%' }}
        status="error"
        title="Error al cargar la página"
        subTitle={renderSubtitle()}
        extra={
          <Button type="primary" onClick={goHome}>
            Ir al Inicio
          </Button>
        }
      />
    </Wrapper>
  );
};
