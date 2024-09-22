"use client";

import {IconMoon, IconSun} from "@tabler/icons-react";
import {useTheme} from "@/context/ThemeContext";

export const ThemeToggle = () => {
    const {theme, toggleTheme} = useTheme();

    return ( theme === "light" ? <IconMoon className={"cursor-pointer"} onClick={toggleTheme} color={"#000000"}/> : <IconSun className={"cursor-pointer"} onClick={toggleTheme} color={"#FFFFFF"}/> );
};