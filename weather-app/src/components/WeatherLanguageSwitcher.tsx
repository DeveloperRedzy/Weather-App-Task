import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonGroup } from "@mui/material";

export const WeatherLanguageSwitcher: FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <ButtonGroup
        variant="text"
        aria-label="language-switcher"
        sx={{
          height: "20px",
          "& .MuiButtonGroup-firstButton": {
            borderColor: "#FFF",
          },
          "& .MuiButtonGroup-middleButton": {
            borderColor: "#FFF",
          },
        }}
      >
        <Button
          sx={{
            color: "#FFF",
            fontWeight: i18n.language === "sl" ? 700 : 400,
          }}
          onClick={() => changeLanguage("sl")}
        >
          SLO
        </Button>
        <Button
          sx={{
            color: "#FFF",
            fontWeight: i18n.language === "en" ? 700 : 400,
          }}
          onClick={() => changeLanguage("en")}
        >
          ENG
        </Button>
      </ButtonGroup>
    </>
  );
};
