import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiModal: {
      defaultProps: {
        container: document.getElementById("modal-root"),
      },
    },
  },
});

export default theme;
