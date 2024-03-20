import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { GET_ME } from './queries';

const withAuthorization = conditionFn => Component => props => (
  <Query query={GET_ME}>
    {({ data, networkStatus }) => {
      if (networkStatus < 7) {
        return null;
      }
      const { ...rest } = props;
      return conditionFn(data) ? (
        <Component {...rest} />
      ) : (
        <Redirect to={'/'} />
      );
    }}
  </Query>
);

export default withAuthorization;
