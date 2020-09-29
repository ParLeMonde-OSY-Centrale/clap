import React, { useContext } from "react";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
import { setCookie } from "src/util/cookies";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))(Button);

const Settings: React.FunctionComponent = () => {
  const { t, currentLocale } = useTranslation();
  const { isLoggedIn, logout } = useContext(UserServiceContext);

  const [currentLanguage, setCurrentLanguage] = React.useState<string | null>(null);
  const { languages } = useLanguages();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLanguage(event.target.value);
    setCookie("app-language", event.target.value, {
      "max-age": 24 * 60 * 60,
    });
    window.location.reload();
  };

  return (
    <>
      <Typography color="primary" variant="h1">
        {t("settings")}
      </Typography>
      <div>
        <form noValidate autoComplete="off" style={{ margin: "1rem 0" }}>
          {languages.length > 0 && (
            <>
              <Typography color="inherit" variant="h2" style={{ margin: "0.5rem 0 1rem 0" }}>
                {t("change_language")}
              </Typography>
              <FormControl variant="outlined" style={{ minWidth: "15rem" }} className="mobile-full-width">
                <InputLabel htmlFor="language">{t("language")}</InputLabel>
                <Select
                  native
                  value={currentLanguage || currentLocale}
                  onChange={handleLanguageChange}
                  label={t("language")}
                  inputProps={{
                    name: "language",
                    id: "language",
                  }}
                >
                  {languages.map((l) => (
                    <option value={l.value} key={l.value}>
                      {l.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </form>
        {isLoggedIn && (
          <>
            <Typography color="inherit" variant="h2" style={{ margin: "2rem 0 1rem 0" }}>
              {t("logout_title")}
            </Typography>
            <RedButton variant="outlined" className="mobile-full-width" onClick={logout}>
              {t("logout_button")}
            </RedButton>
          </>
        )}
      </div>
    </>
  );
};

export default Settings;
