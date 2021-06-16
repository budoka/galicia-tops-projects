import { Col, Row, Skeleton } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ListCard } from 'src/components/list-card';
import { IListCard } from 'src/components/list-card/interfaces';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { CantidadCajas } from 'src/features/cajas/cajas-pendientes/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { views } from 'src/views';
import styles from './style.module.less';

export const Inicio: React.FC = React.memo((props) => {
  const className = classNames(styles.wrapper, styles.header);

  const dispatch = useAppDispatch();

  const cards: IListCard[] = [
    {
      title: <Skeleton.Button active style={{ width: 200 }} />,
      items: [
        {
          description: <Skeleton.Button active style={{ width: 400 }} />,
          loading: true,
          count: 0,
          path: views['Inicio'].path,
          query: '?estado=PendienteCierre',
        },
        {
          description: <Skeleton.Button active style={{ width: 300 }} />,
          loading: true,
          count: 0,
          path: views['Inicio'].path,
          query: '?estado=PendienteRecepcion',
        },
      ],
    },
    {
      title: <Skeleton.Button active style={{ width: 200 }} />,
      items: [{ description: <Skeleton.Button active style={{ width: 300 }} />, loading: true, count: 200 }],
    },
    {
      title: <Skeleton.Button active style={{ width: 200 }} />,
      items: [
        { description: <Skeleton.Button active style={{ width: 300 }} />, count: 5 },
        { description: <Skeleton.Button active style={{ width: 200 }} />, count: 15 },
        { description: <Skeleton.Button active style={{ width: 400 }} />, count: 300 },
        { description: <Skeleton.Button active style={{ width: 350 }} />, count: 50 },
      ],
    },
    {
      title: <Skeleton.Button active style={{ width: 200 }} />,
      items: [
        { description: <Skeleton.Button active style={{ width: 300 }} />, count: 25 },
        { description: <Skeleton.Button active style={{ width: 300 }} />, count: 15 },
        { description: <Skeleton.Button active style={{ width: 200 }} />, count: 10 },
        { description: <Skeleton.Button active style={{ width: 400 }} />, count: 30 },
      ],
    },
  ];

  const renderColumn = (card: ReactNode, key: React.Key) => {
    const className = classNames(styles.column);
    return (
      <Col key={key} className={className}>
        {card}
      </Col>
    );
  };

  const renderRow = (column: ReactNode, key: React.Key) => {
    const className = classNames(styles.row);
    const margin = 16;
    return (
      <Row key={key} gutter={[margin, margin]} className={className} justify="center" style={{ width: '100%', marginBottom: margin }}>
        {column}
      </Row>
    );
  };

  const renderListCard = (card: IListCard, key: React.Key) => {
    return (
      <ListCard
        className={styles.card}
        header={card.title ? <span className={styles.header}>{card.title}</span> : null}
        headerStyle={{
          textAlign: 'center',
        }}
        items={card.items}
        showZero
      />
    );
  };

  const renderListCards = (maxColumns: number) => {
    const chunks = _.chunk(cards, maxColumns);

    const rows = chunks.map((row, rIndex) =>
      renderRow(
        row.map((card, cIndex) => renderColumn(renderListCard(card, `${rIndex}-${cIndex}`), cIndex)),
        rIndex,
      ),
    );

    return rows;
  };

  return (
    <Wrapper contentWrapper className={className} unselectable horizontal="center" vertical="full-height">
      {renderListCards(2)}
    </Wrapper>
  );
});
