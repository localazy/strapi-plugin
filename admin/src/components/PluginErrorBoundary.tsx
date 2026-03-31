import React, { useCallback } from 'react';
import { Box, Flex, Typography, Button } from '@strapi/design-system';
import { SignOut, WarningCircle } from '@strapi/icons';
import { Layouts } from '@strapi/strapi/admin';
import { useTranslation } from 'react-i18next';
import LocalazyUserService from '../modules/user/services/localazy-user-service';
import { useLocalazyIdentity } from '../state/localazy-identity';
import { emptyIdentity } from '../modules/user/model/localazy-identity';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (error: Error, reset: () => void) => React.ReactNode;
}

/**
 * Minimal class boundary — captures errors and delegates rendering to a functional fallback.
 */
class ErrorBoundaryInner extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error: Error; reset: () => void }> = ({ error, reset }) => {
  const { t } = useTranslation();
  const { setIdentity } = useLocalazyIdentity();

  const handleDisconnect = useCallback(() => {
    void LocalazyUserService.deleteIdentity();
    setIdentity(emptyIdentity);
    reset();
  }, [setIdentity, reset]);

  return (
    <Layouts.Root>
      <Box padding={10}>
        <Flex direction='column' alignItems='center' gap={6} paddingTop={10}>
          <WarningCircle width={48} height={48} fill='danger600' />
          <Typography variant='alpha' textColor='neutral800'>
            {t('common.error_boundary_title')}
          </Typography>
          <Box maxWidth='600px'>
            <Typography variant='omega' textColor='neutral600' textAlign='center'>
              {t('common.error_boundary_description')}
            </Typography>
          </Box>
          <Box padding={4} background='neutral100' hasRadius maxWidth='600px' width='100%'>
            <Typography
              variant='pi'
              textColor='neutral500'
              tag='pre'
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {error.message}
            </Typography>
          </Box>
          <Button startIcon={<SignOut />} variant='danger-light' onClick={handleDisconnect}>
            {t('common.error_boundary_disconnect')}
          </Button>
        </Flex>
      </Box>
    </Layouts.Root>
  );
};

const PluginErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundaryInner fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}>
    {children}
  </ErrorBoundaryInner>
);

export default PluginErrorBoundary;
