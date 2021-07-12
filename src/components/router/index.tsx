import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import { Switch } from 'react-router-dom';
import { getHomePage, Views } from 'src/views';
import { View } from 'src/views/types';

type RouterProps = {
  views: Views;
};

export const Router: React.FC<RouterProps> = React.memo((props) => {
  const views = Object.values(props.views) as View[];
  const homePage = getHomePage();

  const removeTrailingSlashes = () => {
    const path = window.location.pathname;
    let trailingSlashes = 0;

    // Count the latest trailing slashes then remove them.
    Array.from(path)
      .reverse()
      .some((c) => {
        if (c === '/') trailingSlashes++;
        return c !== '/';
      });

    const fixedPath = path.slice(0, -1 * trailingSlashes);

    return <Redirect from="/:url*(/+)" to={fixedPath} />;
  };

  const setRoutes = (views: View[]) => {
    return (
      views
        // .filter((view) => !view.scope)
        .map((view) => (
          <Route key={view.title} exact path={view.path}>
            {view.component}
          </Route>
        ))
    );
  };

  const redirectHome = () => {
    return <Redirect from="/" to={homePage} exact />;
  };

  return (
    <Switch>
      {removeTrailingSlashes()}
      {redirectHome()}
      {setRoutes(views)}
    </Switch>
  );
});
