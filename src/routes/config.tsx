import { FC, ReactElement } from 'react';
import { Route } from 'react-router-dom';
import PrivateRoute from './privateRoute';
import { useIntl } from 'react-intl';

interface WrapperRouteComponentProps {
  titleId?: string;
  auth?: boolean;
  element: ReactElement;
  noauth?: boolean;
}

const WrapperRouteComponent: FC<WrapperRouteComponentProps> = ({ titleId, auth,noauth, ...props }) => {
  const { formatMessage } = useIntl();

  if (titleId) {
    document.title = formatMessage({
      id: titleId,
    });
  }
  if (noauth) {
    return props.element as ReactElement
  }
  return auth ? <PrivateRoute {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;