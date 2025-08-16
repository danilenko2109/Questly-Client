import { Typography } from "@mui/material";
import Form from "./Form";
import styles from "./LogInPage.module.scss";
import { useTheme } from "@mui/material/styles";
import classNames from "classnames";

const LoginPage = () => {
  const theme = useTheme();
  
  // Динамические классы для темы
  const containerClasses = classNames({
    [styles.loginContainer]: true,
    [styles[`loginContainer--${theme.palette.mode}`]]: true,
  });

  const headerClasses = classNames({
    [styles.header]: true,
    [styles[`header--${theme.palette.mode}`]]: true,
  });

  const contentClasses = classNames({
    [styles.content]: true,
    [styles[`content--${theme.palette.mode}`]]: true,
  });

  return (
    <div className={containerClasses}>
      <header className={headerClasses}>
        <Typography className={styles.header__title} color="primary">
          Questly
        </Typography>
      </header>

      <main className={contentClasses}>
        <Typography className={styles.content__title} variant="h5">
          Welcome to Questly!
        </Typography>
        <Form />
      </main>
    </div>
  );
};

export default LoginPage;