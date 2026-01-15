import { useContext } from "react";
import { ThemeContext } from "../../layout/home_theme_provider";

function Home() {
  const { setTheme } = useContext(ThemeContext);

  const handleTheme = (bg, text) => {
    setTheme({ backgroud: bg, text: text });
  };

  return (
    <div>
      <button onClick={() => handleTheme("#222", "#fff")}>Dark Mode</button>
      <button onClick={() => handleTheme("#fff", "#000")}>Light Mode</button>
    </div>
  );
}

export default Home;
