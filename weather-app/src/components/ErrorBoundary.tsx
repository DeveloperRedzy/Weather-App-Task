import { Component, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { withTranslation, WithTranslation } from "react-i18next";

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          p={3}
          textAlign="center"
        >
          <Typography variant="h4" gutterBottom>
            {t("error.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {this.state.error?.message || t("error.message")}
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
              sx={{ mr: 2 }}
            >
              {t("error.tryAgain")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleGoHome}
            >
              {t("error.goToDashboard")}
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryComponent);
